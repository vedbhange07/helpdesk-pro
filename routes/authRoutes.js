const express = require("express");
const { body, validationResult } = require("express-validator");
const protect = require("../middleware/authMiddleware");


const {
    registerUser,
    loginUser,
    getProfile
} = require("../controllers/authController");

const router = express.Router();

// Validation middleware
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

// Register API
router.post(
    "/register",
    [
        body("name")
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage("Name must be between 2 and 50 characters"),

        body("email")
            .trim()
            .isEmail()
            .withMessage("Enter a valid email")
            .normalizeEmail(),

        body("password")
            .isString()
            .isLength({ min: 8, max: 72 })
            .withMessage("Password must be between 8 and 72 characters")
    ],
    validateRequest,
    registerUser
);

// Login API
router.post(
    "/login",
    [
        body("email")
            .trim()
            .isEmail()
            .withMessage("Enter a valid email")
            .normalizeEmail(),

        body("password")
            .isString()
            .notEmpty()
            .withMessage("Password is required")
    ],
    validateRequest,
    loginUser
);
router.get("/me", protect, getProfile);

module.exports = router;