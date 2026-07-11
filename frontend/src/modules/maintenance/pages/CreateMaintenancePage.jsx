import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { maintenanceApi } from '../api/maintenance.api';
import { MaintenanceForm } from '../components/MaintenanceForm';
import { ArrowLeft } from 'lucide-react';

export const CreateMaintenancePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await maintenanceApi.createMaintenanceRecord(formData);
      navigate(ROUTES.MAINTENANCE);
    } catch (err) {
      setError(err.message || 'Failed to create maintenance record');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button 
          onClick={() => navigate(ROUTES.MAINTENANCE)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Maintenance
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Log Maintenance</h1>
        <p className="text-sm text-text-secondary mt-1">Record a new vehicle service or repair.</p>
      </div>

      {error && (
        <div className="bg-danger/10 text-danger px-4 py-3 rounded-md border border-danger/20 text-sm">
          {error}
        </div>
      )}

      <MaintenanceForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
