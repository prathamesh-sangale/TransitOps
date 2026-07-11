import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripApi } from '../api/trip.api';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Loader2, ArrowLeft, CheckCircle, XCircle, FileText, Truck, User } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const loadTrip = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await tripApi.getTripById(id);
      if (result.success) {
        setTrip(result.data);
      } else {
        setError('Failed to load trip details');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading trip details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadTrip();
    }
  }, [id]);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const result = await tripApi.completeTrip(id);
      if (result.success) {
        setTrip(prev => ({ ...prev, status: 'COMPLETED' }));
        setIsCompleteDialogOpen(false);
      }
    } catch (err) {
      alert('Failed to complete trip: ' + err.message);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const result = await tripApi.cancelTrip(id);
      if (result.success) {
        setTrip(prev => ({ ...prev, status: 'CANCELLED' }));
        setIsCancelDialogOpen(false);
      }
    } catch (err) {
      alert('Failed to cancel trip: ' + err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p>Loading trip details...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="bg-danger/5 border border-danger/20 p-6 rounded-lg text-center max-w-lg mx-auto mt-8">
        <h3 className="text-lg font-bold text-danger mb-2">Error</h3>
        <p className="text-sm text-danger/80 mb-6">{error || 'Trip not found'}</p>
        <Button onClick={() => navigate(ROUTES.TRIPS)} variant="outline">
          Return to Trips
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button 
            onClick={() => navigate(ROUTES.TRIPS)}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">{trip.id}</h1>
            <StatusBadge status={trip.status} />
          </div>
          <p className="text-sm text-text-secondary mt-1">{trip.origin} to {trip.destination}</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {trip.status === 'DRAFT' && (
            <Button 
              onClick={() => navigate(`/trips/${id}/dispatch`)}
              className="flex-1 sm:flex-none"
            >
              Dispatch Trip
            </Button>
          )}
          {trip.status === 'DISPATCHED' && (
            <Button 
              variant="outline" 
              onClick={() => setIsCompleteDialogOpen(true)}
              className="flex-1 sm:flex-none gap-2"
            >
              <CheckCircle className="w-4 h-4 text-success" /> Complete
            </Button>
          )}
          {(trip.status === 'DRAFT' || trip.status === 'DISPATCHED') && (
            <Button 
              variant="danger" 
              onClick={() => setIsCancelDialogOpen(true)}
              className="flex-1 sm:flex-none gap-2"
            >
              <XCircle className="w-4 h-4" /> Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface rounded-lg shadow-sm border border-border-subtle p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border-subtle pb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-text-muted" /> Trip Information
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-text-secondary">Origin</dt>
                <dd className="mt-1 text-sm text-text-primary">{trip.origin}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-text-secondary">Destination</dt>
                <dd className="mt-1 text-sm text-text-primary">{trip.destination}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-text-secondary">Cargo</dt>
                <dd className="mt-1 text-sm text-text-primary">{trip.cargoDescription}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-text-secondary">Weight</dt>
                <dd className="mt-1 text-sm text-text-primary">{trip.cargoWeight} kg</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-text-secondary">Planned Distance</dt>
                <dd className="mt-1 text-sm text-text-primary">{trip.plannedDistance} km</dd>
              </div>
              {trip.dispatchedAt && (
                <div>
                  <dt className="text-sm font-medium text-text-secondary">Dispatched At</dt>
                  <dd className="mt-1 text-sm text-text-primary">
                    {new Date(trip.dispatchedAt).toLocaleString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          {trip.status !== 'DRAFT' && (
            <>
              <div className="bg-surface rounded-lg shadow-sm border border-border-subtle p-6">
                <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Assigned Vehicle
                </h3>
                {trip.vehicle ? (
                  <div>
                    <p className="font-medium text-text-primary">{trip.vehicle.registration}</p>
                    <p className="text-sm text-text-secondary">{trip.vehicle.type}</p>
                  </div>
                ) : (
                  <p className="text-sm text-text-muted">No vehicle assigned</p>
                )}
              </div>
              
              <div className="bg-surface rounded-lg shadow-sm border border-border-subtle p-6">
                <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4" /> Assigned Driver
                </h3>
                {trip.driver ? (
                  <div>
                    <p className="font-medium text-text-primary">{trip.driver.name}</p>
                    <p className="text-sm text-text-secondary">{trip.driver.licenseNumber}</p>
                  </div>
                ) : (
                  <p className="text-sm text-text-muted">No driver assigned</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isCompleteDialogOpen}
        title="Complete Trip"
        message={`Are you sure you want to mark trip ${trip.id} as completed? This will release the vehicle and driver back to AVAILABLE status.`}
        confirmLabel="Complete Trip"
        onConfirm={handleComplete}
        onCancel={() => setIsCompleteDialogOpen(false)}
        isLoading={isCompleting}
        variant="primary"
      />

      <ConfirmDialog
        isOpen={isCancelDialogOpen}
        title="Cancel Trip"
        message={`Are you sure you want to cancel trip ${trip.id}? This action cannot be undone.`}
        confirmLabel="Yes, Cancel Trip"
        onConfirm={handleCancel}
        onCancel={() => setIsCancelDialogOpen(false)}
        isLoading={isCancelling}
        variant="danger"
      />
    </div>
  );
};
