import { HttpException, Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dtos/create-campaign.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { Repository } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createId } from '@paralleldrive/cuid2';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { FileHelper } from 'src/common/helpers/file.helper';
import { CampaignStatus } from './enums/campaign-status.enum';
import { ListCampaignsDto } from './dtos/list-campaigns.dto';
import { CampaignDto } from './dtos/campaign.dto';
import { UpdateCampaignDto } from './dtos/update-campaign.dto';
import { HashHelper } from 'src/common/helpers/hash.helper';
import { getRabbitMqConfigs } from 'src/configs/rabbitmq.config';

@Injectable()
export class CampaignService {
  private client: ClientProxy;

  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) {
    const { url } = getRabbitMqConfigs()
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue: 'm2c_digital_messages_queue'
      },
    });
  }

  async getCampaigns(): Promise<ListCampaignsDto> {
    try {
      const campaigns = await this.campaignRepository.find({ 
        where: { deleted: false },
        relations: ['user', 'company']
      });

      return {
        campaigns: campaigns.map(
          campaign => new CampaignDto(
            campaign.id, 
            campaign.name,
            campaign.message,
            campaign.status,
            {
              id: campaign.user.id,
              email: campaign.user.email,
            },
            {
              id: campaign.company.id,
              name: campaign.company.name,
              document: campaign.company.document,
            },
            campaign.createdAt,
            campaign.updatedAt,
            campaign.deletedAt,
            campaign.deleted,
          )
        )
      } as ListCampaignsDto;
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }

  async getCampaignById(id: string): Promise<CampaignDto> {
    try {
      const campaign = await this.campaignRepository.findOne({ 
        where: { id, deleted: false },
        relations: ['user', 'company']
      });

      if (!campaign) {
        throw new HttpException("Campaign not found", 404);
      }

      return new CampaignDto(
        campaign.id, 
        campaign.name,
        campaign.message,
        campaign.status,
        {
          id: campaign.user.id,
          email: campaign.user.email,
        },
        {
          id: campaign.company.id,
          name: campaign.company.name,
          document: campaign.company.document,
        },
        campaign.createdAt,
        campaign.updatedAt,
        campaign.deletedAt,
        campaign.deleted,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }

  async createCampaign(buffer: Buffer, createCampaignDto: CreateCampaignDto): Promise<ResponseDto> {
    try {
      const campaign = await this.campaignRepository.save({
        id: createId(),
        name: createCampaignDto.name,
        message: createCampaignDto.message,
        status: CampaignStatus.CREATED,
        user: {
          id: createCampaignDto.userId
        },
        company: {
          id: createCampaignDto.companyId
        }
      })
  
      await this.sendMessagesToQueue(buffer, campaign);
      
      return new ResponseDto(campaign.id, 'Campaign added with success');
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }

  private async sendMessagesToQueue(buffer: Buffer, campaign: Campaign) {
    const lines = FileHelper.getText(buffer);
    
    for await (const [index, line] of lines.entries()) {
      await this.client.emit("message", { 
        identifier: HashHelper.getCuid2(),
        campaignId: campaign.id,
        message: campaign.message,
        phoneNumber: line,
        total: lines.length
      });
    }
  }

  async updateStatusCampaignToSent(campaignId: string): Promise<ResponseDto> {
    try {
      await this.campaignRepository.update(campaignId, {
        status: CampaignStatus.SENT
      })

      return new ResponseDto(campaignId, 'Campaign edited with success');
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }

  async updateCampaign(
    campaignId: string,
    updateCampaignDto: UpdateCampaignDto,
  ): Promise<ResponseDto> {
    try {
      await this.campaignRepository.update(campaignId, {
        ...updateCampaignDto
      })

      return new ResponseDto(campaignId, 'Campaign edited with success');
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }

  async deleteCampaign(campaignId: string): Promise<ResponseDto> {
    try {
      // A atualização do campo "deleted" é feita para respeitar a regra de negócio
      // e manter o campo atualizado, mesmo utilizando o soft delete do próprio ORM
      await this.campaignRepository.update(campaignId, {
        deleted: true
      })

      await this.campaignRepository.softDelete(campaignId);
      
      return new ResponseDto(campaignId, 'Campaign deleted with success');
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }
}