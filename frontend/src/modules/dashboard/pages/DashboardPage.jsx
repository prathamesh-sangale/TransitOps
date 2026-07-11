import { useState, useEffect } from 'react';
import { dashboardApi } from '../api/api';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { KpiCard } from '../../../components/ui/KpiCard';
import { Loader2, RefreshCcw, Filter, Car, Route, Wrench, Users } from 'lucide-react';

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterActive, setFilterActive] = useState('ALL'); // 'ALL', 'ACTIVE', 'MAINTENANCE'

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await dashboardApi.getOverview({ filter: filterActive });
      if (result.success) {
        setData(result.data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('An unexpected error occurred while loading data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterActive]);

  if (isLoading && !data) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 space-y-4 text-text-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p>Loading operational dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/5 border border-danger/20 p-6 rounded-lg text-center max-w-lg mx-auto mt-12">
        <h3 className="text-lg font-bold text-danger mb-2">Error Loading Dashboard</h3>
        <p className="text-sm text-danger/80 mb-6">{error}</p>
        <Button onClick={loadData} variant="outline" className="gap-2">
          <RefreshCcw className="w-4 h-4" /> Retry
        </Button>
      </div>
    );
  }

  if (!data || (data.fleetStatus.length === 0 && data.recentActivity.length === 0)) {
    return (
      <div className="bg-surface border border-border-subtle p-12 rounded-lg text-center max-w-2xl mx-auto mt-12">
        <div className="bg-surface-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Filter className="w-8 h-8 text-text-muted" />
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-2">No Operational Data</h3>
        <p className="text-sm text-text-secondary mb-6">There is currently no data available for the selected filters.</p>
        <Button onClick={() => setFilterActive('ALL')} variant="outline">
          Clear Filters
        </Button>
      </div>
    );
  }

  const filteredFleet = filterActive === 'ALL' 
    ? data.fleetStatus 
    : data.fleetStatus.filter(v => v.status === filterActive);

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Operational Overview</h1>
          <p className="text-sm text-text-secondary mt-1">Live platform metrics and status</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={filterActive === 'ALL' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setFilterActive('ALL')}
          >
            All
          </Button>
          <Button 
            variant={filterActive === 'ACTIVE' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setFilterActive('ACTIVE')}
          >
            Active Only
          </Button>
          <Button 
            variant={filterActive === 'MAINTENANCE' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setFilterActive('MAINTENANCE')}
          >
            Maintenance
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Active Vehicles" value={`${data.kpis.activeVehicles}/${data.kpis.totalVehicles}`} icon={Car} trend={2.4} />
        <KpiCard title="Active Trips" value={data.kpis.activeTrips} icon={Route} trend={5.1} />
        <KpiCard title="Available Drivers" value={data.kpis.availableDrivers} icon={Users} trend={-1.2} />
        <KpiCard title="Pending Maintenance" value={data.kpis.pendingMaintenance} icon={Wrench} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Status List */}
        <div className="lg:col-span-2 bg-surface rounded-lg shadow-sm border border-border-subtle overflow-hidden">
          <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-secondary/50">
            <h3 className="font-semibold text-text-primary">Fleet Status</h3>
            <span className="text-xs text-text-secondary">Filtered: {filteredFleet.length} vehicles</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-secondary text-text-secondary font-medium">
                <tr>
                  <th className="px-4 py-3">Vehicle ID</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Location / Route</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredFleet.length > 0 ? (
                  filteredFleet.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-surface-secondary/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-text-primary">{vehicle.id}</td>
                      <td className="px-4 py-3 text-text-secondary">{vehicle.type}</td>
                      <td className="px-4 py-3 text-text-secondary">{vehicle.location}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={vehicle.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-text-secondary">
                      No vehicles found for the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface rounded-lg shadow-sm border border-border-subtle">
          <div className="p-4 border-b border-border-subtle bg-surface-secondary/50">
            <h3 className="font-semibold text-text-primary">Recent Activity</h3>
          </div>
          <div className="p-4 space-y-4">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                <div>
                  <p className="text-sm text-text-primary">{activity.description}</p>
                  <p className="text-xs text-text-muted mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
