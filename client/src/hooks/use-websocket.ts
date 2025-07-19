import { useState, useEffect, useRef } from "react";

export function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Commented out to prevent unwanted WebSocket connections
    // const connect = () => {
    //   try {
    //     const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    //     const host = window.location.hostname || "localhost";
    //     const port = window.location.port || (window.location.protocol === "https:" ? "443" : "5000");
    //     const wsUrl = `${protocol}//${host}:${port}/ws`;
    //     
    //     console.log("Attempting WebSocket connection to:", wsUrl);
    //     
    //     const ws = new WebSocket(wsUrl);
    //     
    //     ws.onopen = () => {
    //       setIsConnected(true);
    //       setSocket(ws);
    //       console.log("WebSocket connected successfully");
    //     };

    //     ws.onmessage = (event) => {
    //       try {
    //         const data = JSON.parse(event.data);
    //         setLastMessage(data);
    //       } catch (error) {
    //         console.error("Failed to parse WebSocket message:", error);
    //       }
    //     };

    //     ws.onclose = () => {
    //       setIsConnected(false);
    //       setSocket(null);
    //       console.log("WebSocket disconnected");
    //       
    //       // Reconnect after 3 seconds
    //       reconnectTimeoutRef.current = setTimeout(connect, 3000);
    //     };

    //     ws.onerror = (error) => {
    //       console.error("WebSocket error:", error);
    //       // Don't reconnect on error, let the onclose handler handle it
    //     };
    //   } catch (error) {
    //     console.error("Failed to create WebSocket connection:", error);
    //   }
    // };

    // connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, [url]);

  const sendMessage = (message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  };

  return { isConnected, lastMessage, sendMessage };
}
