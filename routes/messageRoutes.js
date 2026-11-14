const express = require("express");
const {
    body,
    param,
    validationResult
} = require("express-validator");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    sendMessage,
    getMessages
} = require("../controllers/messageController");

const router = express.Router();

// VALIDATION MIDDLEWARE
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
            }))
        });
    }

    next();
};

// SEND MESSAGE
router.post(
    "/:ticketId/messages",
    protect,
    authorizeRoles("customer", "agent", "admin"),
    [
        param("ticketId")
            .isMongoId()
            .withMessage("Invalid ticket ID"),

        body("message")
            .isString()
            .trim()
            .isLength({ min: 1, max: 2000 })
            .withMessage("Message must be between 1 and 2000 characters")
    ],
    validateRequest,
    sendMessage
);

// GET CONVERSATION
router.get(
    "/:ticketId/messages",
    protect,
    authorizeRoles("customer", "agent", "admin"),
    [
        param("ticketId")
            .isMongoId()
            .withMessage("Invalid ticket ID")
    ],
    validateRequest,
    getMessages
);

module.exports = router;