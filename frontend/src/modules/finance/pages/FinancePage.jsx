import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { financeApi } from '../api/finance.api';
import { Button } from '../../../components/ui/Button';
import { Loader2, Plus, WalletCards, Fuel } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const FinancePage = () => {
  const [activeTab, setActiveTab] = useState('EXPENSES');
  const [expenses, setExpenses] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === 'EXPENSES') {
        const result = await financeApi.getExpenses();
        if (result.success) setExpenses(result.data);
      } else {
        const result = await financeApi.getFuelLogs();
        if (result.success) setFuelLogs(result.data);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Finance & Expenses</h1>
          <p className="text-sm text-text-secondary mt-1">Manage operational costs and fuel logs</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate(`${ROUTES.FINANCE}/fuel/new`)} variant="outline" className="gap-2">
            <Fuel className="w-4 h-4" /> Log Fuel
          </Button>
          <Button onClick={() => navigate(`${ROUTES.FINANCE}/expenses/new`)} className="gap-2">
            <Plus className="w-4 h-4" /> Log Expense
          </Button>
        </div>
      </div>

      <div className="flex border-b border-border-subtle mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'EXPENSES' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('EXPENSES')}
        >
          General Expenses
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'FUEL' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('FUEL')}
        >
          Fuel Logs
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p>Loading records...</p>
        </div>
      ) : error ? (
        <div className="bg-danger/5 border border-danger/20 p-6 rounded-lg text-center max-w-lg mx-auto mt-8">
          <h3 className="text-lg font-bold text-danger mb-2">Error</h3>
          <p className="text-sm text-danger/80 mb-6">{error}</p>
          <Button onClick={loadData} variant="outline">Retry</Button>
        </div>
      ) : activeTab === 'EXPENSES' ? (
        expenses.length === 0 ? (
          <div className="bg-surface border border-border-subtle p-12 rounded-lg text-center">
            <WalletCards className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary">No Expenses Found</h3>
          </div>
        ) : (
          <div className="bg-surface rounded-lg shadow-sm border border-border-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-surface-secondary text-text-secondary font-medium">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-surface-secondary/50">
                      <td className="px-6 py-4 font-medium text-text-primary">{expense.id.slice(0,8)}</td>
                      <td className="px-6 py-4 text-text-secondary">{formatDate(expense.expenseDate)}</td>
                      <td className="px-6 py-4">{expense.category}</td>
                      <td className="px-6 py-4 text-text-secondary">{expense.description || '—'}</td>
                      <td className="px-6 py-4 font-medium">{formatCurrency(expense.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        fuelLogs.length === 0 ? (
          <div className="bg-surface border border-border-subtle p-12 rounded-lg text-center">
            <Fuel className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary">No Fuel Logs Found</h3>
          </div>
        ) : (
          <div className="bg-surface rounded-lg shadow-sm border border-border-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-surface-secondary text-text-secondary font-medium">
                  <tr>
                    <th className="px-6 py-4">Vehicle ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Quantity (Liters)</th>
                    <th className="px-6 py-4">Cost</th>
                    <th className="px-6 py-4">Odometer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {fuelLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface-secondary/50">
                      <td className="px-6 py-4 font-medium text-text-primary">{log.vehicleId.slice(0,8)}</td>
                      <td className="px-6 py-4 text-text-secondary">{formatDate(log.loggedAt)}</td>
                      <td className="px-6 py-4">{log.fuelQuantity} L</td>
                      <td className="px-6 py-4 font-medium">{formatCurrency(log.fuelCost)}</td>
                      <td className="px-6 py-4 text-text-secondary">{log.odometerReading} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
};
