import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Calendar, Clock, Mail, Phone, User, Trash2, ChevronRight } from "lucide-react";
import api from "../api/axios";

export default function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      loadBookings();
    } catch (error) {
      alert('Failed to cancel booking');
    }
  };

  const now = new Date();
  const filtered = bookings.filter(b => {
    const startDate = new Date(b.start_datetime);
    if (filter === 'upcoming') return startDate > now && b.status === 'scheduled';
    if (filter === 'past') return startDate <= now || b.status !== 'scheduled';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-2xl font-bold text-orange-600 hover:text-orange-500 transition"
          >
            <Home size={24} />
            <span>Book<span className="text-orange-400">Ease</span></span>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/dashboard')} className="hover:text-orange-600 transition">
            <Home size={16} />
          </button>
          <ChevronRight size={16} />
          <span className="text-orange-600 font-medium">Bookings</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Bookings</h1>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              filter === 'upcoming' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-orange-50'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              filter === 'past' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-orange-50'
            }`}
          >
            Past
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              filter === 'all' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-orange-50'
            }`}
          >
            All
          </button>
        </div>

        <div className="space-y-4">
          {filtered.map(booking => (
            <div key={booking.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {booking.event_type?.title || 'Event'}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{booking.guest_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span>{booking.guest_email}</span>
                    </div>
                    {booking.guest_phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>{booking.guest_phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{new Date(booking.start_datetime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>
                        {new Date(booking.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(booking.end_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === 'scheduled' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                  {new Date(booking.start_datetime) > now && booking.status === 'scheduled' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No {filter !== 'all' ? filter : ''} bookings found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}