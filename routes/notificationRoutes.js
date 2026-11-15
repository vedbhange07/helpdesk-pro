const express = require("express");
const {
    param,
    validationResult
} = require("express-validator");

const protect = require("../middleware/authMiddleware");

const {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} = require("../controllers/notificationController");

const router = express.Router();

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    next();
};

// GET MY NOTIFICATIONS
router.get("/", protect, getMyNotifications);

// MARK ALL AS READ
router.patch(
    "/read-all",
    protect,
    markAllNotificationsAsRead
);

// MARK ONE AS READ
router.patch(
    "/:notificationId/read",
    protect,
    [
        param("notificationId")
            .isMongoId()
            .withMessage("Invalid notification ID")
    ],
    validateRequest,
    markNotificationAsRead
);

module.exports = router;