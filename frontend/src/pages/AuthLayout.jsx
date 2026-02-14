import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function AuthLayout({ children }) {
  const location = useLocation();

  const isSignup = location.pathname === "/signup";

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-orange-500 to-orange-200 relative overflow-hidden">

      {/* ===== GLOSSY SPHERE ===== */}
      <div className="absolute -left-40 top-20 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-orange-300 via-orange-500 to-red-600 shadow-2xl">
        <div className="absolute top-16 left-24 w-28 h-28 bg-white/40 rounded-full blur-md"></div>
        <div className="absolute top-36 left-40 w-12 h-12 bg-white/60 rounded-full blur-sm"></div>
        <div className="absolute inset-0 rounded-full border border-white/20 rotate-12"></div>
      </div>

      <div className="absolute right-10 bottom-10 w-60 h-60 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full blur-3xl opacity-70"></div>

      {/* ===== CARD ===== */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">

        {/* LEFT PANEL */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-orange-500 to-red-600 p-12 text-white relative">
          <div>
            <h2 className="text-4xl font-bold uppercase tracking-wide">
              {isSignup ? "Sign Up" : "Login"}
            </h2>

            <p className="mt-6 text-white/90 leading-relaxed">
              Smart scheduling for modern teams.
              Let clients book instantly.
              Zero back-and-forth emails.
            </p>
          </div>

          <div className="absolute bottom-12 right-12 w-32 h-32 bg-white/20 rounded-full blur-md"></div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 p-12">

          {/* Tabs */}
          <div className="flex justify-center mb-10 space-x-12 text-gray-500 font-medium">
            <Link to="/signup" className={`pb-2 transition ${
                isSignup ? "border-b-2 border-orange-500 text-orange-600" : ""
              }`}
            >
              Sign Up
            </Link>

            <Link to="/login" className={`pb-2 transition ${
                !isSignup ? "border-b-2 border-orange-500 text-orange-600" : ""
              }`}
            >
              Login
            </Link>
          </div>

          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
