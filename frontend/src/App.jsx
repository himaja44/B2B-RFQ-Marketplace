import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import BuyerDashboard from "./pages/BuyerDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import SupplierQuotations from "./pages/SupplierQuotations";
import EditRFQ from "./pages/EditRFQ";
function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/buyer-dashboard"
                    element={<BuyerDashboard />}
                />

                <Route
                    path="/supplier-dashboard"
                    element={<SupplierDashboard />}
                />

                <Route
                    path="/supplier-quotations"
                    element={<SupplierQuotations />}
                />
                <Route
    path="/edit-rfq/:id"
    element={<EditRFQ />}
/>

            </Routes>

        </BrowserRouter>

    );

}

export default App;