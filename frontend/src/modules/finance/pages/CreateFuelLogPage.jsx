import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { financeApi } from '../api/finance.api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const CreateFuelLogPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    vehicleId: '',
    fuelQuantity: '',
    fuelCost: '',
    odometerReading: '',
    loggedAt: new Date().toISOString().slice(0, 16)
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
        vehicleId: formData.vehicleId,
        fuelQuantity: Number(formData.fuelQuantity),
        fuelCost: Number(formData.fuelCost),
        odometerReading: Number(formData.odometerReading),
        loggedAt: new Date(formData.loggedAt).toISOString(),
      };

      await financeApi.createFuelLog(payload);
      navigate(ROUTES.FINANCE);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to log fuel entry');
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
        <h1 className="text-2xl font-bold text-text-primary">Log Fuel Entry</h1>
        <p className="text-sm text-text-secondary mt-1">Record a new fuel log for a vehicle.</p>
      </div>

      <div className="bg-surface border border-border-subtle rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-danger/10 text-danger p-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-text-primary">Vehicle ID *</label>
            <Input
              name="vehicleId"
              required
              placeholder="UUID of the vehicle"
              value={formData.vehicleId}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Fuel Quantity (Liters) *</label>
              <Input
                name="fuelQuantity"
                type="number"
                min="0.1"
                step="0.1"
                required
                placeholder="0.0"
                value={formData.fuelQuantity}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Total Cost (₹) *</label>
              <Input
                name="fuelCost"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
                value={formData.fuelCost}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Current Odometer *</label>
              <Input
                name="odometerReading"
                type="number"
                min="0"
                step="1"
                required
                placeholder="e.g. 15400"
                value={formData.odometerReading}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Date & Time *</label>
              <Input
                name="loggedAt"
                type="datetime-local"
                required
                value={formData.loggedAt}
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
              Save Fuel Log
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
