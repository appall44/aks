# Akeray Property Management System - Frontend

## Overview

This is the frontend client for the Akeray Property Management System (APMS), built with Next.js 14, React 18, TypeScript, and Tailwind CSS. It provides a modern, responsive web interface for property management operations.

## 🏗️ Frontend Architecture

The frontend follows modern React patterns with:

- **App Router**: Next.js 14 App Router for file-based routing
- **Server Components**: Leveraging React Server Components for performance
- **Type Safety**: Full TypeScript integration
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: React hooks and context
- **Responsive Design**: Mobile-first responsive design

## 📁 Frontend Folder Structure

```
Frontend/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── dashboard/               # Dashboard pages
│   ├── login/                   # Login page
│   ├── signup/                  # Registration page
│   └── landing/                 # Landing pages
│
├── components/                  # Reusable UI components
│   ├── dashboard-layout.tsx     # Dashboard layout wrapper
│   ├── theme-provider.tsx       # Theme context provider
│   └── ui/                     # UI component library
│
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions
├── public/                     # Static assets
├── styles/                     # Global styles
├── package.json               # Dependencies & scripts
└── tsconfig.json              # TypeScript configuration
```

## 🚀 Key Features

### Authentication & User Management

- Multi-role authentication (Admin, Owner, Landlord, Tenant)
- Secure login/logout flows
- Password reset functionality
- OTP verification system
- Role-based dashboard routing

### Dashboard Interfaces

- **Admin Dashboard**: Full system overview
- **Owner Dashboard**: Property and financial management
- **Landlord Dashboard**: Property and tenant management
- **Tenant Dashboard**: Personal dashboard and maintenance requests

### Property Management UI

- Property listing and search
- Unit management interface
- Property image gallery
- Document upload interface
- Property status tracking

### Financial Management

- Payment tracking interface
- Invoice generation and viewing
- Payment history
- Financial reports visualization

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + custom components
- **State Management**: React hooks
- **HTTP Client**: Fetch API
- **Form Handling**: React Hook Form
- **Validation**: Zod schema validation

## 🚀 Getting Started

### Prerequisites

- Node.js v20+
- npm or pnpm package manager

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Akeray PMS
```

## 🧪 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## 📊 API Documentation

Once the server is running, visit:

- Swagger UI: http://localhost:3000/api
- API Health Check: http://localhost:3000/health
