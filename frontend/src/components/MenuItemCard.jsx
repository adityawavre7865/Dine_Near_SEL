import { Heart, Star, Leaf } from 'lucide-react';
import { useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const categoryColors = {
  breakfast: 'badge-yellow',
  lunch: 'badge-blue',
  dinner: 'badge-blue',
  snacks: 'badge-yellow',
  beverages: 'badge-blue',
  desserts: 'badge-yellow',
  other: 'badge-blue',
};

const MenuItemCard = ({ item, isFavorite: initFav = false, showActions = false, onEdit, onDelete, onToggle }) => {
  const { isAuthenticated } = useAuth();
  const [fav, setFav] = useState(initFav);
  const [available, setAvailable] = useState(item.isAvailable);

  const handleFav = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please sign in to save favorites'); return; }
    try {
      await API.post(`/users/preferences/item/${item._id}`);
      setFav((p) => !p);
      toast.success(fav ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleToggle = async () => {
    try {
      await API.patch(`/menu/item/${item._id}/availability`);
      setAvailable((p) => !p);
      toast.success(`Marked as ${available ? 'unavailable' : 'available'}`);
      onToggle?.();
    } catch {
      toast.error('Failed to update availability');
    }
  };

  return (
    <div className={`card p-4 flex gap-4 group transition-all duration-200 hover:shadow-card-hover ${!available ? 'opacity-60' : ''}`}>
      {/* Image */}
      <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop'; }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {/* Veg indicator */}
            <div className={`w-4 h-4 shrink-0 rounded-sm border-2 flex items-center justify-center ${item.isVeg ? 'border-emerald-500' : 'border-red-500'}`}>
              <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white text-sm truncate">{item.name}</h4>
          </div>
          <button onClick={handleFav} className={`shrink-0 transition-colors ${fav ? 'text-red-500' : 'text-slate-300 hover:text-red-400'}`}>
            <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.description}</p>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`badge ${categoryColors[item.category] || 'badge-blue'} capitalize`}>{item.category}</span>
          {!available && <span className="badge badge-red">Unavailable</span>}
          {item.tags?.includes('bestseller') && <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">🔥 Bestseller</span>}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800 dark:text-white text-sm">₹{item.price}</span>
            {item.rating > 0 && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Star size={11} className="text-amber-400 fill-amber-400" />{item.rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Owner actions */}
          {showActions && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggle}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                  available
                    ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'
                }`}
              >
                {available ? 'Mark Unavailable' : 'Mark Available'}
              </button>
              <button onClick={() => onEdit?.(item)} className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 transition-colors">
                Edit
              </button>
              <button onClick={() => onDelete?.(item._id)} className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-500 dark:bg-slate-700 dark:text-slate-400 transition-colors">
                Del
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
