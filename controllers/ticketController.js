const Ticket = require("../models/Ticket");

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

module.exports = {
    createTicket,
    getMyTickets
};