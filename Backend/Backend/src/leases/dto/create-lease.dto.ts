import { IsString, IsNotEmpty } from 'class-validator';

export class SignLeaseDto {
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsString()
  @IsNotEmpty()
  digitalSignature: string;
}
