import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { FileQuestion } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-surface p-8 rounded-lg shadow-sm border border-border-subtle w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-surface-secondary p-4 rounded-full">
            <FileQuestion className="w-12 h-12 text-text-secondary" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-text-primary mb-2">Page Not Found</h1>
        <p className="text-text-secondary text-sm mb-8">
          The operational view or record you are looking for does not exist or has been moved.
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
