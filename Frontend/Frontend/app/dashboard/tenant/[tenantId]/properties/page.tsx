"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  MapPin,
  DollarSign,
  Users,
  Star,
  Heart,
  Building,
  Sliders,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/dashboard-layout";
import Link from "next/link";
import { useParams } from "next/navigation";

type Unit = {
  id: number;
  unitNumber: string;
  floor?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  rentPrice?: number;
  status?: string;
  tenantId?: number;
};

type Property = {
  id: number;
  name: string;
  address: string;
  totalUnits: number;
  availableUnits: number;
  rating: number;
  reviews: number;
  amenities: string[];
  images?: string[];
  featured: boolean;
  priceRange?: string;
  units?: Unit[];  // add units here
};
export default function TenantPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailability, setFilterAvailability] = useState<"all" | "available" | "full">("all");
  const [favorites, setFavorites] = useState<number[]>([]);
 const totalProperties = properties.length;
const availableProperties = properties.filter((p) => p.availableUnits > 0).length;

  const { tenantId } = useParams();
  const backendUrl = "http://localhost:5000";
  const availableUnits = properties.reduce(
  (sum, p) => sum + p.availableUnits,
  0
);

useEffect(() => {
  async function fetchProperties() {
    try {
      const response = await axios.get<Property[]>(`${backendUrl}/properties`);
      const updatedProperties = response.data.map(property => {
        const availableUnitsCount = property.units?.filter(unit => unit.status === "vacant").length || 0;
        return {
          ...property,
          availableUnits: availableUnitsCount,
        };
      });
      setProperties(updatedProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  }
  fetchProperties();
}, []);


const filteredProperties = properties.filter((property) => {
  const availableUnitsCount = property.units?.filter(unit => unit.status === "vacant").length || 0;

  const matchesSearch =
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesAvailability =
    filterAvailability === "all" ||
    (filterAvailability === "available" && availableUnitsCount > 0) ||
    (filterAvailability === "full" && availableUnitsCount === 0);

  return matchesSearch && matchesAvailability;
});


  // Toggle favorite property id
  const toggleFavorite = (propertyId: number) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  
	return (
		<DashboardLayout>
			<div className="space-y-8">
				{/* Header */}
				<div className="animate-in fade-in duration-1000">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
								Browse Properties
							</h1>
							<p className="text-lg text-gray-600">
								Discover your perfect home from verified properties
							</p>
							<p className="text-sm text-gray-500">
								Explore available units and submit rental applications
							</p>
						</div>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div
						className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
						style={{ animationFillMode: "forwards" }}
					>
						<Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-blue-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div className="space-y-3">
										<p className="text-sm font-semibold text-gray-600">
											Total Properties
										</p>
										<p className="text-3xl font-bold text-gray-900">
											{totalProperties}
										</p>
									</div>
									<div className="p-4 rounded-3xl bg-blue-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
										<Building className="h-8 w-8 text-blue-600" />
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
					<div
						className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-450"
						style={{ animationFillMode: "forwards" }}
					>
						<Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-emerald-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div className="space-y-3">
										<p className="text-sm font-semibold text-gray-600">
											Available Properties
										</p>
										<p className="text-3xl font-bold text-gray-900">
											{availableProperties}
										</p>
									</div>
									<div className="p-4 rounded-3xl bg-emerald-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
										<Users className="h-8 w-8 text-emerald-600" />
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
					<div
						className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600"
						style={{ animationFillMode: "forwards" }}
					>
						<Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-purple-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div className="space-y-3">
										<p className="text-sm font-semibold text-gray-600">
											Available Units
										</p>
										<p className="text-3xl font-bold text-gray-900">
											{availableUnits}
										</p>
									</div>
									<div className="p-4 rounded-3xl bg-purple-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
										<DollarSign className="h-8 w-8 text-purple-600" />
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Search and Filter */}
				<div
					className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-750"
					style={{ animationFillMode: "forwards" }}
				>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search properties by name or location..."
								className="pl-10"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="flex space-x-2">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
  variant="outline"
  className="border-emerald-300 hover:bg-emerald-50 bg-transparent"
>
  <Sliders className="h-4 w-4 mr-2" />
  Availability:{" "}
  {filterAvailability === "all" ? "All" : filterAvailability}
</Button>

								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>Filter by Availability</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => setFilterAvailability("all")}
									>
										All Properties
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setFilterAvailability("available")}
									>
										Available Units
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setFilterAvailability("full")}
									>
										Fully Occupied
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>

				{/* Properties Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredProperties.map((property, index) => (
						<div
							key={property.id}
							className="animate-in fade-in slide-in-from-bottom-4 duration-700"
							style={{
								animationDelay: `${index * 150 + 900}ms`,
								animationFillMode: "forwards",
							}}
						>
							<Card className="hover:shadow-xl transition-all duration-500 group cursor-pointer transform hover:scale-105 bg-white/90 backdrop-blur-sm">
								<div className="relative">
						  {property.images?.length ? (
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {property.images.slice(0, 2).map((imgName, idx) => (
                      <img
                        key={idx}
                        src={`${backendUrl}/uploads/properties/${imgName}`}
                        alt={`Property ${idx}`}
                        className="object-cover w-full h-40 rounded"
                      />
                    ))}
                  </div>
                ) : (
                  <img
                    src="/default.jpg"
                    alt="Default property"
                    className="w-full h-48 object-cover rounded"
                  />
                )}
									<div className="absolute top-3 left-3 flex space-x-2">
										{property.featured && (
											<Badge className="bg-yellow-500 text-white">
												Featured
											</Badge>
										)}
										{property.availableUnits > 0 ? (
											<Badge className="bg-emerald-500 text-white">
												Available
											</Badge>
										) : (
											<Badge className="bg-red-500 text-white">Full</Badge>
										)}
									</div>
									<Button
										variant="ghost"
										size="sm"
										className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
										onClick={() => toggleFavorite(property.id)}
									>
										<Heart
											className={`h-4 w-4 ${
												favorites.includes(property.id)
													? "fill-red-500 text-red-500"
													: "text-gray-600"
											}`}
										/>
									</Button>
								</div>

								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<CardTitle className="text-lg font-semibold group-hover:text-emerald-600 transition-colors">
												{property.name}
											</CardTitle>
											<CardDescription className="flex items-center mt-1">
												<MapPin className="h-4 w-4 mr-1" />
												{property.address}
											</CardDescription>
										</div>
									</div>
								</CardHeader>

								<CardContent className="space-y-4">
									{/* Rating and Reviews */}
									<div className="flex items-center space-x-2">
										<div className="flex items-center space-x-1">
											<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
											<span className="font-medium">{property.rating}</span>
										</div>
										<span className="text-sm text-gray-500">
											({property.reviews} reviews)
										</span>
									</div>

									{/* Stats */}
									<div className="grid grid-cols-3 gap-4 text-center">
										<div>
											<div className="flex items-center justify-center mb-1">
												<Building className="h-4 w-4 text-gray-500" />
											</div>
											<p className="text-sm font-medium">
												{property.totalUnits}
											</p>
											<p className="text-xs text-gray-500">Total Units</p>
										</div>
										<div>
											<div className="flex items-center justify-center mb-1">
												<Users className="h-4 w-4 text-gray-500" />
											</div>
										<p className="text-xs text-gray-500">
  Available Units: {property.availableUnits ?? "N/A"}
