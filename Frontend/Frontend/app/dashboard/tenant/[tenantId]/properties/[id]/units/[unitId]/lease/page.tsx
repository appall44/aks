"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  ArrowLeft,
  CreditCard,
  Calendar,
  Building,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DashboardLayout from "@/components/dashboard-layout";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const leaseTerms = [
  "Monthly rent payment due on the 1st of each month",
  "Security deposit required before move-in",
  "30-day written notice required for lease termination",
  "Late payment fee applies after grace period",
  "Tenant responsible for utilities (electricity, water, internet)",
  "No pets allowed without written permission",
  "Maintenance requests must be submitted through the system",
  "Lease automatically renewable with mutual agreement",
  "No subletting or unauthorized occupants allowed",
  "Property must be returned in original condition (normal wear and tear excepted)",
];

type Property = {
  id: number;
  name: string;
  address: string;
};

type Unit = {
  id: string;
  unitNumber: string;
  monthlyRent: number;
  deposit: number;
};

type Lease = {
	id:string
  startDate: string;
  endDate: string;
  duration: string;
  paymentDueDate: number;
  lateFee: number;
  noticePeriod: number;
};

const paymentMethods = [
  {
    value: "bank_transfer",
    label: "Bank Transfer",
    description: "Transfer to property owner's bank account",
    processingTime: "1-2 business days",
  },
  {
    value: "mobile_money",
    label: "Mobile Money",
    description: "CBE Birr, M-Birr, HelloCash",
    processingTime: "Instant",
  },
];

export default function OnlineLeaseAgreementPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [error, setError] = useState<string>("");
  const paymentMethods = ["cash", "bank", "card"];

  const [property, setProperty] = useState<{
    id: number;
    name: string;
    address: string;
  } | null>(null);
  const [unit, setUnit] = useState<{
    id: string;
    unitNumber: string;
    monthlyRent: number;
    deposit: number;
  } | null>(null);
  const [lease, setLease] = useState<{
	id:string
    startDate: string;
    endDate: string;
    duration: string;
    paymentDueDate: number;
    lateFee: number;
    noticePeriod: number;
  } | null>(null);

  const [formData, setFormData] = useState({
    agreeToTerms: false,
    digitalSignature: "",
    confirmDetails: false,
	 startDate: '',   
  endDate: '',
  rentAmount: 0,
  });

useEffect(() => {
  async function fetchLeaseData() {
  if (!params.id || !params.unitId) return;

  try {
    setFetchError("");
    console.log("Fetching property...");
    const token = localStorage.getItem("accessToken");
    console.log("Token:", token);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const propertyRes = await axios.get<Property>(`http://localhost:5000/properties/${params.id}`, config);
    console.log("Property fetched", propertyRes.data);

    const unitRes = await axios.get<Unit>(`http://localhost:5000/properties/${params.id}/units/${params.unitId}`, config);
    console.log("Unit fetched", unitRes.data);

  const leaseRes = await axios.get<Lease>(`http://localhost:5000/properties/${params.id}/units/${params.unitId}/lease`, config);
    console.log("Lease fetched", leaseRes.data);

    setProperty(propertyRes.data);
    setUnit(unitRes.data);
    setLease(leaseRes.data);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      setFetchError(error.message);
    } else {
      setFetchError("Failed to load lease information. Please try again.");
    }
  }
}


  fetchLeaseData();
}, [params.id, params.unitId]);


  const totalAmount = unit ? unit.monthlyRent + unit.deposit : 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
	const target = e.target as HTMLInputElement;
