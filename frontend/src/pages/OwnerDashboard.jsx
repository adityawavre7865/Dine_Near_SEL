import { useState, useEffect } from 'react';
import { Building2, PlusCircle, UtensilsCrossed, Menu, X, Edit2, Trash2, ToggleLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MenuItemCard from '../components/MenuItemCard';
import API from '../api/axios';
import toast from 'react-hot-toast';

const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snacks', 'beverages', 'desserts', 'other'];

const emptyItem = { name: '', description: '', price: '', category: 'other', image: '', isVeg: true, isAvailable: true, tags: '' };
const emptyHotel = { name: '', description: '', location: '', address: '', cuisine: '', phone: '', openingTime: '09:00', closingTime: '22:00', image: '' };

export default function OwnerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showItemForm, setShowItemForm] = useState(false);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [itemForm, setItemForm] = useState(emptyItem);
  const [hotelForm, setHotelForm] = useState(emptyHotel);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchHotels(); }, []);

  const fetchHotels = async () => {
    try {
      const { data } = await API.get('/hotels/my-hotels');
      setHotels(data.hotels || []);
      if (data.hotels?.length > 0 && !selectedHotel) setSelectedHotel(data.hotels[0]);
    } catch { toast.error('Failed to load hotels'); }
  };

  useEffect(() => {
    if (selectedHotel) fetchMenu();
  }, [selectedHotel]);

  const fetchMenu = async () => {
    try {
      const { data } = await API.get(`/menu/${selectedHotel._id}`);
      setMenuItems(data.items || []);
    } catch { toast.error('Failed to load menu'); }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...itemForm, price: parseFloat(itemForm.price), tags: itemForm.tags ? itemForm.tags.split(',').map(t => t.trim()) : [] };
      if (editItem) {
        await API.put(`/menu/item/${editItem._id}`, payload);
        toast.success('Item updated');
      } else {
        await API.post(`/menu/${selectedHotel._id}`, payload);
        toast.success('Item added');
      }
      setShowItemForm(false); setEditItem(null); setItemForm(emptyItem);
      fetchMenu();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const handleDeleteItem = async (id) => {
    if (!confirm('Delete this menu item?')) return;
    try { await API.delete(`/menu/item/${id}`); toast.success('Deleted'); fetchMenu(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...hotelForm, cuisine: hotelForm.cuisine.split(',').map(c => c.trim()).filter(Boolean) };
      await API.post('/hotels', payload);
      toast.success('Hotel submitted for approval!');
      setShowHotelForm(false); setHotelForm(emptyHotel);
      fetchHotels();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const openEditItem = (item) => {
    setEditItem(item);
    setItemForm({ ...item, tags: item.tags?.join(', ') || '' });
    setShowItemForm(true);
  };

  const TABS = ['overview', 'menu', 'add-hotel'];

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 p-6 lg:p-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mb-4 btn-secondary text-sm gap-2"><Menu size={16} /> Menu</button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="page-header">Owner Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{hotels.length} hotel(s) registered</p>
            </div>
            <button onClick={() => { setActiveTab('add-hotel'); setShowHotelForm(true); }} className="btn-primary text-sm gap-2">
              <PlusCircle size={16} /> Add Hotel
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
            {TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'My Hotels', value: hotels.length, icon: Building2, color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' },
                { label: 'Menu Items', value: menuItems.length, icon: UtensilsCrossed, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                { label: 'Approved', value: hotels.filter(h => h.status === 'approved').length, icon: Building2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}><Icon size={22} /></div>
                  <div><p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p><p className="text-xs text-slate-500 dark:text-slate-400">{label}</p></div>
                </div>
              ))}
              <div className="sm:col-span-3">
                <h2 className="section-title mb-3">My Hotels</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hotels.map((h) => (
                    <div key={h._id} className={`card p-4 flex items-center gap-4 cursor-pointer hover:shadow-card-hover transition-all ${selectedHotel?._id === h._id ? 'border-primary-400 dark:border-primary-600' : ''}`}
                      onClick={() => { setSelectedHotel(h); setActiveTab('menu'); }}>
                      <img src={h.image} alt={h.name} className="w-16 h-16 rounded-xl object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop'; }} />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{h.name}</p>
                        <p className="text-xs text-slate-400">{h.location}</p>
                        <span className={`badge mt-1 ${h.status === 'approved' ? 'badge-green' : h.status === 'rejected' ? 'badge-red' : 'badge-yellow'} capitalize`}>{h.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Menu Tab */}
          {activeTab === 'menu' && (
            <div>
              {hotels.length === 0 ? (
                <div className="card p-10 text-center">
                  <Building2 size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No hotels yet. Add your first hotel!</p>
                  <button onClick={() => setActiveTab('add-hotel')} className="btn-primary text-sm mt-4">Add Hotel</button>
                </div>
              ) : (
                <>
                  {/* Hotel selector */}
                  <div className="flex gap-2 mb-5 flex-wrap">
                    {hotels.map((h) => (
                      <button key={h._id} onClick={() => setSelectedHotel(h)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${selectedHotel?._id === h._id ? 'bg-primary-500 text-white border-primary-500' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-300'}`}>
                        {h.name}
                      </button>
                    ))}
                    <button onClick={() => { setShowItemForm(true); setEditItem(null); setItemForm(emptyItem); }} className="btn-primary text-sm gap-1.5 ml-auto">
                      <PlusCircle size={15} /> Add Item
                    </button>
                  </div>

                  {/* Menu item form */}
                  {showItemForm && (
                    <div className="card p-6 mb-6 border-primary-200 dark:border-primary-800">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-800 dark:text-white">{editItem ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
                        <button onClick={() => { setShowItemForm(false); setEditItem(null); setItemForm(emptyItem); }} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><X size={18} /></button>
                      </div>
                      <form onSubmit={handleItemSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="label">Name *</label><input className="input" value={itemForm.name} onChange={e => setItemForm({...itemForm, name: e.target.value})} required /></div>
                        <div><label className="label">Price (₹) *</label><input className="input" type="number" value={itemForm.price} onChange={e => setItemForm({...itemForm, price: e.target.value})} required /></div>
                        <div className="sm:col-span-2"><label className="label">Description</label><textarea className="input" rows={2} value={itemForm.description} onChange={e => setItemForm({...itemForm, description: e.target.value})} /></div>
                        <div><label className="label">Category</label>
                          <select className="input" value={itemForm.category} onChange={e => setItemForm({...itemForm, category: e.target.value})}>
                            {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                          </select>
                        </div>
                        <div><label className="label">Image URL</label><input className="input" value={itemForm.image} onChange={e => setItemForm({...itemForm, image: e.target.value})} placeholder="https://..." /></div>
                        <div><label className="label">Tags (comma separated)</label><input className="input" value={itemForm.tags} onChange={e => setItemForm({...itemForm, tags: e.target.value})} placeholder="popular, spicy" /></div>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={itemForm.isVeg} onChange={e => setItemForm({...itemForm, isVeg: e.target.checked})} className="w-4 h-4 accent-emerald-500" />
                            <span className="text-sm text-slate-600 dark:text-slate-300">Vegetarian</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={itemForm.isAvailable} onChange={e => setItemForm({...itemForm, isAvailable: e.target.checked})} className="w-4 h-4 accent-primary-500" />
                            <span className="text-sm text-slate-600 dark:text-slate-300">Available</span>
                          </label>
                        </div>
                        <div className="sm:col-span-2 flex gap-3">
                          <button type="submit" disabled={loading} className="btn-primary text-sm">
                            {loading ? 'Saving...' : editItem ? 'Update Item' : 'Add Item'}
                          </button>
                          <button type="button" onClick={() => { setShowItemForm(false); setEditItem(null); }} className="btn-secondary text-sm">Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Menu list */}
                  {menuItems.length === 0 ? (
                    <div className="card p-8 text-center">
                      <UtensilsCrossed size={36} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-500 dark:text-slate-400 text-sm">No menu items yet for {selectedHotel?.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {menuItems.map((item) => (
                        <MenuItemCard key={item._id} item={item} showActions={true}
                          onEdit={openEditItem} onDelete={handleDeleteItem} onToggle={fetchMenu} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Add Hotel Tab */}
          {activeTab === 'add-hotel' && (
            <div className="card p-6 max-w-2xl">
              <h2 className="section-title mb-5">Register New Hotel</h2>
              <form onSubmit={handleHotelSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="label">Hotel Name *</label><input className="input" value={hotelForm.name} onChange={e => setHotelForm({...hotelForm, name: e.target.value})} required /></div>
                  <div><label className="label">Phone</label><input className="input" value={hotelForm.phone} onChange={e => setHotelForm({...hotelForm, phone: e.target.value})} /></div>
                  <div><label className="label">Location / Area *</label><input className="input" value={hotelForm.location} onChange={e => setHotelForm({...hotelForm, location: e.target.value})} required /></div>
                  <div><label className="label">Cuisine Types (comma separated)</label><input className="input" value={hotelForm.cuisine} onChange={e => setHotelForm({...hotelForm, cuisine: e.target.value})} placeholder="North Indian, Chinese" /></div>
                  <div><label className="label">Opening Time</label><input className="input" type="time" value={hotelForm.openingTime} onChange={e => setHotelForm({...hotelForm, openingTime: e.target.value})} /></div>
                  <div><label className="label">Closing Time</label><input className="input" type="time" value={hotelForm.closingTime} onChange={e => setHotelForm({...hotelForm, closingTime: e.target.value})} /></div>
                  <div className="sm:col-span-2"><label className="label">Full Address</label><input className="input" value={hotelForm.address} onChange={e => setHotelForm({...hotelForm, address: e.target.value})} /></div>
                  <div className="sm:col-span-2"><label className="label">Image URL</label><input className="input" value={hotelForm.image} onChange={e => setHotelForm({...hotelForm, image: e.target.value})} placeholder="https://images.unsplash.com/..." /></div>
                  <div className="sm:col-span-2"><label className="label">Description</label><textarea className="input" rows={3} value={hotelForm.description} onChange={e => setHotelForm({...hotelForm, description: e.target.value})} /></div>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-700 dark:text-amber-400">Your hotel will be submitted for admin approval before being listed publicly.</p>
                </div>
                <button type="submit" disabled={loading} className="btn-primary text-sm">
                  {loading ? 'Submitting...' : 'Submit Hotel'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
