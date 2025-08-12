import { Tenant } from '../tenant/entities/tenant.entity';
import { Payment } from '../payments/payment.entity';
import { Property } from '../properties/entities/property.entity';
import { Unit } from '../units/entities/unit.entity';
export type LeaseStatus = "active" | "pending" | "terminated" | "expired" | "expiring";
export declare class Lease {
    id: string;
    startDate: Date;
    endDate: Date;
    rentAmount: number;
    status: LeaseStatus;
    paymentMethod?: string;
    digitalSignature?: string;
    tenant: Tenant;
    tenantId: number;
    payments: Payment[];
    property: Property;
    propertyId: number;
    unit: Unit;
    unitId: number;
}
