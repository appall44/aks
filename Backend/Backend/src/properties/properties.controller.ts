// properties.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  HttpException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

import { Tenant } from '../tenant/entities/tenant.entity';
import { TenantService } from '../tenant/tenant.service';
import { OwnerPropertiesService } from './properties.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';

import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

//@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.ADMIN, Role.TENANT)
@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly service: OwnerPropertiesService,
    private readonly tenantService: TenantService,
  ) {}

  @Get()
  async getAvailableProperties() {
    return this.service.getAvailablePropertiesForTenants();
  }
  @Post()
  //@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/properties',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createProperty(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() body: any,
    @Req() req: Request & { user: any },
  ) {
    const userId = req.user.id;
    const userRole = req.user.role as Role;

    try {
      const dto: CreatePropertyDto = {
        name: String(body.name),
        description: String(body.description),
        type: String(body.type),
        address: String(body.address),
        city: String(body.city),
        area: String(body.area),
        totalUnits: parseInt(body.totalUnits, 10),
        pricePerUnit: parseFloat(body.pricePerUnit),
        bedrooms: parseInt(body.bedrooms, 10),
        bathrooms: parseInt(body.bathrooms, 10),
        squareMeters: body.squareMeters ? Number(body.squareMeters) : undefined,
        googleMapLink: body.googleMapLink ? String(body.googleMapLink) : undefined,
        featured: body.featured === 'true',
        status: String(body.status),
        payForFeatured: body.payForFeatured === 'true',
        featuredDuration: String(body.featuredDuration),
        amenities: Array.isArray(body.amenities)
          ? body.amenities
          : body.amenities
          ? [body.amenities]
          : [],
        images: images.map((file) => file.filename),
      };

      const property = await this.service.createProperty(userId, dto, userRole);
      return { message: 'Property created successfully', property };
    } catch (error) {
      console.error('Error in createProperty:', error);
      throw new HttpException('Invalid data format', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('dashboard')
  //@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  async getDashboardData(@Req() req: Request & { user: any }) {
    const ownerId = req.user.id;

    return {
      totalProperties: await this.service.countPropertiesByOwner(ownerId),
      totalRevenue: await this.service.calculateTotalRevenue(ownerId),
      occupancyRate: await this.service.calculateOccupancyRate(ownerId),
      activeTenants: await this.service.countActiveTenants(ownerId),
    };
  }

 @Get(':id')
@UseGuards(JwtAuthGuard) 
async getPropertyById(
  @Param('id') id: number,
  @Req() req: Request & { user?: any },
) {
  console.log('req.user:', req.user);

  if (!req.user) {
    throw new HttpException('Unauthorized access: user not found in request', HttpStatus.UNAUTHORIZED);
  }

  const userId = req.user.id;
  const userRole = req.user.role;

  const property = await this.service.getPropertyById(+id, userId, userRole);
  if (!property) {
    throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
  }

  return property;
}



  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  async updateProperty(
    @Param('id') id: number,
    @Body() dto: UpdatePropertyDto,
    @Req() req: Request & { user: any },
  ) {
    const userId = req.user.id;
    const userRole = req.user.role as Role;
    const updatedProperty = await this.service.updateProperty(id, userId, userRole, dto);
    return {
      message: 'Property updated successfully',
      property: updatedProperty,
    };
  }
  

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  async deleteProperty(
    @Param('id') id: number,
    @Req() req: Request & { user: any },
  ) {
    const userId = req.user.id;
    const userRole = req.user.role as Role;
    await this.service.deleteProperty(id, userId, userRole);
    return { message: 'Property deleted successfully' };
  }
@Get(':id/tenants')
@UseGuards(JwtAuthGuard)  
async getTenantsByProperty(
  @Param('id') propertyId: number,
): Promise<Tenant[]> {
  return this.tenantService.getTenantsByPropertyId(propertyId);
}


@Get('owner/:ownerId')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.ADMIN)
async getPropertiesByOwner(@Param('ownerId') ownerId: number) {
  return this.service.getPropertiesByOwner(ownerId);
}

  @Get(':id/activities')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  getPropertyActivities(@Param('id') propertyId: number) {
    return `Activities for property ${propertyId}`;
  }

  
  
@Get('tenant/:tenantId/my-properties')
async getPropertiesByTenant(@Param('tenantId') tenantId: number) {
  return this.service.getPropertiesByTenant(tenantId);
}

 @Get('available-units')
  async getPropertiesWithAvailableUnits() {
return this.service.getPropertiesWithAvailableUnits();  }

}
