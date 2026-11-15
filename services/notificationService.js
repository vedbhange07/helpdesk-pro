const Notification = require("../models/Notification");

const createNotification = async ({
    recipient,
    sender = null,
    ticket = null,
    type,
    message,
    io
}) => {
    try {
        const notification = await Notification.create({
            recipient,
            sender,
            ticket,
            type,
            message
        });

        await notification.populate("sender", "name email");

        // Deliver instantly to the recipient's personal room
        if (io) {
            io.to(`user:${recipient}`).emit(
                "new_notification",
                notification
            );
        }

        return notification;

    } catch (error) {
        console.error(
            "Notification creation error:",
            error.message
        );

        throw error;
    }
};

module.exports = createNotification;