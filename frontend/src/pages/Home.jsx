import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, Lock, Globe, Calendar, Clock, Users, Zap, 
  Star, CheckCircle2, ArrowRight, Sparkles, TrendingUp,
  BarChart3, Bell, Link2, Video
} from "lucide-react";
import { Facebook, Linkedin, XIcon } from "lucide-react";
import heroImage from "../assets/hero-image.png";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 text-gray-800 scroll-smooth overflow-x-hidden">
      <BackgroundBlobs />
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Reviews />
      <UseCases />
      <Certifications />
      <CTA />
      <Footer />
    </div>
  );
}

/* ---------------- NAVBAR ---------------- */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`
        fixed z-50 top-0 left-0 right-0 transition-all duration-300
        ${scrolled 
          ? "bg-white/90 backdrop-blur-lg shadow-lg mt-4 mx-4 md:mx-8 rounded-2xl" 
          : "bg-white/60 backdrop-blur-sm"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Calendar className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Book<span className="text-orange-600">Ease</span>
            </h1>
          </Link>
    
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-700 hover:text-orange-600 transition font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-orange-600 transition font-medium">
              How It Works
            </a>
            <a href="#reviews" className="text-gray-700 hover:text-orange-600 transition font-medium">
              Reviews
            </a>

            {/* Login button */}
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-orange-600 transition font-semibold px-4 py-2"
            >
              Login
            </Link>
    
            {/* Get Started button */}
            <Link 
              to="/signup" 
              className="font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setOpen(!open)} 
            className="md:hidden text-orange-600 text-3xl font-bold"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 bg-white/95 backdrop-blur-sm px-6 py-6 space-y-4 rounded-2xl shadow-xl"
          >
            <a href="#features" className="block text-gray-700 hover:text-orange-600 font-medium">
              Features
            </a>
            <a href="#how-it-works" className="block text-gray-700 hover:text-orange-600 font-medium">
              How It Works
            </a>
            <a href="#reviews" className="block text-gray-700 hover:text-orange-600 font-medium">
              Reviews
            </a>
            <Link to="/login" className="block text-gray-700 hover:text-orange-600 font-medium">
              Login
            </Link>
            <Link 
              to="/signup" 
              className="block text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
            >
              Get Started Free
            </Link>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Left: Text & Buttons */}
          <div className="md:w-1/2 text-left">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-6">
                <Sparkles size={16} />
                <span className="text-sm font-semibold">Trusted by 10,000+ professionals</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-gray-900 mb-6">
                Schedule Meetings
                <span className="block bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
                  Without the Hassle
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-gray-600 max-w-xl mb-8 leading-relaxed"
            >
              Say goodbye to endless email chains. Let clients book meetings instantly 
              based on your real-time availability with smart reminders and global timezone support.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link 
                to="/signup" 
                className="group bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 rounded-xl font-bold text-white text-center shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
  
              <Link 
                to="/login" 
                className="border-2 border-gray-800 px-8 py-4 rounded-xl font-bold hover:bg-gray-800 hover:text-white transition-all text-gray-800 text-center"
              >
                Sign In
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex items-center gap-6 mt-10"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-600" size={20} />
                <span className="text-sm text-gray-600">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-600" size={20} />
                <span className="text-sm text-gray-600">Free forever plan</span>
              </div>
            </motion.div>
          </div>
  
          {/* Right: Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="md:w-1/2 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-400 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
              <img 
                src={heroImage} 
                alt="BookEase Dashboard" 
                className="relative w-full max-w-lg rounded-2xl shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- STATS ---------------- */
function Stats() {
  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "500K+", label: "Meetings Scheduled" },
    { number: "98%", label: "Customer Satisfaction" },
    { number: "50+", label: "Countries" }
  ];

  return (
    <section className="py-16 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 text-transparent bg-clip-text mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FEATURES ---------------- */
function Features() {
  const items = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-Time Availability",
      desc: "Your calendar syncs in real-time to prevent double bookings and scheduling conflicts.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Reminders",
      desc: "Automated email and SMS reminders reduce no-shows by up to 80%.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Timezone Intelligence",
      desc: "Automatic timezone detection ensures global teams never miss a beat.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Integration",
      desc: "Automatically generate meeting links for Zoom, Google Meet, and Teams.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <Link2 className="w-8 h-8" />,
      title: "Custom Booking Links",
      desc: "Create personalized booking pages that match your brand identity.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Insights",
      desc: "Track booking trends and optimize your availability for maximum efficiency.",
      color: "from-pink-500 to-pink-600"
    }
  ];

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
            <Zap size={16} />
            <span className="text-sm font-semibold">POWERFUL FEATURES</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Your Time
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built for professionals who value their time and want to focus on what matters most
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                {item.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */
function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Set Your Availability",
      desc: "Define your working hours and let BookEase handle the rest",
      icon: <Calendar className="w-8 h-8" />
    },
    {
      step: "02",
      title: "Share Your Link",
      desc: "Send your personalized booking link to clients and colleagues",
      icon: <Link2 className="w-8 h-8" />
    },
    {
      step: "03",
      title: "Get Booked",
      desc: "Receive instant notifications and calendar invites automatically",
      icon: <CheckCircle2 className="w-8 h-8" />
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full mb-4">
            <Sparkles size={16} />
            <span className="text-sm font-semibold">SIMPLE PROCESS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get Started in Minutes
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Three simple steps to transform your scheduling workflow
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {item.step}
              </div>
              <div className="mt-6 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white">
                  {item.icon}
                </div>
              </div>
              <h4 className="text-2xl font-bold mb-3">{item.title}</h4>
              <p className="text-gray-300 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- REVIEWS ---------------- */
function Reviews() {
  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
      avatar: "SJ",
      text: "BookEase has completely transformed how our team schedules meetings. The timezone support alone has saved us countless hours of confusion!",
      rating: 5,
      color: "bg-blue-500"
    },
    {
      name: "David Chen",
      role: "Startup Founder",
      company: "InnovateLabs",
      avatar: "DC",
      text: "As a founder, every minute counts. BookEase helps me stay organized and never miss an important meeting. It's a game-changer!",
      rating: 5,
      color: "bg-purple-500"
    },
    {
      name: "Emily Rodriguez",
      role: "Freelance Consultant",
      company: "Independent",
      avatar: "ER",
      text: "My clients love how easy it is to book time with me. I've seen a 40% increase in consultation bookings since I started using BookEase.",
      rating: 5,
      color: "bg-pink-500"
    },
    {
      name: "Michael Park",
      role: "Sales Director",
      company: "GrowthCo",
      avatar: "MP",
      text: "The automated reminders have reduced our no-show rate dramatically. Our team is more productive than ever!",
      rating: 5,
      color: "bg-green-500"
    },
    {
      name: "Lisa Anderson",
      role: "HR Manager",
      company: "PeopleFirst",
      avatar: "LA",
      text: "Scheduling interviews used to be a nightmare. Now it's seamless. Candidates appreciate the professional experience too.",
      rating: 5,
      color: "bg-orange-500"
    },
    {
      name: "James Wilson",
      role: "Business Coach",
      company: "CoachPro",
      avatar: "JW",
      text: "I've tried many scheduling tools, but BookEase is by far the best. Simple, powerful, and reliable.",
      rating: 5,
      color: "bg-red-500"
    }
  ];

  return (
    <section id="reviews" className="py-24 px-6 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
            <Star size={16} className="fill-orange-600" />
            <span className="text-sm font-semibold">TESTIMONIALS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by Professionals Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their scheduling
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 ${review.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                  {review.avatar}
                </div>
                <div>
                  <h5 className="font-bold text-gray-900">{review.name}</h5>
                  <p className="text-sm text-gray-600">{review.role}</p>
                  <p className="text-xs text-gray-500">{review.company}</p>
                </div>
              </div>
              
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 leading-relaxed italic">
                "{review.text}"
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-6 py-3 rounded-full">
            <Star size={20} className="fill-orange-500 text-orange-500" />
            <span className="font-bold text-gray-800">4.9/5 rating from 2,500+ reviews</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- USE CASES ---------------- */
function UseCases() {
  const cases = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Sales Teams",
      desc: "Close more deals with instant demo scheduling",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Consultants",
      desc: "Maximize billable hours with efficient booking",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Recruiters",
      desc: "Streamline candidate interview scheduling",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Coaches",
      desc: "Focus on clients, not calendar management",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Built for Every Professional
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No matter your industry, BookEase adapts to your unique workflow
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white mx-auto mb-4`}>
                {item.icon}
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CERTIFICATIONS ---------------- */
function Certifications() {
  return (
    <section className="py-24 px-6 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Enterprise-Grade Security
          </h3>
          <p className="text-lg text-gray-600">
            Your data is protected with industry-leading security standards
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <p className="font-bold text-gray-900">SSL Encrypted</p>
            <p className="text-sm text-gray-600">256-bit encryption</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <p className="font-bold text-gray-900">GDPR Compliant</p>
            <p className="text-sm text-gray-600">EU data protection</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <p className="font-bold text-gray-900">Global CDN</p>
            <p className="text-sm text-gray-600">99.9% uptime</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CTA() {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-12 text-center text-white shadow-2xl"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Transform Your Scheduling?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join 10,000+ professionals who have already simplified their workflow
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/signup" 
            className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2 shadow-lg"
          >
            Start Free Trial
            <ArrowRight size={20} />
          </Link>
          <Link 
            to="/login" 
            className="border-2 border-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
          >
            Sign In
          </Link>
        </div>
        <p className="text-sm mt-6 opacity-75">
          No credit card required • Free forever plan available
        </p>
      </motion.div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Calendar className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">
                Book<span className="text-orange-500">Ease</span>
              </h3>
            </div>
            <p className="text-gray-400 mb-6">
              The modern way to schedule meetings without the back-and-forth.
            </p>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 hover:text-orange-500 cursor-pointer transition" />
              <Linkedin className="w-5 h-5 hover:text-orange-500 cursor-pointer transition" />
              <XIcon className="w-5 h-5 hover:text-orange-500 cursor-pointer transition" />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-orange-500 transition">Features</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">Pricing</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">Integrations</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-orange-500 transition">About</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">Blog</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">Careers</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-orange-500 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">GDPR</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>© 2026 BookEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- BACKGROUND BLOBS ---------------- */
function BackgroundBlobs() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute w-[500px] h-[500px] bg-orange-400 opacity-20 rounded-full blur-3xl top-[-200px] left-[-200px]"
        animate={{ x: [0, 50, 0], y: [0, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] bg-red-400 opacity-15 rounded-full blur-3xl bottom-[-250px] right-[-250px]"
        animate={{ x: [0, -60, 0], y: [0, -50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] bg-orange-300 opacity-10 rounded-full blur-3xl top-[50%] left-[50%]"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}