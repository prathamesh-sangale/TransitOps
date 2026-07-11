import React from 'react';

export const LicenseStatus = ({ expiryDate }) => {
  if (!expiryDate) return <span className="text-sm text-text-muted">Unknown</span>;

  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  let status = 'VALID';
  let colorClass = 'text-success bg-success/10 border-success/20';

  if (diffDays < 0) {
    status = 'EXPIRED';
    colorClass = 'text-danger bg-danger/10 border-danger/20';
  } else if (diffDays <= 30) {
    status = 'EXPIRING SOON';
    colorClass = 'text-warning bg-warning/10 border-warning/20';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}>
      {status}
    </span>
  );
};
