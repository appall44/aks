import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  ParseIntPipe,
  UseGuards,
  BadRequestException
} from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('properties/:propertyId/units/:unitId/payment')
  async createPayment(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Param('unitId', ParseIntPipe) unitId: number,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    createPaymentDto.propertyId = propertyId;
    createPaymentDto.unitId = unitId;

    return this.paymentsService.createPayment(createPaymentDto);
  }

  @Get(':paymentId')
  async getPaymentById(@Param('paymentId') paymentId: string) {
    return this.paymentsService.getPaymentById(paymentId);
  }
  @Get('/:tenantId/payments')
  async getPaymentsByTenant(
    @Param('tenantId', ParseIntPipe) tenantId: number,
  ) {
    return this.paymentsService.getPaymentsByTenant(tenantId);
  }

  @Delete(':paymentId')
  async deletePayment(@Param('paymentId') paymentId: string) {
    return this.paymentsService.deletePayment(paymentId);
  }
}
