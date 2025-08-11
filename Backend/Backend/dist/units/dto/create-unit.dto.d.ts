export declare class CreateUnitDto {
    unitNumber: string;
    unitType: string;
    size?: number;
    bedrooms: number;
    bathrooms: number;
    monthlyRent: number;
    status: string;
    description?: string;
    images?: string[];
}
export declare class UpdateUnitDto extends CreateUnitDto {
}
