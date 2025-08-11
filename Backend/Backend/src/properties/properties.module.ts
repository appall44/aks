import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Property } from './entities/property.entity';
import { Unit } from '../units/entities/unit.entity';
import { Owner } from 'src/owner/entities/owner.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { Tenant } from '../tenant/entities/tenant.entity';

import { UsersModule } from 'src/iam/users/users.module';
import { TenantModule } from '../tenant/tenant.module';

import { PropertiesController } from './properties.controller'; 
import { OwnerPropertiesService } from './properties.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, Unit, Owner, Admin, Tenant]),
    UsersModule,
    TenantModule,
  ],
  controllers: [PropertiesController], 
  providers: [OwnerPropertiesService],
  exports: [OwnerPropertiesService],
})
export class PropertyModule {}
