const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const authenticateToken = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

// REGISTER
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);

// PROFILE (PROTECTED)
router.get(
    "/profile",
    authenticateToken,
    (req, res) => {

        res.json({
            message: "Profile accessed successfully",
            user: req.user
        });

    }
);

// BUYER ONLY
router.get(
    "/buyer-only",
    authenticateToken,
    authorizeRoles("buyer"),
    (req, res) => {

        res.json({
            message: "Welcome Buyer!"
        });

    }
);

module.exports = router;