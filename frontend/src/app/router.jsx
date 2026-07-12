import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { RoleGuard } from '../components/common/RoleGuard';

import { LoginPage } from '../modules/auth/pages/LoginPage';
import { SessionExpiredPage } from '../modules/auth/pages/SessionExpiredPage';
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage';
import { UnauthorizedPage } from '../modules/error/pages/UnauthorizedPage';
import { NotFoundPage } from '../modules/error/pages/NotFoundPage';

// Vehicle Pages
import { VehiclesPage } from '../modules/vehicles/pages/VehiclesPage';
import { VehicleDetailsPage } from '../modules/vehicles/pages/VehicleDetailsPage';
import { CreateVehiclePage } from '../modules/vehicles/pages/CreateVehiclePage';
import { EditVehiclePage } from '../modules/vehicles/pages/EditVehiclePage';

// Driver Pages
import { DriversPage } from '../modules/drivers/pages/DriversPage';
import { DriverDetailsPage } from '../modules/drivers/pages/DriverDetailsPage';
import { CreateDriverPage } from '../modules/drivers/pages/CreateDriverPage';
import { EditDriverPage } from '../modules/drivers/pages/EditDriverPage';

// Trip Pages
import { TripsPage } from '../modules/trips/pages/TripsPage';
import { CreateTripPage } from '../modules/trips/pages/CreateTripPage';
import { TripDetailsPage } from '../modules/trips/pages/TripDetailsPage';
import { TripDispatcherPage } from '../modules/trips/pages/TripDispatcherPage';

// Analytics & Settings
import { AnalyticsPage } from '../modules/analytics/pages/AnalyticsPage';
import { SettingsPage } from '../modules/settings/pages/SettingsPage';

import { MaintenancePage } from '../modules/maintenance/pages/MaintenancePage';
import { CreateMaintenancePage } from '../modules/maintenance/pages/CreateMaintenancePage';
import { MaintenanceDetailsPage } from '../modules/maintenance/pages/MaintenanceDetailsPage';

import { FinancePage } from '../modules/finance/pages/FinancePage';
import { CreateExpensePage } from '../modules/finance/pages/CreateExpensePage';
import { CreateFuelLogPage } from '../modules/finance/pages/CreateFuelLogPage';
export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <AuthLayout />,
    children: [
      { index: true, element: <LoginPage /> },
    ],
  },
  {
    path: ROUTES.SESSION_EXPIRED,
    element: <AuthLayout />,
    children: [
      { index: true, element: <SessionExpiredPage /> },
    ]
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
      { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
      
      // Vehicles
      { path: ROUTES.VEHICLES, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER']}><VehiclesPage /></RoleGuard> },
      { path: `${ROUTES.VEHICLES}/new`, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER']}><CreateVehiclePage /></RoleGuard> },
      { path: `${ROUTES.VEHICLES}/:id`, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER']}><VehicleDetailsPage /></RoleGuard> },
      { path: `${ROUTES.VEHICLES}/:id/edit`, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER']}><EditVehiclePage /></RoleGuard> },
      
      // Drivers
      { path: ROUTES.DRIVERS, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER']}><DriversPage /></RoleGuard> },
      { path: `${ROUTES.DRIVERS}/new`, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER']}><CreateDriverPage /></RoleGuard> },
      { path: `${ROUTES.DRIVERS}/:id`, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER']}><DriverDetailsPage /></RoleGuard> },
      { path: `${ROUTES.DRIVERS}/:id/edit`, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER']}><EditDriverPage /></RoleGuard> },

      // Trips
      { path: ROUTES.TRIPS, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'DISPATCHER']}><TripsPage /></RoleGuard> },
      { path: `${ROUTES.TRIPS}/new`, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'DISPATCHER']}><CreateTripPage /></RoleGuard> },
      { path: `${ROUTES.TRIPS}/:id`, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'DISPATCHER']}><TripDetailsPage /></RoleGuard> },
      { path: `${ROUTES.TRIPS}/:id/dispatch`, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'DISPATCHER']}><TripDispatcherPage /></RoleGuard> },

      { path: ROUTES.MAINTENANCE, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'SAFETY_OFFICER']}><MaintenancePage /></RoleGuard> },
      { path: `${ROUTES.MAINTENANCE}/new`, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'SAFETY_OFFICER']}><CreateMaintenancePage /></RoleGuard> },
      { path: `${ROUTES.MAINTENANCE}/:id`, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'SAFETY_OFFICER']}><MaintenanceDetailsPage /></RoleGuard> },
      { path: ROUTES.FINANCE, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'FINANCIAL_ANALYST']}><FinancePage /></RoleGuard> },
      { path: `${ROUTES.FINANCE}/expenses/new`, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'FINANCIAL_ANALYST']}><CreateExpensePage /></RoleGuard> },
      { path: `${ROUTES.FINANCE}/fuel/new`, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'FINANCIAL_ANALYST']}><CreateFuelLogPage /></RoleGuard> },
      { path: ROUTES.ANALYTICS, element: <RoleGuard allowedRoles={['FLEET_MANAGER', 'FINANCIAL_ANALYST']}><AnalyticsPage /></RoleGuard> },
      { path: ROUTES.SETTINGS, element: <RoleGuard allowedRoles={['FLEET_MANAGER']}><SettingsPage /></RoleGuard> },
    ],
  },
  { 
    path: ROUTES.UNAUTHORIZED, 
    element: <AppLayout />,
    children: [
      { index: true, element: <UnauthorizedPage /> }
    ]
  },
  { 
    path: '*', 
    element: <AppLayout />,
    children: [
      { index: true, element: <NotFoundPage /> }
    ]
  },
]);
