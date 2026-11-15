const Message = require("../models/Message");
const Ticket = require("../models/Ticket");

// CHECK WHETHER USER CAN ACCESS THIS TICKET
const canAccessTicket = (ticket, user) => {

    // Admin can access every ticket
    if (user.role === "admin") {
        return true;
    }

    // Customer can access their own ticket
    if (
        user.role === "customer" &&
        ticket.customer.toString() === user._id.toString()
    ) {
        return true;
    }

    // Agent can access tickets assigned to them
    if (
        user.role === "agent" &&
        ticket.assignedAgent &&
        ticket.assignedAgent.toString() === user._id.toString()
    ) {
        return true;
    }

    return false;
};


// SEND MESSAGE
const sendMessage = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { message } = req.body;

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        if (!canAccessTicket(ticket, req.user)) {
            return res.status(403).json({
                success: false,
                message: "You cannot access this ticket"
            });
        }

        if (ticket.status === "closed") {
            return res.status(409).json({
                success: false,
                message: "Cannot send messages to a closed ticket"
            });
        }

        const newMessage = await Message.create({
            ticket: ticket._id,
            sender: req.user._id,
            message
        });

        await newMessage.populate("sender", "name email role");
        // Send the saved message to connected ticket users
        const io = req.app.get("io");

        io.to(`ticket:${ticket._id}`).emit(
         "new_message",
         newMessage
        );                 
        

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        });

    } catch (error) {
        console.error("Send message error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// GET TICKET CONVERSATION
const getMessages = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        if (!canAccessTicket(ticket, req.user)) {
            return res.status(403).json({
                success: false,
                message: "You cannot access this ticket"
            });
        }

        const messages = await Message.find({
            ticket: ticket._id
        })
            .populate("sender", "name email role")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: messages.length,
            messages
        });

    } catch (error) {
        console.error("Get messages error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    sendMessage,
    getMessages
};