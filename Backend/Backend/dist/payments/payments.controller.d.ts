import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPayment(propertyId: number, unitId: number, createPaymentDto: CreatePaymentDto): Promise<import("./payment.entity").Payment>;
    getPaymentById(paymentId: string): Promise<import("./payment.entity").Payment>;
    getPaymentsByTenant(tenantId: number): Promise<import("./payment.entity").Payment[]>;
    deletePayment(paymentId: string): Promise<void>;
}
