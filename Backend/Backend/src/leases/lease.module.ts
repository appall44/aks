import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lease } from './lease.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Property } from '../properties/entities/property.entity';
import { Unit } from '../units/entities/unit.entity';
import { LeaseService } from './lease.service';
import { LeaseController } from './lease.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lease, Tenant, Property, Unit]), 
  ],
  providers: [LeaseService],
  controllers: [LeaseController],
  exports: [LeaseService],
})
export class LeaseModule {}
