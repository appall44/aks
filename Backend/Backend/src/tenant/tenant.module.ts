import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tenant } from './entities/tenant.entity';
import { Payment } from '../payments/payment.entity';
import { MaintenanceRequest } from './maintenance/maintenance.entity';
import { Amenity } from '../amenity/amenity.entity';
import { Landlord } from '../landlord/landlord.entity';
import { Lease } from '../leases/lease.entity'; 

import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';

import { MailModule } from '../auth/email/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tenant,
      Lease, 
      Payment,
      MaintenanceRequest,
      Amenity,
      Landlord,
    ]),
    MailModule,
  ],
  providers: [TenantService],
  controllers: [TenantController],
  exports: [TenantService],
})
export class TenantModule {}
