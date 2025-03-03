import { Company } from 'src/company/entities/company.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CampaignStatus } from '../enums/campaign-status.enum';

@Entity()
export class Campaign {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  message: string;

  @Column({ type: 'enum', enum: CampaignStatus, default: CampaignStatus.CREATED })
  status: string;

  @ManyToOne(type => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(type => Company, company => company.id)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Column({ default: false })
  deleted: boolean;
}