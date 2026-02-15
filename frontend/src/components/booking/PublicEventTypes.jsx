import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, Calendar, ArrowRight, User } from "lucide-react";
import api from "../../api/axios";
import toast, { Toaster } from "react-hot-toast";

export default function PublicEventTypes() {
  const { username } = useParams(); // Get username from URL
  const [host, setHost] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHostEventTypes();
  }, [username]);

  const fetchHostEventTypes = async () => {
    try {
      const res = await api.get(`/${username}/event-types`);
      setHost(res.data.host);
      setEventTypes(res.data.event_types || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Host not found");
      // Optionally redirect to home after 2 seconds
      setTimeout(() => navigate("/"), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-orange-600">BookEase</h1>
              {host && (
                <div className="flex items-center mt-2 text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-medium">{host.name}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-orange-500 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Event Types Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {!host ? (
          <div className="text-center py-20">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Host Not Found
            </h3>
            <p className="text-gray-500">
              The booking page you're looking for doesn't exist
            </p>
          </div>
        ) : eventTypes.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Event Types Available
            </h3>
            <p className="text-gray-500">
              {host.name} hasn't set up any meeting types yet
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Book a Meeting with {host.name}
              </h2>
              <p className="text-gray-600 text-lg">
                Choose a meeting type below to get started
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventTypes.map((eventType) => (
                <EventTypeCard
                  key={eventType.id}
                  eventType={eventType}
                  username={username}
                  onClick={() => navigate(`/${username}/${eventType.slug}`)}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

function EventTypeCard({ eventType, username, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {eventType.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {eventType.description}
          </p>
        </div>
        <div className="bg-orange-100 p-2 rounded-lg">
          <Calendar className="w-5 h-5 text-orange-600" />
        </div>
      </div>

      <div className="flex items-center text-gray-700 mb-4">
        <Clock className="w-4 h-4 mr-2 text-orange-500" />
        <span className="text-sm font-medium">{eventType.duration} minutes</span>
      </div>

      <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center group hover:shadow-lg transition-all">
        Book Now
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}