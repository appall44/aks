import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Property } from '../properties/entities/property.entity';  // Adjust path as needed

@Entity('amenities')
export class Amenity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  // === NEW PROPERTY RELATION ===
  @Column()
  propertyId: number;

  @ManyToOne(() => Property, (property) => property.amenitiesEntities, { eager: false })
  @JoinColumn({ name: 'propertyId' })
  property: Property;
}
