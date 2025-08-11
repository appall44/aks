import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import smsConfig from './config/sms.config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './iam/users/users.module';
import { AdminModule } from './admin/admin.module';
import { AdminDashboardModule } from './admin/admin-dashboard/admin-dashboard.module';
import { TenantDashboardModule } from './tenant/tenant-dashboard/tenant-dashboard.module';
import { OwnerDashboardModule } from './owner/owner-dashboard/owner-dashboard.module';
import { OwnerModule } from './owner/owner.module';
import { UnitsModule } from './units/units.module';
import { PropertyModule } from './properties/properties.module';

import { User } from './iam/users/entities/user.entity';
import { Lease } from './leases/lease.entity';  
import { Payment } from './payments/payment.entity';
import { Sale } from './sales/sales.entity';
import { Property } from './properties/entities/property.entity';
import { Unit } from './units/entities/unit.entity';
import { Tenant } from './tenant/entities/tenant.entity';
import { Owner } from './owner/entities/owner.entity';
import { Admin } from './admin/entities/admin.entity';
import { MaintenanceRequest } from './tenant/maintenance/maintenance.entity'; 
import { Landlord } from './landlord/landlord.entity';
import { Amenity } from './amenity/amenity.entity';

import { MaintenanceModule } from './tenant/maintenance/maintenance.module'; 
import { LandlordModule } from './landlord/landlord.module';
import { PaymentsModule } from './payments/payments.module';
import { LeaseModule } from './leases/lease.module';
import { TenantModule } from './tenant/tenant.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, smsConfig],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        return {
          type: 'postgres',
          url: dbConfig.url,
          entities: [
            User,
            Lease,  
            Payment,
            MaintenanceRequest, 
            Sale,
            Property,
            Unit,
            Tenant,
            Owner,
            Admin,
            Landlord,
            Amenity,
          ],
          synchronize: dbConfig.synchronize,
          ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    AdminModule,
    UsersModule,
    OwnerModule,
    PropertyModule,
    AdminDashboardModule,
    TenantDashboardModule,
    OwnerDashboardModule,
    UnitsModule,
    MaintenanceModule,
    LandlordModule,
    PaymentsModule,
    LeaseModule,
    TenantModule,
    DashboardModule,
  ],
})
export class AppModule {}
