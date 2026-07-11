export const KpiCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-surface p-6 rounded-lg shadow-sm border border-border-subtle">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-primary-soft text-primary rounded-md">
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <p className="text-sm text-text-secondary font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-text-primary mt-1 tabular-nums">{value}</h3>
    </div>
  </div>
);
