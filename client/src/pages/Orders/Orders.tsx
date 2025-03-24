import React, { useState, useEffect } from "react";
import styles from "./Orders.module.css";
import { useLazyQuery } from "@apollo/client";
import { GET_ORDERS } from "../../graphql/queries";
import { OrderFilters, OrdersQueryResult } from "../../graphql/types";
import Icon from "../../components/UI/Icon";

const ITEMS_PER_PAGE = 5;

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<OrderFilters>({});
  const [tempFilters, setTempFilters] = useState<OrderFilters>({});

  // Use lazy query for filtering
  const [getOrders, { loading, error, data }] =
    useLazyQuery<OrdersQueryResult>(GET_ORDERS);

  // Initial data fetch
  useEffect(() => {
    getOrders();
  }, [getOrders]);

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

  const applyFilters = () => {
    const filters: OrderFilters = {};

    if (tempFilters.name) filters.name = tempFilters.name;
    if (tempFilters.address) filters.address = tempFilters.address;
    if (tempFilters.products) filters.products = tempFilters.products;
    if (tempFilters.status) filters.status = tempFilters.status;
    if (tempFilters.order_date) filters.order_date = tempFilters.order_date;

    setActiveFilters(filters);

    setCurrentPage(1);

    getOrders({ variables: { filters } });
  };

  // Reset filters
  const resetFilters = () => {
    setTempFilters({});
    setActiveFilters({});
    setCurrentPage(1);
    // Keep filter panel open (removed the line that closes it)
    getOrders({ variables: { filters: {} } });
  };

  // Handle filter input change
  const handleFilterChange = (field: keyof OrderFilters, value: string) => {
    setTempFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Client-side search for immediate feedback (name and address only)
  const filteredOrders =
    data?.orders.items.filter((order) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        order.name.toLowerCase().includes(searchLower) ||
        order.address.toLowerCase().includes(searchLower)
      );
    }) || [];

  // Pagination
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, endIndex);
  };

  const currentPageItems = getCurrentPageItems();

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Generate pagination buttons
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

  if (loading && !data) {
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
        <button
          className={`${styles.filterButton} ${
            filterOpen ? styles.activeFilter : ""
          }`}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <div className={styles.filterIcon}>
            <Icon size={16} name="filter" />
          </div>
          Filter
        </button>
      </div>

      {filterOpen && (
        <div className={styles.filterPanel}>
          <div className={styles.filterGrid}>
            <div className={styles.filterItem}>
              <label htmlFor="name-filter">Customer Name</label>
              <input
                id="name-filter"
                type="text"
                value={tempFilters.name || ""}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                placeholder="Filter by name"
              />
            </div>
            <div className={styles.filterItem}>
              <label htmlFor="address-filter">Address</label>
              <input
                id="address-filter"
                type="text"
                value={tempFilters.address || ""}
                onChange={(e) => handleFilterChange("address", e.target.value)}
                placeholder="Filter by address"
              />
            </div>
            <div className={styles.filterItem}>
              <label htmlFor="products-filter">Products</label>
              <input
                id="products-filter"
                type="text"
                value={tempFilters.products || ""}
                onChange={(e) => handleFilterChange("products", e.target.value)}
                placeholder="Filter by products"
              />
            </div>
            <div className={styles.filterItem}>
              <label htmlFor="status-filter">Status</label>
              <select
                id="status-filter"
                value={tempFilters.status || ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            <div className={styles.filterItem}>
              <label htmlFor="date-filter">Order Date</label>
              <input
                id="date-filter"
                type="text"
                value={tempFilters.order_date || ""}
                onChange={(e) =>
                  handleFilterChange("order_date", e.target.value)
                }
                placeholder="Filter by date"
              />
            </div>
          </div>
          <div className={styles.filterActions}>
            <button
              className={styles.applyFiltersButton}
              onClick={applyFilters}
            >
              Apply Filters
            </button>
            <button
              className={styles.resetFiltersButton}
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>
      )}

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
      </div>
      {totalItems > 0 && (
        <div className={styles.paginationContainer}>
          {renderPaginationButtons()}
        </div>
      )}
    </div>
  );
};

export default Orders;
