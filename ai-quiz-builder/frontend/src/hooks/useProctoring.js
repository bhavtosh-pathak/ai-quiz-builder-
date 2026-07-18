
import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_VIOLATIONS = 3;

const VIOLATION_MESSAGES = {
  tab_switch: 'Tab switch detected',
  fullscreen_exit: 'You exited fullscreen',
  copy_attempt: 'Copying is disabled during the quiz',
  devtools_attempt: 'Developer tools shortcut blocked',
};

/**
 * Lightweight browser-side proctoring. Not a substitute for real
 * lockdown-browser software, but it deters the common cheap tricks:
 * switching tabs to search an answer, exiting fullscreen to peek at
 * notes, copying the question out, or opening devtools to poke at the
 * DOM. Every violation is reported live to the teacher's room via
 * Socket.io and also persisted with the final submission for review.
 *
 * `active` gates all listeners — pass false until the student has
 * explicitly clicked "Start quiz" (fullscreen requires a user gesture
 * anyway, so this lines up naturally).
 */
export const useProctoring = ({ active, socket, connected, quizId, onMaxViolations }) => {
  const [violations, setViolations] = useState([]); // [{ type, timestamp }]
  const [isFullscreen, setIsFullscreen] = useState(false);
  const maxReachedRef = useRef(false);
  const activatedAtRef = useRef(null);

  const recordViolation = useCallback(
    (type) => {
      if (!active || maxReachedRef.current) return;
      // Ignore the fullscreen-exit event that fires from our own
      // programmatic exitFullscreen() call on unmount/submit.
      if (type === 'fullscreen_exit' && !activatedAtRef.current) return;

      const entry = { type, timestamp: new Date().toISOString() };
      setViolations((prev) => {
        const next = [...prev, entry];

        if (socket && connected && quizId) {
          socket.emit('cheat:violation', { quizId, type, violationCount: next.length });
        }

        if (next.length >= MAX_VIOLATIONS && !maxReachedRef.current) {
          maxReachedRef.current = true;
          onMaxViolations?.(next);
        }

        return next;
      });
    },
    [active, socket, connected, quizId, onMaxViolations]
  );

  const requestFullscreen = useCallback(async () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      activatedAtRef.current = Date.now();
      setIsFullscreen(true);
    } catch {
      // Some browsers/embedded contexts block fullscreen — proctoring
      // continues via the other checks (tab switch, copy, devtools).
      activatedAtRef.current = Date.now();
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    activatedAtRef.current = null;
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!active) return undefined;

    const onVisibilityChange = () => {
      if (document.hidden) recordViolation('tab_switch');
    };

    const onFullscreenChange = () => {
      const fsActive = !!document.fullscreenElement;
      setIsFullscreen(fsActive);
      if (!fsActive && activatedAtRef.current) recordViolation('fullscreen_exit');
    };

    const onKeyDown = (e) => {
      const blockedCombo =
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.metaKey && e.altKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === 'U');
      if (blockedCombo) {
        e.preventDefault();
        recordViolation('devtools_attempt');
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [active, recordViolation]);

  // Spread onto the quiz content container to block copy/cut/right-click there.
  const containerProps = {
    onCopy: (e) => {
      e.preventDefault();
      recordViolation('copy_attempt');
    },
    onCut: (e) => {
      e.preventDefault();
      recordViolation('copy_attempt');
    },
    onContextMenu: (e) => {
      e.preventDefault();
    },
  };

  return {
    violations,
    violationCount: violations.length,
    maxViolations: MAX_VIOLATIONS,
    isFullscreen,
    requestFullscreen,
    exitFullscreen,
    containerProps,
    violationMessage: (type) => VIOLATION_MESSAGES[type] || 'Proctoring violation',
  };
};