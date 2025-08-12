import { IsNumber, IsString, IsOptional, IsDateString, IsIn } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  tenantId: number;

  @IsOptional()
    @IsString()
  leaseId?: string;  

  @IsNumber()
  amount: number;

  @IsString()
  paymentMethod: string;

  @IsIn(['paid', 'unpaid'])
  status: 'paid' | 'unpaid';

  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsDateString()
  paidDate?: string;

  @IsOptional()
  @IsString()
  month?: string;

  @IsDateString()
  date: string;

  @IsNumber()
  propertyId: number;

  @IsNumber()
  unitId: number;
}
