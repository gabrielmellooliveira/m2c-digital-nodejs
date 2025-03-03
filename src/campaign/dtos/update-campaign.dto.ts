import { CampaignStatus } from "../enums/campaign-status.enum";

export class UpdateCampaignDto {
  name: string;
  message: string;
  status: CampaignStatus;
}