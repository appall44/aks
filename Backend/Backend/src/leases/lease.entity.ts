import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn  } from 'typeorm';
import { Tenant } from '../tenant/entities/tenant.entity';
import { User } from '../iam/users/entities/user.entity';
import { Payment } from '../payments/payment.entity';
import { Property } from '../properties/entities/property.entity';
import { Unit } from '../units/entities/unit.entity';

export type LeaseStatus = "active" | "pending" | "terminated" | "expired" | "expiring";

@Entity()
export class Lease {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'decimal' })
  rentAmount: number;

  @Column({ 
    type: 'enum', 
    enum: ["active", "pending", "terminated", "expired", "expiring"], 
    default: "active" 
  })
  status: LeaseStatus;

  @Column({ nullable: true })
  paymentMethod?: string;

  @Column({ nullable: true })
  digitalSignature?: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.leases, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  tenantId: number;

  @OneToMany(() => Payment, (payment) => payment.lease)
  payments: Payment[];

  @ManyToOne(() => Property, (property) => property.leases, { nullable: false })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column()
  propertyId: number;

  @ManyToOne(() => Unit, (unit) => unit.leases, { nullable: false })
  @JoinColumn({ name: 'unitId' })
  unit: Unit;

  @Column()
  unitId: number;
}