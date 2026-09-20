import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

const SupplierDashboard = () => {

    const navigate = useNavigate();

    const [rfqs, setRfqs] = useState([]);
    const [search, setSearch] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    const [selectedRFQ, setSelectedRFQ] = useState(null);

    const [quotedPrice, setQuotedPrice] = useState("");
    const [deliveryTime, setDeliveryTime] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = localStorage.getItem("token");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    // FETCH ALL RFQs

    const fetchRFQs = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/rfqs",
                authConfig
            );

            setRfqs(response.data.rfqs || []);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to fetch RFQs"
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

        fetchRFQs();

    }, []);

    // SUBMIT QUOTATION

    const handleSubmitQuotation = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (Number(quotedPrice) <= 0) {

            setError("Quoted price must be greater than zero");
            return;

        }

        setSubmitting(true);

        try {

            const response = await api.post(

                "/quotations",

                {
                    rfq_id: selectedRFQ.id,
                    quoted_price: Number(quotedPrice),
                    delivery_time: deliveryTime,
                    message: message
                },

                authConfig

            );

            setSuccess(
                response.data.message ||
                "Quotation submitted successfully!"
            );

            setQuotedPrice("");
            setDeliveryTime("");
            setMessage("");

            setSelectedRFQ(null);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to submit quotation"
            );

        } finally {

            setSubmitting(false);

        }

    };

    // LOGOUT

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    // SEARCH AND FILTER

    const filteredRFQs = rfqs.filter((rfq) => {

        const matchesSearch =
            rfq.product_name
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesLocation =
            rfq.delivery_location
                .toLowerCase()
                .includes(locationFilter.toLowerCase());

        return matchesSearch && matchesLocation;

    });

    return (

        <div className="dashboard-container">

            {/* HEADER */}

            <header className="dashboard-header">

                <h2>Supplier Dashboard</h2>

                <div>

                    <button
                        onClick={() =>
                            navigate("/supplier-quotations")
                        }
                    >
                        My Quotations
                    </button>

                    <button onClick={handleLogout}>
                        Logout
                    </button>

                </div>

            </header>

            <div className="dashboard-content">

                <h3>Available RFQs</h3>

                {/* SEARCH */}

                <input
                    type="text"
                    placeholder="Search by product name..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="search-input"
                />

                {/* LOCATION FILTER */}

                <input
                    type="text"
                    placeholder="Filter by delivery location..."
                    value={locationFilter}
                    onChange={(e) =>
                        setLocationFilter(e.target.value)
                    }
                    className="search-input"
                />

                {/* CLEAR FILTERS */}

                <button
                    onClick={() => {
                        setSearch("");
                        setLocationFilter("");
                    }}
                >
                    Clear Filters
                </button>

                {error && (

                    <p className="error-message">
                        {error}
                    </p>

                )}

                {success && (

                    <p className="success-message">
                        {success}
                    </p>

                )}

                {/* RFQ LIST */}

                {loading ? (

                    <p>Loading RFQs...</p>

                ) : filteredRFQs.length === 0 ? (

                    <p>No RFQs found.</p>

                ) : (

                    <div className="rfq-list">

                        {filteredRFQs.map((rfq) => (

                            <div
                                className="rfq-card"
                                key={rfq.id}
                            >

                                <h4>
                                    {rfq.product_name}
                                </h4>

                                <p>
                                    {rfq.description}
                                </p>

                                <p>
                                    Quantity: {rfq.quantity}
                                </p>

                                <p>
                                    Location:{" "}
                                    {rfq.delivery_location}
                                </p>

                                <p>
                                    Deadline:{" "}
                                    {new Date(
                                        rfq.deadline
                                    ).toLocaleDateString()}
                                </p>

                                <p>
                                    Status: {rfq.status}
                                </p>

                                <button
                                    onClick={() => {

                                        setSelectedRFQ(rfq);

                                        setError("");
                                        setSuccess("");

                                    }}
                                >
                                    Submit Quotation
                                </button>

                            </div>

                        ))}

                    </div>

                )}

                {/* QUOTATION FORM */}

                {selectedRFQ && (

                    <div className="quotation-section">

                        <h3>
                            Submit Quotation
                        </h3>

                        <p>
                            Product:{" "}
                            {selectedRFQ.product_name}
                        </p>

                        <form
                            className="rfq-form"
                            onSubmit={handleSubmitQuotation}
                        >

                            <label>Quoted Price</label>

                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={quotedPrice}
                                onChange={(e) =>
                                    setQuotedPrice(e.target.value)
                                }
                                placeholder="Enter quoted price"
                                required
                            />

                            <label>
                                Estimated Delivery Time
                            </label>

                            <input
                                type="text"
                                value={deliveryTime}
                                onChange={(e) =>
                                    setDeliveryTime(e.target.value)
                                }
                                placeholder="Example: 10 days"
                                required
                            />

                            <label>
                                Message / Notes
                            </label>

                            <textarea
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                placeholder="Enter your message"
                                required
                            />

                            <button
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting
                                    ? "Submitting..."
                                    : "Submit Quotation"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedRFQ(null);
                                    setError("");
                                }}
                            >
                                Cancel
                            </button>

                        </form>

                    </div>

                )}

            </div>

        </div>

    );

};

export default SupplierDashboard;