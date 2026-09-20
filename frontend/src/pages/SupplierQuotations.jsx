import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const SupplierQuotations = () => {

    const navigate = useNavigate();

    const [quotations, setQuotations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    // FETCH MY QUOTATIONS

    const fetchMyQuotations = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/quotations/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setQuotations(response.data.quotations || []);

        } catch (error) {

            console.error("Fetch Quotations Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch quotations"
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        if (!token) {

            navigate("/login");
            return;

        }

        fetchMyQuotations();

    }, []);

    // LOGOUT

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    return (

        <div className="dashboard-container">

            <header className="dashboard-header">

                <h2>My Quotations</h2>

                <div>

                    <button
                        onClick={() => navigate("/supplier-dashboard")}
                    >
                        Dashboard
                    </button>

                    <button onClick={handleLogout}>
                        Logout
                    </button>

                </div>

            </header>

            <div className="dashboard-content">

                <h3>Submitted Quotations</h3>

                {error && (

                    <p className="error-message">
                        {error}
                    </p>

                )}

                {loading ? (

                    <p>Loading quotations...</p>

                ) : quotations.length === 0 ? (

                    <p>You have not submitted any quotations yet.</p>

                ) : (

                    <div className="rfq-list">

                        {quotations.map((quotation) => (

                            <div
                                className="rfq-card"
                                key={quotation.id}
                            >

                                <h4>
                                    {quotation.product_name}
                                </h4>

                                <p>
                                    Delivery Location:{" "}
                                    {quotation.delivery_location}
                                </p>

                                <p>
                                    RFQ ID: {quotation.rfq_id}
                                </p>

                                <p>
                                    Quoted Price: ₹
                                    {quotation.quoted_price}
                                </p>

                                <p>
                                    Delivery Time:{" "}
                                    {quotation.delivery_time}
                                </p>

                                <p>
                                    Message:{" "}
                                    {quotation.message || "No message"}
                                </p>

                                <p>
                                    Submitted On:{" "}
                                    {new Date(
                                        quotation.created_at
                                    ).toLocaleDateString()}
                                </p>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

};

export default SupplierQuotations;