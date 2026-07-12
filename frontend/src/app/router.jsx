import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Placeholder Pages
const DashboardPlaceholder = () => <div className="p-6">Dashboard Module</div>;
const LoginPlaceholder = () => <div className="p-6">Login Module</div>;
const VehiclesPlaceholder = () => <div className="p-6">Vehicles Module</div>;
const DriversPlaceholder = () => <div className="p-6">Drivers Module</div>;
const TripsPlaceholder = () => <div className="p-6">Trips Module</div>;
const MaintenancePlaceholder = () => <div className="p-6">Maintenance Module</div>;
const FinancePlaceholder = () => <div className="p-6">Finance Module</div>;
const AnalyticsPlaceholder = () => <div className="p-6">Analytics Module</div>;
const SettingsPlaceholder = () => <div className="p-6">Settings Module</div>;
const NotFoundPlaceholder = () => <div className="p-6">404 - Not Found</div>;
const UnauthorizedPlaceholder = () => <div className="p-6">403 - Unauthorized</div>;

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <AuthLayout />,
    children: [
      { index: true, element: <LoginPlaceholder /> },
    ],
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
      { path: ROUTES.DASHBOARD, element: <DashboardPlaceholder /> },
      { path: ROUTES.VEHICLES, element: <VehiclesPlaceholder /> },
      { path: ROUTES.DRIVERS, element: <DriversPlaceholder /> },
      { path: ROUTES.TRIPS, element: <TripsPlaceholder /> },
      { path: ROUTES.MAINTENANCE, element: <MaintenancePlaceholder /> },
      { path: ROUTES.FINANCE, element: <FinancePlaceholder /> },
      { path: ROUTES.ANALYTICS, element: <AnalyticsPlaceholder /> },
      { path: ROUTES.SETTINGS, element: <SettingsPlaceholder /> },
    ],
  },
  { path: '/unauthorized', element: <UnauthorizedPlaceholder /> },
  { path: '*', element: <NotFoundPlaceholder /> },
]);
