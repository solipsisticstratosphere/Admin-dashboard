import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <Link to="/dashboard" className={styles.logo}>
          <img
            src={logo}
            alt="Medicine Store Logo"
            className={styles.logoImage}
          />
        </Link>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Medicine store</h1>
          <div className={styles.subtitleContainer}>
            <Link to="/dashboard" className={styles.subtitle}>
              Dashboard
            </Link>
            <span className={styles.separator}>|</span>
            <span className={styles.subtitle}>{user?.email || ""}</span>
          </div>
        </div>
      </div>
      <div className={styles.rightSection}>
        <button
          onClick={handleLogout}
          className={styles.logoutButton}
          aria-label="Logout"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.logoutIcon}
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
