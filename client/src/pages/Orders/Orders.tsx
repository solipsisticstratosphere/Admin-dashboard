import React, { useState } from "react";
import styles from "./Orders.module.css";
import { useQuery } from "@apollo/client";
import { GET_ORDERS } from "../../graphql/queries";
import { OrdersQueryResult } from "../../graphql/types";

const ITEMS_PER_PAGE = 5;

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, error, data } = useQuery<OrdersQueryResult>(GET_ORDERS);

  const getStatusClassName = (status: string): string => {
    const statusLower = status.toLowerCase();

    const statusClasses: Record<string, string> = {
      completed: styles.completed,
      pending: styles.pending,
      processing: styles.processing,
      cancelled: styles.cancelled,
      confirmed: styles.confirmed,
      shipped: styles.shipped,
      delivered: styles.delivered,
    };

    return statusClasses[statusLower] || "";
  };

  // Фильтрация заказов на клиенте по имени клиента или адресу
  const filteredOrders =
    data?.orders.items.filter((order) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        order.name.toLowerCase().includes(searchLower) ||
        order.address.toLowerCase().includes(searchLower)
      );
    }) || [];

  // Пагинация
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Получаем текущую страницу заказов
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, endIndex);
  };

  const currentPageItems = getCurrentPageItems();

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Функция для генерации кнопок страниц
  const renderPaginationButtons = () => {
    const buttons = [];

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`${styles.pageButton} ${
            i === currentPage ? styles.activePageDot : ""
          }`}
          onClick={() => handlePageClick(i)}
          aria-label={`Page ${i}`}
        />
      );
    }

    return buttons;
  };

  if (loading) {
    return <div className={styles.loading}>Loading orders...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        Failed to load orders. Please try again later.
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className={styles.ordersPage}>
      <div className={styles.filterSection}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by name or address"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button className={styles.filterButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            className={styles.filterIcon}
          >
            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
          </svg>
          Filter
        </button>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>All orders</h2>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>User Info</th>
                <th>Address</th>
                <th>Products</th>
                <th>Order date</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentPageItems.length > 0 ? (
                currentPageItems.map((order) => (
                  <tr key={order.id} className={styles.orderRow}>
                    <td>
                      <div className={styles.customerInfo}>
                        <img
                          src={order.photo || "https://via.placeholder.com/40"}
                          alt={order.name}
                          className={styles.avatar}
                        />
                        <span className={styles.customerName}>
                          {order.name}
                        </span>
                      </div>
                    </td>
                    <td>{order.address}</td>
                    <td>{order.products}</td>
                    <td>{order.order_date}</td>
                    <td>{order.price}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${getStatusClassName(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={styles.noOrdersCell}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalItems > 0 && (
          <div className={styles.paginationContainer}>
            {renderPaginationButtons()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
