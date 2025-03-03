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
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { ListCompaniesDto } from './dtos/list-companies.dto';
import { CompanyDto } from './dtos/company.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getCompanies(): Promise<ListCompaniesDto> {
    return this.companyService.getCompanies();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getCompany(@Param('id') id: string): Promise<CompanyDto> {
    return this.companyService.getCompanyById(id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.createCompany(createCompanyDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateCompany(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.updateCompany(id, updateCompanyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteCompany(@Param('id') id: string) {
    return this.companyService.deleteCompany(id);
  }
}