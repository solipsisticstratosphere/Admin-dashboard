import React, { useState } from "react";
import styles from "./CustomerList.module.css";
import { useQuery } from "@apollo/client";
import { GET_CUSTOMERS } from "../../graphql/customers";
import { CustomersQueryResult, CustomerFilters } from "../../graphql/types";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const CustomerList: React.FC = () => {
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Form state (what user is typing)
  const [formFilters, setFormFilters] = useState<CustomerFilters>({});

  // Applied filters (what's actually sent to the query)
  const [appliedFilters, setAppliedFilters] = useState<CustomerFilters>({});

  const { loading, error, data } = useQuery<CustomersQueryResult>(
    GET_CUSTOMERS,
    {
      variables: { filters: appliedFilters },
    }
  );

  const filteredCustomers = data?.getCustomers || [];

  // Pagination
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCustomers.slice(startIndex, endIndex);
  };

  const currentPageItems = getCurrentPageItems();

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Apply search term to filters
  const applySearch = () => {
    setAppliedFilters({ ...appliedFilters, name: searchTerm || undefined });
    setCurrentPage(1);
  };

  // Apply all filters from the filter panel
  const applyFilters = () => {
    setAppliedFilters(formFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setFormFilters({});
    setAppliedFilters({});
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  // Toggle filter panel
  const toggleFilter = () => {
    // When opening filter panel, initialize form filters with currently applied filters
    if (!isFilterOpen) {
      setFormFilters(appliedFilters);
    }
    setIsFilterOpen(!isFilterOpen);
  };

  // Function to generate pagination buttons
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
    return <div className={styles.loading}>Loading customers...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        Failed to load customers. Please try again later.
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className={styles.customersPage}>
      <div className={styles.filterSection}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by name, email, or address"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            // No longer applying filter immediately on change
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              applySearch();
            }
          }}
        />
        <button className={styles.searchButton} onClick={applySearch}>
          Search
        </button>
        <button className={styles.filterButton} onClick={toggleFilter}>
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

      {isFilterOpen && (
        <div className={styles.filterPanel}>
          <div className={styles.filterRow}>
            <div className={styles.filterItem}>
              <label>Name</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Filter by name"
                value={formFilters.name || ""}
                onChange={(e) => {
                  setFormFilters({
                    ...formFilters,
                    name: e.target.value || undefined,
                  });
                }}
              />
            </div>
            <div className={styles.filterItem}>
              <label>Email</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Filter by email"
                value={formFilters.email || ""}
                onChange={(e) => {
                  setFormFilters({
                    ...formFilters,
                    email: e.target.value || undefined,
                  });
                }}
              />
            </div>
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterItem}>
              <label>Phone</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Filter by phone"
                value={formFilters.phone || ""}
                onChange={(e) => {
                  setFormFilters({
                    ...formFilters,
                    phone: e.target.value || undefined,
                  });
                }}
              />
            </div>
            <div className={styles.filterItem}>
              <label>Address</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Filter by address"
                value={formFilters.address || ""}
                onChange={(e) => {
                  setFormFilters({
                    ...formFilters,
                    address: e.target.value || undefined,
                  });
                }}
              />
            </div>
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterItem}>
              <label>Spent</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Filter by amount spent"
                value={formFilters.spent || ""}
                onChange={(e) => {
                  setFormFilters({
                    ...formFilters,
                    spent: e.target.value || undefined,
                  });
                }}
              />
            </div>
            <div className={styles.filterItem}>
              <label>Registration Date</label>
              <input
                type="date"
                className={styles.filterInput}
                value={formFilters.register_date || ""}
                onChange={(e) => {
                  setFormFilters({
                    ...formFilters,
                    register_date: e.target.value || undefined,
                  });
                }}
              />
            </div>
          </div>

          <div className={styles.filterActions}>
            <button className={styles.applyButton} onClick={applyFilters}>
              Apply Filters
            </button>
            <button className={styles.resetButton} onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>
      )}

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>All customers</h2>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.customersTable}>
            <thead>
              <tr>
                <th>Customer Info</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Registration Date</th>
                <th>Spent</th>
              </tr>
            </thead>
            <tbody>
              {currentPageItems.length > 0 ? (
                currentPageItems.map((customer) => (
                  <tr key={customer.id} className={styles.customerRow}>
                    <td>
                      <div className={styles.customerInfo}>
                        <img
                          src={
                            customer.photo || "https://via.placeholder.com/40"
                          }
                          alt={customer.name}
                          className={styles.avatar}
                        />
                        <span className={styles.customerName}>
                          <Link to={`/customers/${customer.id}`}>
                            {customer.name}
                          </Link>
                        </span>
                      </div>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address}</td>
                    <td>{customer.register_date}</td>
                    <td>{customer.spent}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={styles.noCustomersCell}>
                    No customers found.
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

export default CustomerList;
