import { 
  IsString, IsNotEmpty, IsDateString, IsNumber, IsOptional, IsEnum, IsInt 
} from 'class-validator';

export type LeaseStatus = 'active' | 'pending' | 'terminated' | 'expired' | 'expiring';

export class CreateLeaseDto {

  @IsOptional()
  @IsString()
  leaseId?: string;
  
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsNumber()
  @IsNotEmpty()
  rentAmount: number;

  @IsOptional()
  @IsEnum(['active', 'pending', 'terminated', 'expired', 'expiring'])
  status?: LeaseStatus;

  // @IsOptional()
  // @IsString()
  // paymentMethod?: string;

  @IsOptional()
  @IsString()
  digitalSignature?: string;

  @IsInt()
  @IsNotEmpty()
  tenantId: number;

  @IsInt()
  @IsNotEmpty()
  propertyId: number;

  @IsInt()
  @IsNotEmpty()
  unitId: number;
}
