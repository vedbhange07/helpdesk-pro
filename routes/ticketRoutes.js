const express = require("express");
const { body,param,validationResult } = require("express-validator");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createTicket,
    getMyTickets,
    assignTicket,
    getAssignedTickets,
    updateTicketStatus
} = require("../controllers/ticketController");

const router = express.Router();

// Validate incoming request
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

// CREATE TICKET - Customer only
router.post(
    "/",
    protect,
    authorizeRoles("customer"),
    [
        body("title")
            .trim()
            .isLength({ min: 5, max: 100 })
            .withMessage("Title must be between 5 and 100 characters"),

        body("description")
            .trim()
            .isLength({ min: 10, max: 2000 })
            .withMessage("Description must be between 10 and 2000 characters"),

        body("priority")
            .optional()
            .isIn(["low", "medium", "high", "urgent"])
            .withMessage("Invalid ticket priority")
    ],
    validateRequest,
    createTicket
);

// GET MY TICKETS - Customer only
router.get(
    "/my-tickets",
    protect,
    authorizeRoles("customer"),
    getMyTickets
);

// ASSIGN TICKET - ADMIN ONLY
router.put(
    "/:ticketId/assign",
    protect,
    authorizeRoles("admin"),
    [
        param("ticketId")
            .isMongoId()
            .withMessage("Invalid ticket ID"),

        body("agentId")
            .isMongoId()
            .withMessage("Valid agent ID is required")
    ],
    validateRequest,
    assignTicket
);
router.get(
    "/assigned",
    protect,
    authorizeRoles("agent"),
    getAssignedTickets
);
router.patch(
    "/:ticketId/status",
    protect,
    authorizeRoles("agent"),
    [
        param("ticketId")
            .isMongoId()
            .withMessage("Invalid ticket ID"),

        body("status")
            .isIn(["in-progress", "resolved"])
            .withMessage("Status must be in-progress or resolved")
    ],
    validateRequest,
    updateTicketStatus
);

module.exports = router;