import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { User, CreditCard, Package } from 'lucide-react';

export function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { subscription, activePlan, loading: subscriptionLoading } = useSubscription();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.email}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Account Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <User className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Account</h2>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-gray-600">Member since</p>
              <p className="font-medium">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Subscription</h2>
            </div>
            {subscriptionLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : activePlan ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Current Plan</p>
                <p className="font-medium text-green-600">{activePlan}</p>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium capitalize">
                  {subscription?.subscription_status || 'Active'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-600">No active subscription</p>
                <Link to="/products">
                  <Button size="sm">Browse Products</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Package className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Link to="/products" className="block">
                <Button variant="outline" size="sm" className="w-full">
                  View Products
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="w-full" disabled>
                Manage Billing
              </Button>
              <Button variant="outline" size="sm" className="w-full" disabled>
                Download Invoices
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}