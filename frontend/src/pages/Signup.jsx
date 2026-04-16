import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Eye, EyeOff, User, ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'user', label: 'Food Explorer', icon: User, desc: 'Browse restaurants and save favorites' },
  { value: 'owner', label: 'Restaurant Owner', icon: ChefHat, desc: 'List your restaurant and manage menus' },
];

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/signup', form);
      login(data.user, data.token);
      toast.success('Account created successfully!');
      const redirect = data.user.role === 'owner' ? '/owner' : '/dashboard';
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop" alt="food" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 to-primary-700/60 flex flex-col items-center justify-center p-12 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <UtensilsCrossed size={24} className="text-white" />
            </div>
            <span className="text-3xl font-bold">DineNear</span>
          </div>
          <h2 className="text-3xl font-bold text-center mb-4">Join Our Food Community</h2>
          <p className="text-white/75 text-center text-base max-w-xs">Create your account and start discovering amazing restaurants near you.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface-secondary dark:bg-slate-900">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">Dine<span className="text-primary-500">Near</span></span>
          </div>

          <div className="card px-8 py-10">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Create account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Join DineNear today — it's free</p>

            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {ROLES.map(({ value, label, icon: Icon, desc }) => (
                <button key={value} type="button" onClick={() => setForm({ ...form, role: value })}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${form.role === value ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                  <Icon size={18} className={form.role === value ? 'text-primary-500' : 'text-slate-400'} />
                  <p className={`text-sm font-semibold mt-1 ${form.role === value ? 'text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-200'}`}>{label}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">{desc}</p>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input name="name" type="text" value={form.name} onChange={handleChange} className="input" placeholder="Your name" required />
              </div>
              <div>
                <label className="label">Email address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="you@example.com" required />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} className="input pr-11" placeholder="Min. 6 characters" required />
                  <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm mt-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
