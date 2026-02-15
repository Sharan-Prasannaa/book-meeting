import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Users, Plus, LogOut } from "lucide-react";
import api from "../api/axios";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingBookings: 0,
    availabilitySet: false
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsRes, bookingsRes, availRes] = await Promise.all([
          api.get('/event-types'),
          api.get('/bookings'),
          api.get('/availabilities')
        ]);

        const upcoming = bookingsRes.data.bookings?.filter(b => 
          b.status === 'scheduled' && new Date(b.start_datetime) > new Date()
        ).length || 0;

        setStats({
          totalEvents: eventsRes.data.event_types?.length || 0,
          upcomingBookings: upcoming,
          availabilitySet: availRes.data.data?.length > 0
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">
            Book<span className="text-orange-400">Ease</span>
          </h1>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 transition">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}! 👋</h2>
        <p className="text-gray-600 mb-8">Manage your events and bookings</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <Calendar className="text-orange-500 mb-4" size={32} />
            <div className="text-3xl font-bold text-gray-800">{stats.totalEvents}</div>
            <div className="text-sm text-gray-600">Event Types</div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <Users className="text-blue-500 mb-4" size={32} />
            <div className="text-3xl font-bold text-gray-800">{stats.upcomingBookings}</div>
            <div className="text-sm text-gray-600">Upcoming Bookings</div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <Clock className="text-green-500 mb-4" size={32} />
            <div className="text-3xl font-bold text-gray-800">{stats.availabilitySet ? "✓" : "Setup"}</div>
            <div className="text-sm text-gray-600">Availability</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => navigate('/events')} className="bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-2xl shadow-md p-6 hover:shadow-lg transition text-left">
            <Plus className="mb-3" size={24} />
            <h3 className="font-semibold text-lg">Create Event</h3>
            <p className="text-sm opacity-90">Add new event type</p>
          </button>
          <button onClick={() => navigate('/events')} className="bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-2xl shadow-md p-6 hover:shadow-lg transition text-left">
            <Calendar className="mb-3" size={24} />
            <h3 className="font-semibold text-lg">Events</h3>
            <p className="text-sm opacity-90">Manage event types</p>
          </button>
          <button onClick={() => navigate('/availability')} className="bg-gradient-to-r from-green-400 to-green-500 text-white rounded-2xl shadow-md p-6 hover:shadow-lg transition text-left">
            <Clock className="mb-3" size={24} />
            <h3 className="font-semibold text-lg">Availability</h3>
            <p className="text-sm opacity-90">Set your hours</p>
          </button>
          <button onClick={() => navigate('/bookings')} className="bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-2xl shadow-md p-6 hover:shadow-lg transition text-left">
            <Users className="mb-3" size={24} />
            <h3 className="font-semibold text-lg">Bookings</h3>
            <p className="text-sm opacity-90">View appointments</p>
          </button>
        </div>

        {user?.user_slug && (
          <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Booking Page</h3>
            <div className="flex items-center gap-3">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/${user.user_slug}`}
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/${user.user_slug}`);
                  alert('Link copied!');
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}