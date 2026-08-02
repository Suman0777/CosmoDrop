import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let globalSocket: Socket | null = null;

function getSocket(): Socket {
  if (globalSocket) return globalSocket;

  // Reads at runtime inside browser — safe for env vars
  const url =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

  console.log("[socket] connecting to:", url);

  globalSocket = io(url, {
    transports: ["websocket", "polling"], // fallback to polling if websocket fails
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1500,
    timeout: 10000,
  });

  // globalSocket.on("connect_error", (err) => {
  //   console.log("[socket] connect error:", err.message);
  // });

  return globalSocket;
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = getSocket();
    setSocket(s);

    const onConnect = () => {
      console.log("[socket] connected:", s.id);
      setConnected(true);
    };
    const onDisconnect = () => {
      console.log("[socket] disconnected");
      setConnected(false);
    };

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);

    // Sync if already connected when hook mounts
    if (s.connected) setConnected(true);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
    };
  }, []);

  return { socket, connected };
}
