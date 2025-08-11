"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import {
  Building,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  MapPin,
  Users,
  DollarSign,
  TrendingUp
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
import { useRouter, useParams } from "next/navigation";

type Property = {
  id: number;
  name: string;
  address: string;
  totalUnits: number;
  occupiedUnits: number;
  monthlyRevenue: number;
  status: string;
  images?: string[];
  units?: Unit[]; 
  revenue: number;   
};

interface Props {
  id: string;
}

interface Stats {
  propertiesCount: number;
  totalRevenue: number;
  occupancyRate: number;
  activeTenants: number;
}

interface Unit {
  id: number;
  status: "occupied" | "vacant" | "maintenance" | string;
  propertyId: number;
}





export default function OwnerPropertiesPage(props: Props) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
const ownerId = params.ownerId;
const propertyId = params.id;
  const backendUrl = "http://localhost:5000";
  const [stats, setStats] = useState<Stats>({
  propertiesCount: 0,
  totalRevenue: 0,
  occupancyRate: 0,
  activeTenants: 0,
});

useEffect(() => {
  async function fetchProperties() {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");
      if (!ownerId) return;

      const resp = await axios.get<Property[]>(
        `${backendUrl}/properties/owner/${ownerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProperties(resp.data);
      setStats((prev) => ({
        ...prev,
        propertiesCount: resp.data.length,
      }));
    } catch (err: any) {
      console.error(err);
      // handle error
    }
  }

  fetchProperties();
}, [ownerId]);


  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${backendUrl}/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties((prev) => prev.filter((p) => p.id !== id));
      alert("Property deleted successfully.");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/properties/${id}`);
  };

  const handleView = (id: number) => {
    router.push(`/dashboard/owner/${id}/properties/${id}`);
  };

  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

function getOccupancyRate(occupied: number, total: number) {
  if (!total) return 0;
  return Math.round((occupied / total) * 100);
}


  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "inactive":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
              My Properties
            </h1>
            <p className="text-lg text-gray-600">
              Manage and monitor your property portfolio
            </p>
            <p className="text-sm text-gray-500">
              Track performance, occupancy, and revenue across all properties
            </p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Link href={`/dashboard/owner/${ownerId}/properties/new`}>
  <Plus className="h-4 w-4 mr-2" />
  Add Property
</Link>

          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Properties */}
          <StatsCard
            title="Total Properties"
            value={properties.length}
            icon={<Building className="h-8 w-8 text-emerald-600" />}
          />
          {/* Total Units */}
          <StatsCard
            title="Total Units"
            value={properties.reduce((sum, p) => sum + p.totalUnits, 0)}
            icon={<Users className="h-8 w-8 text-blue-600" />}
          />


      {/* Monthly Revenue */}
<StatsCard
  title="Monthly Revenue"
  value={
    properties.length === 0
      ? "0 BIRR"
      : `${(
          properties.reduce((sum, p) => sum + (p.monthlyRevenue || 0), 0) / 1000
        ).toFixed(0)} ETB`
  }
  icon={<DollarSign className="h-8 w-8 text-purple-600" />}
/>

{/* Average Occupancy */}
<StatsCard
  title="Avg. Occupancy"
  value={
  properties.length === 0
    ? "0%"
    : `${Math.round(
        properties.reduce((sum, p) => {
          const occupied = Number(p.occupiedUnits) || 0;
          const total = Number(p.totalUnits) || 1;
          return sum + getOccupancyRate(occupied, total);
        }, 0) / properties.length
      )}%`
}

  icon={<TrendingUp className="h-8 w-8 text-indigo-600" />}
/>

        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search properties by name or address..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Status: {filterStatus === "all" ? "All" : filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("maintenance")}>
                Under Maintenance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Property Cards */}
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
  {getOccupancyRate(property.occupiedUnits || 0, property.totalUnits || 1)}%
</p>


  <p className="text-muted-foreground text-xs">Occupied</p>
</div>

                  <div>
                   <p className="font-medium">
  {property.revenue
    ? `${property.revenue.toLocaleString()} BIRR`
    : '0 BIRR'}
</p>

                    <p className="text-muted-foreground text-xs">Revenue</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleView(property.id)}
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first property."}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Button asChild>
                  <Link href="/dashboard/owner/properties/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="hover:shadow-md border-l-4 border-emerald-300 bg-white/90 transition-all">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded-full shadow">{icon}</div>
      </CardContent>
    </Card>
  );
}
