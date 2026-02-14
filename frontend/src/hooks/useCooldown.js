import { useState, useEffect, useRef, useCallback } from "react";

export default function useCooldown(initialSeconds = 60) {
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timeLeft]);

  const isActive = timeLeft > 0;

  return {
    timeLeft,
    isActive,
    start,
  };
}
