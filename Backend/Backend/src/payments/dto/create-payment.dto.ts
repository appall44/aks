// create-payment.dto.ts
import { IsUUID, IsNumber, IsString, IsOptional, IsDateString, IsIn } from 'class-validator';

export class CreatePaymentDto {
 @IsNumber()
  tenantId: number;  

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
}
