// App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "../../apollo";
import LoginPage from "../../pages/LoginPage/LoginPage";
import Dashboard from "../../pages/Dashboard/Dashboard";
import CustomerDetails from "../../pages/CustomerDetails/CustomerDetails";
import Orders from "../../pages/Orders/Orders";
import SharedLayout from "../SharedLayout/SharedLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Placeholder components for other routes
const ProductsPage = () => <div>Products Page</div>;
const CustomersPage = () => <div>Customers Page</div>;
const SuppliersPage = () => <div>Suppliers Page</div>;

const App: React.FC = () => {
  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />

            {/* Protected routes */}
            <Route path="/" element={<SharedLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route
                path="customers/:customerId"
                element={<CustomerDetails />}
              />
              <Route path="orders" element={<Orders />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="suppliers" element={<SuppliersPage />} />
            </Route>

            {/* Redirect to login for any other routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ApolloProvider>
      <ToastContainer />
    </>
  );
};

export default App;
