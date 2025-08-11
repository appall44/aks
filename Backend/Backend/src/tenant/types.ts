export interface Payment {
  id: number;
  tenantId: number;
  amount: number;
  date: string;
  status: string;
}
export interface MaintenanceRequest {
  id: number;
  tenantId: number;
  issue: string;
  status: string;
}
export interface Amenity {
  id: number;
  name: string;
  propertyId: number;
}
export interface Landlord {
  id: number;
  name: string;
  phone: string;
}
