import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("buyer");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            const response = await api.post("/auth/register", {
                name,
                email,
                password,
                role
            });

            setSuccess(
                response.data.message ||
                "Registration successful!"
            );

            setName("");
            setEmail("");
            setPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            console.error("Register Error:", error);

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h2>B2B RFQ Marketplace</h2>

                <h3>Create Account</h3>

                <form onSubmit={handleRegister}>

                    <label>Full Name</label>

                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required
                    />

                    <label>Register As</label>

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >

                        <option value="buyer">Buyer</option>

                        <option value="supplier">Supplier</option>

                    </select>

                    {error && (

                        <p className="error-message">
                            {error}
                        </p>

                    )}

                    {success && (

                        <p style={{ color: "green" }}>
                            {success}
                        </p>

                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading ? "Registering..." : "Register"}

                    </button>

                </form>

                <p>
                    Already have an account?
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>

            </div>

        </div>

    );

};

export default Register;