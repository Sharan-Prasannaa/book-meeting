import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, ArrowLeft } from "lucide-react";
import api from "../../api/axios";

export default function PublicBooking() {
  const { userSlug, eventSlug } = useParams();
  const navigate = useNavigate();
  const [eventType, setEventType] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: ''
  });
  const [step, setStep] = useState(1);

  useEffect(() => {
    loadEventType();
  }, [userSlug, eventSlug]);

  useEffect(() => {
    if (selectedDate) loadSlots();
  }, [selectedDate]);

  const loadEventType = async () => {
    try {
      const res = await api.get(`/${userSlug}/${eventSlug}`);
      setEventType(res.data.event_type);
    } catch (error) {
      console.error('Failed to load event:', error);
    }
  };

  const loadSlots = async () => {
    try {
      const res = await api.get(`/${userSlug}/${eventSlug}/available-slots?date=${selectedDate}`);
      setSlots(res.data.slots || []);
    } catch (error) {
      console.error('Failed to load slots:', error);
      setSlots([]);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/${userSlug}/${eventSlug}/book`, {
        start_datetime: selectedSlot.start_datetime,
        end_datetime: selectedSlot.end_datetime,
        ...formData
      });
      setStep(4);
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed');
    }
  };

  if (!eventType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate(`/${userSlug}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="border-b pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{eventType.title}</h1>
            {eventType.description && (
              <p className="text-gray-600 mb-3">{eventType.description}</p>
            )}
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={18} />
              <span>{eventType.duration} minutes</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">with {eventType.host.name}</p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Select a Date</h2>
              <input
                type="date"
                min={minDate}
                max={maxDate}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null);
                  if (e.target.value) setStep(2);
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-lg"
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Select a Time on {new Date(selectedDate).toLocaleDateString()}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                {slots.filter(s => s.status === 'available').map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedSlot(slot);
                      setStep(3);
                    }}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition font-medium"
                  >
                    {slot.start_time}
                  </button>
                ))}
              </div>
              {slots.filter(s => s.status === 'available').length === 0 && (
                <p className="text-center text-gray-500 py-8">No available slots for this date.</p>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Details</h2>
              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  <strong>{new Date(selectedDate).toLocaleDateString()}</strong> at{' '}
                  <strong>{selectedSlot?.start_time}</strong>
                </p>
              </div>
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.guest_name}
                    onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.guest_email}
                    onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone (optional)</label>
                  <input
                    type="tel"
                    value={formData.guest_phone}
                    onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition"
                >
                  Confirm Booking
                </button>
              </form>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Your meeting with {eventType.host.name} has been scheduled for{' '}
                <strong>{new Date(selectedDate).toLocaleDateString()}</strong> at{' '}
                <strong>{selectedSlot?.start_time}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                A confirmation email has been sent to {formData.guest_email}
              </p>
              <button
                onClick={() => navigate(`/${userSlug}`)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition"
              >
                Back to Event Types
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}