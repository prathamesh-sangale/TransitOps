import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export const DispatchValidationPanel = ({ trip, selectedVehicle, selectedDriver }) => {
  const validations = [];

  // 1. Vehicle Selection
  if (!selectedVehicle) {
    validations.push({
      id: 'v_selected',
      passed: false,
      label: 'Vehicle Selected',
      message: 'No vehicle has been assigned to this trip.'
    });
  } else {
    validations.push({
      id: 'v_selected',
      passed: true,
      label: 'Vehicle Selected',
      message: `Vehicle ${selectedVehicle.registration} is assigned.`
    });
    
    // 2. Vehicle Availability
    const isVehicleAvailable = selectedVehicle.status === 'AVAILABLE';
    validations.push({
      id: 'v_avail',
      passed: isVehicleAvailable,
      label: 'Vehicle Availability',
      message: isVehicleAvailable 
        ? 'Vehicle is available for dispatch.' 
        : `Vehicle cannot be dispatched (Status: ${selectedVehicle.status}).`
    });

    // 3. Cargo Capacity
    const capacityNum = parseInt(selectedVehicle.capacity, 10);
    const weightNum = parseInt(trip.cargoWeight, 10);
    const isCapacityOk = !isNaN(capacityNum) && !isNaN(weightNum) && capacityNum >= weightNum;
    validations.push({
      id: 'v_cap',
      passed: isCapacityOk,
      label: 'Cargo Capacity Check',
      message: isCapacityOk 
        ? `Capacity (${selectedVehicle.capacity}kg) is sufficient for cargo (${trip.cargoWeight}kg).` 
        : `Cargo weight (${trip.cargoWeight}kg) exceeds vehicle capacity (${selectedVehicle.capacity}kg).`
    });
  }

  // 4. Driver Selection
  if (!selectedDriver) {
    validations.push({
      id: 'd_selected',
      passed: false,
      label: 'Driver Selected',
      message: 'No driver has been assigned to this trip.'
    });
  } else {
    validations.push({
      id: 'd_selected',
      passed: true,
      label: 'Driver Selected',
      message: `Driver ${selectedDriver.name} is assigned.`
    });

    // 5. Driver Availability
    const isDriverAvailable = selectedDriver.status === 'AVAILABLE';
    validations.push({
      id: 'd_avail',
      passed: isDriverAvailable,
      label: 'Driver Availability',
      message: isDriverAvailable 
        ? 'Driver is available for dispatch.' 
        : `Driver cannot be dispatched (Status: ${selectedDriver.status}).`
    });

    // 6. License Validity
    const today = new Date();
    const expiry = new Date(selectedDriver.licenseExpiry);
    const isLicenseValid = expiry >= today;
    validations.push({
      id: 'd_license',
      passed: isLicenseValid,
      label: 'License Validity',
      message: isLicenseValid 
        ? 'Driver license is valid.' 
        : 'Driver license has expired.'
    });
  }

  const allPassed = validations.every(v => v.passed);

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border-subtle overflow-hidden">
      <div className={`px-4 py-3 border-b flex items-center gap-2 ${allPassed ? 'bg-success/5 border-success/20' : 'bg-warning/5 border-warning/20'}`}>
        {allPassed ? (
          <CheckCircle className="w-5 h-5 text-success" />
        ) : (
          <AlertCircle className="w-5 h-5 text-warning" />
        )}
        <h3 className="font-semibold text-text-primary">
          {allPassed ? 'Ready for Dispatch' : 'Dispatch Validation Pending'}
        </h3>
      </div>
      
      <div className="p-4 space-y-3">
        {validations.map((validation) => (
          <div key={validation.id} className="flex items-start gap-3">
            {validation.passed ? (
              <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-danger mt-0.5 shrink-0" />
            )}
            <div>
              <p className={`text-sm font-medium ${validation.passed ? 'text-text-primary' : 'text-danger'}`}>
                {validation.label}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {validation.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
