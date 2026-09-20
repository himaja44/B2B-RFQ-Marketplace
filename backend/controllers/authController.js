const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// REGISTER USER

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;

        // VALIDATION

        if (!name || !email || !password || !role) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        // CHECK ROLE

        if (!["buyer", "supplier"].includes(role)) {

            return res.status(400).json({
                message: "Invalid role"
            });

        }

        // CHECK EXISTING USER

        const [existingUser] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {

            return res.status(409).json({
                message: "Email already registered"
            });

        }

        // HASH PASSWORD

        const hashedPassword = await bcrypt.hash(password, 10);

        // INSERT USER

        const [result] = await db.query(

            `INSERT INTO users
            (name, email, password, role)
            VALUES (?, ?, ?, ?)`,

            [
                name,
                email,
                hashedPassword,
                role
            ]

        );

        res.status(201).json({

            message: "User registered successfully",

            userId: result.insertId

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server error"

        });

    }

};

// LOGIN USER

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        // VALIDATION

        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password are required"
            });

        }

        // FIND USER

        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        const user = users[0];

        // COMPARE PASSWORD

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        // GENERATE JWT

        const token = jwt.sign(

            {
                id: user.id,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );

        // SUCCESS RESPONSE

        res.status(200).json({

            message: "Login successful",

            token: token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};

module.exports = {
    registerUser,
    loginUser
};