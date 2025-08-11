import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { Property } from '../../properties/entities/property.entity';
import { Landlord } from '../../landlord/landlord.entity';
import { User } from '../../iam/users/entities/user.entity';
import { Unit } from '../../units/entities/unit.entity'; 


export enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  EMERGENCY = 'Emergency',
}


export enum Category {
  PLUMBING = 'Plumbing',
  ELECTRICAL = 'Electrical',
  HVAC = 'HVAC',
  APPLIANCES = 'Appliances',
  STRUCTURAL = 'Structural',
  CLEANING = 'Cleaning',
  SECURITY = 'Security',
  OTHER = 'Other',
  GENERAL = 'general',
}

@Entity()
export class MaintenanceRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  status: 'completed' | 'in progress' | 'pending';

  @Column({ type: 'enum', enum: Priority, default: Priority.MEDIUM })
  priority: Priority;

  @Column({ type: 'enum', enum: Category, nullable: true })
  category?: Category;

  @Column({ nullable: true })
  location: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ nullable: true })
  preferredTime: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  urgentContact?: string;


  @ManyToOne(() => Tenant, (tenant) => tenant.maintenanceRequests, { eager: true })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;


  @ManyToOne(() => Property, { eager: true, nullable: true })
  @JoinColumn({ name: 'propertyId' })
  property?: Property;

@ManyToOne(() => Unit, { eager: true, nullable: true })
@JoinColumn({ name: 'unitId' }) 
unit?: Unit;

@Column({ nullable: true })
unitId?: number;  

 
  @ManyToOne(() => Landlord, { eager: true, nullable: true })
  @JoinColumn({ name: 'landlordId' })
  landlord?: Landlord;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo?: User;

  @Column({ nullable: true })
  propertyId?: number;

  @Column({ nullable: true })
  tenantId?: number;

  @Column({ nullable: true })
  landlordId?: number;

  @Column({ nullable: true })
  assignedToId?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
