# TransitOps

Smart Transport Operations Platform

## Overview
TransitOps is a centralized platform that allows organizations to manage the complete lifecycle of their transport operations—from vehicle registration and driver management to dispatching, maintenance, fuel logging, and analytics.

## Core Modules
- Dashboard
- Vehicles
- Drivers
- Trips
- Maintenance
- Fuel & Expenses
- Analytics
- Settings

## Technology Stack
- **Frontend**: React, Vite, Tailwind CSS, React Router, Axios, Lucide React, Recharts
- **Backend**: Node.js, Express.js, PostgreSQL (pg), Zod
- **Database**: Supabase-hosted PostgreSQL
- **Authentication**: Custom JWT/bcrypt based on Express

## Repository Architecture
This is a modular monorepo containing:
- `frontend/`: The React application
- `backend/`: The Express REST APIs and authentication services
- `database/`: Database schema, migrations, and seeds
- `docs/`: Technical documentation and guidelines

## Development Branches
The project is developed across separate branches:
- `frontend`: Owns UI and responsive implementation
- `backend`: Owns business logic and APIs
- `auth`: Owns authentication and RBAC
- `database`: Owns database schema

## Local Setup
1. Clone the repository
2. Install frontend dependencies: `cd frontend && npm install`
3. Install backend dependencies: `cd backend && npm install`

## Environment Configuration
- Copy `frontend/.env.example` to `frontend/.env`
- Copy `backend/.env.example` to `backend/.env`

## Development Scripts
From the root directory:
- `npm run dev:frontend` - Starts the frontend development server
- `npm run dev:backend` - Starts the backend development server
- `npm run build:frontend` - Builds the frontend for production

## Engineering Architecture
- Controllers remain thin; business logic belongs in services.
- Repositories own database queries.
- Authentication is handled via Express middleware, not Supabase Auth.
- Frontend pages communicate strictly via the Express API (no direct DB access).

## Responsive Requirement
The application must remain fully functional and readable across breakpoints: 1440px, 1024px, 768px, and 390px. 

## Contribution Workflow
Please follow branch ownership boundaries. Ensure that tests and builds pass before submitting pull requests. Refer to the Pull Request Template for the checklist.
