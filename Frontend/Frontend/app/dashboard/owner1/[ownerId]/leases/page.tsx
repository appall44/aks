"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  FileText,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Building,
  Clock,
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

interface Lease {
  id: string;
  tenant: string;
  property: string;
  unit: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: string;
  avatar?: string;
}

export default function OwnerLeasesPage() {
  const { ownerId } = useParams();
  const [leases, setLeases] = useState<Lease[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ownerId) return;

    const fetchLeases = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Lease[]>(
          `http://localhost:5000/owner/${ownerId}/leases`
        );
        setLeases(response.data || []);
      } catch (err) {
        setError("Failed to fetch lease data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeases();
  }, [ownerId]);

  const filteredLeases = leases.filter((lease) => {
    const matchesSearch =
      lease.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || lease.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800";
      case "expiring":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "terminated":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "expiring":
        return "Expiring Soon";
      case "expired":
        return "Expired";
      case "terminated":
        return "Terminated";
      default:
        return status;
    }
  };

  const activeLeases = filteredLeases.filter((l) => l.status === "active").length;
  const expiringLeases = filteredLeases.filter((l) => l.status === "expiring").length;
  const totalRevenue = filteredLeases.reduce((sum, lease) => sum + lease.monthlyRent, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* ... header + stats + filters stay unchanged ... */}

        {/* Leases Table */}
        {!loading && !error && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-900">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Lease Records</CardTitle>
                <CardDescription>
                  Complete list of all your rental leases and their current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lease ID</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Property & Unit</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Monthly Rent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeases.map((lease) => (
                      <TableRow key={lease.id}>
                        <TableCell className="font-mono text-sm">{lease.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={lease.avatar} />
                              <AvatarFallback>
                                {lease.tenant
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{lease.tenant}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{lease.property}</p>
                            <p className="text-xs text-gray-500">Unit {lease.unit}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(lease.startDate).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(lease.endDate).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">
                            {lease.monthlyRent.toLocaleString()} ETB
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(lease.status)}>
                            {getStatusLabel(lease.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/dashboard/owner/leases/${lease.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty & Error States */}
        {!loading && filteredLeases.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leases found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No lease agreements available."}
              </p>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="text-center text-gray-500">Loading lease records...</div>
        )}
        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}
      </div>
    </DashboardLayout>
  );
}
