import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import useCooldown from "../hooks/useCooldown";

export default function VerifyNotice() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [disabled, setDisabled] = useState(false);
  const { timeLeft, isActive, start } = useCooldown(60);

  const resend = async () => {
    if (disabled) return;
    setDisabled(true);
    start(); // start cooldown
    try {
        await api.post("/auth/resend-verification", { email });
        alert("Verification email resent.");
    } catch {
        alert("Failed to resend email.");
    } finally {
        // optional: re-enable if you want outside cooldown logic
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-xl font-bold">Verify Your Email</h2>

      <p className="mt-3">
        Before continuing, we need to verify your email address.
        Please check your inbox.
      </p>

      <p className="mt-3">
        If you do not receive the email within few minutes,
        <button
            onClick={resend}
            disabled={isActive}
            className={`ml-1 underline ${
                isActive
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-500"
            }`}
            >
            {isActive ? `resend in ${timeLeft}s` : "resend it"}
        </button>
      </p>
    </div>
  );
}
