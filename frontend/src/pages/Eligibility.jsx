import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Search, CheckCircle2, XCircle, IndianRupee, Calendar,
  Users, Sparkles, ExternalLink, Loader2, Globe, Award, Heart,
  Home, Briefcase, GraduationCap, Tractor, PiggyBank, Stethoscope
} from 'lucide-react';
import { API_BASE } from '../lib/utils';

const TYPE_ICONS = {
  Scholarship: GraduationCap,
  Subsidy: PiggyBank,
  Pension: Award,
  Insurance: ShieldCheck,
  Housing: Home,
  Employment: Briefcase,
  Loan: PiggyBank,
  Healthcare: Stethoscope,
  Agriculture: Tractor,
  Education: GraduationCap,
};

const TYPE_COLORS = {
  Scholarship: 'from-indigo-500 to-blue-500',
  Subsidy: 'from-amber-500 to-orange-500',
  Pension: 'from-purple-500 to-fuchsia-500',
  Insurance: 'from-teal-500 to-emerald-500',
  Housing: 'from-rose-500 to-pink-500',
  Employment: 'from-cyan-500 to-blue-500',
  Loan: 'from-lime-500 to-green-500',
  Healthcare: 'from-red-500 to-rose-500',
  Agriculture: 'from-green-500 to-emerald-500',
  Education: 'from-violet-500 to-indigo-500',
};

export default function Eligibility() {
  const [income, setIncome] = useState('');
  const [age, setAge] = useState('');
  const [category, setCategory] = useState('');
  const [gender, setGender] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(null);

  const checkEligibility = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSchemes([]);

    try {
      const res = await fetch(`${API_BASE}/api/schemes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          age: parseInt(age),
          income: parseInt(income),
          category,
          gender,
          state,
        })
      });

      const data = await res.json();

      if (res.ok && data.schemes) {
        setSchemes(data.schemes);
      } else {
        setError(data.error || 'Failed to fetch schemes');
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
      setChecked(true);
    }
  };

  const getIcon = (type) => {
    const Icon = TYPE_ICONS[type] || Award;
    return Icon;
  };

  const getGradient = (type) => {
    return TYPE_COLORS[type] || 'from-primary-500 to-accent-500';
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-primary-500" />
          AI Scheme Matcher
        </h1>
        <p className="page-subtitle">Enter your details and our AI will find every government scheme you're eligible for — powered by Gemini AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card sticky top-4"
          >
            <div className="p-5 border-b border-surface-200/50 dark:border-surface-700/50">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Search className="w-4 h-4 text-primary-500" />
                Enter Your Details
              </h3>
            </div>
            <form onSubmit={checkEligibility} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" /> Annual Income (₹)
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 150000"
                  value={income}
                  onChange={e => setIncome(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Age
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 35"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  required
                  min="0"
                  max="120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Category
                </label>
                <select
                  className="input-field"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
                  <Heart className="w-3 h-3" /> Gender
                </label>
                <select
                  className="input-field"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> State
                </label>
                <select
                  className="input-field"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  required
                >
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Bihar">Bihar</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Gujarat">Gujarat</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI is Searching...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Find My Schemes
                  </>
                )}
              </button>

              {loading && (
                <p className="text-xs text-center text-surface-400 animate-pulse">
                  Gemini AI is scanning all active Indian government schemes...
                </p>
              )}
            </form>
          </motion.div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!checked ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-12 text-center text-surface-400"
              >
                <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">AI-Powered Scheme Discovery</p>
                <p className="text-sm mt-1">Enter your profile and Gemini AI will find every active scheme you qualify for</p>
              </motion.div>
            ) : loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-12 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-semibold gradient-text">Gemini AI is analyzing...</p>
                <p className="text-sm text-surface-400 mt-2">Scanning Central & State government databases for matching schemes</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-8 text-center"
              >
                <XCircle className="w-12 h-12 mx-auto mb-3 text-red-400" />
                <p className="text-lg font-medium text-red-500">{error}</p>
                <p className="text-sm text-surface-400 mt-1">Please check your connection and try again</p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {schemes.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        {schemes.length} Schemes Found
                      </h3>
                      <span className="text-xs text-surface-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Powered by Gemini AI
                      </span>
                    </div>

                    <div className="space-y-3">
                      {schemes.map((s, i) => {
                        const Icon = getIcon(s.type);
                        const gradient = getGradient(s.type);
                        return (
                          <motion.div
                            key={s.name + i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="glass-card p-5 hover:-translate-y-0.5 transition-all duration-200 group"
                          >
                            <div className="flex items-start gap-4">
                              {/* Icon */}
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg shrink-0`}>
                                <Icon className="w-6 h-6" />
                              </div>

                              <div className="flex-1 min-w-0">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <h4 className="font-bold text-surface-900 dark:text-surface-100">{s.name}</h4>
                                    <p className="text-xs text-surface-400 mt-0.5">{s.ministry}</p>
                                  </div>
                                  {/* Match Score Badge */}
                                  <div className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${
                                    s.match_score >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                    s.match_score >= 60 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                    'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
                                  }`}>
                                    {s.match_score}% Match
                                  </div>
                                </div>

                                {/* Eligibility summary */}
                                <p className="text-sm text-surface-600 dark:text-surface-300 mt-2">{s.eligibility_summary}</p>

                                {/* Benefit & Type */}
                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs font-semibold border border-primary-100 dark:border-primary-800/50">
                                    💰 {s.benefit}
                                  </span>
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 text-xs font-medium">
                                    {s.type}
                                  </span>
                                  {s.official_url && (
                                    <a
                                      href={s.official_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium ml-auto"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      Apply Now
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="glass-card p-8 text-center">
                    <XCircle className="w-12 h-12 mx-auto mb-3 text-red-400 opacity-50" />
                    <p className="text-lg font-medium text-surface-500">No eligible schemes found</p>
                    <p className="text-sm text-surface-400 mt-1">Try adjusting your income, age, or category criteria</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
