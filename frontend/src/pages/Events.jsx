import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, ArrowLeft, Clock } from "lucide-react";
import api from "../api/axios";

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 30
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await api.get('/event-types');
      setEvents(res.data.event_types || []);
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
      loadEvents();
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
    setFormData({ title: "", description: "", duration: 30 });
    setEditingEvent(null);
    setShowForm(false);
  };

  const startEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description || "",
      duration: event.duration
    });
    setEditingEvent(event);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-orange-600">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-orange-600">Event Types</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
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
                  step="5"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
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