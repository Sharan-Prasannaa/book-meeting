import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Plus, Trash2, ChevronRight } from "lucide-react";
import api from "../api/axios";

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function Availability() {
  const navigate = useNavigate();
  const [availabilities, setAvailabilities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    day_of_week: 'monday',
    start_time: '09:00',
    end_time: '17:00'
  });
  const [blockDate, setBlockDate] = useState('');

  useEffect(() => {
    loadAvailabilities();
  }, []);

  const loadAvailabilities = async () => {
    try {
      const res = await api.get('/availabilities');
      setAvailabilities(res.data.data || []);
    } catch (error) {
      console.error('Failed to load availability:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/availabilities', formData);
      loadAvailabilities();
      setShowForm(false);
      setFormData({ day_of_week: 'monday', start_time: '09:00', end_time: '17:00' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add availability');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this availability?')) return;
    try {
      await api.delete(`/availabilities/${id}`);
      loadAvailabilities();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const handleBlockDate = async (e) => {
    e.preventDefault();
    if (!blockDate) return;
    try {
      await api.post('/availabilities/block-date', { blocked_date: blockDate });
      alert('Date blocked successfully');
      setBlockDate('');
      loadAvailabilities();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to block date');
    }
  };

  const groupedAvail = DAYS.reduce((acc, day) => {
    acc[day] = availabilities.filter(a => a.day_of_week === day && !a.is_blocked);
    return acc;
  }, {});

  const blockedDates = availabilities.filter(a => a.is_blocked);

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
          <span className="text-orange-600 font-medium">Availability</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Availability</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-md hover:shadow-lg transition"
          >
            <Plus size={20} />
            Add Availability Hours
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Availability</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                <select
                  value={formData.day_of_week}
                  onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {DAYS.map(day => (
                    <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 px-6 py-2 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition">
                  Add
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Block Specific Date</h3>
          <form onSubmit={handleBlockDate} className="flex gap-3">
            <input
              type="date"
              value={blockDate}
              onChange={(e) => setBlockDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <button type="submit" className="px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition">
              Block Date
            </button>
          </form>
          {blockedDates.length > 0 && (
            <div className="mt-4 space-y-2">
              {blockedDates.map(blocked => (
                <div key={blocked.id} className="flex justify-between items-center py-2 px-4 bg-red-50 rounded-lg">
                  <span className="text-sm text-gray-700">{blocked.blocked_date}</span>
                  <button onClick={() => handleDelete(blocked.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {DAYS.map(day => (
            <div key={day} className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 capitalize">{day}</h3>
              {groupedAvail[day]?.length > 0 ? (
                <div className="space-y-2">
                  {groupedAvail[day].map(avail => (
                    <div key={avail.id} className="flex justify-between items-center py-2 px-4 bg-orange-50 rounded-lg">
                      <span className="text-gray-700">{avail.start_time} - {avail.end_time}</span>
                      <button onClick={() => handleDelete(avail.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No availability set</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}