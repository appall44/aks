export declare class CreatePaymentDto {
    tenantId: number;
    leaseId?: string;
    amount: number;
    paymentMethod: string;
    status: 'paid' | 'unpaid';
    referenceNumber?: string;
    notes?: string;
    dueDate?: string;
    paidDate?: string;
    month?: string;
    date: string;
    propertyId: number;
    unitId: number;
}
