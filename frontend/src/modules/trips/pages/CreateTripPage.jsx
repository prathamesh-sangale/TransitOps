import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripApi } from '../api/trip.api';
import { TripForm } from '../components/TripForm';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const CreateTripPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await tripApi.createTrip(formData);
      if (result.success) {
        navigate(`/trips/${result.data.id}/dispatch`);
      } else {
        setError('Failed to create trip');
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
          onClick={() => navigate(ROUTES.TRIPS)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Create New Trip</h1>
        <p className="text-sm text-text-secondary mt-1">Define route and cargo to prepare for dispatch</p>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-border-subtle p-6">
        {error && (
          <div className="mb-6 p-4 text-sm text-danger bg-danger/10 border border-danger/20 rounded-md">
            {error}
          </div>
        )}
        <TripForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
          onCancel={() => navigate(ROUTES.TRIPS)} 
        />
      </div>
    </div>
  );
};
