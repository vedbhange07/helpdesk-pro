const { Queue } = require("bullmq");

const notificationQueue = new Queue("notificationQueue", {
    connection: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
        maxRetriesPerRequest: null
    },
    defaultJobOptions: {
        attempts: 5,

        backoff: {
            type: "exponential",
            delay: 2000
        },

        removeOnComplete: 1000,
        removeOnFail: 5000
    }
});

notificationQueue.on("error", (error) => {
    console.error("Notification queue error:", error.message);
});

module.exports = notificationQueue;