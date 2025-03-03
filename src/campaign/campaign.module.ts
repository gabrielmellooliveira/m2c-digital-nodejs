import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign]), AuthModule],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [TypeOrmModule]
})
export class CampaignModule {}