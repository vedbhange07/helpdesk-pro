require("dotenv").config();

const { io } = require("socket.io-client");

const token = process.env.SOCKET_TOKEN;
const ticketId = process.env.TICKET_ID;

if (!token || !ticketId) {
    console.log("Please provide SOCKET_TOKEN and TICKET_ID");
    process.exit(1);
}

const socket = io("http://localhost:5000", {
    auth: {
        token
    }
});

socket.on("connect", () => {
    console.log("Connected to HelpDesk Pro!");
    console.log("Socket ID:", socket.id);

    // Join ticket conversation
    socket.emit("join_ticket", ticketId);
});

socket.on("ticket_joined", (data) => {
    console.log("Successfully joined ticket room:");
    console.log(data);
});

socket.on("new_message", (message) => {
    console.log("\nNEW REAL-TIME MESSAGE RECEIVED");
    console.log("------------------------------");
    console.log("Sender:", message.sender.name);
    console.log("Message:", message.message);
    console.log("Time:", message.createdAt);
});
socket.on("new_notification", (notification) => {
    console.log("\nNEW NOTIFICATION RECEIVED");
    console.log("-------------------------");
    console.log("Type:", notification.type);
    console.log("Message:", notification.message);
    console.log("Read:", notification.isRead);
});

socket.on("socket_error", (error) => {
    console.log("Socket error:", error.message);
});

socket.on("connect_error", (error) => {
    console.log("Connection error:", error.message);
});

socket.on("disconnect", (reason) => {
    console.log("Disconnected:", reason);
});