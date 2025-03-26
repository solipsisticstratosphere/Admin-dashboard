import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./MobileMenu.module.css";
import Icon from "../UI/Icon";
import { useAuth } from "../../context/AuthContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    onClose();
  };

  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={onClose} />}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ""}`}>
        <div className={styles.closeButtonContainer}>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>
        <nav className={styles.menu}>
          <ul className={styles.menuItems}>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.menuItem} ${styles.active}`
                    : styles.menuItem
                }
                onClick={handleLinkClick}
              >
                <div className={styles.icon}>
                  <Icon name="dashboard" />
                </div>
                <span className={styles.menuText}>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.menuItem} ${styles.active}`
                    : styles.menuItem
                }
                onClick={handleLinkClick}
              >
                <div className={styles.icon}>
                  <Icon name="orders" />
                </div>
                <span className={styles.menuText}>Orders</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.menuItem} ${styles.active}`
                    : styles.menuItem
                }
                onClick={handleLinkClick}
              >
                <div className={styles.icon}>
                  <Icon name="products" />
                </div>
                <span className={styles.menuText}>Products</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/suppliers"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.menuItem} ${styles.active}`
                    : styles.menuItem
                }
                onClick={handleLinkClick}
              >
                <div className={styles.icon}>
                  <Icon name="suppliers" />
                </div>
                <span className={styles.menuText}>Suppliers</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.menuItem} ${styles.active}`
                    : styles.menuItem
                }
                onClick={handleLinkClick}
              >
                <div className={styles.icon}>
                  <Icon name="customers" />
                </div>
                <span className={styles.menuText}>Customers</span>
              </NavLink>
            </li>
          </ul>

          <div className={styles.logoutContainer}>
            <button className={styles.logoutButton} onClick={handleLogout}>
              <div className={styles.icon}>
                <Icon name="logout" />
              </div>
              <span className={styles.menuText}>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;
