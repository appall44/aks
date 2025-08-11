import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateLandlordDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsPhoneNumber(undefined) 
  phone: string;

  @IsEmail()
  email: string;
}
