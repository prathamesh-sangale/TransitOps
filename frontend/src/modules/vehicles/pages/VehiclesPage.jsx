import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleApi } from '../api/vehicle.api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Search, Plus, Loader2, RefreshCcw, Car } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const navigate = useNavigate();

  const loadVehicles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await vehicleApi.getVehicles({ search, status: statusFilter });
      if (result.success) {
        setVehicles(result.data);
      } else {
        setError('Failed to load vehicles');
      }
    } catch (err) {
      setError('An error occurred while loading vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      loadVehicles();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Vehicles Directory</h1>
          <p className="text-sm text-text-secondary mt-1">Manage fleet registration, status, and details</p>
        </div>
        <Button onClick={() => navigate('/vehicles/new')} className="gap-2">
          <Plus className="w-4 h-4" /> Add Vehicle
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-surface p-4 rounded-lg shadow-sm border border-border-subtle flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input 
            placeholder="Search by ID or Registration..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <div className="w-full sm:w-64">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="IN_SHOP">In Shop</option>
            <option value="RETIRED">Retired</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {isLoading && vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p>Loading fleet data...</p>
        </div>
      ) : error ? (
        <div className="bg-danger/5 border border-danger/20 p-6 rounded-lg text-center max-w-lg mx-auto mt-8">
          <h3 className="text-lg font-bold text-danger mb-2">Error</h3>
          <p className="text-sm text-danger/80 mb-6">{error}</p>
          <Button onClick={loadVehicles} variant="outline" className="gap-2">
            <RefreshCcw className="w-4 h-4" /> Retry
          </Button>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-surface border border-border-subtle p-12 rounded-lg text-center max-w-2xl mx-auto mt-8">
          <div className="bg-surface-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">No Vehicles Found</h3>
          <p className="text-sm text-text-secondary mb-6">There are no vehicles matching your current search or filter criteria.</p>
          {(search || statusFilter !== 'ALL') && (
            <Button onClick={() => { setSearch(''); setStatusFilter('ALL'); }} variant="outline">
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-surface rounded-lg shadow-sm border border-border-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-secondary text-text-secondary font-medium">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Registration</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-text-primary">{vehicle.id}</td>
                    <td className="px-6 py-4 text-text-secondary">{vehicle.registration}</td>
                    <td className="px-6 py-4 text-text-secondary">{vehicle.type}</td>
                    <td className="px-6 py-4 text-text-secondary">{vehicle.location}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={vehicle.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
