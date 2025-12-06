# Vehicle Rental System

**Live Deployment:** https://apollo-level2-web-dev-b6-a2.vercel.app/api/v1/

## 🎯 Project Overview

A backend API for a vehicle rental management system that handles:
- **Vehicles** - Manage vehicle inventory with availability tracking
- **Customers** - Manage customer accounts and profiles
- **Bookings** - Handle vehicle rentals, returns and cost calculation
- **Authentication** - Secure role-based access control (Admin and Customer roles)

## 🛠️ Technology Stack

- **Node.js** + **TypeScript**
- **Express.js** (web framework)
- **PostgreSQL** (database)
- **bcrypt** (password hashing)
- **jsonwebtoken** (JWT authentication)

## 🎯 Features

### 🔐 Authentication & Roles
- JWT-based signin
- Password hashing with bcrypt
- Role based autorization
    - `Admin` -> Full access
    - `Customer` -> Can register, browse vehicles and can manage their own bookings

### 🚙 Vehicle Management
- `Add`, `Update`, `Delete` vehicles (Admin only)
- Public endpoints for browsing single or all vehicles

### 👤 User Management
- `Browse`, `Update`, `Delete` users (Admin only)
- Customers can manage their own profile
- Safe deletaion (Users cannot be deleted if they have active bookings)

### 🗓️ Booking Management
- Create bookings with vehicle availability validation
- Auto Update vehicle status (booked/available)
- Browse all bookings (Admin only)
- Customers can brose their own bookings
- Cancel or Return bookings based on role and rules

## 🛠️ Setup & Usage Instructions

### 1. Install dependencies
```
npm install
```
### 2. Configure environment (see [.env.example](.env.example) for reference)

### 3. Start the dev server
```
npm run dev
```
### 4. Running
To use the development version of the API, you can use [Postman](https://www.postman.com) or [Thunder](https://www.thunderclient.com/) VS Code Extension

### 5. Building
When finished developing the API, you can run
```
npm run build
```
And run it in production by running
```
npm start
```
### 6. Deployment
There are some free serverless cloud platforms where you can deploy your API, like Vercel, Netlify and even Cloudflare!
