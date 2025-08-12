import { 
  Controller, Post, Body, Get, Param, Put, Delete, Req, UseGuards, 
  UnauthorizedException, ParseIntPipe, ValidationPipe, NotFoundException , BadRequestException
} from '@nestjs/common';
import { LeaseService } from './lease.service';
import { SignLeaseDto } from './dto/sign-lease.dto';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';
import { Request } from 'express';
import { User } from '../iam/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {UnitsService} from '../units/units.service';


interface AuthRequest extends Request {
  user?: User;
}
 @UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class LeaseController {
  constructor(private readonly leaseService: LeaseService,
     private readonly unitService: UnitsService
  )
  {}


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('properties/:propertyId/units/:unitId/rental')
  async reqLease(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Param('unitId', ParseIntPipe) unitId: number,
    @Body(new ValidationPipe({ whitelist: true, transform: true })) CreateLeaseDto: CreateLeaseDto,
    @Req() req: AuthRequest,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const leaseData = {
      tenantId: req.user.id,
      propertyId,
      unitId,
      digitalSignature: CreateLeaseDto.digitalSignature,
      startDate: CreateLeaseDto.startDate,
      endDate: CreateLeaseDto.endDate,
      rentAmount: CreateLeaseDto.rentAmount,
      status: CreateLeaseDto.status ?? 'pending',
    };

    console.log('Lease data to save:', leaseData);

    return this.leaseService.createLease(leaseData, req.user);
  }
 @UseGuards(JwtAuthGuard, RolesGuard)
@Post('properties/:propertyId/units/:unitId/lease/sign')
async signLease(
  @Param('propertyId', ParseIntPipe) propertyId: number,
  @Param('unitId', ParseIntPipe) unitId: number,
  @Body(new ValidationPipe({ whitelist: true, transform: true })) signLeaseDto: SignLeaseDto,
  @Req() req: AuthRequest,
) {
  if (!req.user) {
    throw new UnauthorizedException();
  }

  // 1. Get the lease
  const lease = await this.leaseService.findByPropertyAndUnit(propertyId, unitId);
  if (!lease) {
    throw new NotFoundException('Lease not found');
  }

  // 2. Check unit status before signing
  const unit = await this.unitService.findById(unitId);
  if (!unit) {
    throw new NotFoundException('Unit not found');
  }
  if (unit.status === 'occupied') {
    throw new BadRequestException('Unit is already occupied');
  }

  // 3. Update lease fields
  if (signLeaseDto.paymentMethod !== undefined) {
    lease.paymentMethod = signLeaseDto.paymentMethod;
  }
  if (signLeaseDto.digitalSignature !== undefined) {
    lease.digitalSignature = signLeaseDto.digitalSignature;
  }
  lease.status = 'active';

  // 4. Save updated lease
  await this.leaseService.updateLease(lease.id, {
    paymentMethod: lease.paymentMethod,
    digitalSignature: lease.digitalSignature,
    status: lease.status,
  });

  // 5. Mark the unit as occupied
  await this.unitService.updateUnitStatus(unitId, 'occupied');

  // 6. Return response
  return {
    message: 'Lease signed successfully. Unit marked as occupied.',
    leaseId: lease.id,
    unitId: unitId,
    unitStatus: 'occupied',
  };
}




@Get('properties/:propertyId/units/:unitId/lease')
async getLeaseByPropertyAndUnit(
  @Param('propertyId') propertyId: number,
  @Param('unitId') unitId: number,
  @Req() req
) {

  return this.leaseService.findByPropertyAndUnit(propertyId, unitId);
}

  @Get()
  async getAllLeases() {
    return this.leaseService.findAllLeases();
  }

  @Get('/tenant/:tenantId')
  async getLeasesByTenant(@Param('tenantId', ParseIntPipe) tenantId: number) {
    return this.leaseService.findLeasesByTenant(tenantId);
  }

  @Get('/owner/:ownerId')
  async getLeasesByOwner(@Param('ownerId', ParseIntPipe) ownerId: number) {
    return this.leaseService.findLeasesByOwner(ownerId);
  }

@Get(':id')
async getLeaseById(@Param('id') id: string) {
  const lease = await this.leaseService.findLeaseById(id);
  if (!lease) {
    throw new NotFoundException(`Lease with id ${id} not found`);
  }
  return lease;
}


  // @Put(':id')
  // async updateLease(@Param('id', ParseIntPipe) id: number, @Body() updateLeaseDto: UpdateLeaseDto) {
  //   return this.leaseService.updateLease(id, updateLeaseDto);
  // }

  // Delete lease by ID
  @Delete(':id')
  async deleteLease(@Param('id', ParseIntPipe) id: number) {
    return this.leaseService.deleteLease(id);
  }
}
