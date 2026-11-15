const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket",
            default: null
        },

        type: {
            type: String,
            enum: [
                "ticket_assigned",
                "new_message",
                "status_changed"
            ],
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300
        },

        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

notificationSchema.index({
    recipient: 1,
    isRead: 1,
    createdAt: -1
});

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

module.exports = Notification;