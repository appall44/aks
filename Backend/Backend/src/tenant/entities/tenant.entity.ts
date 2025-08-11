import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Property } from '../../properties/entities/property.entity';
import { Payment } from '../../payments/payment.entity';
import { MaintenanceRequest } from '../maintenance/maintenance.entity';
import { Lease } from '../../leases/lease.entity'; 
@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  firstname: string | null;

  @Column({ type: 'varchar', nullable: true })
  lastname: string | null;

  @Column({ type: 'varchar', nullable: true })
  idNumber: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', nullable: true })
  occupation: string | null;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'varchar', nullable: true })
  role: string | null;

  @Column({ type: 'varchar', length: 6, nullable: true })
  otp: string | null;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiresAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string | null;

  @Column({ type: 'varchar', nullable: true })
  unit: string | null;

  @Column({ type: 'date', nullable: true })
  leaseStart: Date | null;

  @Column({ type: 'date', nullable: true })
  leaseEnd: Date | null;

  @Column({ type: 'decimal', nullable: true })
  monthlyRent: number | null;

  @Column({ type: 'decimal', nullable: true })
  deposit: number | null;

 @Column({ type: 'varchar', nullable: true, default: 'approved' })
status: string | null;


  // Relation: Tenant belongs to one Property
  @ManyToOne(() => Property, (property) => property.tenants, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'propertyId' })
  property?: Property;

  @Column({ type: 'int', nullable: true })
  propertyId?: number | null;

  // Relation: Tenant has many Payments
  @OneToMany(() => Payment, (payment) => payment.tenant)
  payments: Payment[];

  // Relation: Tenant has many Maintenance Requests
  @OneToMany(() => MaintenanceRequest, (maintenance) => maintenance.tenant)
  maintenanceRequests: MaintenanceRequest[];

   @OneToMany(() => Lease, (lease) => lease.tenant)
  leases: Lease[];
}
