import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CUSTOMER_DETAILS } from "../../graphql/queries";
import { CustomerDetailsQueryResult } from "../../graphql/types";
import styles from "./CustomerDetails.module.css";

const CustomerDetails: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const { loading, error, data } = useQuery<CustomerDetailsQueryResult>(
    GET_CUSTOMER_DETAILS,
    {
      variables: { customerId: parseInt(customerId || "0", 10) },
    }
  );

  if (loading) {
    return <div className={styles.loading}>Loading customer data...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        Failed to load customer data. Please try again later.
      </div>
    );
  }

  if (!data?.customerDetails) {
    return <div className={styles.error}>Customer not found</div>;
  }

  const { customerDetails: customer } = data;

  return (
    <div className={styles.customerDetails}>
      <div className={styles.header}>
        <Link to="/customers" className={styles.backButton}>
          ← Back to Customers
        </Link>
        <h1 className={styles.title}>Customer Details</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div
              className={styles.avatar}
              style={{
                backgroundImage: customer.photo
                  ? `url(${customer.photo})`
                  : "none",
              }}
            ></div>
            <div className={styles.profileInfo}>
              <h2 className={styles.name}>{customer.name}</h2>
              <div className={styles.email}>{customer.email}</div>
              <div className={styles.spent}>Total Spent: {customer.spent}</div>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Phone</div>
              <div className={styles.detailValue}>{customer.phone}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Address</div>
              <div className={styles.detailValue}>{customer.address}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Registered</div>
              <div className={styles.detailValue}>
                {new Date(customer.registerDate).toLocaleDateString()}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Country</div>
              <div className={styles.detailValue}>{customer.country}</div>
            </div>
          </div>
        </div>

        <div className={styles.transactionsCard}>
          <h2 className={styles.cardTitle}>Transaction History</h2>
          {customer.transactions.length === 0 ? (
            <div className={styles.noTransactions}>
              No transactions found for this customer
            </div>
          ) : (
            <div className={styles.transactionsList}>
              {customer.transactions.map((transaction) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
