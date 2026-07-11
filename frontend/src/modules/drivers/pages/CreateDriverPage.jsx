import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverApi } from '../api/driver.api';
import { DriverForm } from '../components/DriverForm';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const CreateDriverPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await driverApi.createDriver(formData);
      if (result.success) {
        navigate(`/drivers/${result.data.id}`);
      } else {
        setError('Failed to create driver');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during creation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <button 
          onClick={() => navigate(ROUTES.DRIVERS)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Register New Driver</h1>
        <p className="text-sm text-text-secondary mt-1">Add a new driver to the TransitOps personnel</p>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-border-subtle p-6">
        {error && (
          <div className="mb-6 p-4 text-sm text-danger bg-danger/10 border border-danger/20 rounded-md">
            {error}
          </div>
        )}
        <DriverForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
          onCancel={() => navigate(ROUTES.DRIVERS)} 
        />
      </div>
    </div>
  );
};
