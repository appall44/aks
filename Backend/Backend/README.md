# Akeray Property Management System - Backend

## Overview

This is the backend API for the Akeray Property Management System (APMS), built with NestJS (a progressive Node.js framework). It provides a comprehensive RESTful API for managing properties, tenants, landlords, payments, and all aspects of property management operations.

## 🏗️ Backend Architecture

The backend follows a modular architecture pattern with clear separation of concerns:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Entities**: Define database models using TypeORM
- **Modules**: Organize related functionality
- **Middleware**: Handle cross-cutting concerns like authentication

## 📁 Backend Folder Structure

```
Backend/
├── src/                          # Source code directory
│   ├── app.controller.ts         # Root controller
│   ├── app.module.ts            # Root module
│   ├── app.service.ts           # Root service
│   ├── main.ts                  # Application entry point
│   │
│   ├── @types/                  # TypeScript type definitions
│   │   └── express/             # Express.js type extensions
│   │
│   ├── admin/                   # Admin dashboard functionality
│   │   ├── admin.controller.ts  # Admin endpoints
│   │   ├── admin.module.ts      # Admin module
│   │   ├── admin.services.ts    # Admin business logic
│   │   ├── admin-dashboard/     # Admin dashboard data
│   │   └── entities/            # Admin-related entities
│   │
│   ├── amenity/                 # Property amenities management
│   │   └── amenity.entity.ts    # Amenity database model
│   │
│   ├── auth/                    # Authentication & authorization
│   │   ├── auth.controller.ts   # Auth endpoints (login, register)
│   │   ├── auth.service.ts      # Authentication logic
│   │   ├── auth.module.ts       # Auth module configuration
│   │   ├── strategies/          # JWT, Local strategies
│   │   ├── guards/              # Route protection guards
│   │   ├── dto/                 # Data transfer objects
│   │   ├── email/               # Email service integration
│   │   ├── otp/                 # One-time password functionality
│   │   └── interfaces/          # Auth-related interfaces
│   │
│   ├── config/                  # Configuration management
│   │   ├── config.module.ts     # Configuration module
│   │   ├── database.config.ts   # Database connection settings
│   │   ├── jwt.config.ts        # JWT token configuration
│   │   ├── sms.config.ts        # SMS service configuration
│   │   └── swaggers.ts          # API documentation setup
│   │
│   ├── dashboard/               # Dashboard analytics
│   │   ├── dashboard.controller.ts # Dashboard endpoints
│   │   ├── dashboard.service.ts    # Dashboard data aggregation
│   │   └── dashboard.module.ts     # Dashboard module
│   │
│   ├── database/                # Database configuration
│   │   ├── database.module.ts   # Database module
│   │   ├── database.providers.ts # Database connection providers
│   │   ├── migrations/          # Database migrations
│   │   └── seed.ts             # Database seeding scripts
│   │
│   ├── landlord/               # Landlord management
│   │   ├── landlord.entity.ts   # Landlord database model
│   │   ├── landlord.module.ts   # Landlord module
│   │   ├── landlord.service.ts  # Landlord business logic
│   │   └── LandlordController.ts # Landlord endpoints
│   │
│   ├── leases/                 # Lease management
│   │   ├── lease.controller.ts  # Lease endpoints
│   │   ├── lease.entity.ts      # Lease database model
│   │   ├── lease.service.ts     # Lease business logic
│   │   └── lease.module.ts      # Lease module
│   │
│   ├── notifications/          # Notification system
│   │   ├── notifications.module.ts    # Notification module
│   │   ├── notifications.service.ts   # Notification service
│   │   └── events/           # Event handlers
│   │
│   ├── owner/                # Property owner management
│   │   ├── owner.controller.ts  # Owner endpoints
│   │   ├── owner.service.ts     # Owner business logic
│   │   ├── owner.module.ts      # Owner module
│   │   ├── entities/            # Owner-related entities
│   │   ├── owner-dashboard/     # Owner dashboard data
│   │   └── payments/            # Owner payment management
│   │
│   ├── payments/             # Payment processing
│   │   ├── payment.entity.ts    # Payment database model
│   │   ├── payments.controller.ts # Payment endpoints
│   │   ├── payments.service.ts    # Payment processing logic
│   │   └── payments.module.ts     # Payment module
│   │
│   ├── properties/           # Property management
│   │   ├── properties.controller.ts  # Property endpoints
│   │   ├── properties.service.ts     # Property business logic
│   │   ├── properties.module.ts      # Property module
│   │   ├── dto/              # Property data transfer objects
│   │   └── entities/         # Property database models
│   │
│   ├── reports/              # Report generation
│   │   ├── reports.controller.ts  # Report endpoints
│   │   └── reports.service.ts     # Report generation logic
│   │
│   ├── tenant/               # Tenant management
│   │   ├── tenant.controller.ts   # Tenant endpoints
│   │   ├── tenant.service.ts      # Tenant business logic
│   │   ├── tenant.module.ts       # Tenant module
│   │   ├── entities/              # Tenant database models
│   │   ├── tenant-dashboard/      # Tenant dashboard data
│   │   └── maintenance/           # Tenant maintenance requests
│   │
│   ├── units/                # Unit management
│   │   ├── units.controller.ts    # Unit endpoints
│   │   ├── units.service.ts       # Unit business logic
│   │   ├── units.module.ts        # Unit module
│   │   ├── dto/                   # Unit data transfer objects
│   │   └── entities/              # Unit database models
│   │
│   └── utils/                # Utility functions
│       ├── date.util.ts         # Date manipulation utilities
│       ├── env.ts               # Environment variable helpers
│       └── token.util.ts        # JWT token utilities
│
├── uploads/                  # File upload storage
│   ├── properties/           # Property images & documents
│   ├── units/                # Unit-specific documents
│   └── ownership-proofs/     # Property ownership verification
│
├── test/                     # Test files
├── .env                      # Environment variables
├── .env.example             # Environment variables template
├── docker-compose.yml       # Docker services configuration
├── Dockerfile              # Docker container configuration
├── nest-cli.json           # NestJS CLI configuration
├── package.json            # Dependencies & scripts
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Key Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBAC)
- Multi-role support (Admin, Owner, Landlord, Tenant)
- Password reset with OTP verification
- Email notifications

### Property Management

- Property creation and management
- Unit assignment and tracking
- Amenity management
- Property image uploads
- Ownership verification

### Financial Management

- Payment processing and tracking
- Invoice generation
- Payment history
- Financial reporting

### Communication

- SMS notifications via Geez SMS API
- Email notifications
- Automated alerts for lease expirations
- Payment confirmation notifications

### Reporting & Analytics

- Dashboard analytics
- Financial reports
- Occupancy reports
- Payment tracking reports

## 🛠️ Technology Stack

- **Framework**: NestJS (v9+)
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **File Upload**: Multer
- **SMS**: Geez SMS API
- **Email**: Nodemailer

## 📦 Dependencies

Key dependencies include:

- `@nestjs/core`: Core NestJS framework
- `@nestjs/typeorm`: TypeORM integration
- `@nestjs/jwt`: JWT authentication
- `@nestjs/passport`: Authentication strategies
- `typeorm`: ORM for database operations
- `class-validator`: Input validation
- `class-transformer`: Object transformation
- `multer`: File upload handling
- `nodemailer`: Email service
- `geez-sms`: SMS service integration

## 🚀 Getting Started

### Prerequisites

- Node.js v20+
- PostgreSQL v14+
- Geez SMS API credentials
- Email service credentials

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure database
# Update .env with your database credentials

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

### Environment Variables

```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=akeray_pms

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=7d

# SMS
GEEZ_SMS_API_KEY=your-sms-api-key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password

# File Upload
UPLOAD_PATH=./uploads
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

## 📊 API Documentation

Once the server is running, visit:

- Swagger UI: http://localhost:3000/api
- API Health Check: http://localhost:3000/health

## 🔧 Development Commands

```bash
# Generate new module
nest generate module <module-name>

# Generate new controller
nest generate controller <controller-name>

# Generate new service
nest generate service <service-name>

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📞 Support

For backend-related issues or questions:

- Check the API documentation at `/api`
- Review the logs in the console
- Ensure all environment variables are properly configured
- Verify database connectivity
