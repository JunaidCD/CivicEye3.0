export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private listeners: { [key: string]: ((data: any) => void)[] } = {};

  constructor(url: string) {
    this.url = url;
    // this.connect(); // Commented out to prevent unwanted WebSocket connections
  }

  private connect() {
    // Commented out to prevent unwanted WebSocket connections
    // try {
    //   const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    //   const host = window.location.hostname || "localhost";
    //   const port = window.location.port || (window.location.protocol === "https:" ? "443" : "5000");
    //   const wsUrl = `${protocol}//${host}:${port}/ws`;
    //   
    //   console.log("WebSocketClient attempting connection to:", wsUrl);
    //   
    //   this.ws = new WebSocket(wsUrl);
    //   
    //   this.ws.onopen = () => {
    //     console.log("WebSocketClient connected successfully");
    //   };

    //   this.ws.onmessage = (event) => {
    //     try {
    //       const data = JSON.parse(event.data);
    //       this.emit(data.type, data);
    //     } catch (error) {
    //       console.error("WebSocketClient failed to parse message:", error);
    //     }
    //   };

    //   this.ws.onclose = () => {
    //     console.log("WebSocketClient disconnected");
    //     // Reconnect after 3 seconds
    //     setTimeout(() => this.connect(), 3000);
    //   };

    //   this.ws.onerror = (error) => {
    //     console.error("WebSocketClient error:", error);
    //     // Don't reconnect on error, let the onclose handler handle it
    //   };
    // } catch (error) {
    //   console.error("WebSocketClient failed to create connection:", error);
    // }
  }

  public on(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  public off(event: string, callback: (data: any) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  public send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  public close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
