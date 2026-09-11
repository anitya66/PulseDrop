import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectToNotifications = (onNotification) => {
  stompClient = new Client({
    brokerURL: "ws://localhost:8080/ws/notifications",

    reconnectDelay: 5000,

    onConnect: () => {
      console.log("Notification WebSocket connected.");

      stompClient.subscribe(
        "/topic/notifications",
        (message) => {
          try {
            const notification = JSON.parse(message.body);

            console.log(
              "Notification received:",
              notification
            );

            onNotification(notification);
          } catch (error) {
            console.error(
              "Failed to parse notification:",
              error
            );
          }
        }
      );

      console.log(
        "Subscribed to /topic/notifications"
      );
    },

    onStompError: (frame) => {
      console.error(
        "Notification STOMP error:",
        frame
      );
    },

    onWebSocketError: (error) => {
      console.error(
        "Notification WebSocket error:",
        error
      );
    },
  });

  stompClient.activate();
};

export const disconnectNotifications = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;

    console.log(
      "Notification WebSocket disconnected."
    );
  }
};