"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  FileText,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
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
import { toast } from "@/components/ui/use-toast"; 

const backendUrl = "http://localhost:5000"; 



export default function RentalRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

interface RentalRequest {
  id: string;
  property: string;
  unit: string;
  monthlyRent: number;
  submittedDate: string;
  status: "pending" | "approved" | "rejected" | string;
  leaseType: string;
  moveInDate: string;
  response?: string | null;
}

const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);


useEffect(() => {
  async function fetchRentalRequests() {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<RentalRequest[]>(`${backendUrl}/rental-requests`);
      setRentalRequests(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch rental requests."
      );
    } finally {
      setLoading(false);
    }
  }

  fetchRentalRequests();
}, []);


  const filteredRequests = rentalRequests.filter((request: any) => {
    const matchesSearch =
      request.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-emerald-100 text-emerald-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock;
      case "approved":
        return CheckCircle;
      case "rejected":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  function showSubmissionToast(unitNumber: string) {
    toast({
      title: "Rental Request Submitted!",
      description: `Your request for Unit ${unitNumber} has been submitted successfully. You'll receive updates via SMS and email.`,
    });
  }


  if (loading) return <div className="text-center p-8">Loading rental requests...</div>;
  if (error)
    return (
      <div className="text-center p-8 text-red-600 font-semibold">
        {error}
      </div>
    );

  return (
    <DashboardLayout  >
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-in fade-in duration-1000">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                My Rental Requests
              </h1>
              <p className="text-lg text-gray-600">
                Track your rental applications and their status
              </p>
              <p className="text-sm text-gray-500">
                View responses from property owners and next steps
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-yellow-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600">
                    Pending Requests
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {filteredRequests.filter((r) => r.status === "pending").length}
                  </p>
                </div>
                <div className="p-4 rounded-3xl bg-yellow-50 shadow-lg">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-emerald-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {filteredRequests.filter((r) => r.status === "approved").length}
                  </p>
                </div>
                <div className="p-4 rounded-3xl bg-emerald-50 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-red-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {filteredRequests.filter((r) => r.status === "rejected").length}
                  </p>
                </div>
                <div className="p-4 rounded-3xl bg-red-50 shadow-lg">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by property, unit, or request ID..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-emerald-300 hover:bg-emerald-50 bg-transparent"
              >
                <Filter className="h-4 w-4 mr-2" />
                Status: {filterStatus === "all" ? "All" : filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("approved")}>
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("rejected")}>
                Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Requests Table */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Rental Request History</CardTitle>
            <CardDescription>
              All your rental applications and their current status
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No rental requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request: any) => {
                    const StatusIcon = getStatusIcon(request.status);
                    return (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{request.property}</TableCell>
                        <TableCell>{request.unit}</TableCell>
                        <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            className={`inline-flex items-center gap-1 px-3 py-1 ${getStatusColor(
                              request.status
                            )}`}
                          >
                            <StatusIcon className="h-4 w-4" />
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label="View request details"
                              >
                                <Eye className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Request Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  alert(
                                    `Viewing details for request ${request.id}`
                                  )
                                }
                              >
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
    </DashboardLayout>
  );
}
