import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Request } from 'express';
export declare class UnitsController {
    private readonly unitsService;
    constructor(unitsService: UnitsService);
    createUnit(propertyId: number, dto: CreateUnitDto, req: Request & {
        user: any;
    }): Promise<{
        message: string;
        unit: import("./entities/unit.entity").Unit;
    }>;
    getUnits(propertyId: number): Promise<import("./entities/unit.entity").Unit[]>;
    getUnit(propertyId: number, id: number): Promise<import("./entities/unit.entity").Unit>;
    updateUnit(id: number, dto: UpdateUnitDto): Promise<import("./entities/unit.entity").Unit>;
    deleteUnit(id: number): Promise<{
        message: string;
    }>;
}
