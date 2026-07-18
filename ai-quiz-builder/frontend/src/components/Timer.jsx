// import { useEffect, useRef, useState } from 'react';

// const formatClock = (totalSeconds) => {
//   const m = Math.floor(totalSeconds / 60)
//     .toString()
//     .padStart(2, '0');
//   const s = Math.floor(totalSeconds % 60)
//     .toString()
//     .padStart(2, '0');
//   return `${m}:${s}`;
// };

// /**
//  * Countdown timer for a quiz attempt. Calls onExpire exactly once when
//  * time runs out, so callers can trigger auto-submit.
//  */
// const Timer = ({ durationSeconds, onExpire, onTick }) => {
//   const [remaining, setRemaining] = useState(durationSeconds);
//   const expiredRef = useRef(false);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setRemaining((prev) => {
//         const next = prev - 1;
//         if (onTick) onTick(next);
//         if (next <= 0 && !expiredRef.current) {
//           expiredRef.current = true;
//           clearInterval(interval);
//           onExpire?.();
//           return 0;
//         }
//         return next;
//       });
//     }, 1000);
//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const isCritical = remaining <= 30;
//   const isWarning = remaining <= 120 && !isCritical;

//   return (
//     <div
//       className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 font-mono text-sm font-semibold transition-colors ${
//         isCritical
//           ? 'border-danger/30 bg-danger-light text-danger animate-pulse'
//           : isWarning
//           ? 'border-gold-300 bg-gold-50 text-gold-600'
//           : 'border-ink/15 bg-white text-ink'
//       }`}
//     >
//       <span aria-hidden>⏱</span>
//       <span className="tabular-nums">{formatClock(Math.max(remaining, 0))}</span>
//     </div>
//   );
// };

// export default Timer;
// new files 


import { useEffect, useRef, useState } from 'react';

const formatClock = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
};

/**
 * Countdown timer for a quiz attempt. Calls onExpire exactly once when
 * time runs out, so callers can trigger auto-submit.
 */
const Timer = ({ durationSeconds, onExpire, onTick }) => {
  const [remaining, setRemaining] = useState(durationSeconds);
  const expiredRef = useRef(false);

  // The interval below is created once (deps: []) so it isn't reset every
  // render, but that means it must never close over onExpire/onTick
  // directly — those props can be new function instances on every parent
  // render. Keeping them in refs and reading .current inside the interval
  // guarantees it always calls the *latest* version, not the one from
  // whatever render happened to be active when the interval was created.
  const onExpireRef = useRef(onExpire);
  const onTickRef = useRef(onTick);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        onTickRef.current?.(next);
        if (next <= 0 && !expiredRef.current) {
          expiredRef.current = true;
          clearInterval(interval);
          onExpireRef.current?.();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isCritical = remaining <= 30;
  const isWarning = remaining <= 120 && !isCritical;

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 font-mono text-sm font-semibold transition-colors ${
        isCritical
          ? 'border-danger/30 bg-danger-light text-danger animate-pulse'
          : isWarning
          ? 'border-gold-300 bg-gold-50 text-gold-600'
          : 'border-ink/15 bg-white text-ink'
      }`}
    >
      <span aria-hidden>⏱</span>
      <span className="tabular-nums">{formatClock(Math.max(remaining, 0))}</span>
    </div>
  );
};

export default Timer;