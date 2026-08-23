import { useState, useEffect } from 'react';

function CountdownTimer({ endTime }) {
  const calculateTimeLeft = () => {
    const endTimeUTC = endTime.endsWith('Z') || endTime.includes('+')
      ? endTime
      : endTime + 'Z';

    const end = new Date(endTimeUTC).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) return null;

    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  if (!timeLeft) return <span className="deal-expired">Deal ended</span>;

  return (
    <span className="countdown-timer">
      ⏰ {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
    </span>
  );
}

export default CountdownTimer;