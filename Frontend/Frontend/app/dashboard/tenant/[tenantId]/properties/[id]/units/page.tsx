"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Building, MapPin, ArrowLeft, Home, Bed, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/dashboard-layout";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Unit {
	id: number;
	unitNumber: string;
	floor: number;
	bedrooms: number;
	bathrooms: number;
	area: string; // Note: your backend might use 'size' - adjust if needed
	monthlyRent: number;
	deposit: number;
	status: string;
	description: string;
	amenities: string[];
	images: string[];
	availableFrom: string | null;
}

interface Property {
	id: number;
	name: string;
	address: string;
}

export default function PropertyUnitsPage() {
	const params = useParams();
	const backendUrl = "http://localhost:5000"; // Backend base URL

	// Narrow param to string safely
	const propertyId = Array.isArray(params.id) ? params.id[0] : params.id;
	const tenantId = Array.isArray(params.tenantId)
		? params.tenantId[0]
		: params.tenantId;

	const [units, setUnits] = useState<Unit[]>([]);
	const [property, setProperty] = useState<Property | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!propertyId) return;

		async function fetchData() {
			setLoading(true);
			setError(null);

			try {
				const token = localStorage.getItem("accessToken") || "";
				if (!token) {
					throw new Error("User not authenticated");
				}

				// Fetch property info
				const propertyResponse = await axios.get<Property>(
					`${backendUrl}/properties/${propertyId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				// Fetch units for that property
				const unitsResponse = await axios.get<Unit[]>(
					`${backendUrl}/properties/${propertyId}/units`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				setProperty(propertyResponse.data);

				// Backend uses "size" for area — map it if needed
				const unitsWithArea = unitsResponse.data.map((unit) => ({
					...unit,
					area: (unit.area || (unit as any).size)?.toString() || "N/A",
				}));

				setUnits(unitsWithArea);
			} catch (err: any) {
				setError(err.message || "Failed to load property or units");
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [propertyId, backendUrl]);

	if (loading) return <p>Loading units...</p>;
	if (error) return <p className="text-red-600">{error}</p>;

	// Filter units where status is 'vacant' to consider them available
	const availableUnits = units.filter((unit) => unit.status === "vacant");
	console.log("Available Units:", availableUnits);

	return (
		<DashboardLayout userRole="tenant" userId={tenantId}>
			<div className="space-y-8">
				{/* Header */}
				<div className="animate-in fade-in duration-1000">
					<div className="flex items-center space-x-4 mb-6">
						<Button
							variant="outline"
							asChild
							className="border-emerald-300 hover:bg-emerald-50"
						>
							<Link href={`/dashboard/tenant/${tenantId}/properties`}>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to Property Details
							</Link>
						</Button>
					</div>
					<div>
						<h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
							Available Units
						</h1>
						<p className="text-lg text-gray-600 flex items-center">
							<Building className="h-5 w-5 mr-2" />
							{property?.name}
						</p>
						<p className="text-sm text-gray-500 flex items-center mt-1">
							<MapPin className="h-4 w-4 mr-1" />
							{property?.address}
						</p>
					</div>
				</div>

				{/* Available Units Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{availableUnits.map((unit, index) => (
						<div
							key={unit.id}
							className="animate-in fade-in slide-in-from-bottom-4 duration-700"
							style={{
								animationDelay: `${index * 200 + 300}ms`,
								animationFillMode: "forwards",
							}}
						>
							<Card className="hover:shadow-xl transition-all duration-500 group cursor-pointer transform hover:scale-105 bg-white/90 backdrop-blur-sm">
								<div className="relative">
									<img
										src={
											unit.images[0]
												? `${backendUrl}${unit.images[0]}`
												: "/default-unit-image.jpg"
										}
										alt={`Unit ${unit.unitNumber}`}
										className="w-full h-48 object-cover rounded-t-lg"
									/>
									<Badge className="absolute top-3 left-3 bg-emerald-500 text-white">
										Vacant
									</Badge>
									<Badge className="absolute top-3 right-3 bg-blue-500 text-white">
										Floor {unit.floor}
									</Badge>
								</div>

								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div>
											<CardTitle className="text-xl font-semibold">
												Unit {unit.unitNumber}
											</CardTitle>
											<CardDescription className="mt-1">
												{unit.area} sqft • {unit.bedrooms} bed •{" "}
												{unit.bathrooms} bath
											</CardDescription>
										</div>
										<div className="text-right">
											<p className="text-2xl font-bold text-emerald-600">
												{unit.monthlyRent.toLocaleString()} ETB
											</p>
											<p className="text-sm text-gray-500">per month</p>
										</div>
									</div>
								</CardHeader>

								<CardContent className="space-y-4">
									{/* Unit Details */}
									<div className="grid grid-cols-3 gap-4 text-center">
										<div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
											<Bed className="h-5 w-5 text-blue-600 mx-auto mb-1" />
											<p className="text-sm font-medium">{unit.bedrooms}</p>
											<p className="text-xs text-gray-500">
												Bedroom{unit.bedrooms > 1 ? "s" : ""}
											</p>
										</div>
										<div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
											<Bath className="h-5 w-5 text-purple-600 mx-auto mb-1" />
											<p className="text-sm font-medium">{unit.bathrooms}</p>
											<p className="text-xs text-gray-500">
												Bathroom{unit.bathrooms > 1 ? "s" : ""}
											</p>
										</div>
										<div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
											<Home className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
											<p className="text-sm font-medium">{unit.area}</p>
											<p className="text-xs text-gray-500">Total Area (sqft)</p>
										</div>
									</div>

									{/* Description */}
									<p className="text-gray-600 text-sm leading-relaxed">
										{unit.description}
									</p>

									{/* Amenities */}
									{Array.isArray(unit.amenities) &&
										unit.amenities.length > 0 && (
											<div className="space-y-2">
												<p className="text-sm font-medium text-gray-700">
													Unit Features:
												</p>
												<div className="flex flex-wrap gap-1">
													{unit.amenities.map((amenity, i) => (
														<Badge
															key={i}
															variant="outline"
															className="text-xs"
														>
															{amenity}
														</Badge>
													))}
												</div>
											</div>
										)}

									{/* Financial Info */}
									<div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div>
												<p className="text-gray-600">Monthly Rent:</p>
												<p className="font-semibold text-emerald-600">
													{unit.monthlyRent.toLocaleString()} ETB
												</p>
											</div>
											<div>
												<p className="text-gray-600">Security Deposit:</p>
												<p className="font-semibold">
													{unit.deposit != null ? "30000" : "30000"} ETB
												</p>
											</div>
											<div>
												<p className="text-gray-600">Available From:</p>
												<p className="font-semibold">
													{unit.availableFrom
														? new Date(unit.availableFrom).toLocaleDateString()
														: "N/A"}
												</p>
											</div>
											<div>
												<p className="text-gray-600">Lease Term:</p>
												<p className="font-semibold">12 months</p>
											</div>
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
												href={`/dashboard/tenant/${tenantId}/properties/${propertyId}/units/${unit.id}`}
											>
												View Details
											</Link>
										</Button>
										<Button
											size="sm"
											className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
											asChild
										>
											<Link
												href={`/dashboard/tenant/${tenantId}/properties/${propertyId}/units/${unit.id}/rent`}
											>
												Request to Rent
											</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					))}
				</div>

				{/* No Available Units */}
				{availableUnits.length === 0 && (
					<Card className="text-center py-12">
						<CardContent>
							<Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No Available Units
							</h3>
							<p className="text-gray-600 mb-4">
								All units in this property are currently occupied. You can join
								the waiting list to be notified when units become available.
							</p>
							<Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
								Join Waiting List
							</Button>
						</CardContent>
					</Card>
				)}
			</div>
		</DashboardLayout>
	);
}
