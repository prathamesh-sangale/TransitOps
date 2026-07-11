import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Wrench, Search, Filter } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { maintenanceApi } from '../api/maintenance.api';
import { StatusBadge } from '../../../components/ui/StatusBadge';

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};


export const MaintenancePage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const filters = filterStatus ? { status: filterStatus } : {};
      const response = await maintenanceApi.getMaintenanceRecords(filters);
      setRecords(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load maintenance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [filterStatus]);

  if (loading && records.length === 0) return <div className="p-8 text-center text-text-secondary">Loading maintenance records...</div>;
  if (error) return (
    <div className="p-8 text-center">
      <div className="text-danger mb-4">{error}</div>
      <button onClick={fetchRecords} className="px-4 py-2 bg-surface text-primary border border-border-strong rounded hover:bg-surface-secondary">
        Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Maintenance</h1>
          <p className="text-sm text-text-secondary mt-1">Manage fleet repairs and service logs</p>
        </div>
        <Link
          to={`${ROUTES.MAINTENANCE}/new`}
          className="flex items-center gap-2 bg-primary text-surface px-4 py-2 rounded-md hover:bg-primary-hover transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Log Maintenance
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-surface p-4 rounded-lg border border-border-subtle flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text"
            placeholder="Search records..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-border-strong rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-border-strong rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {records.length === 0 ? (
        <div className="bg-surface p-12 rounded-lg border border-border-subtle text-center">
          <Wrench className="w-12 h-12 mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No maintenance records found</h3>
          <p className="text-text-secondary mb-6">There are currently no maintenance records matching your filters.</p>
          <button onClick={() => window.location.href = `${ROUTES.MAINTENANCE}/new`} className="px-4 py-2 bg-primary text-surface rounded hover:bg-primary-hover">
            Log Maintenance
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-border-subtle rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface-secondary text-text-secondary">
                <tr>
                  <th className="px-4 py-3 font-medium">Record ID</th>
                  <th className="px-4 py-3 font-medium">Vehicle ID</th>
                  <th className="px-4 py-3 font-medium">Service Type</th>
                  <th className="px-4 py-3 font-medium">Created At</th>
                  <th className="px-4 py-3 font-medium">Est. Cost</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-text-primary">
                {records.map(record => (
                  <tr key={record.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{record.id}</td>
                    <td className="px-4 py-3">{record.vehicleId}</td>
                    <td className="px-4 py-3">{record.serviceType}</td>
                    <td className="px-4 py-3 text-text-secondary">{formatDate(record.createdAt)}</td>
                    <td className="px-4 py-3">{formatCurrency(record.estimatedCost)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link 
                        to={`${ROUTES.MAINTENANCE}/${record.id}`}
                        className="text-primary hover:text-primary-hover font-medium"
                      >
                        View
                      </Link>
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
