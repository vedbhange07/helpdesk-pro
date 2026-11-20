const notificationQueue = require("../queues/notificationQueue");

const createNotification = async ({
    recipient,
    sender = null,
    ticket = null,
    type,
    message
}) => {
    try {
        const job = await notificationQueue.add(
            "create-notification",
            {
                recipient: recipient.toString(),
                sender: sender ? sender.toString() : null,
                ticket: ticket ? ticket.toString() : null,
                type,
                message
            }
        );

        console.log("Notification job added:", job.id);

        return job;

    } catch (error) {
        console.error(
            "Failed to enqueue notification:",
            error.message
        );

        throw error;
    }
};

module.exports = createNotification;