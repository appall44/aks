import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerService } from './owner.service';
import { OwnerController } from './owner.controller'; 
import { Owner } from './entities/owner.entity';
import { MaintenanceRequest } from '../tenant/maintenance/maintenance.entity';
import { Property } from '../properties/entities/property.entity';
import { Lease } from '../leases/lease.entity'; 
import { Payment } from '../payments/payment.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Owner, MaintenanceRequest, Property,Lease, 
      Payment,]),
  ],
  controllers: [OwnerController], 
  providers: [OwnerService],
  exports: [OwnerService],
})
export class OwnerModule {}
