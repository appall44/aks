import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Property } from 'src/properties/entities/property.entity';
import { Lease } from 'src/leases/lease.entity';

@Entity()
export class Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  unitNumber: string;

  @Column()
  unitType: string;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  bedrooms: number;

  @Column({ nullable: true })
  bathrooms: number;

  @Column({ nullable: true })
  monthlyRent: number;

  @Column({ nullable: true })
  status: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @ManyToOne(() => Property, (property) => property.units, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @OneToMany(() => Lease, (lease) => lease.unit)
  leases: Lease[];
}
