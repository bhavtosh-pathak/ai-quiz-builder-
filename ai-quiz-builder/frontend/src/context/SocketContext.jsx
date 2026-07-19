import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

// In dev, Vite proxies /api but sockets need the raw backend origin.
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  window.location.origin.replace(':5173', ':5000');

// Kept outside the component (module scope) so it survives React 18
// StrictMode's dev-only double effect invocation (mount -> cleanup ->
// mount). Without this, that double-invoke opens TWO live socket
// connections for the same user, both joined to the same rooms — so
// every broadcast (cheating alerts, live participants, leaderboard,
// etc.) gets delivered twice to the browser.
let sharedSocket = null;
let sharedSocketToken = null;

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('aqb_token');

    if (!user || !token) {
      // Logged out — close any lingering shared connection.
      if (sharedSocket) {
        sharedSocket.disconnect();
        sharedSocket = null;
        sharedSocketToken = null;
      }
      setSocketInstance(null);
      setConnected(false);
      return undefined;
    }

    // Reuse the existing connection for this token instead of opening a
    // second one. Only open a fresh socket if there isn't one yet, or it
    // belongs to a different user/token (e.g. someone actually logged out
    // and a different account logged in).
    if (!sharedSocket || sharedSocketToken !== token) {
      if (sharedSocket) sharedSocket.disconnect();
      sharedSocket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
      });
      sharedSocketToken = token;
    }

    const socket = sharedSocket;

    const handleConnect = () => {
      console.log('Socket connected');
      setConnected(true);
    };
    const handleDisconnect = () => setConnected(false);
    const handleError = (err) => {
      console.warn('[socket] connection error:', err.message);
      setConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleError);

    setSocketInstance(socket);
    setConnected(socket.connected);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleError);
      // Intentionally NOT calling socket.disconnect() here — the shared
      // connection is only torn down above when the user/token actually
      // goes away. Disconnecting on every cleanup is what caused the
      // duplicate-connection bug (cleanup also fires from React
      // StrictMode's dev-only phantom remount).
    };
  }, [user]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketInstance,
        connected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);

  if (!ctx) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return ctx;
};