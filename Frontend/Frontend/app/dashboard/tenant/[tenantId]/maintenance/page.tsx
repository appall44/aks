"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useParams, useRouter } from "next/navigation";
interface Property {
  id: string;

}

interface Unit {
  id: string;
 
}

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category?: string | null;
  priority: "low" | "medium" | "high";
  status: "open" | "pending" | "completed" | "cancelled";
  createdAt: string;
  assignedTo?: User | null;
  property?: Property | null;
  unit?: Unit | null;
 
}



interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}


export default function TenantMaintenancePage(){
const { tenantId } = useParams();
const numericTenantId = Number(tenantId); 
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
const [filterStatus, setFilterStatus] = useState<string | null>(null);
const [filterPriority, setFilterPriority] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);

const openRequests = maintenanceRequests.filter(r => r.status === "open");
const inProgressRequests = maintenanceRequests.filter(r => r.status === "pending");
const completedRequests = maintenanceRequests.filter(r => r.status === "completed");

const filteredRequests = maintenanceRequests.filter((req) => {
  const matchesSearch = searchTerm
    ? req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase())
    : true;

  const matchesStatus = filterStatus ? req.status === filterStatus : true;
  const matchesPriority = filterPriority ? req.priority === filterPriority : true;

  return matchesSearch && matchesStatus && matchesPriority;
  });
useEffect(() => {
  if (!numericTenantId || isNaN(numericTenantId)) return;

  async function fetchMaintenanceRequests() {
  setLoading(true);
  setError(null);
  try {
    const response = await axios.get<MaintenanceRequest[]>(
      `http://localhost:5000/tenant/${numericTenantId}/maintenance`
    );

   const formattedRequests = response.data.map((request: MaintenanceRequest) => ({
  ...request,
  propertyId: request.property?.id ?? null,
  unitId: request.unit?.id ?? null,
}));


    setMaintenanceRequests(formattedRequests);
  } catch (err) {
    console.error("Fetch failed:", err);
    setError("Failed to load maintenance requests");
    setMaintenanceRequests([]);
  } finally {
    setLoading(false);
  }
}

  fetchMaintenanceRequests();
}, [numericTenantId, refreshFlag]);



  if (loading) return <div>Loading maintenance requests...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  // Utility functions to show UI badges/colors/icons (same as your logic)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-emerald-100 text-emerald-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-emerald-100 text-emerald-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return AlertTriangle;
      case "in_progress": return Clock;
      case "completed": return CheckCircle;
      default: return Clock;
    }
  };

  const getCategoryLabel = (category?: string | null) => {
    if (!category) return "Unspecified";
    switch (category.toLowerCase()) {
      case "plumbing": return "Plumbing";
      case "electrical": return "Electrical";
      case "hvac": return "HVAC";
      case "general": return "General";
      default: return category;
    }
  };
