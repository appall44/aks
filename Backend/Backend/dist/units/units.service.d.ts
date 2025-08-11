import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
export declare class UnitsService {
    private readonly unitRepo;
    constructor(unitRepo: Repository<Unit>);
    createUnit(propertyId: number, dto: CreateUnitDto): Promise<Unit>;
    getUnitsByProperty(propertyId: number): Promise<Unit[]>;
    getUnitById(id: number): Promise<Unit>;
    updateUnit(id: number, dto: UpdateUnitDto): Promise<Unit>;
    deleteUnit(id: number): Promise<void>;
}
