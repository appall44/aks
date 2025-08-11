import { Controller, Post, Body } from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { CreateLandlordDto } from './dto/create-landlord.dto';

@Controller('landlords')
export class LandlordController {
  constructor(private readonly landlordService: LandlordService) {}

  @Post()
  async create(@Body() createLandlordDto: CreateLandlordDto) {
    return this.landlordService.create(createLandlordDto);
  }
}
