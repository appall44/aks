"use client";

import React, { useState, useEffect } from "react";
import {
  Building,
  DollarSign,
  TrendingUp,
  Users,
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
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/dashboard-layout";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  MapPin,
  FileText,
} from "lucide-react";


interface Stats {
  propertiesCount: number;
  totalRevenue: number;
  occupancyRate: number;
  activeTenants: number;
}

type ActivityStatus = "success" | "warning" | "info" | "pending";

interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
  status: "success" | "warning" | "info"| "pending";
  amount?: string;
  cost?: string;
  action?: string;
  tenant?: string;
}

interface PropertyPerformance {
  property: string;
  revenue: number;
  occupancy: number;
  trend: "up" | "down" | "stable";
}

export default function OwnerDashboard() {
  const [stats, setStats] = useState<Stats>({
    propertiesCount: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    activeTenants: 0,
  });
 const backendUrl = "http://localhost:5000";
 const { ownerId } = useParams();
  const recentActivities: Activity[] = [
    {
      id: 1,
      type: "Payment Received",
      message: "Payment of 12,000 ETB received from tenant John Doe",
      time: "2 hours ago",
      status: "success",
      amount: "12,000 ETB",
      tenant: "John Doe",
    },
    {
      id: 2,
      type: "Maintenance Request",
      message: "Leak reported in apartment 3B",
      time: "1 day ago",
      status: "warning",
      action: "Schedule repair",
    },
  ];

  const propertyPerformance: PropertyPerformance[] = [
    {
      property: "Sunrise Apartments",
      revenue: 50000,
      occupancy: 95,
      trend: "up",
    },
    {
      property: "Maple Residency",
      revenue: 42000,
      occupancy: 88,
      trend: "stable",
    },
  ];

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${backendUrl}/owner/properties/`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "My Properties",
      value: stats.propertiesCount.toString(),
      change: "+1 this month",
      changeType: "positive",
      icon: Building,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      href: "/dashboard/owner/properties",
    },
    {
      title: "Total Revenue",
      value: `${stats.totalRevenue.toLocaleString()} ETB`,
      change: "+12.5% from last month",
      changeType: "positive",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      href: "/dashboard/owner/payments",
    },
    {
      title: "Occupancy Rate",
      value: `${stats.occupancyRate}%`,
      change: "+3% this month",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      href: "/dashboard/owner/reports",
    },
    {
      title: "Active Tenants",
      value: stats.activeTenants.toString(),
      change: "+5 this month",
      changeType: "positive",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      href: "/dashboard/owner/leases",
    },
  ];

	return (
		<DashboardLayout
		>
			<div className="space-y-8">
				{/* Header */}
				<div className="animate-in fade-in duration-1000">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
								Property Owner Dashboard
							</h1>
							<p className="text-lg text-gray-600">
								Welcome back, Here's your property portfolio overview.
							</p>
							<p className="text-sm text-gray-500">
								Track your investments and maximize your rental income.
							</p>
						</div>
						<div className="flex flex-col sm:flex-row gap-3">
							<Button
								asChild
								className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300"
							>
								<Link href={`/dashboard/owner/${ownerId}/properties`}>
									<Plus className="h-4 w-4 mr-2" />
									Add Property
								</Link>
							</Button>
							<Button
								variant="outline"
								asChild
								className="border-emerald-300 hover:bg-emerald-50 bg-transparent"
							>
								<Link href="/dashboard/owner/reports">
									<FileText className="h-4 w-4 mr-2" />
									View Reports
								</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
					{statsCards.map((stat, index) => (
						<div
							key={index}
							className="animate-in fade-in slide-in-from-bottom-4 duration-700"
							style={{
								animationDelay: `${index * 150 + 300}ms`,
								animationFillMode: "forwards",
							}}
						>
							<Card
								className={`hover:shadow-xl transition-all duration-500 border-l-4 ${stat.borderColor} group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm`}
							>
								<Link href={stat.href}>
									<CardContent className="p-6">
										<div className="flex items-center justify-between">
											<div className="space-y-3">
												<p className="text-sm font-semibold text-gray-600">
													{stat.title}
												</p>
												<p className="text-3xl font-bold text-gray-900">
													{stat.value}
												</p>
												<div className="flex items-center space-x-2">
													{stat.changeType === "positive" ? (
														<ArrowUpRight className="h-4 w-4 text-emerald-500" />
													) : (
														<ArrowDownRight className="h-4 w-4 text-red-500" />
													)}
													<p
														className={`text-sm font-medium ${
															stat.changeType === "positive"
																? "text-emerald-600"
																: "text-red-600"
														}`}
													>
														{stat.change}
													</p>
												</div>
											</div>
											<div
												className={`p-4 rounded-3xl ${stat.bgColor} group-hover:scale-125 transition-transform duration-500 shadow-lg`}
											>
												<stat.icon className={`h-8 w-8 ${stat.color}`} />
											</div>
										</div>
									</CardContent>
								</Link>
							</Card>
						</div>
					))}
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
					{/* Recent Activities */}
					<div
						className="animate-in fade-in slide-in-from-left-4 duration-700 delay-1000"
						style={{ animationFillMode: "forwards" }}
					>
						<Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
							<CardHeader className="pb-4">
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="flex items-center space-x-3 text-xl">
											<Clock className="h-6 w-6 text-emerald-600" />
											<span>Recent Activities</span>
										</CardTitle>
										<CardDescription className="mt-2">
											Latest updates from your properties
										</CardDescription>
									</div>
									<Button
										variant="outline"
										size="sm"
										asChild
										className="hover:bg-emerald-50 bg-transparent"
									>
										<Link href="/dashboard/owner/notifications">View All</Link>
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{recentActivities.map((activity, index) => (
										<div
											key={activity.id}
											className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 transition-all duration-300 border border-gray-100 group"
											style={{ animationDelay: `${index * 100 + 1200}ms` }}
										>
										<div className="flex-shrink-0 mt-1">
        {activity.status === "success" && (
          <CheckCircle className="h-6 w-6 text-emerald-500" />
        )}
        {activity.status === "pending" && (
          <Clock className="h-6 w-6 text-orange-500" />
        )}
        {activity.status === "warning" && (
          <AlertCircle className="h-6 w-6 text-red-500" />
        )}
      </div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-gray-900 mb-2 leading-relaxed">
													{activity.message}
												</p>
												<div className="flex items-center justify-between">
													<p className="text-xs text-gray-500">
														{activity.time}
													</p>
													{activity.amount && (
														<Badge className="bg-emerald-100 text-emerald-800 font-semibold">
															{activity.amount}
														</Badge>
													)}
													{activity.cost && (
														<Badge className="bg-orange-100 text-orange-800 font-semibold">
															{activity.cost}
														</Badge>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Property Performance */}
					<div
						className=" animate-in fade-in slide-in-from-right-4 duration-700 delay-1200"
						style={{ animationFillMode: "forwards" }}
					>
						<Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
							<CardHeader className="pb-4">
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="flex items-center space-x-3 text-xl">
											<TrendingUp className="h-6 w-6 text-blue-600" />
											<span>Property Performance</span>
										</CardTitle>
										<CardDescription className="mt-2">
											Revenue and occupancy by property
										</CardDescription>
									</div>
									<Button
										variant="outline"
										size="sm"
										asChild
										className="hover:bg-blue-50 bg-transparent"
									>
										<Link href="/dashboard/owner/properties">
											View Properties
										</Link>
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{propertyPerformance.map((property, index) => (
										<div key={index} className="space-y-3">
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-3">
													<MapPin className="h-4 w-4 text-gray-400" />
													<span className="text-sm font-semibold text-gray-900">
														{property.property}
													</span>
													{property.trend === "up" && (
														<ArrowUpRight className="h-4 w-4 text-emerald-500" />
													)}
													{property.trend === "down" && (
														<ArrowDownRight className="h-4 w-4 text-red-500" />
													)}
												</div>
												<div className="flex items-center space-x-3">
													<span className="text-sm text-gray-600 font-medium">
														{property.revenue}
													</span>
													<Badge
														className={
															property.occupancy >= 90
																? "bg-emerald-100 text-emerald-800"
																: property.occupancy >= 80
																? "bg-yellow-100 text-yellow-800"
																: "bg-red-100 text-red-800"
														}
													>
														{property.occupancy}%
													</Badge>
												</div>
											</div>
											<Progress
												value={property.occupancy}
												className="h-3 bg-gray-200"
												style={{
													animationDelay: `${index * 200 + 1400}ms`,
												}}
											/>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Quick Actions */}
				<div
					className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1600"
					style={{ animationFillMode: "forwards" }}
				>
					<Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="text-xl">Quick Actions</CardTitle>
							<CardDescription>
								Manage your properties efficiently
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{[
									{
										href: "/dashboard/owner/properties/new",
										icon: Building,
										label: "Add Property",
										color: "text-emerald-600",
										bg: "bg-emerald-50",
										border: "border-emerald-200",
									},
									{
										href: "/dashboard/owner/leases",
										icon: FileText,
										label: "Manage Leases",
										color: "text-blue-600",
										bg: "bg-blue-50",
										border: "border-blue-200",
									},
									{
										href: "/dashboard/owner/payments",
										icon: DollarSign,
										label: "View Payments",
										color: "text-purple-600",
										bg: "bg-purple-50",
										border: "border-purple-200",
									},
									{
										href: "/dashboard/owner/reports",
										icon: TrendingUp,
										label: "Generate Report",
										color: "text-orange-600",
										bg: "bg-orange-50",
										border: "border-orange-200",
									},
								].map((action, index) => (
									<Button
										key={index}
										variant="outline"
										asChild
										className={`h-28 flex-col space-y-3 ${action.border} hover:shadow-lg transition-all duration-500 group bg-transparent hover:scale-105`}
									>
										<Link href={action.href}>
											<div
												className={`p-3 rounded-2xl ${action.bg} group-hover:scale-125 transition-transform duration-500 shadow-md`}
											>
												<action.icon className={`h-6 w-6 ${action.color}`} />
											</div>
											<span className="text-sm font-semibold text-center leading-tight">
												{action.label}
											</span>
										</Link>
									</Button>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</DashboardLayout>
	);
}
