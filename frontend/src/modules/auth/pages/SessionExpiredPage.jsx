import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Clock } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const SessionExpiredPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface p-8 rounded-lg shadow-sm border border-border-subtle w-full max-w-md mx-auto text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-primary-soft p-4 rounded-full">
          <Clock className="w-12 h-12 text-primary" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-text-primary mb-2">Session Expired</h1>
      <p className="text-text-secondary text-sm mb-8">
        For your security, your session has timed out due to inactivity. Please sign in again to continue managing operations.
      </p>

      <Button 
        onClick={() => navigate(ROUTES.LOGIN, { replace: true })}
        className="w-full"
      >
        Return to Sign In
      </Button>
    </div>
  );
};
