import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { vehicleApi } from '../api/vehicle.api';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Loader2, ArrowLeft, Edit, AlertCircle, Wrench, Route } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const VehicleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isRetireDialogOpen, setIsRetireDialogOpen] = useState(false);
  const [isRetiring, setIsRetiring] = useState(false);

  const loadVehicle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await vehicleApi.getVehicleById(id);
      if (result.success) {
        setVehicle(result.data);
      } else {
        setError('Failed to load vehicle details');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading vehicle details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadVehicle();
    }
  }, [id]);

  const handleRetire = async () => {
    setIsRetiring(true);
    try {
      const result = await vehicleApi.retireVehicle(id);
      if (result.success) {
        setVehicle(result.data);
        setIsRetireDialogOpen(false);
      }
    } catch (err) {
      alert('Failed to retire vehicle: ' + err.message);
    } finally {
      setIsRetiring(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p>Loading vehicle details...</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="bg-danger/5 border border-danger/20 p-6 rounded-lg text-center max-w-lg mx-auto mt-8">
        <h3 className="text-lg font-bold text-danger mb-2">Error</h3>
        <p className="text-sm text-danger/80 mb-6">{error || 'Vehicle not found'}</p>
        <Button onClick={() => navigate(ROUTES.VEHICLES)} variant="outline">
          Return to Vehicles
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button 
            onClick={() => navigate(ROUTES.VEHICLES)}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">{vehicle.id}</h1>
            <StatusBadge status={vehicle.status} />
          </div>
          <p className="text-sm text-text-secondary mt-1">{vehicle.registration} • {vehicle.type}</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {vehicle.status !== 'RETIRED' && user?.role === 'FLEET_MANAGER' && (
            <>
              <Button 
                variant="outline" 
                onClick={() => navigate(`/vehicles/${id}/edit`)}
                className="flex-1 sm:flex-none gap-2"
              >
                <Edit className="w-4 h-4" /> Edit
              </Button>
              <Button 
                variant="danger" 
                onClick={() => setIsRetireDialogOpen(true)}
                className="flex-1 sm:flex-none gap-2"
              >
                <AlertCircle className="w-4 h-4" /> Retire
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface rounded-lg shadow-sm border border-border-subtle p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border-subtle pb-2">Operational Information</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-text-secondary">Load Capacity</dt>
                <dd className="mt-1 text-sm text-text-primary font-medium">{vehicle.capacity}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-text-secondary">Current Odometer</dt>
                <dd className="mt-1 text-sm text-text-primary font-medium">{vehicle.odometer} km</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-text-secondary">Current Location</dt>
                <dd className="mt-1 text-sm text-text-primary font-medium">{vehicle.location}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-surface rounded-lg shadow-sm border border-border-subtle p-6">
            <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">Quick Actions</h3>
            <div className="space-y-3">
              {['FLEET_MANAGER', 'DISPATCHER'].includes(user?.role) && (
                <Button variant="outline" className="w-full justify-start gap-2" disabled={vehicle.status === 'RETIRED'} onClick={() => navigate(ROUTES.TRIPS)}>
                  <Route className="w-4 h-4" /> View Trip History
                </Button>
              )}
              {['FLEET_MANAGER', 'SAFETY_OFFICER'].includes(user?.role) && (
                <Button variant="outline" className="w-full justify-start gap-2" disabled={vehicle.status === 'RETIRED'} onClick={() => navigate(ROUTES.MAINTENANCE)}>
                  <Wrench className="w-4 h-4" /> View Maintenance
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isRetireDialogOpen}
        title="Retire Vehicle"
        message={`Are you sure you want to retire vehicle ${vehicle.id} (${vehicle.registration})? This action will permanently remove it from active operations.`}
        confirmLabel="Yes, Retire Vehicle"
        onConfirm={handleRetire}
        onCancel={() => setIsRetireDialogOpen(false)}
        isLoading={isRetiring}
        variant="danger"
      />
    </div>
  );
};
