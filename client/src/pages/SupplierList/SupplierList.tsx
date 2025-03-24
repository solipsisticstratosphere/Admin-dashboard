import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_SUPPLIERS,
  CREATE_SUPPLIER,
  UPDATE_SUPPLIER,
  DELETE_SUPPLIER,
} from "../../graphql/suppliers";
import SupplierModal from "../../components/SupplierModal";
import styles from "./SupplierList.module.css";
import Icon from "../../components/UI/Icon";

interface Supplier {
  id: string;
  name: string;
  address: string;
  company: string;
  date: string;
  amount: string;
  status: string;
}

interface SuppliersData {
  getSuppliers: Supplier[];
}

interface SupplierFilters {
  name?: string;
  company?: string;
  status?: string;
}

const ITEMS_PER_PAGE = 5;

const SupplierList = () => {
  const [filters, setFilters] = useState<SupplierFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Query with filters
  const { loading, error, data, refetch } = useQuery<SuppliersData>(
    GET_SUPPLIERS,
    {
      variables: { filters },
    }
  );

  const [createSupplier] = useMutation(CREATE_SUPPLIER, {
    onCompleted: () => {
      refetch();
    },
  });

  const [updateSupplier] = useMutation(UPDATE_SUPPLIER, {
    onCompleted: () => {
      refetch();
    },
  });

  const [deleteSupplier] = useMutation(DELETE_SUPPLIER, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleAddNew = () => {
    setCurrentSupplier(null);
    setIsModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = async (supplierId: string) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await deleteSupplier({
          variables: { id: supplierId },
        });
      } catch (err) {
        console.error("Error deleting supplier:", err);
      }
    }
  };

  const handleModalSubmit = async (supplierData: Omit<Supplier, "id">) => {
    try {
      setErrorMessage(null);

      // Sanitize the input data to prevent whitespace issues
      const sanitizedData = {
        name: supplierData.name.trim(),
        address: supplierData.address.trim(),
        company: supplierData.company.trim(),
        date: supplierData.date,
        amount: supplierData.amount.trim(),
        status: supplierData.status.trim(),
      };

      if (currentSupplier) {
        // Update existing supplier
        await updateSupplier({
          variables: {
            id: currentSupplier.id,
            input: sanitizedData,
          },
        });
      } else {
        // Create new supplier
        await createSupplier({
          variables: { input: sanitizedData },
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving supplier:", err);

      // Extract the error message from GraphQL error
      const apolloError = err as { graphQLErrors?: { message: string }[] };

      if (apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0) {
        const graphQLError = apolloError.graphQLErrors[0];
        const errorMsg = graphQLError.message;

        // Set the error message
        setErrorMessage(errorMsg);
      } else {
        // Fallback for non-GraphQL errors
        const errorMsg =
          err instanceof Error ? err.message : "An unknown error occurred";
        setErrorMessage(`Unable to save supplier: ${errorMsg}`);
      }
    }
  };

  // Apply filters when search button is clicked
  const applyFilters = () => {
    setFilters({
      name: searchTerm || undefined,
      company: selectedCompany || undefined,
      status: selectedStatus || undefined,
    });
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCompany("");
    setSelectedStatus("");
    setFilters({});
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // Toggle filter panel
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const suppliers = data?.getSuppliers || [];

  // Pagination logic
  const totalItems = suppliers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return suppliers.slice(startIndex, endIndex);
  };

  const currentPageItems = getCurrentPageItems();

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

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

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error)
    return (
      <div className={styles.error}>
        Error loading suppliers: {error.message}
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Supplier Name"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.filterButton} onClick={toggleFilter}>
            <Icon name="filter" className={styles.buttonIcon} />
            Filter
          </button>
        </div>
        <button className={styles.addButton} onClick={handleAddNew}>
          <Icon name="add" className={styles.buttonIcon} />
          Add a new supplier
        </button>
      </div>

      {isFilterOpen && (
        <div className={styles.filterPanel}>
          <div className={styles.filterRow}>
            <div className={styles.filterItem}>
              <label>Company</label>
              <input
                type="text"
                placeholder="Filter by company"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterItem}>
              <label>Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Deactive">Deactive</option>
              </select>
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
        <h2 className="text-lg font-semibold">All suppliers</h2>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeaderCell}>Suppliers Info</th>
              <th className={styles.tableHeaderCell}>Address</th>
              <th className={styles.tableHeaderCell}>Company</th>
              <th className={styles.tableHeaderCell}>Delivery date</th>
              <th className={styles.tableHeaderCell}>Amount</th>
              <th className={styles.tableHeaderCell}>Status</th>
              <th className={styles.tableHeaderCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPageItems.length > 0 ? (
              currentPageItems.map((supplier) => (
                <tr key={supplier.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{supplier.name}</td>
                  <td className={styles.tableCell}>{supplier.address}</td>
                  <td className={styles.tableCell}>{supplier.company}</td>
                  <td className={styles.tableCell}>{supplier.date}</td>
                  <td className={styles.tableCell}>{supplier.amount}</td>
                  <td className={styles.tableCell}>
                    <span
                      className={`${styles.statusBadge} ${
                        supplier.status === "Active"
                          ? styles.statusActive
                          : styles.statusDeactive
                      }`}
                    >
                      {supplier.status}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.actionContainer}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(supplier)}
                      >
                        <Icon name="edit" className="w-5 h-5" />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(supplier.id)}
                      >
                        <Icon name="delete" className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.tableCell}>
                  No suppliers found.
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

      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setErrorMessage(null);
        }}
        onSubmit={handleModalSubmit}
        supplier={currentSupplier}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default SupplierList;
