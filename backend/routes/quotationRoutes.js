const express = require("express");

const router = express.Router();

const {
    submitQuotation,
    getMyQuotations,
    getReceivedQuotations,
    acceptQuotation,
    rejectQuotation
} = require("../controllers/quotationController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// GET MY QUOTATIONS (SUPPLIER)

router.get(
    "/my",
    authenticateToken,
    authorizeRoles("supplier"),
    getMyQuotations
);


// SUBMIT QUOTATION (SUPPLIER)

router.post(
    "/",
    authenticateToken,
    authorizeRoles("supplier"),
    submitQuotation
);


// GET RECEIVED QUOTATIONS (BUYER)

router.get(
    "/rfq/:rfq_id",
    authenticateToken,
    authorizeRoles("buyer"),
    getReceivedQuotations
);


// ACCEPT QUOTATION (BUYER)

router.put(
    "/:id/accept",
    authenticateToken,
    authorizeRoles("buyer"),
    acceptQuotation
);


// REJECT QUOTATION (BUYER)

router.put(
    "/:id/reject",
    authenticateToken,
    authorizeRoles("buyer"),
    rejectQuotation
);


module.exports = router;