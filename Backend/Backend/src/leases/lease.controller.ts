import { 
  Controller, Post, Body, Get, Param, Put, Delete, Req, UseGuards, UnauthorizedException, ParseIntPipe, ValidationPipe, NotFoundException 
} from '@nestjs/common';
import { LeaseService } from './lease.service';
import { SignLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../iam/users/entities/user.entity';  
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';


interface AuthRequest extends Request {
  user?: User;
}

@Controller('leases')
export class LeaseController {
  constructor(private readonly leaseService: LeaseService) {}

  @Post()
  async createLease(@Body() createLeaseDto: SignLeaseDto, @Req() req: AuthRequest) {
    if (!req.user) {
      throw new UnauthorizedException('User not found in request');
    }
    return this.leaseService.signLease(createLeaseDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
@Post('property/:propertyId/unit/:unitId/lease/sign')
async signLease(
  @Param('propertyId', ParseIntPipe) propertyId: number,
  @Param('unitId', ParseIntPipe) unitId: number,
  @Body(new ValidationPipe({ whitelist: true, transform: true })) signLeaseDto: SignLeaseDto,
  @Req() req: AuthRequest,
) {
  if (!req.user) {
    throw new UnauthorizedException('User not authenticated');
  }

  // Build a full lease object or partial update object
  const leaseData = {
    tenantId: req.user.id,
    propertyId,
    unitId,
    paymentMethod: signLeaseDto.paymentMethod,
    digitalSignature: signLeaseDto.digitalSignature,
  };

  console.log('Lease data to save:', leaseData);

  return this.leaseService.signLease(leaseData, req.user);
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
  async getLeaseById(@Param('id', ParseIntPipe) id: number) {
    const lease = await this.leaseService.findLeaseById(id);
    if (!lease) {
      throw new NotFoundException(`Lease with id ${id} not found`);
    }
    return lease;
  }

  @Put(':id')
  async updateLease(@Param('id', ParseIntPipe) id: number, @Body() updateLeaseDto: UpdateLeaseDto) {
    return this.leaseService.updateLease(id, updateLeaseDto);
  }

  @Delete(':id')
  async deleteLease(@Param('id', ParseIntPipe) id: number) {
    return this.leaseService.deleteLease(id);
  }

  @Get('/property/:propertyId/unit/:unitId')
  async getLeaseByPropertyAndUnit(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Param('unitId', ParseIntPipe) unitId: number
  ) {
    const lease = await this.leaseService.findLeaseByPropertyAndUnit(propertyId, unitId);
    if (!lease) {
      throw new NotFoundException(`Lease not found for property ${propertyId} and unit ${unitId}`);
    }
    return lease;
  }
}
