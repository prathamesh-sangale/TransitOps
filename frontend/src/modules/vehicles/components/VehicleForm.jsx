import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export const VehicleForm = ({ initialData, onSubmit, isSubmitting, onCancel }) => {
  const [formData, setFormData] = useState({
    registration: '',
    type: 'Heavy Truck',
    capacity: '',
    odometer: '',
    location: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        registration: initialData.registration || '',
        type: initialData.type || 'Heavy Truck',
        capacity: initialData.capacity || '',
        odometer: initialData.odometer || '',
        location: initialData.location || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Registration Number"
          name="registration"
          placeholder="e.g. MH-12-TX-8842"
          value={formData.registration}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-text-primary">Vehicle Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={isSubmitting}
            className="flex h-10 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          >
            <option value="Heavy Truck">Heavy Truck</option>
            <option value="Light Truck">Light Truck</option>
            <option value="Van">Van</option>
          </select>
        </div>

        <Input
          label="Load Capacity"
          name="capacity"
          placeholder="e.g. 15000 kg"
          value={formData.capacity}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Current Odometer (km)"
          name="odometer"
          type="number"
          placeholder="e.g. 45000"
          value={formData.odometer}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Default Depot / Location"
          name="location"
          placeholder="e.g. Depot A"
          value={formData.location}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Vehicle'}
        </Button>
      </div>
    </form>
  );
};
