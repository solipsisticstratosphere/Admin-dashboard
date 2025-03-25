import React, { useState } from "react";
import styles from "./CustomerList.module.css";
import { useQuery } from "@apollo/client";
import { GET_CUSTOMERS } from "../../graphql/customers";
import { CustomersQueryResult, CustomerFilters } from "../../graphql/types";
import { Link } from "react-router-dom";
import Icon from "../../components/UI/Icon";

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

  const filteredCustomers =
    data?.getCustomers.filter((customer) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower)
      );
    }) || [];
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
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Customer Name or Email"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applySearch();
              }
            }}
          />
          <button className={styles.filterButton} onClick={toggleFilter}>
            <Icon name="filter" size={16} className={styles.buttonIcon} />
            Filter
          </button>
        </div>
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

      <div className={styles.tableHeader}>
        <h2 className={styles.tableTitle}>All customers</h2>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.customersTable}>
          <thead>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeaderCell}>Customer Info</th>
              <th className={styles.tableHeaderCell}>Email</th>
              <th className={styles.tableHeaderCell}>Phone</th>
              <th className={styles.tableHeaderCell}>Address</th>
              <th className={styles.tableHeaderCell}>Registration Date</th>
              <th className={styles.tableHeaderCell}>Spent</th>
            </tr>
          </thead>
          <tbody>
            {currentPageItems.length > 0 ? (
              currentPageItems.map((customer) => (
                <tr key={customer.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.customerInfo}>
                      <img
                        src={customer.photo || "https://via.placeholder.com/40"}
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
                  <td className={styles.tableCell}>{customer.email}</td>
                  <td className={styles.tableCell}>{customer.phone}</td>
                  <td className={styles.tableCell}>{customer.address}</td>
                  <td className={styles.tableCell}>{customer.registerDate}</td>
                  <td className={styles.tableCell}>{customer.spent}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.tableCell}>
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
  );
};

export default CustomerList;
