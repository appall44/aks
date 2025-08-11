import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('tenant/:id/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

@Post()
async createPayment(
  @Param('id', ParseIntPipe) id: number, // <- this is the tenantId from route
  @Body() createPaymentDto: CreatePaymentDto,
) {
  createPaymentDto.tenantId = id;
  return this.paymentsService.createPayment(createPaymentDto);
}


  @Get(':paymentId')
  async getPaymentById(@Param('paymentId') paymentId: string) {
    return this.paymentsService.getPaymentById(paymentId);
  }

  // @Patch(':paymentId')
  // async updatePayment(
  //   @Param('paymentId') paymentId: string,
  //   @Body() updatePaymentDto: UpdatePaymentDto,
  // ) {
  //   return this.paymentsService.updatePayment(paymentId, updatePaymentDto);
  // }

  @Delete(':paymentId')
  async deletePayment(@Param('paymentId') paymentId: string) {
    return this.paymentsService.deletePayment(paymentId);
  }

  @Get()
async getPaymentsByTenant(@Param('id', ParseIntPipe) tenantId: number) {
  return this.paymentsService.getPaymentsByTenant(tenantId.toString());
}

}
