import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripApi } from '../api/trip.api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Search, Plus, Loader2, RefreshCcw, Map } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const navigate = useNavigate();

  const loadTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await tripApi.getTrips({ search, status: statusFilter });
      if (result.success) {
        setTrips(result.data);
      } else {
        setError('Failed to load trips');
      }
    } catch (err) {
      setError('An error occurred while loading trips');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTrips();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Trips Directory</h1>
          <p className="text-sm text-text-secondary mt-1">Manage dispatch operations and trip lifecycle</p>
        </div>
        <Button onClick={() => navigate('/trips/new')} className="gap-2">
          <Plus className="w-4 h-4" /> Create Trip
        </Button>
      </div>

      <div className="bg-surface p-4 rounded-lg shadow-sm border border-border-subtle flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input 
            placeholder="Search by ID, Origin, or Destination..." 
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
            <option value="DRAFT">Draft</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {isLoading && trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p>Loading trip data...</p>
        </div>
      ) : error ? (
        <div className="bg-danger/5 border border-danger/20 p-6 rounded-lg text-center max-w-lg mx-auto mt-8">
          <h3 className="text-lg font-bold text-danger mb-2">Error</h3>
          <p className="text-sm text-danger/80 mb-6">{error}</p>
          <Button onClick={loadTrips} variant="outline" className="gap-2">
            <RefreshCcw className="w-4 h-4" /> Retry
          </Button>
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-surface border border-border-subtle p-12 rounded-lg text-center max-w-2xl mx-auto mt-8">
          <div className="bg-surface-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Map className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">No Trips Found</h3>
          <p className="text-sm text-text-secondary mb-6">There are no trips matching your current search or filter criteria.</p>
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
                  <th className="px-6 py-4">Trip ID</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Driver</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-text-primary">{trip.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-text-primary">{trip.origin}</span>
                        <span className="text-text-muted text-xs">to {trip.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{trip.vehicle?.registration || '—'}</td>
                    <td className="px-6 py-4 text-text-secondary">{trip.driver?.name || '—'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={trip.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {trip.status === 'DRAFT' ? (
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/trips/${trip.id}/dispatch`)}
                        >
                          Dispatch
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigate(`/trips/${trip.id}`)}
                        >
                          View Details
                        </Button>
                      )}
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
