import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Zap, Mail, Lock, User as UserIcon, GraduationCap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';

export function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signup(name, email, password, college);
      navigate('/profile?setup=true');
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-white max-w-md"
        >
          <h2 className="text-4xl font-bold mb-4">
            Join the Developer Community
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Connect with talented developers from top colleges and build amazing projects together
          </p>
          <ul className="space-y-4 text-left">
            {[
              'AI-powered teammate matching',
              'Personalized skill gap analysis',
              'Curated learning resources',
              'Project idea generation',
              'Analytics and insights',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Right Side - Form */}
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
            
            <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
            <p className="mt-2 text-gray-600">
              Start building with talented developers today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

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
              <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-2">
                College/University
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="college"
                  type="text"
                  placeholder="IIT Delhi"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
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
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 rounded border-gray-300" required />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
              </span>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
