"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Home,
  DollarSign,
  Calendar,
  Wrench,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Plus,
  CreditCard,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/dashboard-layout";
import Link from "next/link";
import { useParams} from "next/navigation";

interface PaymentType {
  id: string;
  amount: number;
  date: string;
  status: string;
  month: string;
}

interface MaintenanceRequestType {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in progress" | string;
  priority: "High" | "Medium" | "Low" | string;
  date: string;
}

interface AmenityType {
  id: string;
  name: string;
}

interface PropertyType {
  id: number;
  name: string;
  city: string;
}

interface TenantInfoType {
  id: string;
  firstname: string;
  email: string;
  property: PropertyType; 
  unit: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: string | number;
  deposit: string | number;
  status: string;
}

interface LandlordInfoType {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
}

export default function TenantDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tenantInfo, setTenantInfo] = useState<TenantInfoType | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentType[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequestType[]>([]);
  const [propertyAmenities, setPropertyAmenities] = useState<AmenityType[]>([]);
  const [landlordInfo, setLandlordInfo] = useState<LandlordInfoType | null>(null);
const { tenantId } = useParams();
const effectiveTenantId = tenantId || tenantInfo?.id;
  const backendBaseUrl = "http://localhost:5000";

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          profileRes,
          paymentsRes,
          maintenanceRes,
          amenitiesRes,
        ] = await Promise.all([
          axios.get<TenantInfoType>(`${backendBaseUrl}/tenant/me`),
          axios.get<PaymentType[]>(`${backendBaseUrl}/tenant/payments`),
          axios.get<MaintenanceRequestType[]>(`${backendBaseUrl}/tenant/maintenance`),
          axios.get<AmenityType[]>(`${backendBaseUrl}/tenant/amenities`),
        ]);

        setTenantInfo(profileRes.data);
        setPaymentHistory(paymentsRes.data);
        setMaintenanceRequests(maintenanceRes.data);
        setPropertyAmenities(amenitiesRes.data);
      } catch (err: unknown) {
        const isAxiosError = (
          error: any
        ): error is { response?: { status: number; statusText: string } } =>
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof error.response === "object" &&
          error.response !== null &&
          "status" in error.response &&
          "statusText" in error.response;

        if (isAxiosError(err)) {
          setError(`Error: ${err.response?.status} ${err.response?.statusText}`);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className=" animate-in fade-in duration-1000">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Tenant Dashboard
              </h1>
              <p className="text-lg text-gray-600">Welcome back, here's your rental information.</p>
              <p className="text-sm text-gray-500">Manage your lease, payments, and maintenance requests.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300">
                <Link href={`/dashboard/tenant/${effectiveTenantId}/payments/new`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Make Payment
                </Link>
              </Button>
             <Button variant="outline" asChild className="border-emerald-300 hover:bg-emerald-50 bg-transparent">
    <Link href={`/dashboard/tenant/${effectiveTenantId}/maintenance/new`}>
      <Wrench className="h-4 w-4 mr-2" />
      Request Maintenance
    </Link>
  </Button>
            </div>
          </div>
        </div>

        {/* Rental Info */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-emerald-50 to-blue-50 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700 delay-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-xl">
              <Home className="h-6 w-6 text-emerald-600" />
              <span>Your Rental Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Property</p>
                <p className="text-lg font-semibold text-gray-900">
                  {tenantInfo?.property?.name}
                </p>
                <p className="text-sm text-gray-600">{tenantInfo?.unit}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Lease Period</p>
                <p className="text-sm font-semibold text-gray-900">
                  {tenantInfo?.leaseStart}
                </p>
                <p className="text-sm text-gray-600">to {tenantInfo?.leaseEnd}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Monthly Rent</p>
                <p className="text-lg font-bold text-emerald-600">
                  ${tenantInfo?.monthlyRent}
                </p>
                <p className="text-sm text-gray-600">
                  Deposit: ${tenantInfo?.deposit}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge className="bg-emerald-100 text-emerald-800 font-semibold">
                  {tenantInfo?.status}
                </Badge>
                <p className="text-sm text-gray-600">Lease Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments & Maintenance */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Payment History */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-in fade-in slide-in-from-left-4 duration-700 delay-600">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                    <span>Payment History</span>
                  </CardTitle>
                  <CardDescription className="mt-2">Your recent rent payments</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild className="hover:bg-purple-50 bg-transparent">
                  <Link href={`/dashboard/tenant/${effectiveTenantId}/payments`}>View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {payment.status === "paid" ? (
                          <CheckCircle className="h-6 w-6 text-emerald-500" />
                        ) : (
                          <Clock className="h-6 w-6 text-orange-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {payment.month}
                        </p>
                        <p className="text-xs text-gray-500">{payment.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ${Number(payment.amount).toFixed(2)}
                      </p>
                      <p className={`text-xs font-medium ${payment.status === "paid" ? "text-emerald-600" : "text-orange-600"}`}>
                        {payment.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Requests */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-in fade-in slide-in-from-right-4 duration-700 delay-900">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <Wrench className="h-6 w-6 text-red-600" />
                    <span>Maintenance Requests</span>
                  </CardTitle>
                  <CardDescription>Track your maintenance requests</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild className="hover:bg-red-50 bg-transparent">
                  <Link href={`/dashboard/tenant/${effectiveTenantId}/maintenance`}>View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-gradient-to-r hover:from-red-50 hover:to-blue-50 transition-all duration-300 border border-gray-100"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900">{request.title}</p>
                      <p className="text-xs text-gray-500">{request.date}</p>
                      <p className="text-xs text-gray-600">{request.description}</p>
                    </div>
                    <Badge
                      variant={
                        request.status === "completed"
                          ? "secondary"
                          : request.status === "in progress"
                          ? "outline"
                          : "secondary"
                      }
                      className="font-semibold"
                    >
                      {request.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Amenities & Landlord Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1200">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-xl">
                <Calendar className="h-6 w-6 text-blue-600" />
                <span>Property Amenities</span>
              </CardTitle>
              <CardDescription>Available amenities in your property</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {propertyAmenities.map((amenity) => (
                  <li key={amenity.id} className="text-gray-700">{amenity.name}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Optional: landlord info can be re-added if API returns it */}
        </div>
      </div>
    </DashboardLayout>
  );
}
