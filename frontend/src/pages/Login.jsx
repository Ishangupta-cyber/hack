import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight, Loader2, Users, ArrowLeft } from 'lucide-react';
import { API_BASE } from '../lib/utils';

export default function Login() {
  const { portalType } = useParams();
  const isAdmin = portalType === 'admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (emailStr) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email format.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.access_token) {
        // Verify that the user role matches the portal they're using
        const userRole = data.user.role;
        if (isAdmin && userRole !== 'Authority') {
          setError('Access denied. This portal is for Authority accounts only.');
          setLoading(false);
          return;
        }
        if (!isAdmin && userRole !== 'Citizen') {
          setError('Access denied. This portal is for Citizen accounts only.');
          setLoading(false);
          return;
        }

        localStorage.setItem('token', data.access_token);
        localStorage.setItem('role', data.user.role);
        navigate('/dashboard');
      } else if (data.code === 'USER_NOT_FOUND') {
        navigate(`/signup/${portalType}`, { state: { email } });
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const accentFrom = isAdmin ? 'from-teal-500' : 'from-indigo-500';
  const accentTo = isAdmin ? 'to-emerald-500' : 'to-blue-500';
  const accentRing = isAdmin ? 'focus:ring-teal-500/50' : 'focus:ring-indigo-500/50';
  const borderColor = isAdmin ? 'border-t-teal-500' : 'border-t-indigo-500';
  const btnGradient = isAdmin
    ? 'from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-teal-500/30'
    : 'from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-500/30';
  const linkColor = isAdmin ? 'text-teal-600 dark:text-teal-400' : 'text-primary-600 dark:text-primary-400';

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-4 relative">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-surface-500 hover:text-surface-300 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className={`glass-card p-8 shadow-xl border-t-4 ${borderColor}`}>
          <div className="flex flex-col items-center mb-8">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${accentFrom} ${accentTo} flex items-center justify-center shadow-glow mb-4`}>
              {isAdmin ? <Lock className="w-8 h-8 text-white" /> : <Users className="w-8 h-8 text-white" />}
            </div>
            <h1 className="text-2xl font-bold gradient-text">
              {isAdmin ? 'Authority Login' : 'Citizen Login'}
            </h1>
            <p className="text-sm text-surface-500 font-medium">
              {isAdmin ? 'Government & Admin Access' : 'Public Welfare Portal'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-600 dark:text-red-400 text-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider pl-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white/50 dark:bg-surface-900/50 focus:outline-none focus:ring-2 ${accentRing} transition-all font-medium`}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider pl-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white/50 dark:bg-surface-900/50 focus:outline-none focus:ring-2 ${accentRing} transition-all font-medium`}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl bg-gradient-to-r ${btnGradient} text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Secure Login'}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-surface-200/50 dark:border-surface-700/50 text-center">
            <p className="text-sm text-surface-500">
              Don't have an account?{' '}
              <Link to={`/signup/${portalType}`} className={`font-semibold ${linkColor} hover:underline`}>
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
