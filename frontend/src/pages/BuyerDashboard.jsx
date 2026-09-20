import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

const BuyerDashboard = () => {

    const navigate = useNavigate();

    const [rfqs, setRfqs] = useState([]);

    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [deliveryLocation, setDeliveryLocation] = useState("");
    const [deadline, setDeadline] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [receivedQuotations, setReceivedQuotations] = useState([]);
    const [selectedRfqId, setSelectedRfqId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = localStorage.getItem("token");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    // FETCH MY RFQs

    const fetchMyRFQs = async () => {

        try {

            setFetching(true);

            const response = await api.get(
                "/rfqs/my",
                authConfig
            );

            setRfqs(response.data.rfqs || []);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to fetch RFQs"
            );

        } finally {

            setFetching(false);

        }

    };

    useEffect(() => {

        if (!token) {

            navigate("/login");
            return;

        }

        fetchMyRFQs();

    }, []);

    // CREATE OR UPDATE RFQ

    const handleSubmitRFQ = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            const data = {

                product_name: productName,
                description: description,
                quantity: Number(quantity),
                delivery_location: deliveryLocation,
                deadline: deadline

            };

            let response;

            if (editingId) {

                response = await api.put(
                    `/rfqs/${editingId}`,
                    data,
                    authConfig
                );

            } else {

                response = await api.post(
                    "/rfqs",
                    data,
                    authConfig
                );

            }

            setSuccess(
                response.data.message ||
                "Operation successful"
            );

            clearForm();

            fetchMyRFQs();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Operation failed"
            );

        } finally {

            setLoading(false);

        }

    };

    // CLEAR FORM

    const clearForm = () => {

        setProductName("");
        setDescription("");
        setQuantity("");
        setDeliveryLocation("");
        setDeadline("");
        setEditingId(null);

    };

    // EDIT RFQ

    const handleEdit = (rfq) => {

        setEditingId(rfq.id);

        setProductName(rfq.product_name);
        setDescription(rfq.description);
        setQuantity(rfq.quantity);
        setDeliveryLocation(rfq.delivery_location);

        setDeadline(
            rfq.deadline?.split("T")[0]
        );

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };

    // DELETE RFQ

    
// DELETE RFQ

