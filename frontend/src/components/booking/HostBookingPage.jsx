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
      <div className="max-w-5xl mx-auto px-4 py-16">
  
        {/* HERO SECTION */}
        <div className="text-center mb-14">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
            {host.name.charAt(0).toUpperCase()}
          </div>
  
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Book a Meeting with {host.name}
          </h1>
  
          <p className="text-gray-600 text-lg mb-2">
            Choose an event type below to schedule a time.
          </p>
  
          <p className="text-sm text-gray-500">
            All times are shown in Asia/Kolkata
          </p>
        </div>
  
  
        {/* EVENT TYPES LIST */}
        {eventTypes.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {eventTypes.map(event => (
              <Link
                key={event.id}
                to={`/${userSlug}/${event.slug}`}
                className="group bg-white rounded-2xl shadow-md p-6 hover:shadow-2xl transition-all transform hover:scale-[1.02] border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition">
                    {event.title}
                  </h3>
  
                  <span className="text-xs px-3 py-1 bg-orange-100 text-orange-600 rounded-full font-medium">
                    {event.duration} min
                  </span>
                </div>
  
                {event.description && (
                  <p className="text-gray-600 mb-5 text-sm leading-relaxed">
                    {event.description}
                  </p>
                )}
  
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{event.duration} minutes</span>
                  </div>
  
                  <div className="flex items-center gap-2 text-orange-600 font-medium group-hover:gap-3 transition-all">
                    <Calendar size={16} />
                    <span>Book Now</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <Calendar size={40} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Event Types Available
            </h3>
            <p className="text-gray-500">
              {host.name} hasn’t created any public events yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );  
}