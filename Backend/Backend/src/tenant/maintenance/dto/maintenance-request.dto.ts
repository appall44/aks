import { IsString, IsOptional, IsEnum, IsArray, IsNumber } from 'class-validator';
import { Priority, Category } from '../maintenance.entity';
import { Property } from '../../../properties/entities/property.entity';
import { Landlord } from '../../../landlord/landlord.entity';

export class CreateMaintenanceRequestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsString()
  preferredTime?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  urgentContact?: string;  

  @IsOptional()
  property?: Property | number;  

  @IsOptional()
  landlord?: Landlord | number;

  @IsOptional()
  @IsNumber()
  assignedToId?: number;  
}
