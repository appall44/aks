import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
export declare class UnitsService {
    private readonly unitRepo;
    private unitRepository;
    constructor(unitRepo: Repository<Unit>, unitRepository: Repository<Unit>);
    createUnit(propertyId: number, dto: CreateUnitDto): Promise<Unit>;
    getUnitsByProperty(propertyId: number): Promise<Unit[]>;
    getUnitById(id: number): Promise<Unit>;
    updateUnit(id: number, dto: UpdateUnitDto): Promise<Unit>;
    deleteUnit(id: number): Promise<void>;
    findById(id: number): Promise<Unit | null>;
    updateUnitStatus(id: number, status: string): Promise<Unit>;
}
