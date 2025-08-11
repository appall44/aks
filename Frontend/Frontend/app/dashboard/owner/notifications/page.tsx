"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Bell, CheckCircle, Clock, AlertCircle, Mail, MessageSquare, Search, Filter, Eye } from "lucide-react";
import { useParams } from "next/navigation";

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

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  status: string;
  priority: string;
  date: string;
}

export default function OwnerNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { ownerId } = useParams();

  useEffect(() => {
    if (!ownerId) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        console.log("Fetching notifications for ownerId:", ownerId);
        const res = await axios.get<Notification[]>(
          `http://localhost:5000/owner/${ownerId}/notifications/maintenance`
        );
        setNotifications(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [ownerId]);

  // Filtering notifications by search term, type, and status
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesStatus = filterStatus === "all" || notification.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Helper functions for styling badges and icons
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "read":
        return "bg-gray-100 text-gray-800";
      case "unread":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "payment":
        return "bg-emerald-100 text-emerald-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "lease":
        return "bg-purple-100 text-purple-800";
      case "application":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "normal":
        return "bg-gray-100 text-gray-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "payment":
        return CheckCircle;
      case "maintenance":
        return AlertCircle;
      case "lease":
        return Clock;
      case "application":
        return Mail;
      default:
        return Bell;
    }
  };

  const unreadCount = filteredNotifications.filter((n) => n.status === "unread").length;
  const highPriorityCount = filteredNotifications.filter((n) => n.priority.toLowerCase() === "high").length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">Loading notifications...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-red-600">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-in fade-in duration-1000">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Notifications
              </h1>
              <p className="text-lg text-gray-600">Stay updated with important alerts and messages about your properties</p>
              <p className="text-sm text-gray-500">Monitor payments, maintenance, lease renewals, and tenant communications</p>
            </div>
            <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300">
              <MessageSquare className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Notifications */}
          <Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-blue-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600">Total Notifications</p>
                  <p className="text-3xl font-bold text-gray-900">{filteredNotifications.length}</p>
                </div>
                <div className="p-4 rounded-3xl bg-blue-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
                  <Bell className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unread */}
          <Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-emerald-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600">Unread</p>
                  <p className="text-3xl font-bold text-gray-900">{unreadCount}</p>
                </div>
                <div className="p-4 rounded-3xl bg-emerald-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
                  <Mail className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* High Priority */}
          <Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-red-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600">High Priority</p>
                  <p className="text-3xl font-bold text-gray-900">{highPriorityCount}</p>
                </div>
                <div className="p-4 rounded-3xl bg-red-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* This Week (same as total for now) */}
          <Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-purple-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600">This Week</p>
                  <p className="text-3xl font-bold text-gray-900">{filteredNotifications.length}</p>
                </div>
                <div className="p-4 rounded-3xl bg-purple-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  <Input
    type="search"
    placeholder="Search by title, message, or ID..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-10"
  />
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Filter Type: {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["all", "payment", "maintenance", "lease", "application"].map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => setFilterType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Filter Status: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["all", "read", "unread"].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Notifications List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredNotifications.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No notifications found.</p>
          ) : (
            filteredNotifications.map((notification) => {
              const TypeIcon = getTypeIcon(notification.type);
              return (
                <Card
                  key={notification.id}
                  className="hover:shadow-xl transition-all duration-500 border-l-4 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm"
                  style={{ borderColor: getTypeColor(notification.type).split(" ")[1] }} // gets border color from badge class
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TypeIcon
                        className={`h-6 w-6 ${getTypeColor(notification.type).split(" ")[1]}`}
                      />
                      {notification.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {notification.message}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <Badge className={getStatusColor(notification.status)}>
                      {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                    </Badge>
                    <Badge className={getPriorityColor(notification.priority)}>
                      {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                    </Badge>
                    <span className="text-xs text-gray-500">{new Date(notification.date).toLocaleDateString()}</span>
                    <Button variant="ghost" size="sm" aria-label="View Notification">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
