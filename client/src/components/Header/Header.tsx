import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Header.module.css";
import logo from "../../assets/images/logo1.png";
import { useAuth } from "../../context/AuthContext";
import Icon from "../UI/Icon";
import MobileMenu from "../MobileMenu/MobileMenu";
import EditModeToggle from "../EditModeToggle/EditModeToggle";
import AdminPasswordDialog from "../AdminPasswordDialog/AdminPasswordDialog";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.leftSection}>
          <button
            onClick={toggleMobileMenu}
            className={styles.menuButton}
            aria-label="Menu"
          >
            <Icon name="menu" className={styles.menuIcon} />
          </button>
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
          <EditModeToggle />
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
            aria-label="Logout"
          >
            <Icon name="logout" className={styles.logoutIcon} />
          </button>
        </div>
      </header>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      <AdminPasswordDialog />
    </>
  );
};

export default Header;
