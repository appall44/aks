"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { ArrowLeft, Save, Home, Plus, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DashboardLayout from "@/components/dashboard-layout";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface CreateUnitDto {
	unitNumber: string;
	unitType: "apartment" | "studio" | "adu";
	size?: number;
	bedrooms: number;
	bathrooms: number;
	monthlyRent: number;
	status: "vacant" | "occupied" | "maintenance";
	description?: string;
	images?: File[];
}

export default function NewUnitPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState<CreateUnitDto>({
		unitNumber: "",
		unitType: "apartment",
		size: undefined,
		bedrooms: 1,
		bathrooms: 1,
		monthlyRent: 0,
		status: "vacant",
		description: "",
		images: [],
	});
	const fileInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const { toast } = useToast();
	const { id } = useParams();

	if (!id) {
		return (
			<DashboardLayout userRole="owner" userId="16">
				<div className="p-6 text-center text-red-600 font-semibold">
					የንብረት መለያ አልተገኘም / Property ID not found.
				</div>
			</DashboardLayout>
		);
	}

	const handleInputChange = (
		field: keyof CreateUnitDto,
		value: string | number
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setError(""); // Clear error on input change
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files ? Array.from(e.target.files) : [];
		const maxImages = 5;
		const maxFileSize = 5 * 1024 * 1024; // 5MB

		if (files.length + formData.images.length > maxImages) {
			setError(
				`ከፍተኛ ${maxImages} ምስሎች ተፈቅደዋል / Maximum ${maxImages} images allowed`
			);
			return;
		}

		const validFiles: File[] = [];
		for (const file of files) {
			if (!file.type.match(/image\/(jpg|jpeg|png)/)) {
				setError(
					"እባክዎ ምስሎችን ብቻ ይስቀሉ (JPG, PNG) / Please upload images only (JPG, PNG)"
				);
				return;
			}
			if (file.size > maxFileSize) {
				setError(
					"እያንዳንዱ ምስል ከ 5MB ያነሰ መሆን አለበት / Each image must be smaller than 5MB"
				);
				return;
			}
			validFiles.push(file);
		}

		setFormData((prev) => ({
			...prev,
			images: [...prev.images, ...validFiles],
		}));
		setError("");
		if (fileInputRef.current) {
			fileInputRef.current.value = ""; // Reset file input
		}
	};

	const handleRemoveImage = (index: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	const validateForm = (): string | null => {
		if (!formData.unitNumber.trim()) {
			return "የክፍል ቁጥር ያስፈልጋል / Unit Number is required";
		}
		if (!["apartment", "studio", "adu"].includes(formData.unitType)) {
			return "የክፍል አይነት መሆን አለበት: apartment, studio, adu / Unit Type must be one of: apartment, studio, adu";
		}
		if (!Number.isInteger(formData.bedrooms) || formData.bedrooms < 1) {
			return "መኝታ ቤቶች ከ1 ያነሰ ወይም ኢንቲጀር መሆን አለባቸው / Bedrooms must be a positive integer";
		}
		if (isNaN(formData.bathrooms) || formData.bathrooms <= 0) {
			return "መታጠቢያ ቤቶች ከ0 በላይ መሆን አለባቸው / Bathrooms must be a positive number";
		}
		if (isNaN(formData.monthlyRent) || formData.monthlyRent <= 0) {
			return "ወርሃዊ ክራይ ከ0 በላይ መሆን አለበት / Monthly rent must be a positive number";
		}
		if (!["vacant", "occupied", "maintenance"].includes(formData.status)) {
			return "ሁኔታ መሆን አለበት: vacant, occupied, maintenance / Status must be one of: vacant, occupied, maintenance";
		}
		if (
			formData.size !== undefined &&
			(isNaN(formData.size) || formData.size <= 0)
		) {
			return "መጠን ከ0 በላይ መሆን አለበት / Size must be a positive number if provided";
		}
		if (formData.description && typeof formData.description !== "string") {
			return "መግለጫ ሕብረቁምፊ መሆን አለበት / Description must be a string";
		}
		return null;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		const validationError = validateForm();
		if (validationError) {
			setError(validationError);
			toast({
				variant: "destructive",
				title: "ስህተት / Error",
				description: validationError,
			});
			setIsLoading(false);
			return;
		}

		try {
			const data = new FormData();
			data.append("unitNumber", formData.unitNumber.trim());
			data.append("unitType", formData.unitType);
			if (formData.size && !isNaN(formData.size)) {
				data.append("size", Math.round(formData.size).toString());
			}
			data.append("bedrooms", formData.bedrooms.toString());
			data.append("bathrooms", formData.bathrooms.toString());
			data.append("monthlyRent", formData.monthlyRent.toString());
			data.append("status", formData.status);
			if (formData.description) {
				data.append("description", formData.description.trim());
			}
			formData.images.forEach((image) => data.append("images", image));

			const token = localStorage.getItem("accessToken");
			if (!token) {
				setError("ተጠቃሚው አልተረጋገጠም / User not authenticated");
				toast({
					variant: "destructive",
					title: "ስህተት / Error",
					description: "እባክዎ ይግቡ እና እንደገና ይሞክሩ / Please log in and try again",
				});
				setIsLoading(false);
				return;
			}

			await axios.post(`http://localhost:5000/properties/${id}/units`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			});

			toast({
				title: "ክፍል ተጨምሯል / Unit Added Successfully",
				description: `Unit ${formData.unitNumber} has been added to the property`,
			});

			router.push(`/dashboard/owner/16/properties/${id}`);
		} catch (error: any) {
			console.error("Error adding unit:", error);
			const errorMessage = Array.isArray(error.response?.data?.message)
				? error.response.data.message.join("; ")
				: error.response?.data?.message || "እባክዎ እንደገና ይሞክሩ / Please try again";
			setError(errorMessage);
			toast({
				variant: "destructive",
				title: "አስተካክል አልተሳካም / Error",
				description: errorMessage,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<DashboardLayout userRole="owner" userId="16">
			<div className="space-y-6 p-4 sm:p-6 lg:p-8">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Button variant="outline" size="sm" asChild>
							<Link href={`/dashboard/owner/16/properties/${id}`}>
								<ArrowLeft className="h-4 w-4 mr-2" />
								ተመለስ / Back
							</Link>
						</Button>
						<div>
							<h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
								አዲስ ክፍል ጨምር / Add New Unit
							</h1>
							<p className="text-gray-600 mt-1 text-sm sm:text-base">
								ለንብረቱ አዲስ ክፍል መረጃ ያስገቡ / Enter new unit information
							</p>
						</div>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="flex items-center space-x-2 text-xl">
								<Home className="h-5 w-5 text-teal-600" />
								<span>የክፍል ዝርዝር / Unit Details</span>
							</CardTitle>
							<CardDescription>
								መሰረታዊ የክፍል መረጃ / Basic unit information
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label
										htmlFor="unitNumber"
										className="text-sm font-semibold text-gray-700"
									>
										የክፍል ቁጥር / Unit Number *
									</Label>
									<Input
										id="unitNumber"
										value={formData.unitNumber}
										onChange={(e) =>
											handleInputChange("unitNumber", e.target.value)
										}
										placeholder="e.g., 101"
										className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-500"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="unitType"
										className="text-sm font-semibold text-gray-700"
									>
										የክፍል አይነት / Unit Type *
									</Label>
									<Select
										value={formData.unitType}
										onValueChange={(value) =>
											handleInputChange("unitType", value)
										}
										required
									>
										<SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-500">
											<SelectValue placeholder="Select type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="apartment">Apartment</SelectItem>
											<SelectItem value="studio">Studio</SelectItem>
											<SelectItem value="adu">ADU</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="size"
										className="text-sm font-semibold text-gray-700"
									>
										መጠን / Size (sq ft)
									</Label>
									<Input
										id="size"
										type="number"
										value={formData.size ?? ""}
										onChange={(e) =>
											handleInputChange(
												"size",
												parseInt(e.target.value) || undefined
											)
										}
										placeholder="e.g., 800"
										className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-500"
										min="1"
										step="1"
									/>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="bedrooms"
										className="text-sm font-semibold text-gray-700"
									>
										መኝታ ቤቶች / Bedrooms *
									</Label>
									<Select
										value={formData.bedrooms.toString()}
										onValueChange={(value) =>
											handleInputChange("bedrooms", parseInt(value))
										}
										required
									>
										<SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-500">
											<SelectValue placeholder="Select" />
										</SelectTrigger>
										<SelectContent>
											{[1, 2, 3, 4, 5].map((num) => (
												<SelectItem key={num} value={num.toString()}>
													{num}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="bathrooms"
										className="text-sm font-semibold text-gray-700"
									>
										መታጠቢያ ቤቶች / Bathrooms *
									</Label>
									<Select
										value={formData.bathrooms.toString()}
										onValueChange={(value) =>
											handleInputChange("bathrooms", parseFloat(value))
										}
										required
									>
										<SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-500">
											<SelectValue placeholder="Select" />
										</SelectTrigger>
										<SelectContent>
											{[1, 1.5, 2, 2.5, 3].map((num) => (
												<SelectItem key={num} value={num.toString()}>
													{num}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="monthlyRent"
										className="text-sm font-semibold text-gray-700"
									>
										ወርሃዊ ክራይ / Monthly Rent (ETB) *
									</Label>
									<Input
										id="monthlyRent"
										type="number"
										value={formData.monthlyRent || ""}
										onChange={(e) =>
											handleInputChange(
												"monthlyRent",
												parseFloat(e.target.value) || 0
											)
										}
										placeholder="e.g., 10000"
										className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-500"
										required
										min="1"
										step="0.01"
									/>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="status"
										className="text-sm font-semibold text-gray-700"
									>
										ሁኔታ / Status *
									</Label>
									<Select
										value={formData.status}
										onValueChange={(value) =>
											handleInputChange("status", value)
										}
										required
									>
										<SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-500">
											<SelectValue placeholder="Select" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="vacant">Vacant</SelectItem>
											<SelectItem value="occupied">Occupied</SelectItem>
											<SelectItem value="maintenance">
												Under Maintenance
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="description"
									className="text-sm font-semibold text-gray-700"
								>
									መግለጫ / Description
								</Label>
								<Textarea
									id="description"
									value={formData.description || ""}
									onChange={(e) =>
										handleInputChange("description", e.target.value)
									}
									placeholder="Unit description..."
									className="min-h-24 rounded-xl border-2 border-gray-200 focus:border-emerald-500"
									rows={3}
								/>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="image-upload"
									className="text-sm font-semibold text-gray-700"
								>
									የክፍል ምስሎች / Unit Images (up to 5)
								</Label>
								<div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors">
									<Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
									<p className="text-sm font-medium text-gray-700 mb-2">
										ምስሎችን ይጎትቱ ወይም ይጫኑ / Drag images here or click to upload
									</p>
									<p className="text-xs text-gray-500 mb-3">
										JPG, PNG up to 5MB each. First image will be the main photo.
									</p>
									<input
										type="file"
										accept="image/jpeg,image/png"
										multiple
										onChange={handleImageUpload}
										ref={fileInputRef}
										className="hidden"
										id="image-upload"
									/>
									<Button
										variant="outline"
										type="button"
										onClick={() => fileInputRef.current?.click()}
										className="border-emerald-300 hover:bg-emerald-50"
									>
										<Plus className="h-4 w-4 mr-2" />
										ምስል ጨምር / Add Images
									</Button>
								</div>
								{formData.images.length > 0 && (
									<div className="mt-4">
										<p className="text-sm font-medium text-gray-700 mb-3">
											Uploaded Images ({formData.images.length}/5)
										</p>
										<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
											{formData.images.map((image, index) => (
												<div key={index} className="relative group">
													<img
														src={URL.createObjectURL(image)}
														alt={`Unit image ${index + 1}`}
														className="h-24 w-full object-cover rounded-lg border-2 border-gray-200"
													/>
													{index === 0 && (
														<span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
															Main Photo
														</span>
													)}
													<Button
														variant="destructive"
														size="icon"
														className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
														onClick={() => handleRemoveImage(index)}
													>
														<X className="h-3 w-3" />
													</Button>
													<p className="text-xs text-gray-500 mt-1 truncate">
														{image.name}
													</p>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					<div className="flex justify-end space-x-4">
						<Button
							variant="outline"
							type="button"
							asChild
							className="border-gray-300 hover:bg-gray-50"
						>
							<Link href={`/dashboard/owner/16/properties/${id}`}>
								ተወው / Cancel
							</Link>
						</Button>
						<Button
							type="submit"
							className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg"
							disabled={isLoading}
						>
							{isLoading ? (
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									<span>በመጨመር ላይ... / Adding...</span>
								</div>
							) : (
								<div className="flex items-center space-x-2">
									<Save className="h-4 w-4" />
									<span>ክፍል ጨምር / Add Unit</span>
								</div>
							)}
						</Button>
					</div>
				</form>
			</div>
		</DashboardLayout>
	);
}
