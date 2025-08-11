import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Lease } from 'src/leases/lease.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, { eager: true })
  tenant: Tenant;

  @ManyToOne(() => Lease, (lease) => lease.payments)
  lease: Lease;

  @Column('decimal')
  amount: number;

  @Column()
  paymentMethod: string;

  @Column({ default: 'unpaid' })
  status: 'paid' | 'unpaid';

  @Column({ nullable: true })
  referenceNumber?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true, type: 'date' })
  dueDate?: Date;

  @Column({ nullable: true, type: 'date' })
  paidDate?: Date;

  @Column({ nullable: true })
  month?: string; // e.g. "2025-07"

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  date: Date;
}
