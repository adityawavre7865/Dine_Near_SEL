import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Star, Phone, ArrowLeft, UtensilsCrossed } from 'lucide-react';
import Navbar from '../components/Navbar';
import MenuItemCard from '../components/MenuItemCard';
import SearchBar from '../components/SearchBar';
import API from '../api/axios';

const CATEGORIES = ['all', 'breakfast', 'lunch', 'dinner', 'snacks', 'beverages', 'desserts'];

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelRes, menuRes] = await Promise.all([
          API.get(`/hotels/${id}`),
          API.get(`/menu/${id}`),
        ]);
        setHotel(hotelRes.data.hotel);
        setItems(menuRes.data.items || []);
        setFiltered(menuRes.data.items || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSearch = (q) => {
    const base = activeCategory === 'all' ? items : items.filter(i => i.category === activeCategory);
    setFiltered(base.filter(i => i.name.toLowerCase().includes(q.toLowerCase())));
  };

  const handleCategoryFilter = (cat) => {
    setActiveCategory(cat);
    setFiltered(cat === 'all' ? items : items.filter(i => i.category === cat));
  };

  if (loading) return (
    <div className="min-h-screen bg-surface-secondary dark:bg-slate-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="h-72 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse mb-6" />
        <div className="space-y-3">
          {Array(4).fill(0).map((_, i) => <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />)}
        </div>
      </div>
    </div>
  );

  if (!hotel) return (
    <div className="min-h-screen bg-surface-secondary dark:bg-slate-900">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-24">
        <UtensilsCrossed size={48} className="text-slate-300 mb-4" />
        <p className="text-slate-500">Restaurant not found</p>
        <Link to="/" className="btn-primary mt-4 text-sm">Back to Home</Link>
      </div>
    </div>
  );

  const grouped = CATEGORIES.slice(1).reduce((acc, cat) => {
    const inCat = filtered.filter(i => i.category === cat);
    if (inCat.length) acc[cat] = inCat;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-slate-900">
      <Navbar />

      {/* Hero banner */}
      <div className="relative h-72 overflow-hidden">
        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <Link to="/" className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm font-medium hover:bg-white/30 transition-all">
          <ArrowLeft size={15} /> Back
        </Link>
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-3xl font-bold mb-1">{hotel.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
            <span className="flex items-center gap-1"><MapPin size={13} />{hotel.location}</span>
            <span className="flex items-center gap-1"><Clock size={13} />{hotel.openingTime}–{hotel.closingTime}</span>
            {hotel.phone && <span className="flex items-center gap-1"><Phone size={13} />{hotel.phone}</span>}
            {hotel.rating > 0 && <span className="flex items-center gap-1"><Star size={13} className="text-amber-400 fill-amber-400" />{hotel.rating} ({hotel.totalRatings} reviews)</span>}
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${hotel.isOpen ? 'bg-emerald-500/80' : 'bg-slate-500/80'}`}>{hotel.isOpen ? 'Open Now' : 'Closed'}</span>
          </div>
          {hotel.cuisine?.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {hotel.cuisine.map(c => <span key={c} className="text-xs px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full">{c}</span>)}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Description */}
        {hotel.description && (
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed max-w-2xl">{hotel.description}</p>
        )}

        {/* Search + category filter */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} placeholder="Search menu items..." onFilter={() => {}} />
          <div className="flex gap-2 mt-3 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => handleCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${activeCategory === cat ? 'bg-primary-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-300'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu grouped by category */}
        {filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <UtensilsCrossed size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No items found</p>
          </div>
        ) : activeCategory === 'all' ? (
          Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat} className="mb-8">
              <h2 className="section-title capitalize mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary-500 rounded-full inline-block" />
                {cat}
                <span className="text-xs text-slate-400 font-normal">({catItems.length} items)</span>
              </h2>
              <div className="space-y-3">
                {catItems.map(item => <MenuItemCard key={item._id} item={item} />)}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-3">
            {filtered.map(item => <MenuItemCard key={item._id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  );
}
