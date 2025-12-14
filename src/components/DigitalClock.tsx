import { useState, useEffect } from 'react';

export function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="hidden lg:block">
      <div className="bg-black/50 border border-white/10 rounded-md px-3 py-1.5 shadow-[0_0_10px_rgba(168,85,247,0.2)] backdrop-blur-sm">
        <span className="font-mono text-sm md:text-base text-purple-400 tracking-widest font-bold">
          {formatTime(time)}
        </span>
      </div>
    </div>
  );
}
