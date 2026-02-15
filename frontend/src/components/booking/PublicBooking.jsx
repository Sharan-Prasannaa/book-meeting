import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Home, Edit2, User, ArrowLeft } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../api/axios";

const bookingSchema = yup.object().shape({
  guest_name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
  guest_email: yup.string().required("Email is required").email("Please enter a valid email address"),
  guest_phone: yup.string(),
});

export default function PublicBooking() {
  const { userSlug, eventSlug } = useParams();
  const navigate = useNavigate();
  const [eventType, setEventType] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookingData, setBookingData] = useState(null);
  const { user } = useContext(AuthContext);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(bookingSchema),
    defaultValues: {
      guest_name: '',
      guest_email: '',
      guest_phone: ''
    }
  });

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

  const onSubmit = async (data) => {
    try {
      await api.post(`/${userSlug}/${eventSlug}/book`, {
        start_datetime: selectedSlot.start_datetime,
        end_datetime: selectedSlot.end_datetime,
        guest_name: data.guest_name,
        guest_email: data.guest_email,
        guest_phone: data.guest_phone || null,
      });
      setBookingData(data);
      setStep(4);
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  if (!eventType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 flex items-center justify-center">
        <div className="text-xl text-gray-600">No event Available...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Conditional Header for Host Only */}
        {user && user.user_slug === userSlug && (
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-orange-600 rounded-lg hover:bg-white shadow-sm hover:shadow-md transition"
            >
              <Home size={18} />
              Dashboard
            </button>
            <button
              onClick={() => navigate('/events')}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-blue-600 rounded-lg hover:bg-white shadow-sm hover:shadow-md transition"
            >
              <Edit2 size={18} />
              Edit Event Type
            </button>
          </div>
        )}

        {/* Event Header - Outside Container */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">{eventType.title}</h1>
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
            <User size={18} />
            <span className="text-lg">1-on-1 meeting with {eventType.host.name}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-orange-600 font-semibold">
            <Clock size={18} />
            <span>{eventType.duration} minutes</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Modern Progress Indicator with Previous Button */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-md mx-auto relative">
              {[
                { num: 1, label: 'Date' },
                { num: 2, label: 'Time' },
                { num: 3, label: 'Details' }
              ].map((item, idx) => (
                <div key={item.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      step >= item.num 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-110' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {step > item.num ? '✓' : item.num}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${step >= item.num ? 'text-orange-600' : 'text-gray-400'}`}>
                      {item.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div className={`h-1 flex-1 mx-2 rounded transition-all duration-300 ${
                      step > item.num ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            {/* Previous Button Inside Container */}
            {step > 1 && (
              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setStep(step - 1);
                    if (step === 2) {
                      setSelectedDate('');
                      setSlots([]);
                    } else if (step === 3) {
                      setSelectedSlot(null);
                    }
                  }}
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition font-medium group"
                >
                  <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                  Go Back
                </button>
              </div>
            )}
          </div>

          {/* Step 1: Calendar Date Selection */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select a Date</h2>
              
              {/* Calendly-style Single Month Calendar */}
              <div className="max-w-md mx-auto">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => {
                      const newDate = new Date(currentMonth);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setCurrentMonth(newDate);
                    }}
                    disabled={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
                    className="p-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <h3 className="text-lg font-semibold text-gray-800">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  
                  <button
                    onClick={() => {
                      const newDate = new Date(currentMonth);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setCurrentMonth(newDate);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Day headers - MON to SUN */}
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Generate calendar dates */}
                  {(() => {
                    const year = currentMonth.getFullYear();
                    const month = currentMonth.getMonth();
                    const firstDay = new Date(year, month, 1);
                    const lastDay = new Date(year, month + 1, 0);
                    const daysInMonth = lastDay.getDate();
                    
                    // Adjust for Monday start (0 = Monday, 6 = Sunday)
                    let startDay = firstDay.getDay() - 1;
                    if (startDay === -1) startDay = 6;
                    
                    const dates = [];
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    // Empty cells before first day
                    for (let i = 0; i < startDay; i++) {
                      dates.push(<div key={`empty-${i}`} />);
                    }
                    
                    // Date cells
                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(year, month, day);
                      const dateStr = date.getFullYear() +
                        "-" +
                        String(date.getMonth() + 1).padStart(2, "0") +
                        "-" +
                        String(date.getDate()).padStart(2, "0");
                      const isSelected = selectedDate === dateStr;
                      const isToday = date.getTime() === today.getTime();
                      const isPast = date < today;
                      const maxDate = new Date();
                      maxDate.setDate(maxDate.getDate() + 60);

                      const isInNext60Days = date <= maxDate;
                      
                      dates.push(
                        <button
                          key={day}
                          onClick={() => {
                            if (!isPast && isInNext60Days) {
                              setSelectedDate(dateStr);
                              setSelectedSlot(null);
                            }
                          }}
                          disabled={isPast || !isInNext60Days}
                          className={`aspect-square rounded-full flex items-center justify-center font-medium transition-all text-sm ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-lg scale-110'
                              : isToday
                              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                              : isPast || !isInNext60Days
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-700 hover:bg-blue-50'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    }
                    
                    return dates;
                  })()}
                </div>

                {selectedDate && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setStep(2)}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      Continue to Select Time →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Time Selection */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Select a Time</h2>
                <p className="text-gray-600">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString('en-US', { 
                    timeZone: "Asia/Kolkata",
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {slots.filter(s => s.status === 'available').length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto px-2">
                  {slots.filter(s => s.status === 'available').map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setStep(3);
                      }}
                      className="group relative px-4 py-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100 transition-all transform hover:scale-105 hover:shadow-lg"
                    >
                      <div className="font-semibold text-gray-800 group-hover:text-orange-600 transition">
                        {slot.start_time}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {slot.start_time} - {slot.end_time}
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-600 mb-4">No available slots for this date</p>
                  <button
                    onClick={() => {
                      setSelectedDate('');
                      setStep(1);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full font-semibold hover:shadow-lg transition"
                  >
                    ← Choose Another Date
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Booking Form */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Enter Your Details</h2>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-4 mb-6 text-center">
                <p className="text-gray-700">
                  <span className="font-semibold">{new Date(selectedDate + "T00:00:00").toLocaleDateString('en-US', { timeZone: "Asia/Kolkata",weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  {' at '}
                  <span className="font-semibold">{selectedSlot?.start_time}</span>
                </p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md mx-auto">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    {...register("guest_name")}
                    className={`w-full px-5 py-3 rounded-full border transition focus:ring-2 focus:outline-none ${
                      errors.guest_name 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-orange-200 focus:border-orange-500'
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.guest_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.guest_name.message}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    {...register("guest_email")}
                    className={`w-full px-5 py-3 rounded-full border transition focus:ring-2 focus:outline-none ${
                      errors.guest_email 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-orange-200 focus:border-orange-500'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.guest_email && (
                    <p className="text-red-500 text-sm mt-1">{errors.guest_email.message}</p>
                  )}
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone (optional)</label>
                  <input
                    type="tel"
                    {...register("guest_phone")}
                    className="w-full px-5 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 focus:outline-none transition"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Confirm Booking
                </button>
              </form>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Your meeting with <strong>{eventType.host.name}</strong> has been scheduled
              </p>
              <div className="bg-orange-50 rounded-2xl p-6 max-w-md mx-auto mb-6">
                <p className="text-gray-700 mb-2">
                  <strong>{new Date(selectedDate + "T00:00:00").toLocaleDateString('en-US', { 
                    timeZone: "Asia/Kolkata",
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}</strong>
                </p>
                <p className="text-gray-700">
                  at <strong>{selectedSlot?.start_time}</strong>
                </p>
              </div>
              <p className="text-sm text-gray-500 mb-8">
                A confirmation email has been sent to <strong>{bookingData?.guest_email}</strong>
              </p>
              <button
                onClick={() => navigate(`/${userSlug}`)}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-xl transition-all transform hover:scale-105"
              >
                View More Event Types
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}