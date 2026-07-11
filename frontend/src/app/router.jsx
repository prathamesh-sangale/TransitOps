import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

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

// Placeholder Pages for future phases
const MaintenancePlaceholder = () => <div className="p-6">Maintenance Module</div>;
const FinancePlaceholder = () => <div className="p-6">Finance Module</div>;

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
      { path: ROUTES.VEHICLES, element: <VehiclesPage /> },
      { path: `${ROUTES.VEHICLES}/new`, element: <CreateVehiclePage /> },
      { path: `${ROUTES.VEHICLES}/:id`, element: <VehicleDetailsPage /> },
      { path: `${ROUTES.VEHICLES}/:id/edit`, element: <EditVehiclePage /> },
      
      // Drivers
      { path: ROUTES.DRIVERS, element: <DriversPage /> },
      { path: `${ROUTES.DRIVERS}/new`, element: <CreateDriverPage /> },
      { path: `${ROUTES.DRIVERS}/:id`, element: <DriverDetailsPage /> },
      { path: `${ROUTES.DRIVERS}/:id/edit`, element: <EditDriverPage /> },

      // Trips
      { path: ROUTES.TRIPS, element: <TripsPage /> },
      { path: `${ROUTES.TRIPS}/new`, element: <CreateTripPage /> },
      { path: `${ROUTES.TRIPS}/:id`, element: <TripDetailsPage /> },
      { path: `${ROUTES.TRIPS}/:id/dispatch`, element: <TripDispatcherPage /> },

      { path: ROUTES.MAINTENANCE, element: <MaintenancePlaceholder /> },
      { path: ROUTES.FINANCE, element: <FinancePlaceholder /> },
      { path: ROUTES.ANALYTICS, element: <AnalyticsPage /> },
      { path: ROUTES.SETTINGS, element: <SettingsPage /> },
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
