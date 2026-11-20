const { Worker } = require("bullmq");

const Notification = require("../models/Notification");

const createNotificationWorker = (io) => {

    const worker = new Worker(
        "notificationQueue",

        async (job) => {
            console.log("Processing notification job:", job.id);

            const {
                recipient,
                sender,
                ticket,
                type,
                message
            } = job.data;

            // Save notification in MongoDB
            const notification = await Notification.create({
                recipient,
                sender,
                ticket,
                type,
                message
            });

            // Populate sender details
            await notification.populate("sender", "name email");

            // Send real-time notification
            io.to(`user:${recipient}`).emit(
                "new_notification",
                notification
            );

            console.log(
                "Notification processed successfully:",
                notification._id
            );

            return {
                success: true,
                notificationId: notification._id.toString()
            };
        },

        {
            connection: {
                host: process.env.REDIS_HOST || "127.0.0.1",
                port: Number(process.env.REDIS_PORT) || 6379,
                maxRetriesPerRequest: null
            },
            concurrency: 5
        }
    );

    worker.on("completed", (job) => {
        console.log(`Job ${job.id} completed successfully`);
    });

    worker.on("failed", (job, error) => {
        console.error(
            `Job ${job?.id} failed:`,
            error.message
        );
    });

    worker.on("error", (error) => {
        console.error("Notification worker error:", error.message);
    });

    console.log("Notification worker started!");

    return worker;
};

module.exports = createNotificationWorker;