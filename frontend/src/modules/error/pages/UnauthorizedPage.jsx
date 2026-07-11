import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { ShieldAlert } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-surface p-8 rounded-lg shadow-sm border border-border-subtle w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-danger/10 p-4 rounded-full">
            <ShieldAlert className="w-12 h-12 text-danger" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-text-primary mb-2">Access Restricted</h1>
        <p className="text-text-secondary text-sm mb-8">
          You do not have the required role permissions to view this operational area. Please contact your system administrator if you need access.
        </p>

        <Button 
          onClick={() => navigate(ROUTES.DASHBOARD, { replace: true })}
          className="w-full"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};
