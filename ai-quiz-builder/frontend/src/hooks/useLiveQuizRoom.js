import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { attemptService } from '../services/attemptService';

/**
 * Joins a quiz's Socket.io room and keeps leaderboard + participant count
 * live-updated, falling back to a REST fetch for the initial paint so the
 * page never shows an empty state while the socket handshake completes.
 */
export const useLiveQuizRoom = (quizId) => {
  const { socket, connected } = useSocket();
  const [leaderboard, setLeaderboard] = useState([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [activeParticipants, setActiveParticipants] = useState([]);
  const [lastEvent, setLastEvent] = useState(null);
  const [cheatAlerts, setCheatAlerts] = useState([]); // most-recent-first, capped
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!quizId) return;
    try {
      const { leaderboard: lb } = await attemptService.getLeaderboard(quizId);
      setLeaderboard(lb);
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!socket || !connected || !quizId) return undefined;

    socket.emit('room:join', { quizId });

    const onLeaderboard = (lb) => {
      setLeaderboard(lb);
      setLoading(false);
    };
    const onParticipants = ({ count, participants }) => {
      setParticipantCount(count);
      setActiveParticipants(participants);
    };
    const onNewAttempt = (payload) => setLastEvent(payload);
    const onCheatAlert = (payload) => {
      setCheatAlerts((prev) => {
        const withoutThisStudent = prev.filter(
          (a) => (a.studentId || a.studentName) !== (payload.studentId || payload.studentName)
        );
        return [payload, ...withoutThisStudent].slice(0, 30);
      });
    };

    socket.on('leaderboard:update', onLeaderboard);
    socket.on('room:participants', onParticipants);
    socket.on('attempt:new', onNewAttempt);
    socket.on('quiz:cheatingDetected', onCheatAlert);

    return () => {
      socket.emit('room:leave', { quizId });
      socket.off('leaderboard:update', onLeaderboard);
      socket.off('room:participants', onParticipants);
      socket.off('attempt:new', onNewAttempt);
      socket.off('quiz:cheatingDetected', onCheatAlert);
    };
  }, [socket, connected, quizId]);

  return {
    leaderboard,
    participantCount,
    activeParticipants,
    lastEvent,
    cheatAlerts,
    loading,
    isLive: connected,
    refetch,
  };
};