import { 
  IsString, IsOptional} from 'class-validator';

export class SignLeaseDto {

   @IsOptional()
    @IsString()
    leaseId?: string; 

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  digitalSignature?: string;
}
