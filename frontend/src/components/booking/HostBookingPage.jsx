import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";
import api from "../../api/axios";

export default function HostBookingPage() {
  const { userSlug } = useParams();
  const [host, setHost] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHostData();
  }, [userSlug]);

  const loadHostData = async () => {
    try {
      const res = await api.get(`/${userSlug}/event-types`);
      setHost(res.data.host);
      setEventTypes(res.data.event_types);
    } catch (error) {
      console.error('Failed to load host data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!host) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Host not found</h2>
          <p className="text-gray-600">The booking page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
            {host.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{host.name}</h1>
          <p className="text-gray-600">Select an event type to book a meeting</p>
        </div>

        <div className="space-y-4">
          {eventTypes.map(event => (
            <Link
              key={event.id}
              to={`/${userSlug}/${event.slug}`}
              className="block bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition transform hover:scale-[1.02]"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
              {event.description && (
                <p className="text-gray-600 mb-4">{event.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{event.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>Book a time</span>
                </div>
              </div>
            </Link>
          ))}

          {eventTypes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No event types available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}