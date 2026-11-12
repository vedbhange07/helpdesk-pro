const express = require("express");
const { body, validationResult } = require("express-validator");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createTicket,
    getMyTickets
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

module.exports = router;