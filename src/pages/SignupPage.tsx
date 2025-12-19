import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SignupPageProps {
  onSignup: (email: string, password: string, name: string, role: string) => Promise<{ success: boolean; error?: string }>;
}

export function SignupPage({ onSignup }: SignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('family');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await onSignup(email, password, name, role);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else {
      // Display user-friendly error message
      let errorMessage = result.error || 'Signup failed. Please try again.';
      
      // Check if it's a duplicate email error
      if (errorMessage.includes('already exists') || errorMessage.includes('already been registered')) {
        errorMessage = 'This email is already registered. Please use a different email or sign in.';
      }
      
      setError(errorMessage);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-amber-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="size-8 text-green-600" />
          </div>
          <h2 className="text-2xl text-green-900 mb-2">Account Created!</h2>
          <p className="text-neutral-600">Redirecting you to login...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Heart className="size-8 text-green-600" />
          </div>
          <h1 className="text-3xl text-green-900 mb-2">Create Account</h1>
          <p className="text-neutral-600">Join AuraHome to get started</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-neutral-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="John Doe"
              required
            />
          </div>

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
              minLength={6}
            />
            <p className="text-xs text-neutral-500 mt-1">At least 6 characters</p>
          </div>

          <div>
            <label className="block text-sm text-neutral-700 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('family')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  role === 'family'
                    ? 'border-green-600 bg-green-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="text-sm text-neutral-900">Family Member</div>
                <div className="text-xs text-neutral-500 mt-1">Track elder care</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('resident')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  role === 'resident'
                    ? 'border-green-600 bg-green-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="text-sm text-neutral-900">Resident</div>
                <div className="text-xs text-neutral-500 mt-1">Living in community</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('staff')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  role === 'staff'
                    ? 'border-green-600 bg-green-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="text-sm text-neutral-900">Staff</div>
                <div className="text-xs text-neutral-500 mt-1">Caregiver/Nurse</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  role === 'admin'
                    ? 'border-green-600 bg-green-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="text-sm text-neutral-900">Admin</div>
                <div className="text-xs text-neutral-500 mt-1">Facility manager</div>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700">
              Sign in
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
