import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, ChevronRight, Heart } from 'lucide-react';
import { useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const HotelCard = ({ hotel, isFavorite: initFav = false }) => {
  const { isAuthenticated } = useAuth();
  const [fav, setFav] = useState(initFav);
  const [loading, setLoading] = useState(false);

  const handleFav = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please sign in to save favorites'); return; }
    setLoading(true);
    try {
      await API.post(`/users/preferences/hotel/${hotel._id}`);
      setFav((p) => !p);
      toast.success(fav ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/hotel/${hotel._id}`} className="card hover:shadow-card-hover transition-all duration-300 group overflow-hidden block">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop'; }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Status badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`badge text-xs font-medium ${hotel.isOpen ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}>
            {hotel.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFav}
          disabled={loading}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            fav ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-500 hover:text-red-500'
          }`}
        >
          <Heart size={15} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-slate-800 dark:text-white text-base leading-snug group-hover:text-primary-500 transition-colors line-clamp-1">
            {hotel.name}
          </h3>
          {hotel.rating > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{hotel.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-3">{hotel.description}</p>

        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {hotel.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {hotel.openingTime}–{hotel.closingTime}
          </span>
        </div>

        {hotel.cuisine?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {hotel.cuisine.slice(0, 3).map((c) => (
              <span key={c} className="badge badge-blue text-xs">{c}</span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary-500 group-hover:gap-2 transition-all">
          View Menu <ChevronRight size={13} />
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
