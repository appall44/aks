import {
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOwnerDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  idNumber: string;

  @IsString()
  phone: string;

  @IsString()
  location: string;

  @IsString()
  googleMapLink: string;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  agreementsAccepted: boolean;

  @IsOptional()
  @IsString()
  ownershipProofUrl?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  verified?: boolean;
}
