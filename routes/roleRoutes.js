const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin only
router.get(
    "/admin",
    protect,
    authorizeRoles("admin"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome Admin! You have access."
        });
    }
);

// Admin and Agent
router.get(
    "/agent",
    protect,
    authorizeRoles("admin", "agent"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome! You have agent access."
        });
    }
);

// Customer only
router.get(
    "/customer",
    protect,
    authorizeRoles("customer"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome Customer! You have access."
        });
    }
);

module.exports = router;