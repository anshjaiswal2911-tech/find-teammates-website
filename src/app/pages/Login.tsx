import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Zap, Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-xl">CollabNest</span>
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-2 text-gray-600">
              Sign in to continue to your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-700">
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">
            Find Your Perfect Dev Team
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            AI-powered matching for college developers
          </p>
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
            {[
              { value: '10K+', label: 'Developers' },
              { value: '50K+', label: 'Matches' },
              { value: '2.5K+', label: 'Projects' },
              { value: '85%', label: 'Success Rate' },
            ].map((stat) => (
              <Card key={stat.label} className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-blue-100">{stat.label}</div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
