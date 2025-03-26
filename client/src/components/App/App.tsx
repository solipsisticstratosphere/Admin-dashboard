import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "../../apollo";
import SharedLayout from "../SharedLayout/SharedLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader/Loader";
import NotFoundPage from "../../pages/NotFoundPage/NotFoundPage";

// Lazy loading компонентов страниц
const LoginPage = lazy(() => import("../../pages/LoginPage/LoginPage"));
const Dashboard = lazy(() => import("../../pages/Dashboard/Dashboard"));
const CustomerDetails = lazy(
  () => import("../../pages/CustomerDetails/CustomerDetails")
);
const Orders = lazy(() => import("../../pages/Orders/Orders"));
const ProductList = lazy(() => import("../../pages/ProductList"));
const SupplierList = lazy(
  () => import("../../pages/SupplierList/SupplierList")
);
const CustomerList = lazy(() => import("../../pages/CustomerList"));

const App: React.FC = () => {
  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <Suspense fallback={<Loader />}>
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

              {/* 404 Page for any other routes */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Router>
      </ApolloProvider>
      <ToastContainer />
    </>
  );
};

export default App;
