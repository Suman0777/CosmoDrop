"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";

let globalSocket: Socket | null = null;

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!globalSocket) {
      globalSocket = io(SOCKET_URL, { transports: ["websocket"] });
    }
    socketRef.current = globalSocket;

    return () => {
      // don't disconnect on unmount — keep alive across page navigations
    };
  }, []);

  return socketRef;
}