</p>

										</div>
										<div>
											<div className="flex items-center justify-center mb-1">
												<DollarSign className="h-4 w-4 text-gray-500" />
											</div>
											<p className="text-sm font-medium">
												{property.priceRange}
											</p>
											<p className="text-xs text-gray-500">Price Range</p>
										</div>
									</div>

									{/* Amenities */}
									<div className="space-y-2">
										<p className="text-sm font-medium text-gray-700">
											Amenities:
										</p>
										<div className="flex flex-wrap gap-1">
  {(property.amenities ?? []).slice(0, 3).map((amenity, i) => (
    <Badge key={i} variant="outline" className="text-xs">
      {amenity}
    </Badge>
  ))}
  {(property.amenities ?? []).length > 3 && (
    <Badge variant="outline" className="text-xs">
      +{(property.amenities ?? []).length - 3} more
    </Badge>
  )}
</div>

									</div>

									{/* Actions */}
									<div className="flex space-x-2 pt-2">
										<Button
											variant="outline"
											size="sm"
											className="flex-1 bg-transparent"
											asChild
										>
											<Link
												href={`/dashboard/tenant/${tenantId}/properties/${property.id}`}
											>
												<Eye className="h-4 w-4 mr-1" />
												View Details
											</Link>
										</Button>
{property.availableUnits > 0 && (
  <Button
    size="sm"
    className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
    asChild
  >
    <Link href={`/dashboard/tenant/${tenantId}/properties/${property.id}/units`}>
      View Units
    </Link>
  </Button>
)}

									</div>
								</CardContent>
							</Card>
						</div>
					))}
				</div>

				{/* Empty State */}
				{filteredProperties.length === 0 && (
					<Card className="text-center py-12">
						<CardContent>
							<Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No properties found
							</h3>
							<p className="text-gray-600 mb-4">
								{searchTerm || filterAvailability !== "all"
									? "Try adjusting your search or filter criteria."
									: "No properties available at the moment."}
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</DashboardLayout>
	);
}
