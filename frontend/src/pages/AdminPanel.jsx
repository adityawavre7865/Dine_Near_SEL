import { useState, useEffect } from 'react';
import { Users, Building2, UtensilsCrossed, ShieldCheck, Menu, CheckCircle, XCircle, Trash2, ToggleLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hotelFilter, setHotelFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { if (activeTab === 'users') fetchUsers(); }, [activeTab, userFilter]);
  useEffect(() => { if (activeTab === 'hotels') fetchHotels(); }, [activeTab, hotelFilter]);

  const fetchStats = async () => {
    try { const { data } = await API.get('/admin/stats'); setStats(data.stats); } catch {}
  };

  const fetchUsers = async () => {
    try {
      const params = userFilter ? { role: userFilter } : {};
      const { data } = await API.get('/admin/users', { params });
      setUsers(data.users || []);
    } catch { toast.error('Failed to load users'); }
  };

  const fetchHotels = async () => {
    try {
      const params = hotelFilter ? { status: hotelFilter } : {};
      const { data } = await API.get('/admin/hotels', { params });
      setHotels(data.hotels || []);
    } catch { toast.error('Failed to load hotels'); }
  };

  const toggleUser = async (id) => {
    try { await API.patch(`/admin/users/${id}/toggle`); fetchUsers(); toast.success('User status updated'); }
    catch { toast.error('Failed'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try { await API.delete(`/admin/users/${id}`); fetchUsers(); toast.success('User deleted'); }
    catch { toast.error('Failed to delete user'); }
  };

  const updateHotelStatus = async (id, status) => {
    try { await API.patch(`/admin/hotels/${id}/status`, { status }); fetchHotels(); fetchStats(); toast.success(`Hotel ${status}`); }
    catch { toast.error('Failed to update hotel'); }
  };

  const TABS = ['dashboard', 'users', 'hotels'];

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Hotel Owners', value: stats.totalOwners, icon: ShieldCheck, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Total Hotels', value: stats.totalHotels, icon: Building2, color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' },
    { label: 'Pending Approval', value: stats.pendingHotels, icon: Building2, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Approved Hotels', value: stats.approvedHotels, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Menu Items', value: stats.totalMenuItems, icon: UtensilsCrossed, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
  ] : [];

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 p-6 lg:p-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mb-4 btn-secondary text-sm gap-2"><Menu size={16} /> Menu</button>

          <div className="mb-6">
            <h1 className="page-header">Admin Panel</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage users, hotels, and platform settings</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
            {TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {statCards.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}><Icon size={22} /></div>
                  <div><p className="text-2xl font-bold text-slate-800 dark:text-white">{value ?? '–'}</p><p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{label}</p></div>
                </div>
              ))}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex gap-2 mb-4 flex-wrap">
                {['', 'user', 'owner', 'admin'].map((role) => (
                  <button key={role} onClick={() => setUserFilter(role)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all border ${userFilter === role ? 'bg-primary-500 text-white border-primary-500' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-300'}`}>
                    {role || 'All Roles'}
                  </button>
                ))}
              </div>
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm">{u.name?.charAt(0)}</div>
                            <span className="font-medium text-slate-800 dark:text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`badge capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : u.role === 'owner' ? 'badge-yellow' : 'badge-blue'}`}>{u.role}</span>
                        </td>
                        <td className="px-4 py-3"><span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          {u.role !== 'admin' && (
                            <div className="flex gap-1.5">
                              <button onClick={() => toggleUser(u._id)} title={u.isActive ? 'Deactivate' : 'Activate'}
                                className={`p-1.5 rounded-lg text-xs transition-colors ${u.isActive ? 'bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                <ToggleLeft size={15} />
                              </button>
                              <button onClick={() => deleteUser(u._id)} className="p-1.5 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">No users found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Hotels Tab */}
          {activeTab === 'hotels' && (
            <div>
              <div className="flex gap-2 mb-4 flex-wrap">
                {['', 'pending', 'approved', 'rejected'].map((s) => (
                  <button key={s} onClick={() => setHotelFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all border ${hotelFilter === s ? 'bg-primary-500 text-white border-primary-500' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-300'}`}>
                    {s || 'All'}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {hotels.map((h) => (
                  <div key={h._id} className="card p-4 flex items-center gap-4">
                    <img src={h.image} alt={h.name} className="w-20 h-16 rounded-xl object-cover shrink-0"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop'; }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-slate-800 dark:text-white">{h.name}</p>
                        <span className={`badge capitalize ${h.status === 'approved' ? 'badge-green' : h.status === 'rejected' ? 'badge-red' : 'badge-yellow'}`}>{h.status}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{h.location} · Owner: {h.owner?.name || '–'}</p>
                      <p className="text-xs text-slate-400">{h.cuisine?.join(', ')}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {h.status !== 'approved' && (
                        <button onClick={() => updateHotelStatus(h._id, 'approved')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 transition-colors">
                          <CheckCircle size={14} /> Approve
                        </button>
                      )}
                      {h.status !== 'rejected' && (
                        <button onClick={() => updateHotelStatus(h._id, 'rejected')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors">
                          <XCircle size={14} /> Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {hotels.length === 0 && (
                  <div className="card p-10 text-center">
                    <Building2 size={36} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">No hotels found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
