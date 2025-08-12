import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Property } from '../properties/entities/property.entity';
import { User } from '../iam/users/entities/user.entity';

@Entity('landlords')
export class Landlord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @OneToMany(() => Property, (property) => property.landlord)
  properties: Property[];

  @OneToOne(() => User, { eager: true, nullable: true })
  @JoinColumn()
  user?: User;  
}
