import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { driverApi } from '../api/driver.api';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { LicenseStatus } from '../components/LicenseStatus';
import { Loader2, ArrowLeft, Edit, AlertCircle, ShieldAlert, Route } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const DriverDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [driver, setDriver] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);

  const loadDriver = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await driverApi.getDriverById(id);
      if (result.success) {
        setDriver(result.data);
      } else {
        setError('Failed to load driver details');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading driver details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadDriver();
    }
  }, [id]);

  const handleSuspend = async () => {
    setIsSuspending(true);
    try {
      const result = await driverApi.suspendDriver(id);
      if (result.success) {
        setDriver(result.data);
        setIsSuspendDialogOpen(false);
      }
    } catch (err) {
      alert('Failed to suspend driver: ' + err.message);
    } finally {
      setIsSuspending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p>Loading driver details...</p>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="bg-danger/5 border border-danger/20 p-6 rounded-lg text-center max-w-lg mx-auto mt-8">
        <h3 className="text-lg font-bold text-danger mb-2">Error</h3>
        <p className="text-sm text-danger/80 mb-6">{error || 'Driver not found'}</p>
        <Button onClick={() => navigate(ROUTES.DRIVERS)} variant="outline">
          Return to Drivers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button 
            onClick={() => navigate(ROUTES.DRIVERS)}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">{driver.name}</h1>
            <StatusBadge status={driver.status} />
          </div>
          <p className="text-sm text-text-secondary mt-1">ID: {driver.id}</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/drivers/${id}/edit`)}
            className="flex-1 sm:flex-none gap-2"
          >
            <Edit className="w-4 h-4" /> Edit
          </Button>
          {driver.status !== 'SUSPENDED' && (
            <Button 
              variant="danger" 
              onClick={() => setIsSuspendDialogOpen(true)}
              className="flex-1 sm:flex-none gap-2"
            >
              <AlertCircle className="w-4 h-4" /> Suspend
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface rounded-lg shadow-sm border border-border-subtle p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border-subtle pb-2">Driver Information</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-text-secondary">License Number</dt>
                <dd className="mt-1 text-sm text-text-primary font-medium">{driver.licenseNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-text-secondary">License Condition</dt>
                <dd className="mt-1">
                  <LicenseStatus expiryDate={driver.licenseExpiry} />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-text-secondary">License Expiry Date</dt>
                <dd className="mt-1 text-sm text-text-primary font-medium">{driver.licenseExpiry}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-text-secondary">Safety Score</dt>
                <dd className={`mt-1 text-xl font-bold ${driver.safetyScore >= 90 ? 'text-success' : driver.safetyScore >= 75 ? 'text-warning' : 'text-danger'}`}>
                  {driver.safetyScore}<span className="text-sm font-medium text-text-secondary">/100</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface rounded-lg shadow-sm border border-border-subtle p-6">
            <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2" disabled={driver.status === 'SUSPENDED'}>
                <Route className="w-4 h-4" /> View Trip History
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" disabled={driver.status === 'SUSPENDED'}>
                <ShieldAlert className="w-4 h-4" /> Report Incident
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isSuspendDialogOpen}
        title="Suspend Driver"
        message={`Are you sure you want to suspend ${driver.name} (${driver.id})? They will not be able to be dispatched until the suspension is lifted.`}
        confirmLabel="Yes, Suspend Driver"
        onConfirm={handleSuspend}
        onCancel={() => setIsSuspendDialogOpen(false)}
        isLoading={isSuspending}
        variant="danger"
      />
    </div>
  );
};
