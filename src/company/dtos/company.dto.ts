export class CompanyDto {
  constructor(
    id: string, 
    name: string, 
    document: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    deleted: boolean
  ) {
    this.id = id;
    this.name = name;
    this.document = document;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.deleted = deleted;
  }

  id: string;
  name: string;
  document: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  deleted: boolean;
}