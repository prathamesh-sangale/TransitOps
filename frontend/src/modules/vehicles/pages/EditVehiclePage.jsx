import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleApi } from '../api/vehicle.api';
import { VehicleForm } from '../components/VehicleForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const EditVehiclePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const result = await vehicleApi.getVehicleById(id);
        if (result.success) {
          setVehicle(result.data);
        } else {
          setError('Failed to load vehicle for editing');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while loading');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchVehicle();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await vehicleApi.updateVehicle(id, formData);
      if (result.success) {
        navigate(`/vehicles/${id}`);
      } else {
        setError('Failed to update vehicle');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during update');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p>Loading vehicle data...</p>
      </div>
    );
  }

  if (error && !vehicle) {
    return (
      <div className="bg-danger/5 border border-danger/20 p-6 rounded-lg text-center max-w-lg mx-auto mt-8 text-danger">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <button 
          onClick={() => navigate(`/vehicles/${id}`)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Details
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Edit Vehicle: {id}</h1>
        <p className="text-sm text-text-secondary mt-1">Update operational details for {vehicle.registration}</p>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-border-subtle p-6">
        {error && (
          <div className="mb-6 p-4 text-sm text-danger bg-danger/10 border border-danger/20 rounded-md">
            {error}
          </div>
        )}
        <VehicleForm 
          initialData={vehicle}
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
          onCancel={() => navigate(`/vehicles/${id}`)} 
        />
      </div>
    </div>
  );
};
