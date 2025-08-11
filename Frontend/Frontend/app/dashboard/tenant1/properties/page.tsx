"use client";

import { useState } from "react";
import {
	Building,
	Search,
	Filter,
	Eye,
	MapPin,
	DollarSign,
	Users,
	Star,
	Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardLayout from "@/components/dashboard-layout";
import Link from "next/link";

const properties = [
	{
		id: 1,
		name: "Sunrise Apartments",
		address: "Bole Road, Addis Ababa",
		totalUnits: 20,
		availableUnits: 3,
		priceRange: "15,000 - 25,000 ETB",
		rating: 4.8,
		reviews: 24,
		amenities: ["24/7 Security", "Parking", "WiFi", "Generator"],
		image:
			"https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400",
		featured: true,
	},
	{
		id: 2,
		name: "Green Valley Complex",
		address: "Kazanchis, Addis Ababa",
		totalUnits: 30,
		availableUnits: 5,
		priceRange: "18,000 - 28,000 ETB",
		rating: 4.6,
		reviews: 18,
		amenities: ["Swimming Pool", "Gym", "Security", "Parking"],
		image:
			"https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400",
		featured: false,
	},
	{
		id: 3,
		name: "City Center Plaza",
		address: "Piassa, Addis Ababa",
		totalUnits: 15,
		availableUnits: 0,
		priceRange: "22,000 - 35,000 ETB",
		rating: 4.9,
		reviews: 31,
		amenities: ["Elevator", "Security", "Modern Kitchen", "Balcony"],
		image:
			"https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=400",
		featured: true,
	},
	{
		id: 4,
		name: "Riverside Towers",
		address: "CMC Area, Addis Ababa",
		totalUnits: 25,
		availableUnits: 2,
		priceRange: "20,000 - 30,000 ETB",
		rating: 4.7,
		reviews: 15,
		amenities: ["River View", "Security", "Parking", "Garden"],
		image:
			"https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=400",
		featured: false,
	},
	{
		id: 5,
		name: "Modern Heights",
		address: "Gerji, Addis Ababa",
		totalUnits: 18,
		availableUnits: 4,
		priceRange: "16,000 - 24,000 ETB",
		rating: 4.5,
		reviews: 12,
		amenities: ["Modern Design", "Security", "WiFi", "Backup Power"],
		image:
			"https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400",
		featured: false,
	},
	{
		id: 6,
		name: "Golden Gate Residences",
		address: "Megenagna, Addis Ababa",
		totalUnits: 12,
		availableUnits: 1,
		priceRange: "25,000 - 40,000 ETB",
		rating: 4.9,
		reviews: 28,
		amenities: ["Luxury Finishes", "Concierge", "Gym", "Rooftop Terrace"],
		image:
			"https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=400",
		featured: true,
	},
];

export default function TenantPropertiesPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterAvailability, setFilterAvailability] = useState("all");
	const [filterPriceRange, setFilterPriceRange] = useState("all");
	const [favorites, setFavorites] = useState<number[]>([]);

	const filteredProperties = properties.filter((property) => {
		const matchesSearch =
			property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			property.address.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesAvailability =
			filterAvailability === "all" ||
			(filterAvailability === "available" && property.availableUnits > 0) ||
			(filterAvailability === "full" && property.availableUnits === 0);
		return matchesSearch && matchesAvailability;
	});

	const toggleFavorite = (propertyId: number) => {
		setFavorites((prev) =>
			prev.includes(propertyId)
				? prev.filter((id) => id !== propertyId)
				: [...prev, propertyId]
		);
	};

	const totalProperties = properties.length;
	const availableProperties = properties.filter(
		(p) => p.availableUnits > 0
	).length;
	const totalAvailableUnits = properties.reduce(
		(sum, p) => sum + p.availableUnits,
		0
	);

	return (
		<DashboardLayout
		>
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
											{totalAvailableUnits}
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
										<Filter className="h-4 w-4 mr-2" />
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
									<img
										src={property.image}
										alt={property.name}
										className="w-full h-48 object-cover rounded-t-lg"
									/>
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
											<p className="text-sm font-medium">
												{property.availableUnits}
											</p>
											<p className="text-xs text-gray-500">Available</p>
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
											{property.amenities.slice(0, 3).map((amenity, i) => (
												<Badge key={i} variant="outline" className="text-xs">
													{amenity}
												</Badge>
											))}
											{property.amenities.length > 3 && (
												<Badge variant="outline" className="text-xs">
													+{property.amenities.length - 3} more
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
												href={`/dashboard/tenant/properties/${property.id}`}
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
												<Link
													href={`/dashboard/tenant/properties/${property.id}/units`}
												>
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
