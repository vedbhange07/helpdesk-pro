const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket",
            required: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            minlength: 1,
            maxlength: 2000
        }
    },
    {
        timestamps: true
    }
);

// Helps retrieve messages belonging to a ticket efficiently
messageSchema.index({ ticket: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;