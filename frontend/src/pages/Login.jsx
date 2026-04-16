import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      const redirect = data.user.role === 'admin' ? '/admin' : data.user.role === 'owner' ? '/owner' : '/dashboard';
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel – image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop"
          alt="restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/80 to-slate-900/60 flex flex-col items-center justify-center p-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <UtensilsCrossed size={24} className="text-white" />
            </div>
            <span className="text-3xl font-bold">DineNear</span>
          </div>
          <h2 className="text-3xl font-bold text-center mb-4 leading-snug">Discover Today's<br />Best Food Around You</h2>
          <p className="text-white/75 text-center text-base max-w-xs">
            Browse menus, save favorites, and enjoy great food from the best restaurants nearby.
          </p>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface-secondary dark:bg-slate-900">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">Dine<span className="text-primary-500">Near</span></span>
          </div>

          <div className="card px-8 py-10">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Welcome back</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Email address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  className="input" placeholder="you@example.com" required />
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input name="password" type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={handleChange} className="input pr-11" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPass((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full justify-center py-3 text-sm">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Sign In'}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">Demo Accounts</p>
              {[
                { role: 'Admin', email: 'admin@dinenear.com', pass: 'Admin@123' },
                { role: 'Owner', email: 'owner1@dinenear.com', pass: 'Owner@123' },
                { role: 'User', email: 'user@dinenear.com', pass: 'User@123' },
              ].map((d) => (
                <button key={d.role} onClick={() => setForm({ email: d.email, password: d.pass })}
                  className="block w-full text-left text-xs text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 py-0.5 transition-colors">
                  <span className="font-medium">{d.role}:</span> {d.email} / {d.pass}
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-500 hover:text-primary-600 font-medium">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
