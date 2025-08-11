import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './payment.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Lease } from '../leases/lease.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Tenant, Lease]), 
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
