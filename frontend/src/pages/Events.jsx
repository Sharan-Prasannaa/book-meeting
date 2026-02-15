import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Edit2, Trash2, Home, Clock, ChevronRight, Calendar, Users } from "lucide-react";
import api from "../api/axios";

// ============ MAIN COMPONENT ============
export default function Events() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await api.get('/event-types');
      const eventList = res.data.event_types || [];
      setEvents(eventList);

      // Handle edit parameter from URL
      const editId = searchParams.get("edit");
      if (editId) {
        const eventToEdit = eventList.find(e => e.id == editId);
        if (eventToEdit) {
          handleEdit(eventToEdit);
        }
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const handleCreate = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event type?')) return;
    
    try {
      await api.delete(`/event-types/${id}`);
      await loadEvents();
    } catch (error) {
      alert('Failed to delete event');
    }
  };

  const handleFormSuccess = async () => {
    navigate('/events'); // Clear URL params
    await loadEvents();
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      <Header navigate={navigate} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb navigate={navigate} />
        
        <PageHeader />

        {showForm ? (
          <EventForm 
            event={editingEvent}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        ) : (
          <EventList 
            events={events}
            onCreateClick={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

// ============ HEADER COMPONENT ============
function Header({ navigate }) {
  return (
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
  );
}

// ============ BREADCRUMB COMPONENT ============
function Breadcrumb({ navigate }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="hover:text-orange-600 transition"
      >
        <Home size={16} />
      </button>
      <ChevronRight size={16} />
      <span className="text-orange-600 font-medium">Event Types</span>
    </div>
  );
}

// ============ PAGE HEADER COMPONENT ============
function PageHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Event Types</h1>
      <p className="text-gray-600">Create and manage your event types for scheduling</p>
    </div>
  );
}

// ============ EVENT LIST COMPONENT ============
function EventList({ events, onCreateClick, onEdit, onDelete }) {
  return (
    <>
      <button
        onClick={onCreateClick}
        className="mb-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105"
      >
        <Plus size={20} />
        Create Event Type
      </button>

      {events.length === 0 ? (
        <EmptyState onCreateClick={onCreateClick} />
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <EventCard 
              key={event.id}
              event={event}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}

// ============ EVENT CARD COMPONENT ============
function EventCard({ event, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              event.is_active ? 'bg-orange-100' : 'bg-gray-200'
            }`}>
              <Calendar className={event.is_active ? 'text-orange-600' : 'text-gray-400'} size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
              <StatusBadge isActive={event.is_active} />
            </div>
          </div>
          
          {event.description && (
            <p className="text-gray-600 mb-4 ml-15">{event.description}</p>
          )}
          
          <div className="flex items-center gap-6 text-sm text-gray-500 ml-15">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span className="font-medium">{event.duration} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>One-on-One</span>
            </div>
          </div>
        </div>

        <EventCardActions 
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

// ============ STATUS BADGE COMPONENT ============
function StatusBadge({ isActive }) {
  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
      isActive 
        ? 'bg-green-100 text-green-700' 
        : 'bg-red-100 text-red-600'
    }`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

// ============ EVENT CARD ACTIONS COMPONENT ============
function EventCardActions({ event, onEdit, onDelete }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onEdit(event)}
        className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
        title="Edit event"
      >
        <Edit2 size={18} />
      </button>
      <button
        onClick={() => onDelete(event.id)}
        className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
        title="Delete event"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

// ============ EMPTY STATE COMPONENT ============
function EmptyState({ onCreateClick }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-12 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Calendar className="text-orange-600" size={40} />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">No event types yet</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Create your first event type to start accepting bookings from clients and colleagues
      </p>
      <button
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-bold hover:shadow-xl transition-all transform hover:scale-105"
      >
        <Plus size={22} />
        Create Your First Event Type
      </button>
    </div>
  );
}

// ============ EVENT FORM COMPONENT ============
function EventForm({ event, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    duration: event?.duration || 30,
    is_active: event?.is_active ?? true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (event) {
        await api.put(`/event-types/${event.id}`, formData);
      } else {
        await api.post('/event-types', formData);
      }
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <FormHeader isEditing={!!event} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <TitleInput 
          value={formData.title}
          onChange={(title) => updateFormData({ title })}
        />

        <DescriptionInput 
          value={formData.description}
          onChange={(description) => updateFormData({ description })}
        />

        <DurationInput 
          value={formData.duration}
          onChange={(duration) => updateFormData({ duration })}
        />

        <ActiveStatusToggle 
          isActive={formData.is_active}
          onChange={(is_active) => updateFormData({ is_active })}
        />

        <FormActions 
          isEditing={!!event}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
}

// ============ FORM HEADER COMPONENT ============
function FormHeader({ isEditing }) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        {isEditing ? 'Edit Event Type' : 'Create Event Type'}
      </h2>
      <p className="text-gray-600">
        {isEditing 
          ? 'Update the details of your event type' 
          : 'Set up a new event type for your bookings'}
      </p>
    </div>
  );
}

// ============ TITLE INPUT COMPONENT ============
function TitleInput({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Event Title <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
        placeholder="e.g., 30 Minute Meeting, Discovery Call, Consultation"
      />
    </div>
  );
}

// ============ DESCRIPTION INPUT COMPONENT ============
function DescriptionInput({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Description
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
        rows="4"
        placeholder="Brief description of this meeting type (optional)"
      />
      <p className="text-xs text-gray-500 mt-1">
        This will be shown to people when they book this event type
      </p>
    </div>
  );
}

// ============ DURATION INPUT COMPONENT ============
function DurationInput({ value, onChange }) {
  const commonDurations = [15, 30, 45, 60, 90, 120];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Duration (minutes) <span className="text-red-500">*</span>
      </label>
      
      {/* Quick select buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        {commonDurations.map(duration => (
          <button
            key={duration}
            type="button"
            onClick={() => onChange(duration)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              value === duration
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {duration} min
          </button>
        ))}
      </div>

      {/* Custom input */}
      <input
        type="number"
        required
        min="5"
        max="480"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 5)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
        placeholder="Enter custom duration"
      />
      <p className="text-xs text-gray-500 mt-1">
        Minimum 5 minutes, maximum 8 hours (480 minutes)
      </p>
    </div>
  );
}

// ============ ACTIVE STATUS TOGGLE COMPONENT ============
function ActiveStatusToggle({ isActive, onChange }) {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
      <div className="flex-1">
        <label className="text-sm font-semibold text-gray-800 mb-1 block">
          Active Status
        </label>
        <p className="text-xs text-gray-600">
          Inactive events won't appear on your public booking page and cannot be booked
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!isActive)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
          isActive ? "bg-orange-500 shadow-lg shadow-orange-200" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-300 shadow-md ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

// ============ FORM ACTIONS COMPONENT ============
function FormActions({ isEditing, isSubmitting, onCancel }) {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting 
          ? 'Saving...' 
          : isEditing 
            ? 'Update Event Type' 
            : 'Create Event Type'}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
    </div>
  );
}