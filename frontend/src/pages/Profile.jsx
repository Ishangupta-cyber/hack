import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User as UserIcon, Mail, Phone, MapPin, Building2, Shield,
  Pencil, Save, X, Loader2, Calendar, FileText, Fingerprint
} from 'lucide-react';
import { fetchAPI, API_BASE } from '../lib/utils';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/profile`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        setForm(data);
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          aadhaar_last4: form.aadhaar_last4,
          bio: form.bio,
        })
      });
      const data = await res.json();
      if (res.ok) {
        setProfile({ ...profile, ...data.user });
        setForm({ ...form, ...data.user });
        setEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
    setMessage(null);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const isAdmin = profile?.role === 'Authority';

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">View and manage your personal information.</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Message Banner */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border text-sm font-medium ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Profile Header Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-accent-500" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${isAdmin ? 'from-teal-500 to-emerald-500' : 'from-indigo-500 to-blue-500'} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
              {profile?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">{profile?.name}</h2>
              <p className="text-sm text-surface-500 font-medium">{profile?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  isAdmin
                    ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800'
                }`}>
                  <Shield className="w-3 h-3" />
                  {profile?.role}
                </span>
                <span className="text-xs text-surface-400">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Joined {new Date(profile?.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Edit / Save / Cancel buttons */}
            <div className="flex gap-2 self-start">
              {editing ? (
                <>
                  <button onClick={handleCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 text-sm font-medium transition-all">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white text-sm font-bold shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white text-sm font-bold shadow-lg shadow-primary-500/30 transition-all">
                  <Pencil className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Details Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 md:p-8">
          <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-6">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <ProfileField
              icon={UserIcon}
              label="Full Name"
              value={form.name}
              editing={editing}
              onChange={(v) => handleChange('name', v)}
            />

            {/* Email (read-only always) */}
            <ProfileField
              icon={Mail}
              label="Email Address"
              value={form.email}
              editing={false}
              readOnly
            />

            {/* Phone */}
            <ProfileField
              icon={Phone}
              label="Phone Number"
              value={form.phone}
              editing={editing}
              placeholder="+91 9876543210"
              onChange={(v) => handleChange('phone', v)}
            />

            {/* City */}
            <ProfileField
              icon={Building2}
              label="City"
              value={form.city}
              editing={editing}
              placeholder="e.g. Lucknow"
              onChange={(v) => handleChange('city', v)}
            />

            {/* State */}
            <ProfileField
              icon={MapPin}
              label="State"
              value={form.state}
              editing={editing}
              placeholder="e.g. Uttar Pradesh"
              onChange={(v) => handleChange('state', v)}
            />

            {/* Aadhaar Last 4 */}
            <ProfileField
              icon={Fingerprint}
              label="Aadhaar (Last 4 digits)"
              value={form.aadhaar_last4}
              editing={editing}
              placeholder="e.g. 1234"
              maxLength={4}
              onChange={(v) => handleChange('aadhaar_last4', v)}
            />
          </div>

          {/* Address — full width */}
          <div className="mt-6">
            <ProfileField
              icon={MapPin}
              label="Full Address"
              value={form.address}
              editing={editing}
              placeholder="e.g. 42, Civil Lines, Lucknow"
              onChange={(v) => handleChange('address', v)}
              fullWidth
            />
          </div>

          {/* Bio — full width */}
          <div className="mt-6">
            <label className="flex items-center gap-2 text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
              <FileText className="w-4 h-4" /> Bio
            </label>
            {editing ? (
              <textarea
                rows={3}
                value={form.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="A short bio about yourself..."
                className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all outline-none resize-none text-sm"
              />
            ) : (
              <p className="text-sm text-surface-700 dark:text-surface-300 pl-6">
                {form.bio || <span className="text-surface-400 italic">Not provided</span>}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}


// ---- Reusable field component ----
function ProfileField({ icon: Icon, label, value, editing, onChange, placeholder, readOnly, maxLength, fullWidth }) {
  return (
    <div className={fullWidth ? 'col-span-full' : ''}>
      <label className="flex items-center gap-2 text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
        <Icon className="w-4 h-4" /> {label}
      </label>
      {editing && !readOnly ? (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || ''}
          maxLength={maxLength}
          className="w-full px-4 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all outline-none text-sm font-medium"
        />
      ) : (
        <p className="text-sm text-surface-700 dark:text-surface-300 pl-6 py-1">
          {value || <span className="text-surface-400 italic">Not provided</span>}
          {readOnly && <span className="ml-2 text-xs text-surface-400">(cannot be changed)</span>}
        </p>
      )}
    </div>
  );
}
