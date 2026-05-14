import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

export function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief loading state to show the success message
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your purchase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
        </div>

        {sessionId && (
          <Alert type="success">
            <div className="text-sm">
              <p className="font-medium">Transaction Details</p>
              <p className="mt-1 text-xs font-mono break-all">
                Session ID: {sessionId}
              </p>
            </div>
          </Alert>
        )}

        <div className="space-y-4">
          <Alert type="info">
            <div className="text-sm">
              <p className="font-medium">What's Next?</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>You'll receive a confirmation email shortly</li>
                <li>Access your purchase from your dashboard</li>
                <li>Contact support if you have any questions</li>
              </ul>
            </div>
          </Alert>

          <div className="flex flex-col space-y-3">
            <Link to="/dashboard" className="w-full">
              <Button className="w-full">
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/products" className="w-full">
              <Button variant="outline" className="w-full">
                Browse More Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}