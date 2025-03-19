// App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "../../pages/LoginPage/LoginPage";
import Dashboard from "../../pages/Dashboard/Dashboard";
import SharedLayout from "../SharedLayout/SharedLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Placeholder components for other routes
const OrdersPage = () => <div>Orders Page</div>;
const ProductsPage = () => <div>Products Page</div>;
const CustomersPage = () => <div>Customers Page</div>;
const SuppliersPage = () => <div>Suppliers Page</div>;

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          {/* Protected routes */}
          <Route path="/" element={<SharedLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
          </Route>

          {/* Redirect to login for any other routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
};

export default App;
