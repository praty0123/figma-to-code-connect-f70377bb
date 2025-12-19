import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await onLogin(email, password);

    if (!result.success) {
      // Display user-friendly error message
      let errorMessage = result.error || 'Login failed. Please try again.';
      
      // Check if it's an invalid credentials error
      if (errorMessage.includes('Invalid login credentials') || errorMessage.includes('invalid') || errorMessage.includes('credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      }
      
      setError(errorMessage);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Heart className="size-8 text-green-600" />
          </div>
          <h1 className="text-3xl text-green-900 mb-2">Welcome Back</h1>
          <p className="text-neutral-600">Sign in to access your AuraHome dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-neutral-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-neutral-300" />
              <span className="text-sm text-neutral-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-green-600 hover:text-green-700">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-green-600 hover:text-green-700">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-200">
          <Link to="/" className="flex items-center justify-center gap-2 text-sm text-neutral-600 hover:text-neutral-900">
            <Heart className="size-4" />
            Back to AuraHome
          </Link>
        </div>
      </Card>
    </div>
  );
}