"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Building,
  MapPin,
  DollarSign,
  Users,
  Star,
  Plus,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/dashboard-layout";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  type: string;
  status: string;
  featured: boolean;
  images: string[];
  description: string;
  rating: number;
  reviews: number;
  pricePerUnit: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  amenities: string[];
   name: string;
  address: string;
  totalUnits: number;
  occupiedUnits: number;
  monthlyRevenue: number;
  // Add others as needed
}


type ProPropertyDetails = {
  id: number;
  firstname: string;
  address: string;
  totalUnits: number;
  occupiedUnits: number;
  monthlyRevenue: number;
};

type Tenant = {
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
};

export default function PropertyDetailsPage() {
    const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [property, setProperty] = useState<Property | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const backendUrl = "http://localhost:5000";

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("accessToken") || "";

        const [propertyRes, tenantsRes] = await Promise.all([
          axios.get<Property>(`${backendUrl}/owner/properties/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<Tenant[]>(`${backendUrl}/owner/properties/${id}/tenants`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProperty(propertyRes.data);
        setTenants(tenantsRes.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;
  if (error) return <DashboardLayout><p className="text-red-600">{error}</p></DashboardLayout>;
  if (!property) return <DashboardLayout><p>Property not found.</p></DashboardLayout>;

  // Use the fields from the interface, not non-existing ones
  const totalUnits = property.totalUnits;
  const occupiedUnits = property.occupiedUnits || tenants.length; // fallback to tenants count
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  // If you have no 'activities' field, comment this out or define state & fetching
  const recentActivities: any[] = []; 

  const handleDelete = async (tenantId: number) => {
    const token = localStorage.getItem("accessToken") || "";
    try {
      await axios.delete(`${backendUrl}/owner/tenants/${tenantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTenants((prev) => prev.filter((tenant) => tenant.id !== tenantId));
      toast({ title: "Tenant removed successfully." });
    } catch (err) {
      toast({ title: "Failed to remove tenant.", variant: "destructive" });
    }
  };

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
							<Link href="/dashboard/owner/properties">
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
								<Badge className="bg-emerald-100 text-emerald-800">
									{property.type}
								</Badge>
								<Badge className="bg-blue-100 text-blue-800">
									{property.status}
								</Badge>
								{property.featured && (
									<Badge className="bg-yellow-100 text-yellow-800">
										⭐ Featured
									</Badge>
								)}
							</div>
						</div>
						<div className="flex space-x-3">
							<Button
            asChild
            className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Link href={`/dashboard/owner/properties/${id}/units/new`}>
              <Plus className="h-4 w-4 mr-2" />
              Add Unit
            </Link>
          </Button>
							<Button
								variant="outline"
								asChild
								className="border-emerald-300 hover:bg-emerald-50"
							>
								<Link href={`/dashboard/owner/properties/${id}/edit`}>
									<Edit className="h-4 w-4 mr-2" />
									Edit Property
								</Link>
							</Button>
							<AlertDialog>
								<AlertDialogTrigger asChild>
	{tenants.map((tenant) => (
  <Button
    variant="outline"
    className="border-red-300 hover:bg-red-50 text-red-600"
    onClick={() => handleDelete(tenant.id)}  // tenant.id here
    key={tenant.id}
  >
    <Trash2 className="h-4 w-4 mr-2" />
    Delete
  </Button>
))}

								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Delete Property</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to delete "{property.name}"?
											This action cannot be undone and will affect all
											associated leases and tenants.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
  className="bg-red-600 hover:bg-red-700"
onClick={() => handleDelete(Number(property.id))}
>
  Delete Property
</AlertDialogAction>

									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
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
										Visual showcase of your property
									</CardDescription>
								</CardHeader>
								<CardContent>
						 <div className="relative">
{property.images?.length ? (
  <div className="grid grid-cols-2 gap-2">
    {property.images.map((imgName, index) => (
      <img
        key={index}
        src={`${backendUrl}/uploads/properties/${imgName}`}
        alt={`Property image ${index + 1}`}
        className="w-full h-48 object-cover rounded-lg"
      />
    ))}
  </div>
) : (
  <img
    src="/default.jpg"
    alt="Default property"
    className="w-full h-48 object-cover rounded-lg"
  />
)}
										{/* Thumbnail Gallery */}
										<div className="grid grid-cols-4 gap-3">
  {property.images.map((image, index) => (
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
        src={`http://localhost:5000/uploads/${image}`} // <-- this is the key fix
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
										Property Description
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-700 leading-relaxed text-lg">
										{property.description}
									</p>

									<div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
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
												{occupancyRate}%
											</p>
											<p className="text-sm text-blue-700">Occupied</p>
										</div>
										<div className="text-center p-4 rounded-xl bg-purple-50 border border-purple-200">
											<DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
											<p className="text-2xl font-bold text-purple-600">
												{(property.monthlyRevenue / 1000).toFixed(0)}K
											</p>
											<p className="text-sm text-purple-700">Monthly Revenue</p>
										</div>
										<div className="text-center p-4 rounded-xl bg-yellow-50 border border-yellow-200">
											<Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
											<p className="text-2xl font-bold text-yellow-600">
												{property.rating}
											</p>
											<p className="text-sm text-yellow-700">
												{property.reviews} Reviews
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Current Tenants */}
						<div
							className="animate-in fade-in slide-in-from-left-4 duration-700 delay-900"
							style={{ animationFillMode: "forwards" }}
						>
							<Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
								<CardHeader>
									<CardTitle className="text-xl font-bold text-gray-900">
										Current Tenants
									</CardTitle>
									<CardDescription>
										Active tenants in this property
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Tenant</TableHead>
												<TableHead>Unit</TableHead>
												<TableHead>Lease Period</TableHead>
												<TableHead>Monthly Rent</TableHead>
												<TableHead>Status</TableHead>
												<TableHead className="text-right">Actions</TableHead>
											</TableRow>
										</TableHeader>
<TableBody>
  {tenants.map((tenant) => (
    <TableRow key={tenant.id}>
      <TableCell>
        {(tenant.firstname && tenant.firstname.split(" ")[0]) || "Unknown"}
      </TableCell>
      <TableCell>{tenant.unit || "8/1/2026"}</TableCell>
	  <TableCell>
        {tenant.leaseStart && tenant.leaseEnd
          ? `${new Date(tenant.leaseStart).toLocaleDateString()} - ${new Date(tenant.leaseEnd).toLocaleDateString()}`
          : "7/2/2025"}
      </TableCell>
<TableCell>
  {typeof tenant.monthlyRent === "number"
    ? `$${tenant.monthlyRent.toFixed(2)}`
    : "$2500"}
</TableCell>
      <TableCell>{tenant.status || "Unknown"}</TableCell>
    </TableRow>
  ))}
</TableBody>



									</Table>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* Sidebar */}
					<div className="xl:col-span-1 space-y-8">
						{/* Property Stats */}
						<div
							className="animate-in fade-in slide-in-from-right-4 duration-700 delay-600"
							style={{ animationFillMode: "forwards" }}
						>
							<Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm sticky top-8">
								<CardHeader>
									<CardTitle className="text-xl font-bold text-gray-900">
										Property Statistics
									</CardTitle>
									<CardDescription>
										Performance metrics and details
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Occupancy Rate */}
									<div className="space-y-3">
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium text-gray-700">
												Occupancy Rate
											</span>
											<span className="text-lg font-bold text-emerald-600">
												{occupancyRate}%
											</span>
										</div>
										<Progress value={occupancyRate} className="h-3" />
										<p className="text-xs text-gray-500">
											{property.occupiedUnits} of {property.totalUnits}{" "}
											units occupied
										</p>
									</div>

									<Separator />

									{/* Financial Info */}
									<div className="space-y-4">
										<h4 className="font-semibold text-gray-900">
											Financial Overview
										</h4>
										<div className="space-y-3">
											<div className="flex justify-between">
												<span className="text-sm text-gray-600">
													Monthly Revenue:
												</span>
												<span className="font-semibold text-emerald-600">
  {property?.monthlyRevenue != null ? `${property.monthlyRevenue.toLocaleString()} ETB` : "N/A"}
</span>

											</div>
											<div className="flex justify-between">
												<span className="text-sm text-gray-600">
													Price per Unit:
												</span>
												<span className="font-medium">
													{property.pricePerUnit.toLocaleString()} ETB
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm text-gray-600">
													Annual Revenue:
												</span>
												<span className="font-semibold text-emerald-600">
  {property?.monthlyRevenue != null ? `${property.monthlyRevenue.toLocaleString()} ETB` : "N/A"}
</span>

											</div>
										</div>
									</div>

									<Separator />

									{/* Property Details */}
									<div className="space-y-4">
										<h4 className="font-semibold text-gray-900">
											Property Details
										</h4>
										<div className="space-y-3">
											<div className="flex justify-between">
												<span className="text-sm text-gray-600">Bedrooms:</span>
												<span className="font-medium">
													{property.bedrooms}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm text-gray-600">
													Bathrooms:
												</span>
												<span className="font-medium">
													{property.bathrooms}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm text-gray-600">Area:</span>
												<span className="font-medium">
													{property.squareMeters} sqm
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm text-gray-600">Rating:</span>
												<div className="flex items-center space-x-1">
													<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
													<span className="font-medium">
														{property.rating}
													</span>
												</div>
											</div>
										</div>
									</div>

									<Separator />

									{/* Amenities */}
									<div className="space-y-4">
										<h4 className="font-semibold text-gray-900">Amenities</h4>
										<div className="grid grid-cols-1 gap-2">
											{property.amenities.map((amenity, index) => (
												<div
													key={index}
													className="flex items-center space-x-2 p-2 rounded-lg bg-emerald-50 border border-emerald-100"
												>
													<div className="w-2 h-2 bg-emerald-500 rounded-full" />
													<span className="text-sm text-emerald-700">
														{amenity}
													</span>
												</div>
											))}
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Recent Activities */}
						<div
							className="animate-in fade-in slide-in-from-right-4 duration-700 delay-900"
							style={{ animationFillMode: "forwards" }}
						>
							<Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
								<CardHeader>
									<CardTitle className="text-xl font-bold text-gray-900">
										Recent Activities
									</CardTitle>
									<CardDescription>
										Latest updates for this property
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
  {Array.isArray(recentActivities) ? (
    recentActivities.map((activity) => (
      <div
        key={activity.id}
        className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <div className="flex-shrink-0 mt-1">
          {activity.type === "payment" && (
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          )}
          {activity.type === "maintenance" && (
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Building className="h-4 w-4 text-orange-600" />
            </div>
          )}
          {activity.type === "inquiry" && (
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Eye className="h-4 w-4 text-blue-600" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {activity.message}
          </p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500">
              {new Date(activity.date).toLocaleDateString()}
            </p>
            {activity.amount && (
              <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                {activity.amount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-500">No recent activity available.</p>
  )}
</div>

								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
