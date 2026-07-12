import { useState, useEffect } from 'react';
import { analyticsApi } from '../api/analytics.api';
import { KpiCard } from '../../../components/ui/KpiCard';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Loader2, RefreshCcw, Download, TrendingUp, DollarSign, Activity, Settings2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dateRange, setDateRange] = useState('30d');
  const [vehicleType, setVehicleType] = useState('ALL');

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyticsApi.getOverview({ dateRange, vehicleType });
      if (result.success) {
        setData(result.data);
      } else {
        setError('Failed to load analytics data');
      }
    } catch (err) {
      setError('An error occurred while loading analytics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateRange, vehicleType]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  };

  if (isLoading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-secondary h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/5 border border-danger/20 p-6 rounded-lg text-center max-w-lg mx-auto mt-8 text-danger flex flex-col items-center">
        <p className="mb-4">{error}</p>
        <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-surface text-danger border border-danger/20 rounded-md hover:bg-danger/10">
          <RefreshCcw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
          <p className="text-sm text-text-secondary mt-1">Monitor fleet efficiency, operational costs, and vehicle performance.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Date Range</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-surface border border-border-strong rounded py-1.5 px-3 text-sm text-text-primary focus:border-primary outline-none"
            >
              <option value="30d">Last 30 Days</option>
              <option value="6m">Last 6 Months</option>
              <option value="ytd">Year to Date</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Vehicle Type</label>
            <select 
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="bg-surface border border-border-strong rounded py-1.5 px-3 text-sm text-text-primary focus:border-primary outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="Long Haul">Long Haul</option>
              <option value="Delivery Van">Delivery Van</option>
            </select>
          </div>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Fleet Utilization" 
          value={`${data.kpis.fleetUtilization}%`} 
          icon={Activity} 
          trend={2.5} 
        />
        <KpiCard 
          title="Avg Fuel Efficiency" 
          value={`${data.kpis.avgFuelEfficiency} km/L`} 
          icon={Settings2} 
          trend={0.0} 
        />
        <KpiCard 
          title="Operational Cost" 
          value={formatCurrency(data.kpis.operationalCost)} 
          icon={DollarSign} 
          trend={-4.2} 
        />
        <KpiCard 
          title="Avg Vehicle ROI" 
          value={`${data.kpis.avgVehicleROI}%`} 
          icon={TrendingUp} 
          trend={1.1} 
        />
      </div>

      {/* Visual Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-surface rounded-xl shadow-sm border border-border-subtle p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Fleet Utilization Trend</h3>
              <p className="text-sm text-text-secondary">Capacity vs actual usage</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-text-secondary">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-border-strong border border-dashed border-text-muted" />
                <span className="text-xs text-text-secondary">Target</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.charts.utilizationTrend} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="actual" stroke="#1D4ED8" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="target" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-surface rounded-xl shadow-sm border border-border-subtle p-6 flex flex-col">
          <h3 className="text-lg font-bold text-text-primary">Operational Costs</h3>
          <p className="text-sm text-text-secondary mb-6">Fuel vs. Maintenance Breakdown</p>
          
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.charts.costBreakdown}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.charts.costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val) => formatCurrency(val)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-semibold text-text-secondary uppercase">Total</span>
                <span className="text-lg font-bold text-text-primary">
                  {formatCurrency(data.charts.costBreakdown.reduce((acc, curr) => acc + curr.value, 0))}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {data.charts.costBreakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-text-primary">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Top Vehicles Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-border-subtle overflow-hidden">
        <div className="p-6 border-b border-border-subtle flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-text-primary">Top Vehicles by ROI</h3>
            <p className="text-sm text-text-secondary">Highest performing assets across all routes</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-secondary text-text-secondary">
              <tr>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider text-xs">Vehicle ID</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider text-xs">Registration</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider text-xs">Type</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider text-xs text-right">ROI (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {data.topVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-surface-secondary/50">
                  <td className="px-6 py-4 font-medium text-text-primary">{v.id}</td>
                  <td className="px-6 py-4 text-text-secondary">{v.registration}</td>
                  <td className="px-6 py-4 text-text-secondary">{v.type}</td>
                  <td className="px-6 py-4"><StatusBadge status={v.status} /></td>
                  <td className="px-6 py-4 text-right font-medium text-success">+{v.roi.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
