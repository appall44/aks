import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Unit } from 'src/units/entities/unit.entity';
import { Owner } from 'src/owner/entities/owner.entity';
import { Role } from 'src/shared/enums/role.enum';
import { Tenant } from '../../tenant/entities/tenant.entity';
import { Landlord } from '../../landlord/landlord.entity';
import { Amenity } from 'src/amenity/amenity.entity';  
import { Lease } from '../../leases/lease.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  area: string;

  @Column({ nullable: true })
  googleMapLink: string;

  @Column('int')
  totalUnits: number;

  @Column('decimal')
  pricePerUnit: number;

  @Column('int')
  bedrooms: number;

  @Column('int')
  bathrooms: number;

  @Column('decimal', { nullable: true })
  squareMeters: number;

  @Column('simple-array', { nullable: true })
  amenities: string[]; // note: this is just string array column, different from relation below

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ default: false })
  featured: boolean;

  @Column({ default: 'active' })
  status: string;

  @Column({ default: false })
  payForFeatured: boolean;

  @Column({ default: '30' })
  featuredDuration: string;

  @Column({ type: 'enum', enum: Role, default: Role.OWNER })
  role: Role;

  @Column()
  ownerId: number;

  

  @ManyToOne(() => Owner, (owner) => owner.properties, { eager: false })
  @JoinColumn({ name: 'ownerId' })
  owner: Owner;

  @OneToMany(() => Unit, (unit) => unit.property, { cascade: true })
  units: Unit[];

  @OneToMany(() => Tenant, (tenant) => tenant.property)
  tenants: Tenant[];

  @Column({ nullable: true })
  landlordId?: number;

  @ManyToOne(() => Landlord, (landlord) => landlord.properties, { eager: false })
  @JoinColumn({ name: 'landlordId' })
  landlord?: Landlord;

  @OneToMany(() => Amenity, (amenity) => amenity.property)
  amenitiesEntities: Amenity[];

  @OneToMany(() => Lease, lease => lease.property)
leases: Lease[];

}
