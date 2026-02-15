import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Users, Plus, LogOut, Home, Copy, Check, Pencil } from "lucide-react";
import api from "../api/axios";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingBookings: 0,
    availabilitySet: false
  });
  const [events, setEvents] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

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

      setEvents(eventsRes.data.event_types || []);
      setStats({
        totalEvents: eventsRes.data.event_types?.length || 0,
        upcomingBookings: upcoming,
        availabilitySet: availRes.data.data?.length > 0
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const copyEventUrl = (slug) => {
    const url = `${window.location.origin}/${user.user_slug}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(slug);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-2xl font-bold text-orange-600 hover:text-orange-500 transition"
          >
            <Home size={24} />
            <span>Book<span className="text-orange-400">Ease</span></span>
          </button>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 transition">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Home size={16} />
          <span>/</span>
          <span className="text-orange-600 font-medium">Dashboard</span>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}! 👋</h2>
        <p className="text-gray-600 mb-8">Manage your events and bookings</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <Calendar className="text-orange-500 mb-4" size={32} />
            <div className="text-3xl font-bold text-gray-800">{stats.totalEvents}</div>
            <div className="text-sm text-gray-600">Event Types</div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <Users className="text-blue-500 mb-4" size={32} />
            <div className="text-3xl font-bold text-gray-800">{stats.upcomingBookings}</div>
            <div className="text-sm text-gray-600">Upcoming Bookings</div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <Clock className="text-green-500 mb-4" size={32} />
            <div className="text-3xl font-bold text-gray-800">{stats.availabilitySet ? "✓" : "Setup"}</div>
            <div className="text-sm text-gray-600">Availability</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button onClick={() => navigate('/events')} className="bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-2xl shadow-md p-6 hover:shadow-lg transition text-left transform hover:scale-105">
            <Plus className="mb-3" size={24} />
            <h3 className="font-semibold text-lg">Create Event</h3>
            <p className="text-sm opacity-90">Add new event type</p>
          </button>
          <button onClick={() => navigate('/events')} className="bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-2xl shadow-md p-6 hover:shadow-lg transition text-left transform hover:scale-105">
            <Calendar className="mb-3" size={24} />
            <h3 className="font-semibold text-lg">Events</h3>
            <p className="text-sm opacity-90">Manage event types</p>
          </button>
          <button onClick={() => navigate('/availability')} className="bg-gradient-to-r from-green-400 to-green-500 text-white rounded-2xl shadow-md p-6 hover:shadow-lg transition text-left transform hover:scale-105">
            <Clock className="mb-3" size={24} />
            <h3 className="font-semibold text-lg">Availability</h3>
            <p className="text-sm opacity-90">Set your hours</p>
          </button>
          <button onClick={() => navigate('/bookings')} className="bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-2xl shadow-md p-6 hover:shadow-lg transition text-left transform hover:scale-105">
            <Users className="mb-3" size={24} />
            <h3 className="font-semibold text-lg">Bookings</h3>
            <p className="text-sm opacity-90">View appointments</p>
          </button>
        </div>

        {/* Event Types List - Calendly Style */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Your Event Types</h3>
            <button
              onClick={() => navigate('/events')}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm"
            >
              <Plus size={16} />
              New Event Type
            </button>
          </div>

          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map(event => (
                <div 
                  key={event.id} 
                  className={`border border-gray-200 rounded-xl p-5 transition group ${
                    !event.is_active ? 'opacity-70' : 'hover:border-orange-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition">
                          {event.title}
                        </h4>

                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            event.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {event.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{event.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>One-on-One</span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-400 font-mono bg-gray-50 px-3 py-1.5 rounded inline-block">
                        /{user.user_slug}/{event.slug}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => event.is_active && copyEventUrl(event.slug)}
                        disabled={!event.is_active}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-sm ${
                          !event.is_active
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : copiedId === event.slug
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                        }`}
                      >
                        {copiedId === event.slug ? (
                          <>
                            <Check size={16} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copy Link
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => navigate(`/events?edit=${event.id}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-orange-500" size={32} />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">No event types yet</h4>
              <p className="text-gray-600 mb-4">Create your first event type to start accepting bookings</p>
              <button
                onClick={() => navigate('/events')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition"
              >
                <Plus size={20} />
                Create Event Type
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}