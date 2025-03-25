import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import Icon from "../UI/Icon";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
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
            >
              <div className={styles.icon}>
                <Icon className={styles.icon} name="dashboard" />
              </div>
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
            >
              <div className={styles.icon}>
                <Icon className={styles.icon} name="orders" />
              </div>
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
            >
              <div className={styles.icon}>
                <Icon className={styles.icon} name="products" />
              </div>
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
            >
              <div className={styles.icon}>
                <Icon className={styles.icon} name="suppliers" />
              </div>
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
            >
              <div className={styles.icon}>
                <Icon className={styles.icon} name="customers" />
              </div>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
