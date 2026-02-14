import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import useCooldown from "../hooks/useCooldown";
import api from "../api/axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [email, setEmail] = useState(null);
  const { timeLeft, isActive, start } = useCooldown(60);

   // Return early if no token
   if (!token) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <h2 className="text-xl font-bold">Invalid verification link</h2>
        <p>Please check your email for a valid link.</p>
      </div>
    );
  }

  const handleResend = async () => {
    if (isActive) return; // prevent double click
    start(); // start cooldown immediately
    try {
      await api.post("/auth/resend-verification", { email });
      setMessage("Verification email resent.");
    } catch {
      setMessage("Failed to resend verification email.");
    }
  };

  const handleVerify = async () => {
    if (loading) return; // prevent multiple clicks
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-email", {
        token,
        password
      });

      if (res.data.already_verified) {
        navigate("/dashboard");
        return;
      }

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      setMessage(data?.message || "Verification failed");
      if (data?.can_resend && data?.email) {
        setShowResend(true);
        setEmail(data.email);
      } else {
        setShowResend(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>

      <input
        type="password"
        placeholder="Enter your password"
        className="border p-2 w-full mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleVerify}
        className="bg-blue-500 text-white px-4 py-2 w-full"
      >
        Verify Email
      </button>

      {message && <p className="text-red-500 mt-3">{message}</p>}

      {showResend && (
        <button
          onClick={handleResend}
          disabled={isActive}
          className={`mt-3 underline ${
            isActive ? "text-gray-400 cursor-not-allowed" : "text-blue-500"
          }`}
        >
          {isActive ? `Resend available in ${timeLeft}s` : "Resend Verification Email"}
        </button>
      )}
    </div>
  );
}
