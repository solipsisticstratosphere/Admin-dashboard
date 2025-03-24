import React from "react";
import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_DATA } from "../../graphql/queries";
import { DashboardQueryResult } from "../../graphql/types";
import Icon from "../../components/UI/Icon";

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
              <Icon name="coins" />
            </div>
            <div className={styles.statTitle}>All products</div>
          </div>
          <div className={styles.statValue}>{stats.totalProducts}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>
              <Icon name="customers" />
            </div>
            <div className={styles.statTitle}>All suppliers</div>
          </div>
          <div className={styles.statValue}>{stats.totalSuppliers}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>
              <Icon name="customers" />
            </div>
            <div className={styles.statTitle}>All customers</div>
          </div>
          <div className={styles.statValue}>{stats.totalCustomers}</div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Customers</h2>
          </div>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Income/Expenses</h2>
          </div>
          <div className={styles.today}>
            <p>Today</p>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.transactionsList}>
              {transactions.slice(0, 6).map((transaction) => (
                <div key={transaction.id} className={styles.transaction}>
                  <div className={styles.transactionInfo}>
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
