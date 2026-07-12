import React from 'react';
import { Badge } from './Badge';

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    // Vehicle
    AVAILABLE: { label: 'Available', variant: 'success' },
    ON_TRIP: { label: 'On Trip', variant: 'primary' },
    IN_SHOP: { label: 'In Shop', variant: 'warning' },
    RETIRED: { label: 'Retired', variant: 'default' },
    // Driver (Available and On Trip are shared)
    OFF_DUTY: { label: 'Off Duty', variant: 'default' },
    SUSPENDED: { label: 'Suspended', variant: 'danger' },
    // Trip
    DRAFT: { label: 'Draft', variant: 'default' },
    DISPATCHED: { label: 'Dispatched', variant: 'primary' },
    COMPLETED: { label: 'Completed', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'danger' },
    // Maintenance
    ACTIVE: { label: 'Active', variant: 'warning' },
    // Fallback
    UNKNOWN: { label: 'Unknown', variant: 'default' }
  };

  const config = statusConfig[status] || statusConfig.UNKNOWN;

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};
