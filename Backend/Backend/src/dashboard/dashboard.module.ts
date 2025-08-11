import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Property } from '../properties/entities/property.entity';
import { Payment } from '../payments/payment.entity';
import { Lease } from '../leases/lease.entity';
import { Tenant } from '../tenant/entities/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, Payment, Lease, Tenant])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
