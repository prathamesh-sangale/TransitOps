import { useState, useEffect } from 'react';
import { vehicleApi } from '../../vehicles/api/vehicle.api';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Loader2, Car } from 'lucide-react';

export const VehicleSelector = ({ selectedVehicleId, onSelect }) => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const result = await vehicleApi.getVehicles();
        if (result.success) {
          setVehicles(result.data);
        }
      } catch (err) {
        console.error('Failed to load vehicles', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2">
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.id}
            type="button"
            onClick={() => onSelect(vehicle)}
            className={`flex items-center justify-between p-3 border rounded-lg transition-colors text-left ${
              selectedVehicleId === vehicle.id
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border-subtle hover:border-border-strong bg-surface'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-surface-secondary p-2 rounded-md">
                <Car className="w-5 h-5 text-text-muted" />
              </div>
              <div>
                <p className="font-medium text-text-primary text-sm">{vehicle.registration}</p>
                <p className="text-xs text-text-secondary">Cap: {vehicle.capacity}kg • {vehicle.type}</p>
              </div>
            </div>
            <StatusBadge status={vehicle.status} />
          </button>
        ))}
        {vehicles.length === 0 && (
          <p className="text-sm text-text-muted text-center py-4">No vehicles available.</p>
        )}
      </div>
    </div>
  );
};
