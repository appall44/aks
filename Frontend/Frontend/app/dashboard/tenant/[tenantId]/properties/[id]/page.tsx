"use client";

import React, { useState, useEffect } from "react";
import {
  Building,
  MapPin,
  Star,
  Users,
  DollarSign,
  ArrowLeft,
  Heart,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/dashboard-layout";
import Link from "next/link";
import { useParams } from "next/navigation";

import axios from "axios";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";


import { useToast } from "@/hooks/use-toast";

// --- Types ---
type OwnerType = "individual" | "company" | "other";

interface LocationType {
  city: string;
  state: string;
  country: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  occupiedUnits: number;
  monthlyRevenue: number;
  description: string;
  pricePerUnit: number;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  amenities?: string[];
  images?: string[];
  rating?: number;
  reviews?: number;
  type?: string;
  status?: string;
  featured?: boolean;
  owner?: Owner;
  location?: LocationType;
  propertyType: string;
  availableUnits?: number;
  yearBuilt?: number;
}

interface Tenant {
  id: number;
  firstname: string;
  unit: string;
  phone: string;
  email: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  status: string;
  avatar: string;
}

interface Owner {
  name: string;
  type: OwnerType;
  avatar?: string;
  phone?: string;
  email?: string;
  company?: string;
}

interface LocationType {
  address: string;
  city: string;
  nearby?: string[];         
  transportation?: string[]; 
 
}

interface Unit {
  id: number;
  unitNumber: string;
  floor?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  rentPrice?: number;
  status?: string;
  tenantId?: number;
 
}

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const { toast } = useToast();

  const [property, setProperty] = useState<Property | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const backendUrl = "http://localhost:5000";
const images = property?.images ?? [];
const amenities = property?.amenities ?? [];
const location = property?.location;
const { tenantId } = useParams();
const { ownerId } = useParams();
const [units, setUnits] = useState<Unit[]>([]);

useEffect(() => {
  async function fetchData() {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken") || "";

   const [propertyRes, unitsRes] = await Promise.all([
  axios.get<Property>(`${backendUrl}/properties/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  }),
  axios.get<Unit[]>(`${backendUrl}/properties/${id}/units`, {
    headers: { Authorization: `Bearer ${token}` },
  }),
]);

setProperty(propertyRes.data);
setUnits(unitsRes.data);


    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load property data."
      );
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
    });
  };

 if (loading) {
    return <DashboardLayout><p>Loading...</p></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><p className="text-red-600">{error}</p></DashboardLayout>;
  }

  if (!property) {
    return <DashboardLayout><p>Property not found.</p></DashboardLayout>;
  }

const availableUnitsCount = units.filter(unit => unit.status === "vacant").length;

const availableUnits = availableUnitsCount;

  const occupancyRate =
    property.totalUnits > 0
      ? Math.round((property.occupiedUnits / property.totalUnits) * 100)
      : 0;

  const owner = property.owner;
	return (
		<DashboardLayout>
			<div className="space-y-8">
				{/* Header */}
				<div className="animate-in fade-in duration-1000">
					<div className="flex items-center space-x-4 mb-6">
						<Button
							variant="outline"
							asChild
							className="border-emerald-300 hover:bg-emerald-50"
						>
							<Link href={`/dashboard/tenant/${id}/properties`}>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to Properties
							</Link>
						</Button>
					</div>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
								{property.name}
							</h1>
							<p className="text-lg text-gray-600 flex items-center">
								<MapPin className="h-5 w-5 mr-2" />
								{property.address}
							</p>
							<div className="flex items-center space-x-4 mt-2">
								<div className="flex items-center space-x-1">
									<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
									<span className="font-medium">{property.rating}</span>
									<span className="text-sm text-gray-500">
										({property.reviews} reviews)
									</span>
								</div>
								<Badge className="bg-emerald-100 text-emerald-800">
									{property.propertyType}
								</Badge>
							</div>
						</div>
						<div className="flex space-x-3">
							<Button
								variant="outline"
								onClick={() => setIsFavorite(!isFavorite)}
								className={`border-red-300 hover:bg-red-50 ${
									isFavorite ? "bg-red-50" : ""
								}`}
							>
								<Heart
									className={`h-4 w-4 mr-2 ${
										isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
									}`}
								/>
								{isFavorite ? "Saved" : "Save"}
							</Button>
							{(property.availableUnits ?? 0) > 0 && (
  <Button
    asChild
    className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300"
  >
    <Link href={`/dashboard/tenant/properties/${property.id}/units`}>
      View Available Units
    </Link>
  </Button>
)}

						</div>
					</div>
				</div>

				{/* Property Overview */}
				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* Images and Details */}
					<div className="xl:col-span-2 space-y-8">
						{/* Image Gallery */}
						<div
							className="animate-in fade-in slide-in-from-left-4 duration-700 delay-300"
							style={{ animationFillMode: "forwards" }}
						>
							<Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
								<CardHeader>
									<CardTitle className="text-xl font-bold text-gray-900">
										Property Images
									</CardTitle>
									<CardDescription>
										Visual showcase of the property
									</CardDescription>
								</CardHeader>
								<CardContent>
  <div className="space-y-4">
    {/* Main Image */}
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
    {/* Thumbnail Gallery */}
    <div className="grid grid-cols-4 gap-3">
      {property.images?.map((image, index) => (
        <button
          key={index}
          onClick={() => setSelectedImage(index)}
          className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
            selectedImage === index
              ? "ring-4 ring-emerald-500 scale-105"
              : "hover:scale-105 hover:shadow-lg"
          }`}
        >
          <img
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className="w-full h-20 object-cover"
          />
        </button>
      ))}
    </div>
  </div>
</CardContent>

							</Card>
						</div>

						{/* Property Description */}
						<div
							className="animate-in fade-in slide-in-from-left-4 duration-700 delay-600"
							style={{ animationFillMode: "forwards" }}
						>
							<Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
								<CardHeader>
									<CardTitle className="text-xl font-bold text-gray-900">
										About This Property
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-700 leading-relaxed text-lg mb-6">
										{property.description}
									</p>

									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
										<div className="text-center p-4 rounded-xl bg-emerald-50 border border-emerald-200">
											<Building className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
											<p className="text-2xl font-bold text-emerald-600">
												{property.totalUnits}
											</p>
											<p className="text-sm text-emerald-700">Total Units</p>
										</div>
										<div className="text-center p-4 rounded-xl bg-blue-50 border border-blue-200">
											<Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
											<p className="text-2xl font-bold text-blue-600">
												{property.availableUnits}
											</p>
											<p className="text-sm text-blue-700">Available</p>
										</div>
										<div className="text-center p-4 rounded-xl bg-purple-50 border border-purple-200">
											<Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
											<p className="text-2xl font-bold text-purple-600">
												{property.yearBuilt}
											</p>
											<p className="text-sm text-purple-700">Year Built</p>
										</div>
										<div className="text-center p-4 rounded-xl bg-yellow-50 border border-yellow-200">
											<Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
											<p className="text-2xl font-bold text-yellow-600">
												{property.rating}
											</p>
											<p className="text-sm text-yellow-700">Rating</p>
										</div>
									</div>

									<Separator className="my-6" />

									<div>
										<h4 className="font-semibold mb-3 text-gray-900">
											Property Amenities
										</h4>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
  {property.amenities?.length ? (
    property.amenities.map((amenity, index) => (
      <div
        key={index}
        className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100"
      >
        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
        <span className="text-sm text-emerald-700 font-medium">{amenity}</span>
      </div>
    ))
  ) : (
    <p className="text-gray-500">No amenities available.</p>
  )}
</div>

									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* Sidebar */}
					<div className="xl:col-span-1 space-y-8">
						{/* Property Owner */}
						<div
							className="animate-in fade-in slide-in-from-right-4 duration-700 delay-600"
							style={{ animationFillMode: "forwards" }}
						>
							<Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm sticky top-8">
								<CardHeader>
									<CardTitle className="text-xl font-bold text-gray-900">
										Property Owner
									</CardTitle>
									<CardDescription>Contact information</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
									<div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
  <Avatar className="h-16 w-16 ring-4 ring-purple-200">
    {property.owner?.avatar ? (
      <AvatarImage src={property.owner.avatar} />
    ) : (
      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-lg">
        {property.owner?.name
          ? property.owner.name
              .split(' ')
              .map((n) => n[0])
              .join('')
          : 'PO' /* fallback initials */}
      </AvatarFallback>
    )}
  </Avatar>
  <div className="flex-1">
    <p className="font-semibold text-lg text-gray-900">
      {property.owner?.name || 'Unknown Owner'}
    </p>
    <p className="text-sm text-gray-600">Property Owner</p>
    <p className="text-sm text-purple-600 font-medium">
      {property.owner?.company || 'No company info'}
    </p>
  </div>
</div>


										<div className="space-y-3">
											<div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
												<div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
													<Phone className="h-5 w-5 text-emerald-600" />
												</div>
												<div>
  <p className="text-sm font-medium text-gray-900">
    {property.owner?.phone || "No phone available"}
  </p>
  <p className="text-xs text-gray-500">Phone</p>
</div>

											</div>
											<div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
												<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
													<Mail className="h-5 w-5 text-blue-600" />
												</div>
												<div>
  <p className="text-sm font-medium text-gray-900">
    {property.owner?.email || "No email available"}
  </p>
  <p className="text-xs text-gray-500">Email</p>
</div>

											</div>
										</div>

										<Button className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
											Contact Owner
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Location Info */}
						<div
							className="animate-in fade-in slide-in-from-right-4 duration-700 delay-900"
							style={{ animationFillMode: "forwards" }}
						>
							<Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
								<CardHeader>
									<CardTitle className="text-xl font-bold text-gray-900">
										Location & Nearby
									</CardTitle>
									<CardDescription>What's around this property</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<h4 className="font-semibold text-gray-900 mb-3">
												Nearby Places
											</h4>
											<div className="space-y-2">
  {property.location?.nearby?.map((place, index) => (
    <div
      key={index}
      className="flex items-center space-x-2 text-sm"
    >
      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
      <span className="text-gray-700">{place}</span>
    </div>
  )) || <p className="text-gray-500">No nearby places listed.</p>}
</div>

										</div>

										<Separator />

										<div>
											<h4 className="font-semibold text-gray-900 mb-3">
												Transportation
											</h4>
											<div className="space-y-2">
  {property.location?.transportation?.map((transport, index) => (
    <div
      key={index}
      className="flex items-center space-x-2 text-sm"
    >
      <div className="w-2 h-2 bg-blue-500 rounded-full" />
      <span className="text-gray-700">{transport}</span>
    </div>
  )) || <p className="text-gray-500">No transportation info available.</p>}
</div>

										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
      
<div>
  {availableUnits >0 && (
    <div
      className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1200"
      style={{ animationFillMode: "forwards" }}
    >
      <Card className="shadow-xl border-0 bg-gradient-to-r from-emerald-50 to-blue-50 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Ready to Make This Your Home?
            </h3>

            <p className="text-gray-600">
              {availableUnits} unit{availableUnits > 1 ? "s" : ""} available for rent
            </p>

            {property && tenantId && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Link href={`/dashboard/tenant/${tenantId}/properties/${property.id}/units`}>
                    View Available Units
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-emerald-300 hover:bg-emerald-50"
                >
                  Schedule Property Tour
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )}
</div>



		</DashboardLayout>
	);
}