const handleDelete = async (id) => {
    if (!window.confirm("Delete this RFQ?")) {
        return;
    }

    try {
        setError("");
        setSuccess("");

        const response = await api.delete(
            `/rfqs/${id}`,
            authConfig
        );

        // Remove deleted RFQ immediately from the screen
        setRfqs((previousRfqs) =>
            previousRfqs.filter((rfq) => rfq.id !== id)
        );

        // Close quotations if deleted RFQ was selected
        if (selectedRfqId === id) {
            setSelectedRfqId(null);
            setReceivedQuotations([]);
        }

        setSuccess(
            response.data.message || "RFQ deleted successfully"
        );

        // Refresh from database
        await fetchMyRFQs();

    } catch (error) {
        console.error("Delete RFQ Error:", error);

        setError(
            error.response?.data?.message ||
            "Failed to delete RFQ"
        );
    }
};

    // VIEW QUOTATIONS

    const handleViewQuotations = async (rfqId) => {

        try {

            setError("");
            setSuccess("");

            const response = await api.get(
                `/quotations/rfq/${rfqId}`,
                authConfig
            );

            setReceivedQuotations(
                response.data.quotations || []
            );

            setSelectedRfqId(rfqId);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to fetch quotations"
            );

        }

    };

    // ACCEPT QUOTATION

    const handleAcceptQuotation = async (quotationId) => {

        try {

            const response = await api.put(
                `/quotations/${quotationId}/accept`,
                {},
                authConfig
            );

            setSuccess(response.data.message);

            handleViewQuotations(selectedRfqId);

            fetchMyRFQs();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to accept quotation"
            );

        }

    };

    // REJECT QUOTATION

    const handleRejectQuotation = async (quotationId) => {

        try {

            const response = await api.put(
                `/quotations/${quotationId}/reject`,
                {},
                authConfig
            );

            setSuccess(response.data.message);

            handleViewQuotations(selectedRfqId);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to reject quotation"
            );

        }

    };

    // LOGOUT

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    return (

        <div className="dashboard-container">

            <header className="dashboard-header">

                <h2>Buyer Dashboard</h2>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </header>

            <div className="dashboard-content">

                <h3>
                    {editingId
                        ? "Edit RFQ"
                        : "Create New RFQ"
                    }
                </h3>

                <form
                    className="rfq-form"
                    onSubmit={handleSubmitRFQ}
                >

                    <label>Product / Service Name</label>

                    <input
                        type="text"
                        value={productName}
                        onChange={(e) =>
                            setProductName(e.target.value)
                        }
                        placeholder="Enter product name"
                        required
                    />

                    <label>Requirement Description</label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Describe your requirements"
                        required
                    />

                    <label>Quantity</label>

                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(e.target.value)
                        }
                        placeholder="Enter quantity"
                        required
                    />

                    <label>Delivery Location</label>

                    <input
                        type="text"
                        value={deliveryLocation}
                        onChange={(e) =>
                            setDeliveryLocation(e.target.value)
                        }
                        placeholder="Enter delivery location"
                        required
                    />

                    <label>Deadline</label>

                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) =>
                            setDeadline(e.target.value)
                        }
                        min={
                            new Date()
                                .toISOString()
                                .split("T")[0]
                        }
                        required
                    />

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

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : editingId
                                ? "Update RFQ"
                                : "Create RFQ"
                        }
                    </button>

                    {editingId && (

                        <button
                            type="button"
                            onClick={clearForm}
                        >
                            Cancel Edit
                        </button>

                    )}

                </form>

                <hr />

                <h3>My RFQs</h3>

                {fetching ? (

                    <p>Loading RFQs...</p>

                ) : rfqs.length === 0 ? (

                    <p>No RFQs created yet.</p>

                ) : (

                    <div className="rfq-list">

                        {rfqs.map((rfq) => (

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
                                    Location: {rfq.delivery_location}
                                </p>

                                <p>
                                    Deadline:{" "}
                                    {rfq.deadline
                                        ? new Date(
                                              rfq.deadline
                                          ).toLocaleDateString("en-IN", {
                                              day: "2-digit",
                                              month: "long",
                                              year: "numeric",
                                          })
                                        : "Not specified"}
                                </p>

                                <p>
                                    Status: {rfq.status}
                                </p>

                                <button
                                    onClick={() =>
                                        handleEdit(rfq)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(rfq.id)
                                    }
                                >
                                    Delete
                                </button>

                                <button
                                    onClick={() =>
                                        handleViewQuotations(
                                            rfq.id
                                        )
                                    }
                                >
                                    View Quotations
                                </button>

                            </div>

                        ))}

                    </div>

                )}

                {/* RECEIVED QUOTATIONS */}

                {selectedRfqId && (

                    <div className="quotation-section">

                        <h3>
                            Received Quotations
                        </h3>

                        {receivedQuotations.length === 0 ? (

                            <p>
                                No quotations received yet.
                            </p>

                        ) : (

                            receivedQuotations.map((quotation) => {
                                const status = (
                                    quotation.status || "pending"
                                ).toLowerCase();

                                return (
                                    <div
                                        className="rfq-card"
                                        key={quotation.id}
                                    >
                                        <h4>Supplier Quotation</h4>

                                        <p>
                                            Supplier Name:{" "}
                                            {quotation.supplier_name}
                                        </p>

                                        <p>
                                            Price: ₹{quotation.quoted_price}
                                        </p>

                                        <p>
                                            Delivery Time:{" "}
                                            {quotation.delivery_time}
                                        </p>

                                        <p>
                                            Message: {quotation.message}
                                        </p>

                                        <p>Status: {status}</p>

                                        {status === "pending" && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        handleAcceptQuotation(
                                                            quotation.id
                                                        )
                                                    }
                                                >
                                                    Accept
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleRejectQuotation(
                                                            quotation.id
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}

                                        {status === "accepted" && (
                                            <p className="success-message">
                                                ✅ Quotation Accepted
                                            </p>
                                        )}

                                        {status === "rejected" && (
                                            <p className="error-message">
                                                ❌ Quotation Rejected
                                            </p>
                                        )}
                                    </div>
                                );
                            })

                        )}

                        <button
                            onClick={() => {

                                setSelectedRfqId(null);
                                setReceivedQuotations([]);

                            }}
                        >
                            Close Quotations
                        </button>

                    </div>

                )}

            </div>

        </div>

    );
};

export default BuyerDashboard;
