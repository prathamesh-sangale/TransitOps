import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { maintenanceApi } from '../api/maintenance.api';
import { ROUTES } from '../../../constants/routes';
import { ArrowLeft, CheckCircle, Clock, Truck, Wrench } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};


export const MaintenanceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isClosing, setIsClosing] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const fetchRecord = async () => {
    try {
      setLoading(true);
      const response = await maintenanceApi.getMaintenanceRecordById(id);
      setRecord(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load maintenance record');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const handleCloseMaintenance = async () => {
    try {
      setIsClosing(true);
      await maintenanceApi.completeMaintenanceRecord(id);
      setShowCloseDialog(false);
      fetchRecord(); // Refresh to show completed state
    } catch (err) {
      console.error(err);
      alert('Failed to close maintenance record.');
    } finally {
      setIsClosing(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-text-secondary">Loading maintenance details...</div>;
  if (error) return (
    <div className="p-8 text-center">
      <div className="text-danger mb-4">{error}</div>
      <button onClick={fetchRecord} className="px-4 py-2 bg-surface text-primary border border-border-strong rounded hover:bg-surface-secondary">
        Retry
      </button>
    </div>
  );
  if (!record) return null;

  const isActive = record.status === 'ACTIVE';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button 
            onClick={() => navigate(ROUTES.MAINTENANCE)}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Maintenance
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">Record {record.id}</h1>
            <StatusBadge status={record.status} />
          </div>
          <p className="text-sm text-text-secondary mt-1">Logged on {formatDate(record.createdAt)}</p>
        </div>

        {isActive && (
          <button
            onClick={() => setShowCloseDialog(true)}
            className="flex items-center gap-2 bg-success text-surface px-4 py-2 rounded-md hover:bg-success/90 transition-colors font-medium text-sm shadow-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Close Maintenance
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface border border-border-subtle rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-4 mb-4">
              <Wrench className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-text-primary">Service Information</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <span className="block text-sm text-text-secondary mb-1">Service Type</span>
                <span className="font-medium text-text-primary">{record.serviceType}</span>
              </div>
              <div>
                <span className="block text-sm text-text-secondary mb-1">Estimated Cost</span>
                <span className="font-medium text-text-primary">{formatCurrency(record.estimatedCost)}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-sm text-text-secondary mb-1">Description</span>
                <p className="text-text-primary text-sm whitespace-pre-wrap bg-surface-secondary p-3 rounded border border-border-subtle">
                  {record.description || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-surface border border-border-subtle rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-4 mb-4">
              <Truck className="w-5 h-5 text-text-secondary" />
              <h2 className="text-sm font-semibold text-text-primary">Vehicle Details</h2>
            </div>
            {record.vehicle ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Registration</span>
                  <Link to={`${ROUTES.VEHICLES}/${record.vehicle.id}`} className="font-medium text-primary hover:underline">
                    {record.vehicle.registration}
                  </Link>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Type</span>
                  <span className="font-medium">{record.vehicle.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Current Status</span>
                  <StatusBadge status={record.vehicle.status} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-secondary">Vehicle details unavailable.</p>
            )}
          </div>

          <div className="bg-surface border border-border-subtle rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-4 mb-4">
              <Clock className="w-5 h-5 text-text-secondary" />
              <h2 className="text-sm font-semibold text-text-primary">Timeline</h2>
            </div>
            <div className="space-y-4 text-sm relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border-strong before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-surface bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border border-border-subtle bg-surface shadow-sm">
                  <div className="font-semibold text-text-primary">Created</div>
                  <div className="text-xs text-text-secondary">{formatDate(record.createdAt)}</div>
                </div>
              </div>
              {record.completedAt && (
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-surface bg-success shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border border-border-subtle bg-surface shadow-sm">
                    <div className="font-semibold text-text-primary">Completed</div>
                    <div className="text-xs text-text-secondary">{formatDate(record.completedAt)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showCloseDialog}
        title="Close Maintenance"
        message="Are you sure you want to mark this maintenance record as completed? This will update the associated vehicle's status back to AVAILABLE."
        confirmLabel="Close Maintenance"
        cancelLabel="Cancel"
        onConfirm={handleCloseMaintenance}
        onCancel={() => setShowCloseDialog(false)}
        isLoading={isClosing}
      />
    </div>
  );
};
