import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';
import { ListCampaignsDto } from './dtos/list-campaigns.dto';
import { UpdateCampaignDto } from './dtos/update-campaign.dto';
import { CampaignDto } from './dtos/campaign.dto';
import { CreateCampaignDto } from './dtos/create-campaign.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDto } from 'src/user/dtos/user.dto';
import { UserRequestDto } from 'src/common/dtos/user-request.dto';
import { ApiKeyGuard } from 'src/guards/api-key.guard';

@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getCampaigns(): Promise<ListCampaignsDto> {
    return this.campaignService.getCampaigns();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getCampaign(@Param('id') id: string): Promise<CampaignDto> {
    return this.campaignService.getCampaignById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  createCampaign(
    @UploadedFile() file: Express.Multer.File, 
    @Body('data') data: string, 
    @CurrentUser() user: UserRequestDto
  ) {
    const createCampaignDto = JSON.parse(data) as CreateCampaignDto
    createCampaignDto.userId = user.sub;

    return this.campaignService.createCampaign(file.buffer, createCampaignDto);
  }

  @Put('/sent/:id')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  updateStatusCampaignToSent(@Param('id') id: string) {
    return this.campaignService.updateStatusCampaignToSent(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  updateCampaign(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignService.updateCampaign(id, updateCampaignDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  deleteCampaign(@Param('id') id: string) {
    return this.campaignService.deleteCampaign(id);
  }
}