function assignedToDisplay(
  assignedTo: 
    | string 
    | { firstname: string; lastname: string; role?: string } 
    | null 
    | undefined
): string {
  if (!assignedTo) return 'owner';
  if (typeof assignedTo === 'string') return assignedTo;

  // Only consider owner or admin roles
  if (assignedTo.role === 'owner') return 'Assigned to Owner';
  if (assignedTo.role === 'admin') return 'Assigned to Admin';

  // If assignedTo has other roles or no role, fallback to just the name or 'Unassigned'
  return `${assignedTo.firstname} ${assignedTo.lastname}`;
}

  return (
    <DashboardLayout >
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-in fade-in duration-1000">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Maintenance Requests
              </h1>
              <p className="text-lg text-gray-600">Submit and track maintenance requests for your apartment</p>
              <p className="text-sm text-gray-500">Report issues and monitor repair progress</p>
            </div>
            {tenantId && (
  <Button
    asChild
    className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300"
  >
    <Link href={`/dashboard/tenant/${tenantId}/maintenance/new`}>
      <Plus className="h-4 w-4 mr-2" />
      New Request
    </Link>
  </Button>
)}

          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300" style={{ animationFillMode: "forwards" }}>
            <Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-red-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
           <CardContent className="p-6">
  <div className="flex items-center justify-between">
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-600">Open Requests</p>
      <p className="text-3xl font-bold text-gray-900">{openRequests.length}</p>
    </div>
    <div className="p-4 rounded-3xl bg-red-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
      <AlertTriangle className="h-8 w-8 text-red-600" />
    </div>
  </div>
</CardContent>

            </Card>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-450" style={{ animationFillMode: "forwards" }}>
            <Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-yellow-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
  <div className="flex items-center justify-between">
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-600">In Progress</p>
      <p className="text-3xl font-bold text-gray-900">{inProgressRequests.length}</p>
    </div>
    <div className="p-4 rounded-3xl bg-yellow-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
      <Clock className="h-8 w-8 text-yellow-600" />
    </div>
  </div>
</CardContent>

            </Card>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600" style={{ animationFillMode: "forwards" }}>
            <Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-emerald-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
             <CardContent className="p-6">
  <div className="flex items-center justify-between">
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-600">Completed</p>
      <p className="text-3xl font-bold text-gray-900">{completedRequests.length}</p>
    </div>
    <div className="p-4 rounded-3xl bg-emerald-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
      <CheckCircle className="h-8 w-8 text-emerald-600" />
    </div>
  </div>
</CardContent>

            </Card>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-750" style={{ animationFillMode: "forwards" }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, description, or request ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-emerald-300 hover:bg-emerald-50 bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Status: {filterStatus === "all" ? "All" : filterStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("open")}>Open</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("in_progress")}>In Progress</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("completed")}>Completed</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-blue-300 hover:bg-blue-50 bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Priority: {filterPriority === "all" ? "All" : filterPriority}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterPriority("all")}>All Priority</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterPriority("high")}>High</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterPriority("medium")}>Medium</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterPriority("low")}>Low</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Maintenance Requests Table */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-900" style={{ animationFillMode: "forwards" }}>
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">My Maintenance Requests</CardTitle>
              <CardDescription>
                Track all your maintenance requests and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
   <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Request ID</TableHead>
		  <TableHead>Property & Unit ID</TableHead>
          <TableHead>Title & Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submitted Date</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
<TableBody>
  {maintenanceRequests.length === 0 ? (
    <TableRow>
      <TableCell colSpan={8} className="text-center py-4 text-gray-500">
        No maintenance requests found.
      </TableCell>
    </TableRow>
  ) : (
    maintenanceRequests.map((request) => {
      const StatusIcon = getStatusIcon(request.status);
      return (
        <TableRow key={request.id} className="hover:bg-gray-50">
          <TableCell>
            <span className="font-mono text-sm font-medium">{request.id}</span>
          </TableCell>
<TableCell>
  {request.property?.id ?? "N/A"}
  {request.unit?.id ? ` & ${request.unit.id}` : ""}
</TableCell>







          <TableCell className="max-w-xs">
            <div>
              <p className="font-medium text-sm">{request.title}</p>
              <p className="text-xs text-gray-500 truncate">{request.description}</p>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant="outline" className="text-xs">
              {getCategoryLabel(request.category)}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge className={getPriorityColor(request.priority)}>
              {request.priority}
            </Badge>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <StatusIcon className="h-4 w-4" />
              <Badge className={getStatusColor(request.status)}>
                {request.status.replace("_", " ")}
              </Badge>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm">
                {request.createdAt && !isNaN(new Date(request.createdAt).getTime())
                  ? new Date(request.createdAt).toLocaleDateString()
                  : "Unspecified"}
              </span>
            </div>
          </TableCell>
          <TableCell>
<span className="text-sm text-gray-400">
  {assignedToDisplay(request.assignedTo)}
</span>


          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/tenant/maintenance/${request.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </TableCell>
        </TableRow>
      );
    })
  )}
</TableBody>


    </Table>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance requests found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "You haven't submitted any maintenance requests yet."}
              </p>
              {!searchTerm && filterStatus === "all" && filterPriority === "all" && (
                <Button asChild>
                  <Link href="/dashboard/tenant/maintenance/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Request
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}