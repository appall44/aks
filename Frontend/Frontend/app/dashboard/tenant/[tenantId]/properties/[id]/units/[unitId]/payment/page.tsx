"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { CreditCard, ArrowLeft, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DashboardLayout from "@/components/dashboard-layout";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const paymentMethods = [
  {
    value: "bank_transfer",
    label: "Bank Transfer",
    icon: "🏦",
    description: "Transfer to property owner's bank account",
    processingTime: "1-2 business days verification",
  },
  {
    value: "mobile_money",
    label: "Mobile Money",
    icon: "📱",
    description: "CBE Birr, M-Birr, HelloCash",
    processingTime: "Instant verification with screenshot",
  },
];

interface Lease {
  monthlyRent: number;
  deposit: number;
  // other fields as needed
}

type Owner = {
  name: string;
  bankName: string;
  bankAccount: string;
  phone: string;
};

type Property = {
  id: string;
  name: string;
  owner: Owner;
  // other props as needed
};

type Unit = {
  id: string;
  unitNumber: string;
  monthlyRent: number;
  deposit: number;
  // other props as needed
};

export default function CompletePaymentPage() {
  const params = useParams() as { id?: string; unitId?: string };
  const router = useRouter();
  const { toast } = useToast();
   const { tenantId } = useParams();

  const [property, setProperty] = useState<Property | null>(null);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [lease, setLease] = useState<Lease | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  

  const [formData, setFormData] = useState({
    paymentMethod: "",
    referenceNumber: "",
    notes: "",
  });
  const [error, setError] = useState("");

  // Calculate total amount (rent + deposit) if data loaded
  const totalAmount =
    (unit?.monthlyRent ?? 0) + (unit?.deposit ?? 0);

  // Find selected payment method object
  const selectedMethod = paymentMethods.find(
    (m) => m.value === formData.paymentMethod
  );

  useEffect(() => {
    async function fetchLeaseData() {
      if (!params.id || !params.unitId) return;

      try {
        setFetchError("");
        const token = localStorage.getItem("accessToken") || "";

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [propertyRes, unitRes, leaseRes] = await Promise.all([
          axios.get<Property>(`http://localhost:5000/properties/${params.id}`, config),
          axios.get<Unit>(
            `http://localhost:5000/properties/${params.id}/units/${params.unitId}`,
            config
          ),
          axios.get<Lease>(
            `http://localhost:5000/leases/property/${params.id}/unit/${params.unitId}`,
            config
          ),
        ]);

        setProperty(propertyRes.data);
        setUnit(unitRes.data);
        setLease(leaseRes.data);
      } catch (err) {
        console.error(err);
        setFetchError("Failed to load lease information. Please try again.");
      }
    }

    fetchLeaseData();
  }, [params.id, params.unitId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }

    if (!params.id || !params.unitId) {
      toast({
        title: "Error",
        description: "Invalid property or unit ID.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken") || "";

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

const paymentPayload = {
  tenantId: Number(tenantId),   
  amount: totalAmount,
  paymentMethod: formData.paymentMethod,
  status: 'paid',                // or 'unpaid'
  referenceNumber: formData.referenceNumber,
  notes: formData.notes,
  date: new Date().toISOString(),
};



      await axios.post(`http://localhost:5000/tenant/${tenantId}/payments`, paymentPayload, config);

      toast({
        title: "Payment Submitted Successfully!",
        description: `Your payment of ${totalAmount.toLocaleString()} ETB has been submitted for verification.`,
      });

      router.push(`http://localhost:5000/tenant/${tenantId}/payments`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Payment Failed",
        description: "Failed to submit payment. Please try again.",
        variant: "destructive",
      });
      setError("Failed to submit payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (fetchError) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center text-red-600">{fetchError}</div>
      </DashboardLayout>
    );
  }

  if (!property || !unit || !lease) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center text-gray-600">Loading lease information...</div>
      </DashboardLayout>
    );
  }

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
              <Link
                href={`/dashboard/tenant/properties/${params.id}/units/${params.unitId}/lease`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lease Agreement
              </Link>
            </Button>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Complete Payment
            </h1>
            <p className="text-lg text-gray-600">
              Pay for Unit {unit.unitNumber} to finalize your lease
            </p>

            <p className="text-sm text-gray-500">
              Submit payment for first month rent and security deposit
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="xl:col-span-2 space-y-8">
              {/* Payment Overview */}
              <div
                className="animate-in fade-in slide-in-from-left-4 duration-700 delay-300"
                style={{ animationFillMode: "forwards" }}
              >
                <Card className="shadow-xl border-0 bg-gradient-to-r from-emerald-50 to-blue-50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <Building className="h-6 w-6 text-emerald-600" />
                      <span>Payment Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">
                          Property & Unit
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {property.name}
                        </p>
                        <p className="text-sm text-gray-600">Unit {unit.unitNumber}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">
                          Payment Breakdown
                        </p>
                        <p className="text-sm text-gray-600">
                          Rent: {unit.monthlyRent.toLocaleString()} ETB
                        </p>
                        <p className="text-sm text-gray-600">
  Deposit: {unit && typeof unit.deposit === "number" ? unit.deposit.toLocaleString() : "N/A"} ETB
</p>

                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Total Amount</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          {totalAmount.toLocaleString()} ETB
                        </p>
                        <p className="text-sm text-gray-600">Due immediately</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Method Selection */}
              <div
                className="animate-in fade-in slide-in-from-left-4 duration-700 delay-500"
                style={{ animationFillMode: "forwards" }}
              >
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle>Select Payment Method</CardTitle>
                    <CardDescription>
                      Choose your preferred payment option
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, paymentMethod: value }))
                      }
                      value={formData.paymentMethod}
                      name="paymentMethod"
                      className="flex flex-col space-y-3"
                      required
                    >
                      {paymentMethods.map((method) => (
                        <Label
                          key={method.value}
                          htmlFor={method.value}
                          className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-300 bg-white p-4 text-base font-medium text-gray-900 shadow-sm transition-colors hover:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2"
                        >
                          <RadioGroupItem
                            value={method.value}
                            id={method.value}
                            className="peer sr-only"
                          />
                          <span className="text-xl">{method.icon}</span>
                          <div>
                            <p>{method.label}</p>
                            <p className="text-sm text-gray-500">
                              {method.description}
                            </p>
                            <p className="text-xs italic text-gray-400 mt-1">
                              {method.processingTime}
                            </p>
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>

                    {selectedMethod && (
                      <Alert variant="default" className="mt-4">
                        <AlertDescription>
                          You selected: <strong>{selectedMethod.label}</strong> —{" "}
                          {selectedMethod.processingTime}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Reference Number & Notes */}
              <div
                className="animate-in fade-in slide-in-from-left-4 duration-700 delay-700"
                style={{ animationFillMode: "forwards" }}
              >
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle>Reference & Notes</CardTitle>
                    <CardDescription>
                      Provide your payment reference and any additional notes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="referenceNumber">Payment Reference Number</Label>
                      <Input
                        id="referenceNumber"
                        name="referenceNumber"
                        type="text"
                        value={formData.referenceNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            referenceNumber: e.target.value,
                          }))
                        }
                        placeholder="Enter your payment reference"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="Optional notes"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {error && (
                <p className="text-red-600 text-center mt-2">{error}</p>
              )}

              <div className="flex justify-center mt-6">
                <Button
                  type="submit"
                  className="w-full max-w-sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Payment"}
                </Button>
              </div>
            </div>

            {/* Owner Info Sidebar */}
            <div
              className="animate-in fade-in slide-in-from-right-4 duration-700 delay-700"
              style={{ animationFillMode: "forwards" }}
            >
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-6 w-6 text-emerald-600" />
                    <span>Owner Payment Details</span>
                  </CardTitle>
                  <CardDescription>
                    Payment details for the property owner
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Owner Name</p>
                    <p className="text-lg font-semibold">{property.owner.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bank Name</p>
                    <p className="text-lg font-semibold">{property.owner.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Account Number</p>
                    <p className="text-lg font-semibold">{property.owner.bankAccount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-lg font-semibold">{property.owner.phone}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
