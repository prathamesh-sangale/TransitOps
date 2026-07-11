import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export const DriverForm = ({ initialData, onSubmit, isSubmitting, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    licenseExpiry: '',
    safetyScore: 100
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        licenseNumber: initialData.licenseNumber || '',
        licenseExpiry: initialData.licenseExpiry || '',
        safetyScore: initialData.safetyScore ?? 100
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
          label="Full Name"
          name="name"
          placeholder="e.g. John Doe"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />

        <Input
          label="License Number"
          name="licenseNumber"
          placeholder="e.g. DL-1234-5678"
          value={formData.licenseNumber}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />

        <Input
          label="License Expiry Date"
          name="licenseExpiry"
          type="date"
          value={formData.licenseExpiry}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Initial Safety Score (0-100)"
          name="safetyScore"
          type="number"
          min="0"
          max="100"
          value={formData.safetyScore}
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
          {isSubmitting ? 'Saving...' : 'Save Driver'}
        </Button>
      </div>
    </form>
  );
};
