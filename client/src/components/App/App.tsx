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
import ProductList from "../../pages/ProductList";
import SupplierList from "../../pages/SupplierList/SupplierList";
import CustomerList from "../../pages/CustomerList";
import SharedLayout from "../SharedLayout/SharedLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
              <Route path="products" element={<ProductList />} />
              <Route path="customers" element={<CustomerList />} />
              <Route path="suppliers" element={<SupplierList />} />
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
