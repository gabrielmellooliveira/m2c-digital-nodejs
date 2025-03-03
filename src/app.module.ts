import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from './company/company.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Company } from './company/entities/company.entity';
import { getPostgresConfigs } from './configs/postgres.config';
import { Campaign } from './campaign/entities/campaign.entity';
import { CampaignModule } from './campaign/campaign.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...getPostgresConfigs(),
      entities: [User, Company, Campaign]
    } as TypeOrmModuleOptions),
    UserModule,
    CompanyModule,
    CampaignModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
