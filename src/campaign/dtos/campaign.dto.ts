export class CampaignDto {
  constructor(
    id: string, 
    name: string, 
    message: string, 
    status: string,
    user: {
      id: string,
      email: string
    },
    company: {
      id: string,
      name: string,
      document: string
    },
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    deleted: boolean
  ) {
    this.id = id;
    this.name = name;
    this.message = message;
    this.status = status;
    this.user = user;
    this.company = company;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.deleted = deleted;
  }

  id: string;
  name: string;
  message: string;
  status: string;
  user: {
    id: string,
    email: string
  };
  company: {
    id: string,
    name: string,
    document: string
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  deleted: boolean;
}