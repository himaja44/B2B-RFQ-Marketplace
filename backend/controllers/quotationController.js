const db = require("../config/db");

// ==========================================
// SUBMIT QUOTATION (SUPPLIER)
// ==========================================

const submitQuotation = async (req, res) => {
    try {
        const {
            rfq_id,
            quoted_price,
            delivery_time,
            message
        } = req.body;

        if (
            rfq_id === undefined ||
            quoted_price === undefined ||
            !delivery_time
        ) {
            return res.status(400).json({
                message: "RFQ ID, quoted price and delivery time are required"
            });
        }

        if (
            !Number.isFinite(Number(quoted_price)) ||
            Number(quoted_price) <= 0
        ) {
            return res.status(400).json({
                message: "Quoted price must be greater than zero"
            });
        }

        const [rfqs] = await db.query(
            `SELECT id, status, deadline
             FROM rfqs
             WHERE id = ?`,
            [rfq_id]
        );

        if (rfqs.length === 0) {
            return res.status(404).json({
                message: "RFQ not found"
            });
        }

        const rfq = rfqs[0];

        if (
            rfq.status !== "open" ||
            new Date(rfq.deadline) <
            new Date(new Date().toISOString().split("T")[0])
        ) {
            return res.status(400).json({
                message: "This RFQ is no longer accepting quotations"
            });
        }

        const [existingQuotation] = await db.query(
            `SELECT id
             FROM quotations
             WHERE rfq_id = ?
             AND supplier_id = ?`,
            [rfq_id, req.user.id]
        );

        if (existingQuotation.length > 0) {
            return res.status(409).json({
                message: "You have already submitted a quotation for this RFQ"
            });
        }

        const [result] = await db.query(
            `INSERT INTO quotations
            (
                rfq_id,
                supplier_id,
                quoted_price,
                delivery_time,
                message
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                rfq_id,
                req.user.id,
                Number(quoted_price),
                delivery_time,
                message || null
            ]
        );

        res.status(201).json({
            message: "Quotation submitted successfully",
            quotationId: result.insertId
        });

    } catch (error) {
        console.error("Submit Quotation Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// GET SUPPLIER'S QUOTATIONS
// ==========================================

const getMyQuotations = async (req, res) => {
    try {
        const [quotations] = await db.query(
            `SELECT
                quotations.*,
                rfqs.product_name,
                rfqs.delivery_location
             FROM quotations
             JOIN rfqs
                ON quotations.rfq_id = rfqs.id
             WHERE quotations.supplier_id = ?
             ORDER BY quotations.created_at DESC`,
            [req.user.id]
        );

        res.status(200).json({
            message: "Your quotations fetched successfully",
            quotations
        });

    } catch (error) {
        console.error("Get My Quotations Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// GET QUOTATIONS RECEIVED BY BUYER
// ==========================================

const getReceivedQuotations = async (req, res) => {
    try {
        const { rfq_id } = req.params;

        const [quotations] = await db.query(
            `SELECT
                quotations.id,
                quotations.rfq_id,
                quotations.quoted_price,
                quotations.delivery_time,
                quotations.message,
                quotations.status,
                quotations.created_at,
                users.name AS supplier_name,
                users.email AS supplier_email
             FROM quotations
             JOIN rfqs
                ON quotations.rfq_id = rfqs.id
             JOIN users
                ON quotations.supplier_id = users.id
             WHERE quotations.rfq_id = ?
             AND rfqs.buyer_id = ?
             ORDER BY quotations.created_at DESC`,
            [
                rfq_id,
                req.user.id
            ]
        );

        res.status(200).json({
            message: "Received quotations fetched successfully",
            quotations
        });

    } catch (error) {
        console.error("Get Received Quotations Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// ACCEPT QUOTATION (BUYER)
// ==========================================

const acceptQuotation = async (req, res) => {
    try {
        const { id } = req.params;

        const [quotations] = await db.query(
            `SELECT quotations.id
             FROM quotations
             JOIN rfqs
                ON quotations.rfq_id = rfqs.id
             WHERE quotations.id = ?
             AND rfqs.buyer_id = ?`,
            [id, req.user.id]
        );

        if (quotations.length === 0) {
            return res.status(404).json({
                message: "Quotation not found"
            });
        }

        await db.query(
            `UPDATE quotations
             SET status = 'accepted'
             WHERE id = ?`,
            [id]
        );

        res.status(200).json({
            message: "Quotation accepted successfully"
        });

    } catch (error) {
        console.error("Accept Quotation Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// REJECT QUOTATION (BUYER)
// ==========================================

const rejectQuotation = async (req, res) => {
    try {
        const { id } = req.params;

        const [quotations] = await db.query(
            `SELECT quotations.id
             FROM quotations
             JOIN rfqs
                ON quotations.rfq_id = rfqs.id
             WHERE quotations.id = ?
             AND rfqs.buyer_id = ?`,
            [id, req.user.id]
        );

        if (quotations.length === 0) {
            return res.status(404).json({
                message: "Quotation not found"
            });
        }

        await db.query(
            `UPDATE quotations
             SET status = 'rejected'
             WHERE id = ?`,
            [id]
        );

        res.status(200).json({
            message: "Quotation rejected successfully"
        });

    } catch (error) {
        console.error("Reject Quotation Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// EXPORT FUNCTIONS
// ==========================================

module.exports = {
    submitQuotation,
    getMyQuotations,
    getReceivedQuotations,
    acceptQuotation,
    rejectQuotation
};