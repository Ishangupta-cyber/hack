import { useState } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, User as UserIcon, ArrowRight, Loader2, ArrowLeft, Users } from 'lucide-react';
import { API_BASE } from '../lib/utils';

export default function Signup() {
  const { portalType } = useParams();
  const isAdmin = portalType === 'admin';
  const role = isAdmin ? 'Authority' : 'Citizen';

  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validateEmail = (emailStr) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => navigate(`/login/${portalType}`), 2000);
      } else {
        setError(data.error || 'Failed to create account.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
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
            <h1 className="text-2xl font-bold gradient-text">Create Account</h1>
            <p className="text-sm text-surface-500 font-medium">
              {isAdmin ? 'Register as Authority' : 'Register as Citizen'}
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-600 dark:text-red-400 text-center font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-sm text-emerald-600 dark:text-emerald-400 text-center font-medium">
                {success}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider pl-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white/50 dark:bg-surface-900/50 focus:outline-none focus:ring-2 ${accentRing} transition-all font-medium`}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider pl-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white/50 dark:bg-surface-900/50 focus:outline-none focus:ring-2 ${accentRing} transition-all font-medium`}
                  placeholder="name@example.com"
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
                  placeholder="Create a strong password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Role badge - read-only, auto assigned */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
              <Shield className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Role: <span className="font-bold">{role}</span>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl bg-gradient-to-r ${btnGradient} text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-surface-200/50 dark:border-surface-700/50 text-center">
            <p className="text-sm text-surface-500">
              Already have an account?{' '}
              <Link to={`/login/${portalType}`} className={`font-semibold ${linkColor} hover:underline`}>
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
