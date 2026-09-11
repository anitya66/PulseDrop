import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectToDriverLocation = (driverId, onLocationUpdate) => {
  stompClient = new Client({
    brokerURL: "ws://localhost:8080/ws",

    reconnectDelay: 5000,

    onConnect: () => {
      console.log("WebSocket connected.");

      stompClient.subscribe(
        `/topic/driver/${driverId}`,
        (message) => {
          const location = JSON.parse(message.body);

          console.log(
            "Driver location update received:",
            location
          );

          onLocationUpdate(location);
        }
      );

      console.log(
        `Subscribed to /topic/driver/${driverId}`
      );
    },

    onStompError: (frame) => {
      console.error("STOMP error:", frame);
    },

    onWebSocketError: (error) => {
      console.error("WebSocket error:", error);
    },
  });

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();

    stompClient = null;

    console.log("WebSocket disconnected.");
  }
};