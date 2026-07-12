import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripApi } from '../api/trip.api';
import { Button } from '../../../components/ui/Button';
import { VehicleSelector } from '../components/VehicleSelector';
import { DriverSelector } from '../components/DriverSelector';
import { DispatchValidationPanel } from '../components/DispatchValidationPanel';
import { Loader2, ArrowLeft, Send } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const TripDispatcherPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [dispatchError, setDispatchError] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const result = await tripApi.getTripById(id);
        if (result.success) {
          if (result.data.status !== 'DRAFT') {
            navigate(`/trips/${id}`); // Only draft trips can be dispatched
          } else {
            setTrip(result.data);
          }
        } else {
          setError('Failed to load trip');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while loading');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchTrip();
    }
  }, [id, navigate]);

  const handleSplit = async () => {
    setIsSplitting(true);
    setDispatchError(null);
    try {
      const result = await tripApi.splitTrip(id, parseInt(selectedVehicle.capacity, 10));
      if (result.success) {
        setTrip(result.data); // Update local trip to the new split weight
        alert('Cargo split successfully! A new Draft trip has been created for the remaining cargo.');
      } else {
        setDispatchError('Failed to split trip');
      }
    } catch (err) {
      setDispatchError(err.message || 'An error occurred during split');
    } finally {
      setIsSplitting(false);
    }
  };

  const handleDispatch = async () => {
    setIsDispatching(true);
    setDispatchError(null);
    try {
      const result = await tripApi.dispatchTrip(id, {
        vehicleId: selectedVehicle.id,
        driverId: selectedDriver.id
      });
      if (result.success) {
        navigate(`/trips/${id}`);
      } else {
        setDispatchError('Failed to dispatch trip');
      }
    } catch (err) {
      setDispatchError(err.message || 'An error occurred during dispatch');
    } finally {
      setIsDispatching(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p>Loading dispatch workflow...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="bg-danger/5 border border-danger/20 p-6 rounded-lg text-center max-w-lg mx-auto mt-8 text-danger">
        {error || 'Trip not found'}
      </div>
    );
  }

  // Determine if dispatch is valid based on local panel logic
  const isVehicleAvailable = selectedVehicle?.status === 'AVAILABLE';
  const isDriverAvailable = selectedDriver?.status === 'AVAILABLE';
  
  let isCapacityOk = false;
  if (selectedVehicle) {
    const capacityNum = parseInt(selectedVehicle.capacity, 10);
    const weightNum = parseInt(trip.cargoWeight, 10);
    isCapacityOk = !isNaN(capacityNum) && !isNaN(weightNum) && capacityNum >= weightNum;
  }

  let isLicenseValid = false;
  if (selectedDriver) {
    const today = new Date();
    const expiry = new Date(selectedDriver.licenseExpiry);
    isLicenseValid = expiry >= today;
  }

  const isValidToDispatch = selectedVehicle && selectedDriver && 
                            isVehicleAvailable && isDriverAvailable && 
                            isCapacityOk && isLicenseValid;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div>
        <button 
          onClick={() => navigate(`/trips/${id}`)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Trip Details
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Dispatch Trip: {trip.id}</h1>
        <p className="text-sm text-text-secondary mt-1">
          {trip.origin} to {trip.destination} • {trip.cargoWeight}kg Cargo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-lg shadow-sm border border-border-subtle p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">1. Select Vehicle</h3>
            <VehicleSelector 
              selectedVehicleId={selectedVehicle?.id} 
              onSelect={setSelectedVehicle} 
            />
          </div>

          <div className="bg-surface rounded-lg shadow-sm border border-border-subtle p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">2. Select Driver</h3>
            <DriverSelector 
              selectedDriverId={selectedDriver?.id} 
              onSelect={setSelectedDriver} 
            />
          </div>
        </div>

        {/* Right Column: Validation & Action */}
        <div className="space-y-6">
          <DispatchValidationPanel 
            trip={trip} 
            selectedVehicle={selectedVehicle} 
            selectedDriver={selectedDriver} 
          />

          <div className="bg-surface rounded-lg shadow-sm border border-border-subtle p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">Final Action</h3>
            {dispatchError && (
              <div className="mb-4 p-3 text-sm text-danger bg-danger/10 border border-danger/20 rounded-md">
                {dispatchError}
              </div>
            )}
            <p className="text-sm text-text-secondary mb-4">
              Once dispatched, the vehicle and driver will be marked as ON_TRIP and the trip will become active.
            </p>
            <Button 
              className="w-full gap-2" 
              size="lg"
              disabled={!isValidToDispatch || isDispatching || isSplitting}
              onClick={handleDispatch}
            >
              {isDispatching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Execute Dispatch
                </>
              )}
            </Button>
            
            {!isCapacityOk && selectedVehicle && trip && (parseInt(trip.cargoWeight, 10) > parseInt(selectedVehicle.capacity, 10)) && (
              <Button 
                variant="outline"
                className="w-full gap-2 mt-3" 
                size="lg"
                disabled={isSplitting || isDispatching}
                onClick={handleSplit}
              >
                {isSplitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Splitting...
                  </>
                ) : (
                  'Split Cargo for this Vehicle'
                )}
              </Button>
            )}

            {!isValidToDispatch && (
              <p className="text-xs text-danger text-center mt-3">
                Cannot dispatch. Please resolve validation issues above.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
