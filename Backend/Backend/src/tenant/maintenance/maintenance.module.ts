import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MaintenanceRequest } from './maintenance.entity';
import { MaintenanceRequestService } from './maintenance.service';
import { MaintenanceRequestController } from './maintenance.controller';

import { Tenant } from '../entities/tenant.entity';
import { Property } from '../../properties/entities/property.entity';
import { Landlord } from '../../landlord/landlord.entity';
import { User } from '../../iam/users/entities/user.entity';  
import { TenantModule } from '../tenant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MaintenanceRequest,
      Property,
      Landlord,
      Tenant,
      User,   // <-- Added User here
    ]),
    TenantModule,
  ],
  providers: [MaintenanceRequestService],
  controllers: [MaintenanceRequestController],
})
export class MaintenanceModule {}
