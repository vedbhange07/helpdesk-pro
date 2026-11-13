const Ticket = require("../models/Ticket");
const User = require("../models/User");

// CREATE TICKET
const createTicket = async (req, res) => {
    try {
        const { title, description, priority } = req.body;

        const ticket = await Ticket.create({
            title,
            description,

            // Customer ID comes from authenticated user
            customer: req.user._id,

            priority: priority || "medium"
        });

        return res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            ticket
        });

    } catch (error) {
        console.error("Create ticket error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// GET CUSTOMER'S TICKETS
const getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({
            customer: req.user._id
        })
            .populate("customer", "name email")
            .populate("assignedAgent", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: tickets.length,
            tickets
        });

    } catch (error) {
        console.error("Get tickets error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
// ASSIGN TICKET TO AGENT (ADMIN ONLY)
const assignTicket = async (req, res) => {
    try {
        const { agentId } = req.body;
        const { ticketId } = req.params;

        // Check whether the selected user is an active agent
        const agent = await User.findOne({
            _id: agentId,
            role: "agent",
            isActive: true
        }).select("_id name email role");

        if (!agent) {
            return res.status(400).json({
                success: false,
                message: "Selected user is not an active support agent"
            });
        }

        // Find the ticket
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        // Assign agent
        ticket.assignedAgent = agent._id;

        await ticket.save();

        // Return populated information
        await ticket.populate("customer", "name email");
        await ticket.populate("assignedAgent", "name email");

        return res.status(200).json({
            success: true,
            message: "Ticket assigned successfully",
            ticket
        });

    } catch (error) {
        console.error("Assign ticket error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createTicket,
    getMyTickets,
    assignTicket
};