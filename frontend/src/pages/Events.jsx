import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Edit2, Trash2, Home, Clock, ChevronRight } from "lucide-react";
import api from "../api/axios";

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 30,
    is_active: true
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await api.get('/event-types');
      const eventList = res.data.event_types || [];
      setEvents(eventList);

      const editId = searchParams.get("edit");
      if (editId) {
        const eventToEdit = eventList.find(e => e.id == editId);
        if (eventToEdit) {
          startEdit(eventToEdit);
        }
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await api.put(`/event-types/${editingEvent.id}`, formData);
      } else {
        await api.post('/event-types', formData);
      }
     
      // Clear edit param from URL
      navigate('/events');
      await loadEvents();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save event');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event type?')) return;
    try {
      await api.delete(`/event-types/${id}`);
      loadEvents();
    } catch (error) {
      alert('Failed to delete event');
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", duration: 30, is_active: true });
    setEditingEvent(null);
    setShowForm(false);
  };

  const startEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description || "",
      duration: event.duration,
      is_active: event.is_active
    });
    setEditingEvent(event);
    setShowForm(true);
  };

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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/dashboard')} className="hover:text-orange-600 transition">
            <Home size={16} />
          </button>
          <ChevronRight size={16} />
          <span className="text-orange-600 font-medium">Event Types</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Event Types</h1>

        {!showForm ? (
          <>
            <button
              onClick={() => setShowForm(true)}
              className="mb-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-md hover:shadow-lg transition"
            >
              <Plus size={20} />
              Create Event Type
            </button>

            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-3">{event.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={16} />
                        {event.duration} minutes
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(event)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No event types yet. Create your first one!
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingEvent ? 'Edit Event Type' : 'Create Event Type'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 30 Minute Meeting"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="3"
                  placeholder="Brief description of this meeting type"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  required
                  min="5"
                //   step="5"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                    <label className="text-sm font-medium text-gray-700">
                    Active Status
                    </label>
                    <p className="text-xs text-gray-500">
                    Inactive events won't appear on your public booking page.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                    setFormData({ ...formData, is_active: !formData.is_active })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    formData.is_active ? "bg-orange-500" : "bg-gray-300"
                    }`}
                >
                    <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        formData.is_active ? "translate-x-6" : "translate-x-1"
                    }`}
                    />
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition"
                >
                  {editingEvent ? 'Update' : 'Create'} Event
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}