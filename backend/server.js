const express = require("express");
const cors = require("cors");

require("dotenv").config();

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const rfqRoutes = require("./routes/rfqRoutes");
const quotationRoutes = require("./routes/quotationRoutes");

// CREATE EXPRESS APP

const app = express();

// MIDDLEWARE

app.use(cors());

app.use(express.json());

// ROUTES

app.use("/api/auth", authRoutes);

app.use("/api/rfqs", rfqRoutes);

app.use("/api/quotations", quotationRoutes);

// HOME ROUTE

app.get("/", (req, res) => {

    res.json({
        message: "B2B RFQ Marketplace Backend Running"
    });

});

// START SERVER

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});