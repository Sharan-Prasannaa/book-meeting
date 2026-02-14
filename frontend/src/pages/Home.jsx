import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Globe, Menu, X } from "lucide-react";
import { Facebook, Linkedin, XIcon } from "lucide-react";
import heroImage from "../assets/hero-image.png";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 text-gray-800 scroll-smooth">
      <BackgroundBlobs />
      <Navbar />
      <Hero />
      <Features />
      <Reviews />
      <Certifications />
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
            px-8 md:px-12 py-4
            ${scrolled ? "shadow-lg backdrop-blur-sm rounded-full mx-4 md:mx-[5%]" : ""}
            bg-orange-50
            `}
        >
            <div className="flex justify-between items-center">
                {/* Logo */}
                <h1 className="text-2xl font-bold text-orange-600">
                    Book<span className="text-orange-400">Ease</span>
                </h1>
        
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-4">
                    <a href="#features" className="text-gray-800 hover:text-orange-500 transition px-3 py-2 rounded-md">
                    Features
                    </a>
                    <a href="#reviews" className="text-gray-800 hover:text-orange-500 transition px-3 py-2 rounded-md">
                    Reviews
                    </a>
    
                    {/* Login button */}
                    <Link to="/login" className="font-semibold bg-gradient-to-r from-orange-400 to-orange-500 text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition">
                    Login
                    </Link>
        
                    {/* Get Started button */}
                    <Link to="/signup" className="font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition">
                    Get Started
                    </Link>
                </div>
    
                {/* Mobile Toggle */}
                <button onClick={() => setOpen(!open)} className="md:hidden text-orange-600 text-2xl">
                    {open ? "✕" : "☰"}
                </button>
            </div>
  
            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden bg-orange-50 border-t border-orange-200 px-6 py-6 space-y-4 rounded-b-3xl shadow-md">
                    <a href="#features" className="block text-gray-800 hover:text-orange-500">Features</a>
                    <a href="#reviews" className="block text-gray-800 hover:text-orange-500">Reviews</a>
                    <Link to="/login" className="block text-gray-800 hover:text-orange-500">Login</Link>
                    <Link to="/signup" className="block text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-full">
                    Get Started
                    </Link>
                </div>
            )}
      </motion.nav>
    );
}
  
  /* ---------------- HERO ---------------- */
function Hero() {
    return (
        <section className="relative bg-gradient-to-t">
            <div className="container mx-auto px-6 md:px-12 py-32 flex flex-col md:flex-row items-center">
          
                {/* Left: Text & Buttons */}
                <div className="md:w-3/4 text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-bold leading-tight text-gray-900"
                    >
                        <h2 className="mb-2">Effortless Meeting Scheduling</h2>
                        <p className="bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
                            Built for Modern Teams
                        </p>
                    </motion.div>
                    <br />
                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 text-gray-700 text-lg md:text-xl max-w-xl"
                        >
                            Let clients book meetings instantly based on your availability.
                            Smart reminders. Global timezone support. Zero stress.
                    </motion.p>
        
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 flex flex-col sm:flex-row gap-4"
                        >
                        <Link to="/signup" className="bg-gradient-to-r from-red-500 to-orange-600 px-8 py-3 rounded-full font-semibold hover:scale-105 transition text-white text-center">
                            Start Free
                        </Link>
            
                        <Link to="/login" className="border border-orange-500 px-8 py-3 rounded-full hover:bg-orange-100 transition text-gray-800 text-center">
                            Login
                        </Link>
                    </motion.div>
                </div>
        
                {/* Right: Image */}
                <div className="md:w-1/4 mt-12 md:mt-0 flex justify-center mr-6">
                    <img src={heroImage} alt="Hero Illustration" className="w-full max-w-md"/>
                </div>
            </div>
        </section>
    );
}
  
  

/* ---------------- FEATURES ---------------- */

function Features() {
  const items = [
    {
      title: "Live Availability",
      desc: "Prevent double booking with real-time calendar sync."
    },
    {
      title: "Automated Reminders",
      desc: "Reduce no-shows with smart email notifications."
    },
    {
      title: "Timezone Aware",
      desc: "Global scheduling without timezone confusion."
    }
  ];

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <h3 className="text-3xl font-bold text-center mb-12">
        Powerful Features
      </h3>

      <div className="grid md:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="group-hover:border-purple-400 group bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <h4 className="text-xl font-semibold mb-4">
              {item.title}
            </h4>
            <p className="text-gray-400">
              {item.desc}
            </p>
          </motion.div>
        ))}
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
          text: "BookEase saved us hours every week."
        },
        {
          name: "David Lee",
          role: "Startup Founder",
          text: "The timezone support is incredible."
        },
        {
          name: "Anita Sharma",
          role: "Consultant",
          text: "Clients love the instant booking link."
        }
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % reviews.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);
    
  return (
    <section className="py-20 px-6 text-center">
        <h3 className="text-3xl font-bold mb-12">
            Trusted by Professionals
        </h3>

        <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto bg-white shadow-lg p-10 rounded-2xl"
            >
            <p className="text-lg italic text-gray-600">
                "{reviews[index].text}"
            </p>
            <p className="mt-6 font-semibold text-purple-600">
                {reviews[index].name}
            </p>
            <p className="text-sm text-gray-500">
                {reviews[index].role}
            </p>
        </motion.div>
    </section>
  );
}

/* ---------------- CERTIFICATIONS ---------------- */

function Certifications() {
  return (
    <section className="py-20 px-6 text-center">
      <h3 className="text-3xl font-bold mb-10">
        Secure & Reliable
      </h3>

        <div className="flex flex-wrap justify-center gap-12">
            <div className="flex flex-col items-center">
                <ShieldCheck className="w-10 h-10 text-purple-500" />
                <p className="mt-3 font-medium">SSL Secured</p>
            </div>

            <div className="flex flex-col items-center">
                <Lock className="w-10 h-10 text-purple-500" />
                <p className="mt-3 font-medium">GDPR Compliant</p>
            </div>

            <div className="flex flex-col items-center">
                <Globe className="w-10 h-10 text-purple-500" />
                <p className="mt-3 font-medium">Global Infrastructure</p>
            </div>
        </div>

    </section>
  );
}

/* ---------------- FOOTER ---------------- */

function Footer() {
  return (
    <footer className="border-t border-gray-200 py-12 text-center">
        <div className="flex justify-center gap-6 mb-6">
            <Facebook className="w-5 h-5 hover:text-purple-600 cursor-pointer" />
            <Linkedin className="w-5 h-5 hover:text-purple-600 cursor-pointer" />
            <XIcon className="w-5 h-5 hover:text-purple-600 cursor-pointer" />
        </div>

        <p className="text-gray-500">
            © 2026 BookEase. All rights reserved.
        </p>
    </footer>
  );
}

/* ---------------- BACKGROUND BLOBS ---------------- */

function BackgroundBlobs() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute w-96 h-96 bg-purple-600 opacity-20 rounded-full blur-3xl top-[-100px] left-[-100px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] bg-indigo-600 opacity-20 rounded-full blur-3xl bottom-[-150px] right-[-150px]"
        animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
    </div>
  );
}
