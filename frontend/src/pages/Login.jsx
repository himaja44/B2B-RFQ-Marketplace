import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post("/auth/login", {
                email,
                password
            });

            console.log("Login Response:", response.data);

            // SAVE TOKEN

            localStorage.setItem(
                "token",
                response.data.token
            );

            // SAVE USER DETAILS

            if (response.data.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );

            }

            const role = response.data.user?.role;

            // REDIRECT BASED ON ROLE

            if (role === "buyer") {

                navigate("/buyer-dashboard");

            } else if (role === "supplier") {

                navigate("/supplier-dashboard");

            } else {

                setError("Invalid user role");

            }

        } catch (error) {

            console.error("Login Error:", error);

            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h2>B2B RFQ Marketplace</h2>

                <h3>Login</h3>

                <form onSubmit={handleLogin}>

                    <div>

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                    </div>

                    <div>

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                    </div>

                    {error && (

                        <p className="error-message">
                            {error}
                        </p>

                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading ? "Logging in..." : "Login"}

                    </button>

                </form>

                <p>
                    Don't have an account?{" "}

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>

                </p>

            </div>

        </div>

    );

};

export default Login;