import { Routes, Route } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import Orders from "./pages/Orders";
import Products from "./pages/Products";


const PantryPal = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                {/* Nested routes for Products and Orders */}
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
            </Route>
        </Routes>
    );
};

export default PantryPal;
