import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { Request } from 'express';

@Controller('properties/:propertyId/units')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.OWNER, Role.TENANT)
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  async createUnit(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Body() dto: CreateUnitDto,
    @Req() req: Request & { user: any },
  ) {

    const unit = await this.unitsService.createUnit(propertyId, dto);
    return { message: 'Unit created successfully', unit };
  }

  @Get()
  async getUnits(@Param('propertyId', ParseIntPipe) propertyId: number) {
    return this.unitsService.getUnitsByProperty(propertyId);
  }

  @Get(':id')
  async getUnit(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {

    return this.unitsService.getUnitById(id);
  }

  @Put(':id')
  async updateUnit(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUnitDto,
  ) {
    return this.unitsService.updateUnit(id, dto);
  }

  @Delete(':id')
  async deleteUnit(@Param('id', ParseIntPipe) id: number) {
    await this.unitsService.deleteUnit(id);
    return { message: 'Unit deleted successfully' };
  }
}