const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsLoading(true);

    if (
      !formData.agreeToTerms ||
      !formData.digitalSignature.trim() ||
      !formData.confirmDetails
    ) {
      setSubmitError("Please complete all required fields and agreements.");
      setIsLoading(false);
      return;
    }

    try {
     
const token = localStorage.getItem('accessToken'); 

await axios.post(
  `http://localhost:5000/properties/${params.id}/units/${params.unitId}/lease/sign`,
  {
    digitalSignature: formData.digitalSignature,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


      toast({
        title: "Lease Agreement Signed Successfully!",
        description: `Your lease for Unit ${unit?.unitNumber} has been created.`,
      });

      router.push(
        `/dashboard/tenant/${params.tenantId}/properties/${params.id}/units/${params.unitId}/payment`
      );
    } catch (error) {
      setSubmitError("Failed to submit lease agreement. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (fetchError)
    return (
      <p className="text-center text-red-600 font-semibold mt-6">{fetchError}</p>
    );

  if (!property || !unit || !lease)
    return <p className="text-center mt-6">Loading lease information...</p>;

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
								href={`/dashboard/tenant/properties/${params.id}/units/${params.unitId}/rent`}
							>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to Application
							</Link>
						</Button>
					</div>
					<div>
						<h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
							Digital Lease Agreement
						</h1>
						<p className="text-lg text-gray-600">
							Review and sign your lease agreement for Unit{" "}
							{unit.unitNumber}
						</p>
						<p className="text-sm text-gray-500">
							Complete the digital lease signing process
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
						{/* Main Content */}
						<div className="xl:col-span-2 space-y-8">
							{/* Lease Overview */}
							<div
								className="animate-in fade-in slide-in-from-left-4 duration-700 delay-300"
								style={{ animationFillMode: "forwards" }}
							>
								<Card className="shadow-xl border-0 bg-gradient-to-r from-emerald-50 to-blue-50 backdrop-blur-sm">
									<CardHeader>
										<CardTitle className="flex items-center space-x-3 text-xl">
											<Building className="h-6 w-6 text-emerald-600" />
											<span>Lease Agreement Overview</span>
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
											<div className="space-y-2">
												<p className="text-sm font-medium text-gray-500">
													Property & Unit
												</p>
												<p className="text-lg font-semibold text-gray-900">
													{property.name}
												</p>
												<p className="text-sm text-gray-600">
													Unit {unit.unitNumber}
												</p>
											</div>
										<div className="space-y-2">
  <p className="text-sm font-medium text-gray-500">Lease Period</p>
  <p className="text-sm font-semibold text-gray-900">
    {lease?.startDate ? new Date(lease.startDate).toLocaleDateString() : "N/A"}
  </p>
  <p className="text-sm text-gray-600">
    to {lease?.endDate ? new Date(lease.endDate).toLocaleDateString() : "N/A"}
  </p>
    <p className="text-sm text-gray-600">
    Lease Id {lease.id}
  </p>
</div>

											<div className="space-y-2">
												<p className="text-sm font-medium text-gray-500">
													Monthly Rent
												</p>
												<p className="text-lg font-bold text-emerald-600">
													{unit.monthlyRent.toLocaleString()} ETB
												</p>
												<p className="text-sm text-gray-600">
													Due on {lease.paymentDueDate}
													{lease.paymentDueDate === 1 ? "st" : "th"} of
													month
												</p>
											</div>
											<div className="space-y-2">
												<p className="text-sm font-medium text-gray-500">
													Security Deposit
												</p>
												<p className="text-lg font-bold text-blue-600">
													 {unit.deposit !== undefined && unit.deposit !== null 
    ? unit.deposit.toLocaleString() 
    : '0'} ETB
												</p>
												<p className="text-sm text-gray-600">Refundable</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Lease Terms */}
							<div
								className="animate-in fade-in slide-in-from-left-4 duration-700 delay-600"
								style={{ animationFillMode: "forwards" }}
							>
								<Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
									<CardHeader>
										<CardTitle className="text-xl font-bold text-gray-900">
											Lease Terms & Conditions
										</CardTitle>
										<CardDescription>
											Please read all terms carefully before signing
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4 max-h-96 overflow-y-auto">
											{leaseTerms.map((term, index) => (
												<div
													key={index}
													className="flex items-start space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-100"
												>
													<div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
														<span className="text-xs font-bold text-blue-600">
															{index + 1}
														</span>
													</div>
													<p className="text-sm text-gray-700 leading-relaxed">
														{term}
													</p>
												</div>
											))}
										</div>

										<div className="mt-6 pt-6 border-t">
											<div className="flex items-start space-x-3">
												<Checkbox
													id="agreeToTerms"
													checked={formData.agreeToTerms}
													onCheckedChange={(checked) =>
														setFormData({
															...formData,
															agreeToTerms: checked as boolean,
														})
													}
													className="mt-1"
												/>
												<Label
													htmlFor="agreeToTerms"
													className="text-sm text-gray-700 cursor-pointer leading-relaxed"
												>
													I have read, understood, and agree to all the lease
													terms and conditions listed above. I acknowledge that
													this constitutes a legally binding agreement.
												</Label>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
{/* Payment Method Selection
      <div>
        <label
          htmlFor="paymentMethod"
          className="block text-sm font-medium text-gray-700"
        >
          Select Payment Method
        </label>
        <select
          id="paymentMethod"
          value={formData.paymentMethod}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              paymentMethod: e.target.value,
            }))
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">-- Choose a method --</option>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </option>
          ))}
        </select>
      </div> */}
							{/* Digital Signature */}
							<div
								className="animate-in fade-in slide-in-from-left-4 duration-700 delay-900"
								style={{ animationFillMode: "forwards" }}
							>
								<Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
									<CardHeader>
										<CardTitle className="text-xl font-bold text-gray-900">
											Digital Signature
										</CardTitle>
										<CardDescription>
											Sign the lease agreement digitally
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										{error && (
											<Alert variant="destructive">
												<AlertDescription>{error}</AlertDescription>
											</Alert>
										)}

										<div className="space-y-2">
											<Label
												htmlFor="digitalSignature"
												className="text-sm font-semibold text-gray-700"
											>
												Type Your Full Name as Digital Signature *
											</Label>
											<div className="relative">
												<input
													id="digitalSignature"
													type="text"
													placeholder="Type your full name here"
													className="w-full h-16 px-4 text-2xl font-script border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none bg-gradient-to-r from-blue-50 to-emerald-50"
													value={formData.digitalSignature}
													onChange={(e) =>
														setFormData({
															...formData,
															digitalSignature: e.target.value,
														})
													}
													required
												/>
											</div>
											<p className="text-xs text-gray-500">
												By typing your name above, you agree that this serves as
												your legal digital signature
											</p>
										</div>

										<div className="flex items-start space-x-3">
											<Checkbox
												id="confirmDetails"
												checked={formData.confirmDetails}
												onCheckedChange={(checked) =>
													setFormData({
														...formData,
														confirmDetails: checked as boolean,
													})
												}
												className="mt-1"
											/>
											<Label
												htmlFor="confirmDetails"
												className="text-sm text-gray-700 cursor-pointer leading-relaxed"
											>
												I confirm that all information provided in this
												application is accurate and complete. I understand that
												any false information may result in lease termination.
											</Label>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>

						{/* Sidebar */}
						<div className="xl:col-span-1 space-y-8">
							{/* Payment Summary */}
							<div
								className="animate-in fade-in slide-in-from-right-4 duration-700 delay-600"
								style={{ animationFillMode: "forwards" }}
							>
								<Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm sticky top-8">
									<CardHeader>
										<CardTitle className="text-xl font-bold text-gray-900">
											Payment Summary
										</CardTitle>
										<CardDescription>
											Amount due upon lease signing
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="space-y-3">
											<div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50 border border-emerald-200">
												<span className="text-sm font-medium text-emerald-700">
													First Month Rent:
												</span>
												<span className="font-semibold text-emerald-600">
													{unit.monthlyRent.toLocaleString()} ETB
												</span>
											</div>

											<div className="flex justify-between items-center p-3 rounded-xl bg-blue-50 border border-blue-200">
												<span className="text-sm font-medium text-blue-700">
													Security Deposit:
												</span>
												<span className="font-semibold text-blue-600">
													 {unit.deposit !== undefined && unit.deposit !== null 
    ? unit.deposit.toLocaleString() 
    : '0'} ETB
												</span>
											</div>

											<div className="border-t pt-3">
												<div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
													<span className="text-sm font-medium text-gray-900">
														Total Amount:
													</span>
													<span className="font-semibold text-purple-600">
														{totalAmount.toLocaleString()} ETB
													</span>
												</div>
											</div>
										</div>

										<div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
											<h4 className="font-semibold text-yellow-800 mb-2">
												Important Notes
											</h4>
											<ul className="text-yellow-700 text-sm space-y-1">
												<li>• Payment required within 24 hours of signing</li>
												<li>• Security deposit is fully refundable</li>
												<li>
													• Keys will be provided after payment confirmation
												</li>
												<li>• Move-in inspection will be scheduled</li>
											</ul>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Next Steps */}
							<div
								className="animate-in fade-in slide-in-from-right-4 duration-700 delay-900"
								style={{ animationFillMode: "forwards" }}
							>
								<Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
									<CardHeader>
										<CardTitle className="text-xl font-bold text-gray-900">
											After Signing
										</CardTitle>
										<CardDescription>What happens next</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="flex items-start space-x-3">
												<div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
													<span className="text-white font-bold text-sm">
														1
													</span>
												</div>
												<div>
													<p className="font-medium text-gray-900">
														Payment Processing
													</p>
													<p className="text-sm text-gray-600">
														Complete payment for first month rent and deposit
													</p>
												</div>
											</div>
											<div className="flex items-start space-x-3">
												<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
													<span className="text-white font-bold text-sm">
														2
													</span>
												</div>
												<div>
													<p className="font-medium text-gray-900">
														Lease Activation
													</p>
													<p className="text-sm text-gray-600">
														Your lease will be activated and added to your
														dashboard
													</p>
												</div>
											</div>
											<div className="flex items-start space-x-3">
												<div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
													<span className="text-white font-bold text-sm">
														3
													</span>
												</div>
												<div>
													<p className="font-medium text-gray-900">
														Key Collection
													</p>
													<p className="text-sm text-gray-600">
														Schedule key pickup and move-in inspection
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>

					{/* Submit Button */}
					<div
						className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1200"
						style={{ animationFillMode: "forwards" }}
					>
						<div className="flex justify-end space-x-4 mt-8">
							<Button
								type="button"
								variant="outline"
								asChild
								className="border-gray-300 hover:bg-gray-50"
							>
								<Link
									href={`/dashboard/tenant/properties/${params.id}/units/${params.unitId}/rent`}
								>
									Cancel
								</Link>
							</Button>
							<Button
								type="submit"
								className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300"
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="flex items-center space-x-3">
										<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
										<span>Processing Lease...</span>
									</div>
								) : (
									<div className="flex items-center space-x-3">
										<FileText className="h-5 w-5" />
										<span>Sign Lease & Proceed to Payment</span>
									</div>
								)}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</DashboardLayout>
	);
}
