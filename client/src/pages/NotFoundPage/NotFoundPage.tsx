import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.message}>
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.homeButton}>
            Go to Login
          </Link>
          <Link to="/dashboard" className={styles.dashboardButton}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
