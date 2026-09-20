const express = require("express");

const router = express.Router();

const {
    createRFQ,
    getAllRFQs,
    getMyRFQs,
    getRFQById,
    updateRFQ,
    deleteRFQ
} = require("../controllers/rfqController");

const authenticateToken = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");


// GET MY RFQs (BUYER ONLY)
// Keep before /:id

router.get(
    "/my",
    authenticateToken,
    authorizeRoles("buyer"),
    getMyRFQs
);


// CREATE RFQ (BUYER ONLY)

router.post(
    "/",
    authenticateToken,
    authorizeRoles("buyer"),
    createRFQ
);


// GET ALL RFQs (SUPPLIER ONLY)

router.get(
    "/",
    authenticateToken,
    authorizeRoles("supplier"),
    getAllRFQs
);


// GET RFQ DETAILS (BUYER OR SUPPLIER)

router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("buyer", "supplier"),
    getRFQById
);


// UPDATE RFQ (BUYER ONLY)

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("buyer"),
    updateRFQ
);


// DELETE RFQ (BUYER ONLY)

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("buyer"),
    deleteRFQ
);


module.exports = router;