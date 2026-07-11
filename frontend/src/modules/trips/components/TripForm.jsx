import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export const TripForm = ({ onSubmit, isSubmitting, onCancel }) => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    cargoDescription: '',
    cargoWeight: '',
    plannedDistance: ''
  });

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
          label="Origin Location"
          name="origin"
          placeholder="e.g. Warehouse North"
          value={formData.origin}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Destination Location"
          name="destination"
          placeholder="e.g. Port Sector 7"
          value={formData.destination}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        
        <div className="md:col-span-2">
          <Input
            label="Cargo Description"
            name="cargoDescription"
            placeholder="e.g. Electronics & Hardware"
            value={formData.cargoDescription}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <Input
          label="Cargo Weight (kg)"
          name="cargoWeight"
          type="number"
          placeholder="e.g. 12000"
          value={formData.cargoWeight}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Planned Distance (km)"
          name="plannedDistance"
          type="number"
          placeholder="e.g. 45"
          value={formData.plannedDistance}
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
          {isSubmitting ? 'Creating...' : 'Create Draft Trip'}
        </Button>
      </div>
    </form>
  );
};
