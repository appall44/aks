import {
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
  IsArray,
  IsIn,
  IsPositive,
} from 'class-validator';

export class CreateUnitDto {
  @IsString()
  unitNumber: string;

  @IsString()
  @IsIn(['apartment', 'studio', 'adu'])
  unitType: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  size?: number;

  @IsInt()
  @IsPositive()
  bedrooms: number;

  @IsNumber()
  @IsPositive()
  bathrooms: number;

  @IsNumber()
  @IsPositive()
  monthlyRent: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  securityDeposit?: number = 60000;

  @IsString()
  @IsIn(['vacant', 'occupied', 'maintenance'])
  status: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class UpdateUnitDto extends CreateUnitDto {}
