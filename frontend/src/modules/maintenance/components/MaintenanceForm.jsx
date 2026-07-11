import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleApi } from '../../vehicles/api/vehicle.api';
import { Wrench } from 'lucide-react';

export const MaintenanceForm = ({ initialData, onSubmit, isSubmitting }) => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  
  const [formData, setFormData] = useState({
    vehicleId: initialData?.vehicleId || '',
    serviceType: initialData?.serviceType || '',
    description: initialData?.description || '',
    estimatedCost: initialData?.estimatedCost || '',
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await vehicleApi.getVehicles();
        // Allow creating maintenance for vehicles that are not RETIRED.
        // Even if ON_TRIP, sometimes people log future maintenance (though ideally AVAILABLE)
        // For simplicity, we just exclude RETIRED.
        setVehicles(response.data.filter(v => v.status !== 'RETIRED'));
      } catch (err) {
        console.error('Failed to load vehicles', err);
      }
    };
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-lg border border-border-subtle p-6 shadow-sm space-y-6">
      
      <div className="flex items-center gap-2 border-b border-border-subtle pb-4 mb-4">
        <Wrench className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Maintenance Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-secondary">
            Vehicle <span className="text-danger">*</span>
          </label>
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-border-strong rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={!!initialData?.vehicleId}
          >
            <option value="">Select a vehicle</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.registration} ({v.type})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-secondary">
            Service Type <span className="text-danger">*</span>
          </label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-border-strong rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Select type</option>
            <option value="Routine Inspection">Routine Inspection</option>
            <option value="Engine Repair">Engine Repair</option>
            <option value="Tire Replacement">Tire Replacement</option>
            <option value="Brake Service">Brake Service</option>
            <option value="Oil Change">Oil Change</option>
            <option value="Body Work">Body Work</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-text-secondary">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-border-strong rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Describe the issues or work needed..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-secondary">
            Estimated Cost ($) <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            name="estimatedCost"
            value={formData.estimatedCost}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-border-strong rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="e.g. 500"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-border-subtle">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-secondary border border-border-strong rounded-md transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-surface bg-primary hover:bg-primary-hover rounded-md transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Record')}
        </button>
      </div>
    </form>
  );
};
