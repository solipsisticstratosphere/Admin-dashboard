import { Outlet, Navigate, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./SharedLayout.module.css";
import { useAuth } from "../../context/AuthContext";

const SharedLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If user navigates to root path of protected routes, redirect to dashboard
  if (location.pathname === "/") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={styles.layout}>
      <Header />
      <Sidebar />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default SharedLayout;
