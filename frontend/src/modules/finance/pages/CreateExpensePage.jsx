import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { financeApi } from '../api/finance.api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const CreateExpensePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    vehicleId: '',
    tripId: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        category: formData.category,
        amount: Number(formData.amount),
        expenseDate: formData.expenseDate,
      };
      if (formData.description) payload.description = formData.description;
      if (formData.vehicleId) payload.vehicleId = formData.vehicleId;
      if (formData.tripId) payload.tripId = formData.tripId;

      await financeApi.createExpense(payload);
      navigate(ROUTES.FINANCE);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to log expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(ROUTES.FINANCE)}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Finance
      </button>

      <div>
        <h1 className="text-2xl font-bold text-text-primary">Log General Expense</h1>
        <p className="text-sm text-text-secondary mt-1">Record a new operational cost.</p>
      </div>

      <div className="bg-surface border border-border-subtle rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-danger/10 text-danger p-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Category *</label>
              <Input
                name="category"
                required
                placeholder="e.g., Tolls, Office, Repairs"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Amount (₹) *</label>
              <Input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Date *</label>
              <Input
                name="expenseDate"
                type="date"
                required
                value={formData.expenseDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-text-primary">Description</label>
            <textarea
              name="description"
              className="w-full flex min-h-[80px] rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Optional details..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Vehicle ID (Optional)</label>
              <Input
                name="vehicleId"
                placeholder="UUID if applicable"
                value={formData.vehicleId}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Trip ID (Optional)</label>
              <Input
                name="tripId"
                placeholder="UUID if applicable"
                value={formData.tripId}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="button" variant="ghost" onClick={() => navigate(ROUTES.FINANCE)} className="mr-3">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Expense
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
