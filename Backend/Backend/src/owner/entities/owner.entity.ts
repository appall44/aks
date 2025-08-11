import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AccountStatus } from 'src/iam/users/enums/account-status.enum';
import { Property } from 'src/properties/entities/property.entity';
import { User } from 'src/iam/users/entities/user.entity';

@Entity('owners')
export class Owner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  idNumber: string;

 @Column({ nullable: true })
phone: string;


  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

@Column({ nullable: true })
  location: string;

 @Column({ nullable: true })
  googleMapLink: string;

@Column({ nullable: true })
  agreementsAccepted: boolean;

  @Column({ nullable: true })
  ownershipProofUrl?: string;

  @Column({ default: 'owner' })
  role: string;

  @Column({ default: false })
  verified: boolean;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.PENDING,
  })
  status: AccountStatus;

  @Column({ nullable: true })
  refreshToken?: string;

  @OneToMany(() => Property, (property) => property.owner)
  properties: Property[];

  @OneToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ nullable: true })
  userId?: number;
}
