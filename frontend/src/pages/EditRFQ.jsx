import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditRFQ = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [deliveryLocation, setDeliveryLocation] = useState("");
    const [deadline, setDeadline] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    // FETCH RFQ
    useEffect(() => {

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchRFQ = async () => {

            try {

                const response = await api.get(
                    `/rfqs/${id}`,
                    authConfig
                );

                const rfq = response.data.rfq;

                setProductName(rfq.product_name);
                setDescription(rfq.description);
                setQuantity(rfq.quantity);
                setDeliveryLocation(
                    rfq.delivery_location
                );

                setDeadline(
                    new Date(rfq.deadline)
                        .toISOString()
                        .split("T")[0]
                );

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Failed to load RFQ"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchRFQ();

    }, [id]);

    // UPDATE RFQ
    const handleUpdate = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");
        setSaving(true);

        try {

            const response = await api.put(
                `/rfqs/${id}`,
                {
                    product_name: productName,
                    description: description,
                    quantity: Number(quantity),
                    delivery_location: deliveryLocation,
                    deadline: deadline
                },
                authConfig
            );

            setSuccess(
                response.data.message ||
                "RFQ updated successfully!"
            );

            setTimeout(() => {
                navigate("/buyer-dashboard");
            }, 1000);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to update RFQ"
            );

        } finally {

            setSaving(false);

        }

    };

    if (loading) {
        return <p>Loading RFQ...</p>;
    }

    return (

        <div className="dashboard-container">

            <header className="dashboard-header">

                <h2>Edit RFQ</h2>

                <button
                    onClick={() =>
                        navigate("/buyer-dashboard")
                    }
                >
                    Dashboard
                </button>

            </header>

            <div className="dashboard-content">

                <h3>Update RFQ</h3>

                <form
                    className="rfq-form"
                    onSubmit={handleUpdate}
                >

                    <label>Product / Service Name</label>

                    <input
                        type="text"
                        value={productName}
                        onChange={(e) =>
                            setProductName(e.target.value)
                        }
                        required
                    />

                    <label>Requirement Description</label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
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
                        required
                    />

                    <label>Delivery Location</label>

                    <input
                        type="text"
                        value={deliveryLocation}
                        onChange={(e) =>
                            setDeliveryLocation(e.target.value)
                        }
                        required
                    />

                    <label>Deadline</label>

                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) =>
                            setDeadline(e.target.value)
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
                        disabled={saving}
                    >
                        {saving
                            ? "Updating..."
                            : "Update RFQ"}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/buyer-dashboard")
                        }
                    >
                        Cancel
                    </button>

                </form>

            </div>

        </div>

    );

};

export default EditRFQ;