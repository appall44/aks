"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
	Building,
	Search,
	Eye,
	Calendar,
	DollarSign,
	Wrench,
	FileText,
	Phone,
	Mail,
	 MapPin
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/dashboard-layout";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
interface Property {
	id: number;
	property: string;
	unit: string;
	name: string; 
	address: string;
	monthlyRent: number;
	leaseStart: string;
	leaseEnd: string;
	status: string;
	 totalUnits: number; 
	daysRemaining: number;
	paymentStatus: string;
	occupiedUnits: number;      // (Add if also missing)
  monthlyRevenue: number;
	lastPayment: string;
	nextPayment: string;
	maintenanceRequests: number;
	image: string;
	 images: string[];
	landlord: {
		name: string;
		phone: string;
		email: string;
		avatar: string;
	};
}


export default function MyPropertiesPage() {
const [properties, setProperties] = useState<Property[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [loading, setLoading] = useState(false);
	const [selectedPropertyName, setSelectedPropertyName] = useState<string>("");
	const [error, setError] = useState("");
 const backendUrl = "http://localhost:5000";
 const { tenantId } = useParams();
  const router = useRouter();
  const params = useParams();

useEffect(() => {
  const fetchProperties = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No access token found");
        return;
      }

      const numericTenantId = Number(tenantId);

      const response = await axios.get<Property[]>(
        `http://localhost:5000/properties/tenant/${numericTenantId}/my-properties`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

	  
      setProperties(response.data);

	   if (response.data.length > 0) {
          setSelectedPropertyName(response.data[0].property);
        }
    } catch (err: any) {
      console.error("Error fetching properties:", err);
      setError(err.response?.data?.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  if (tenantId) {
    fetchProperties();
  }
}, [tenantId]);


const filteredProperties = properties.filter((property) => {
	const search = searchTerm?.toLowerCase() ?? '';

	const matchesSearch =
		(property.property?.toLowerCase() ?? '').includes(search) ||
		(property.address?.toLowerCase() ?? '').includes(search) ||
		(property.unit?.toLowerCase() ?? '').includes(search);

	const matchesStatus =
		filterStatus === 'all' || property.status === filterStatus;

	return matchesSearch && matchesStatus;
});

function getOccupancyRate(occupiedUnits?: number, totalUnits?: number): number {
  if (!occupiedUnits || !totalUnits || totalUnits === 0) return 0;
  return Math.round((occupiedUnits / totalUnits) * 100);
}


	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-emerald-100 text-emerald-800";
			case "expiring":
				return "bg-yellow-100 text-yellow-800";
			case "expired":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

const handleEdit = (id: string) => {
  const tenantId = params.tenantId;
  router.push(`/dashboard/tenant/${tenantId}/my-properties/${id}/edit`);
};

	const getPaymentStatusColor = (status: string) => {
		switch (status) {
			case "current":
				return "bg-emerald-100 text-emerald-800";
			case "due":
				return "bg-yellow-100 text-yellow-800";
			case "overdue":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const handleView = (id: string) => {
    router.push(`/dashboard/tenant/${tenantId}/my-properties/${id}`);
  };

	const getLeaseProgress = (startDate: string, endDate: string) => {
		const start = new Date(startDate).getTime();
		const end = new Date(endDate).getTime();
		const now = new Date().getTime();
		const progress = ((now - start) / (end - start)) * 100;
		return Math.min(Math.max(progress, 0), 100);
	};

const totalUnits = properties.reduce((sum, property) => sum + (property.totalUnits || 0), 0);
const totalOccupiedUnits = properties.reduce((sum, property) => sum + (property.occupiedUnits || 0), 0);


	const activeLeases = filteredProperties.filter(
		(p) => p.status === "active"
	).length;

	const filtered = properties.filter((p) => {
    const matchesSearch =
    p.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

	return (
		<DashboardLayout>
			<div className="space-y-8">
				{/* Header */}
				<div className="animate-in fade-in duration-1000">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
								My Rented Properties
							</h1>
							<p className="text-lg text-gray-600">
								Manage all your current rental properties
							</p>
							<p className="text-sm text-gray-500">
								View lease details, payments, and maintenance for each property
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
						<Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-emerald-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div className="space-y-3">
										<p className="text-sm font-semibold text-gray-600">
											Active Leases
										</p>
										<p className="text-3xl font-bold text-gray-900">
											{activeLeases}
										</p>
									</div>
									<div className="p-4 rounded-3xl bg-emerald-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
										<Building className="h-8 w-8 text-emerald-600" />
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
					<div
						className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-450"
						style={{ animationFillMode: "forwards" }}
					>
						<Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-blue-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
  <div className="space-y-3">
    <p className="text-sm font-semibold text-gray-600">My Rented Property ID</p>
    {properties.length > 0 && (
  <p className="text-3xl font-bold text-gray-900">
    {properties[0].id}
  </p>
)}

  </div>
  <div className="p-4 rounded-3xl bg-blue-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
    <DollarSign className="h-8 w-8 text-blue-600" />
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
											Maintenance Requests
										</p>
										<p className="text-3xl font-bold text-gray-900">
	                     {properties.reduce((sum, p) => sum + (p.maintenanceRequests ?? 0), 0)}
                              </p>

									</div>
									<div className="p-4 rounded-3xl bg-purple-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
										<Wrench className="h-8 w-8 text-purple-600" />
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
								placeholder="Search by property name, unit, or address..."
								className="pl-10"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>
				</div>

				{/* Properties Grid */}
				 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((property) => (
            <Card key={property.id} className="hover:shadow-lg group transition-all">
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
                <Badge
                  className={`absolute top-2 right-2 ${getStatusColor(
                    property.status
                  )}`}
                >
                  {property.status}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle>{property.name}</CardTitle>
                <CardDescription className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-3 text-center text-sm">
                  <div>
                    <p className="font-medium">{property.totalUnits}</p>
                    <p className="text-muted-foreground text-xs">Units</p>
                  </div>
                  <div>
                    <p className="font-medium">
                      {getOccupancyRate(
                        property.occupiedUnits,
                        property.totalUnits
                      )}
                    %
                    </p>
                    <p className="text-muted-foreground text-xs">Occupied</p>
                  </div>
                 <div>
  <p className="font-medium">
    {property.monthlyRevenue
      ? property.monthlyRevenue >= 1000
        ? `${(property.monthlyRevenue / 1000).toFixed(0)}K`
        : property.monthlyRevenue.toString()
      : '0'}
  </p>
  <p className="text-muted-foreground text-xs">Revenue</p>
</div>

                </div>

                {/* <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
onClick={() => handleEdit(property.id.toString())}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(property.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div> */}
              </CardContent>
            </Card>
          ))}
        </div>

				{/* Empty State */}
				{filteredProperties.length === 0 && (
					<Card className="text-center py-12">
						<CardContent>
							<Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No rented properties found
							</h3>
							<p className="text-gray-600 mb-4">
								{searchTerm || filterStatus !== "all"
									? "Try adjusting your search or filter criteria."
									: "You don't have any active rental properties yet."}
							</p>
							<Button
								asChild
								className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
							>
								<Link href="/dashboard/tenant/properties">
									Browse Available Properties
								</Link>
							</Button>
						</CardContent>
					</Card>
				)}
			</div>
		</DashboardLayout>
	);
}
