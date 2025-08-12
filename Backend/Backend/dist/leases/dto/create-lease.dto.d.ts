export type LeaseStatus = 'active' | 'pending' | 'terminated' | 'expired' | 'expiring';
export declare class CreateLeaseDto {
    leaseId?: string;
    startDate: string;
    endDate: string;
    rentAmount: number;
    status?: LeaseStatus;
    digitalSignature?: string;
    tenantId: number;
    propertyId: number;
    unitId: number;
}
