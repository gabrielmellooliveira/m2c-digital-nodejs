import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ListCompaniesDto } from './dtos/list-companies.dto';
import { CompanyDto } from './dtos/company.dto';
import { HashHelper } from 'src/common/helpers/hash.helper';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async getCompanies(): Promise<ListCompaniesDto> {
    try {
      const companies = await this.companyRepository.find();

      return {
        companies: companies.map(
          company => new CompanyDto(
            company.id, 
            company.name, 
            company.document,
            company.createdAt,
            company.updatedAt,
            company.deletedAt,
            company.deleted,
          )
        )
      } as ListCompaniesDto;
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }

  async getCompanyById(id: string): Promise<CompanyDto> {
    try {
      const company = await this.companyRepository.findOneBy({ id });

      if (!company) {
        throw new HttpException("Company not found", 404);
      }

      return new CompanyDto(
        company.id, 
        company.name, 
        company.document,
        company.createdAt,
        company.updatedAt,
        company.deletedAt,
        company.deleted,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }

  async createCompany(createCompanyDto: CreateCompanyDto): Promise<ResponseDto> {
    try {
      const company = await this.companyRepository.save({
        id: HashHelper.getCuid2(),
        name: createCompanyDto.name,
        document: createCompanyDto.document,
      })

      return new ResponseDto(company.id, 'Company added with success');
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }

  async updateCompany(
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<ResponseDto> {
    try {
      await this.companyRepository.update(companyId, {
        ...updateCompanyDto
      })

      return new ResponseDto(companyId, 'Company edited with success');
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }

  async deleteCompany(companyId: string): Promise<ResponseDto> {
    try {
      // A atualização do campo "deleted" é feita para respeitar a regra de negócio
      // e manter o campo atualizado, mesmo utilizando o soft delete do próprio ORM
      await this.companyRepository.update(companyId, {
        deleted: true
      })

      await this.companyRepository.softDelete(companyId);
      
      return new ResponseDto(companyId, 'Company deleted with success');
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }
}