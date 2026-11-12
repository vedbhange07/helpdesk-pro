const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Ticket title is required"],
            trim: true,
            minlength: 5,
            maxlength: 100
        },

        description: {
            type: String,
            required: [true, "Ticket description is required"],
            trim: true,
            minlength: 10,
            maxlength: 2000
        },

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        assignedAgent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium"
        },

        status: {
            type: String,
            enum: [
                "open",
                "in-progress",
                "resolved",
                "closed"
            ],
            default: "open"
        }
    },
    {
        timestamps: true
    }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;