import { useState, useEffect } from 'react';
import { driverApi } from '../../drivers/api/driver.api';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { LicenseStatus } from '../../drivers/components/LicenseStatus';
import { Loader2, User } from 'lucide-react';

export const DriverSelector = ({ selectedDriverId, onSelect }) => {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const result = await driverApi.getDrivers();
        if (result.success) {
          setDrivers(result.data);
        }
      } catch (err) {
        console.error('Failed to load drivers', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDrivers();
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
        {drivers.map((driver) => (
          <button
            key={driver.id}
            type="button"
            onClick={() => onSelect(driver)}
            className={`flex items-center justify-between p-3 border rounded-lg transition-colors text-left ${
              selectedDriverId === driver.id
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border-subtle hover:border-border-strong bg-surface'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-surface-secondary p-2 rounded-md flex-shrink-0">
                <User className="w-5 h-5 text-text-muted" />
              </div>
              <div>
                <p className="font-medium text-text-primary text-sm">{driver.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-text-secondary">{driver.licenseNumber}</span>
                  <LicenseStatus expiryDate={driver.licenseExpiry} />
                </div>
              </div>
            </div>
            <StatusBadge status={driver.status} />
          </button>
        ))}
        {drivers.length === 0 && (
          <p className="text-sm text-text-muted text-center py-4">No drivers available.</p>
        )}
      </div>
    </div>
  );
};
