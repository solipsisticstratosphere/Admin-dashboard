import React from "react";
import styles from "./Dashboard.module.css";

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <div className={styles.statTitle}>All products</div>
          </div>
          <div className={styles.statValue}>8,430</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className={styles.statTitle}>All suppliers</div>
          </div>
          <div className={styles.statValue}>211</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className={styles.statTitle}>All customers</div>
          </div>
          <div className={styles.statValue}>140</div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.dashboardCard}>
          <h2 className={styles.cardTitle}>Recent Customers</h2>
          <div className={styles.cardContent}>
            <table className={styles.customersTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Spent</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className={styles.customerName}>
                      <div className={styles.avatar}></div>
                      <span>Alex Shatov</span>
                    </div>
                  </td>
                  <td>alexshatov@gmail.com</td>
                  <td>2,890.66</td>
                </tr>
                <tr>
                  <td>
                    <div className={styles.customerName}>
                      <div className={styles.avatar}></div>
                      <span>Philip Harbach</span>
                    </div>
                  </td>
                  <td>philip.h@gmail.com</td>
                  <td>2,767.04</td>
                </tr>
                <tr>
                  <td>
                    <div className={styles.customerName}>
                      <div className={styles.avatar}></div>
                      <span>Mirko Fisuk</span>
                    </div>
                  </td>
                  <td>mirkofisuk@gmail.com</td>
                  <td>2,996.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.dashboardCard}>
          <h2 className={styles.cardTitle}>Income/Expenses</h2>
          <div className={styles.cardContent}>
            <div className={styles.transactionsList}>
              <div className={styles.transaction}>
                <div className={styles.transactionInfo}>
                  <div className={styles.transactionTag}>Today</div>
                  <div className={styles.transactionType}>Income</div>
                  <div className={styles.transactionDesc}>
                    Cruip.com Market Ltd
                  </div>
                </div>
                <div className={styles.transactionAmount}>+249.88</div>
              </div>

              <div className={styles.transaction}>
                <div className={styles.transactionInfo}>
                  <div className={styles.transactionType}>Expense</div>
                  <div className={styles.transactionDesc}>Qonto billing</div>
                </div>
                <div className={styles.transactionAmount}>-49.88</div>
              </div>

              <div className={styles.transaction}>
                <div className={styles.transactionInfo}>
                  <div className={styles.transactionType}>Income</div>
                  <div className={styles.transactionDesc}>Market Cap Ltd</div>
                </div>
                <div className={styles.transactionAmount}>+1,200.88</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
