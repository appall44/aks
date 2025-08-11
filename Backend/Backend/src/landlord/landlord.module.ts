import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Landlord } from './landlord.entity';
import { LandlordService } from './landlord.service';
import { LandlordController } from './LandlordController';

@Module({
  imports: [TypeOrmModule.forFeature([Landlord])],
  providers: [LandlordService],
  controllers: [LandlordController],
  exports: [LandlordService],
})
export class LandlordModule {}
