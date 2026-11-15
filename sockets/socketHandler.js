const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/User");
const Ticket = require("../models/Ticket");

// Check ticket access
const canAccessTicket = (ticket, user) => {

    if (user.role === "admin") {
        return true;
    }

    if (
        user.role === "customer" &&
        ticket.customer.toString() === user._id.toString()
    ) {
        return true;
    }

    if (
        user.role === "agent" &&
        ticket.assignedAgent &&
        ticket.assignedAgent.toString() === user._id.toString()
    ) {
        return true;
    }

    return false;
};

const socketHandler = (io) => {

    // Authenticate socket connection
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(new Error("Authentication required"));
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const user = await User.findById(decoded.id)
                .select("_id name email role isActive");

            if (!user || !user.isActive) {
                return next(new Error("Invalid or inactive user"));
            }

            socket.user = user;

            next();

        } catch (error) {
            next(new Error("Invalid or expired token"));
        }
    });

    // Handle socket connection
    io.on("connection", (socket) => {
         // Automatically join the logged-in user's personal room
        const userRoom = `user:${socket.user._id.toString()}`;

        socket.join(userRoom);

        console.log(`${socket.user.email} joined ${userRoom}`);
                

        console.log(
            `User connected: ${socket.user.email}`
        );

        // Join a ticket-specific room
        socket.on("join_ticket", async (ticketId) => {
            try {
                if (!mongoose.Types.ObjectId.isValid(ticketId)) {
                    return socket.emit("socket_error", {
                        message: "Invalid ticket ID"
                    });
                }

                const ticket = await Ticket.findById(ticketId);

                if (!ticket) {
                    return socket.emit("socket_error", {
                        message: "Ticket not found"
                    });
                }

                if (!canAccessTicket(ticket, socket.user)) {
                    return socket.emit("socket_error", {
                        message: "You cannot access this ticket"
                    });
                }

                const room = `ticket:${ticketId}`;

                await socket.join(room);

                socket.emit("ticket_joined", {
                    success: true,
                    message: "Joined ticket conversation",
                    ticketId
                });

                console.log(
                    `${socket.user.email} joined ${room}`
                );

            } catch (error) {
                console.error("Join ticket error:", error.message);

                socket.emit("socket_error", {
                    message: "Unable to join ticket"
                });
            }
        });

        socket.on("disconnect", () => {
            console.log(
                `User disconnected: ${socket.user.email}`
            );
        });
    });
};

module.exports = socketHandler;