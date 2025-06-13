import React, { useState, useEffect } from 'react';

const CountDown = (minutes) => {
  const [count, setCount] = useState(minutes.minutes ?? 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 0) {
          clearInterval(interval);
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div>{!!count ? count : ''}</div>;
};

export default CountDown;
