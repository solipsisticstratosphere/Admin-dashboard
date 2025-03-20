import React from "react";
import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_DATA } from "../../graphql/queries";
import { DashboardQueryResult } from "../../graphql/types";

const Dashboard: React.FC = () => {
  const { loading, error, data } =
    useQuery<DashboardQueryResult>(GET_DASHBOARD_DATA);

  if (loading) {
    return <div className={styles.loading}>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        Failed to load dashboard data. Please try again later.
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data?.dashboard) {
    return <div className={styles.error}>No dashboard data available</div>;
  }

  const { stats, recentCustomers, transactions } = data.dashboard;

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
          <div className={styles.statValue}>{stats.totalProducts}</div>
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
          <div className={styles.statValue}>{stats.totalSuppliers}</div>
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
          <div className={styles.statValue}>{stats.totalCustomers}</div>
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
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {recentCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className={styles.customerName}>
                        <div
                          className={styles.avatar}
                          style={{
                            backgroundImage: customer.photo
                              ? `url(${customer.photo})`
                              : "none",
                          }}
                        ></div>
                        <Link to={`/customers/${customer.id}`}>
                          {customer.name}
                        </Link>
                      </div>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.spent}</td>
                    <td>{customer.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.dashboardCard}>
          <h2 className={styles.cardTitle}>Income/Expenses</h2>
          <div className={styles.cardContent}>
            <div className={styles.transactionsList}>
              {transactions.map((transaction) => (
                <div key={transaction.id} className={styles.transaction}>
                  <div className={styles.transactionInfo}>
                    {transaction.email && (
                      <div className={styles.transactionEmail}>
                        {transaction.email}
                      </div>
                    )}
                    <div
                      className={`${styles.transactionType} ${
                        styles[transaction.type.toLowerCase()]
                      }`}
                    >
                      {transaction.type}
                    </div>
                    <div className={styles.transactionDesc}>
                      {transaction.name}
                    </div>
                  </div>
                  <div
                    className={`${styles.transactionAmount} ${
                      transaction.amount.startsWith("+")
                        ? styles.positive
                        : transaction.amount.startsWith("-")
                        ? styles.negative
                        : ""
                    }`}
                  >
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
