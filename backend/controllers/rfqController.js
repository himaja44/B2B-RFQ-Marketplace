const db = require("../config/db");

// ==========================================
// CREATE RFQ (BUYER)
// ==========================================

const createRFQ = async (req, res) => {

    try {

        const {
            product_name,
            description,
            quantity,
            delivery_location,
            deadline
        } = req.body;

        // VALIDATION

        if (
            !product_name ||
            !description ||
            quantity === undefined ||
            !delivery_location ||
            !deadline
        ) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        if (
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) <= 0
        ) {

            return res.status(400).json({
                message: "Quantity must be a positive integer"
            });

        }

        // CREATE RFQ

        const [result] = await db.query(

            `INSERT INTO rfqs
            (
                buyer_id,
                product_name,
                description,
                quantity,
                delivery_location,
                deadline
            )
            VALUES (?, ?, ?, ?, ?, ?)`,

            [
                req.user.id,
                product_name,
                description,
                Number(quantity),
                delivery_location,
                deadline
            ]

        );

        res.status(201).json({

            message: "RFQ created successfully",

            rfqId: result.insertId

        });

    } catch (error) {

        console.error("Create RFQ Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


// ==========================================
// GET ALL OPEN RFQs (SUPPLIER)
// ==========================================

const getAllRFQs = async (req, res) => {

    try {

        const [rfqs] = await db.query(

            `SELECT
                id,
                buyer_id,
                product_name,
                description,
                quantity,
                delivery_location,
                deadline,
                status,
                created_at
             FROM rfqs
             WHERE status = 'open'
             AND deadline >= CURDATE()
             ORDER BY created_at DESC`

        );

        res.status(200).json({

            message: "RFQs fetched successfully",

            rfqs

        });

    } catch (error) {

        console.error("Get RFQs Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


// ==========================================
// GET BUYER'S RFQs
// ==========================================

const getMyRFQs = async (req, res) => {

    try {

        const [rfqs] = await db.query(

            `SELECT *
             FROM rfqs
             WHERE buyer_id = ?
             ORDER BY created_at DESC`,

            [req.user.id]

        );

        res.status(200).json({

            message: "Your RFQs fetched successfully",

            rfqs

        });

    } catch (error) {

        console.error("Get My RFQs Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


// ==========================================
// GET RFQ DETAILS
// ==========================================

const getRFQById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rfqs] = await db.query(

            `SELECT
                rfqs.*,
                users.name AS buyer_name,
                users.email AS buyer_email
             FROM rfqs
             JOIN users
                ON rfqs.buyer_id = users.id
             WHERE rfqs.id = ?`,

            [id]

        );

        if (rfqs.length === 0) {

            return res.status(404).json({
                message: "RFQ not found"
            });

        }

        res.status(200).json({

            message: "RFQ fetched successfully",

            rfq: rfqs[0]

        });

    } catch (error) {

        console.error("Get RFQ Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


// ==========================================
// UPDATE RFQ (BUYER)
// ==========================================

const updateRFQ = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            product_name,
            description,
            quantity,
            delivery_location,
            deadline
        } = req.body;

        // VALIDATION

        if (
            !product_name ||
            !description ||
            quantity === undefined ||
            !delivery_location ||
            !deadline
        ) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        if (
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) <= 0
        ) {

            return res.status(400).json({
                message: "Quantity must be a positive integer"
            });

        }

        // UPDATE RFQ

        const [result] = await db.query(

            `UPDATE rfqs
             SET
                product_name = ?,
                description = ?,
                quantity = ?,
                delivery_location = ?,
                deadline = ?
             WHERE id = ?
             AND buyer_id = ?`,

            [
                product_name,
                description,
                Number(quantity),
                delivery_location,
                deadline,
                id,
                req.user.id
            ]

        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "RFQ not found or you are not the owner"
            });

        }

        res.status(200).json({

            message: "RFQ updated successfully"

        });

    } catch (error) {

        console.error("Update RFQ Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


// ==========================================
// DELETE RFQ (BUYER)
// ==========================================

// ==========================================
// DELETE RFQ (BUYER)
// ==========================================

const deleteRFQ = async (req, res) => {
    try {
        const { id } = req.params;

        // Check whether RFQ belongs to the logged-in buyer
        const [rfqs] = await db.query(
            `SELECT id
             FROM rfqs
             WHERE id = ?
             AND buyer_id = ?`,
            [id, req.user.id]
        );

        if (rfqs.length === 0) {
            return res.status(404).json({
                message: "RFQ not found or you are not the owner"
            });
        }

        // Delete related quotations first
        await db.query(
            `DELETE FROM quotations
             WHERE rfq_id = ?`,
            [id]
        );

        // Delete the RFQ
        const [result] = await db.query(
            `DELETE FROM rfqs
             WHERE id = ?
             AND buyer_id = ?`,
            [id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "RFQ could not be deleted"
            });
        }

        res.status(200).json({
            message: "RFQ and related quotations deleted successfully"
        });

    } catch (error) {
        console.error("Delete RFQ Error:", error);

        res.status(500).json({
            message: "Server error while deleting RFQ",
            error: error.message
        });
    }
};


// ==========================================
// EXPORT ALL FUNCTIONS
// ==========================================

module.exports = {

    createRFQ,

    getAllRFQs,

    getMyRFQs,

    getRFQById,

    updateRFQ,

    deleteRFQ

};