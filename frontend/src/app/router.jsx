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

// Placeholder Pages for future phases
const VehiclesPlaceholder = () => <div className="p-6">Vehicles Module</div>;
const DriversPlaceholder = () => <div className="p-6">Drivers Module</div>;
const TripsPlaceholder = () => <div className="p-6">Trips Module</div>;
const MaintenancePlaceholder = () => <div className="p-6">Maintenance Module</div>;
const FinancePlaceholder = () => <div className="p-6">Finance Module</div>;
const AnalyticsPlaceholder = () => <div className="p-6">Analytics Module</div>;
const SettingsPlaceholder = () => <div className="p-6">Settings Module</div>;

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
      { path: ROUTES.VEHICLES, element: <VehiclesPlaceholder /> },
      { path: ROUTES.DRIVERS, element: <DriversPlaceholder /> },
      { path: ROUTES.TRIPS, element: <TripsPlaceholder /> },
      { path: ROUTES.MAINTENANCE, element: <MaintenancePlaceholder /> },
      { path: ROUTES.FINANCE, element: <FinancePlaceholder /> },
      { path: ROUTES.ANALYTICS, element: <AnalyticsPlaceholder /> },
      { path: ROUTES.SETTINGS, element: <SettingsPlaceholder /> },
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
