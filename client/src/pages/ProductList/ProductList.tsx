import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_PRODUCTS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from "../../graphql/products";
import ProductModal from "../../components/ProductModal";
import styles from "./ProductList.module.css";
import Icon from "../../components/UI/Icon";

interface Product {
  id: string;
  photo: string;
  name: string;
  suppliers: string;
  stock: string;
  price: string;
  category: string;
}

interface ProductsData {
  getProducts: {
    products: Product[];
    categories: string[];
  };
}

interface ProductFilters {
  name?: string;
  category?: string;
  suppliers?: string;
  minPrice?: string;
  maxPrice?: string;
}

const ITEMS_PER_PAGE = 5;

const ProductList = () => {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Query with filters
  const { loading, error, data, refetch } = useQuery<ProductsData>(
    GET_PRODUCTS,
    {
      variables: { filters },
    }
  );

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      refetch();
    },
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => {
      refetch();
    },
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (data?.getProducts?.categories) {
      setAvailableCategories(data.getProducts.categories);
    }
  }, [data]);

  const handleAddNew = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct({
          variables: { id: productId },
        });
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  const handleModalSubmit = async (productData: Omit<Product, "id">) => {
    try {
      setErrorMessage(null);

      // Sanitize the input data to prevent whitespace issues
      const sanitizedData = {
        name: productData.name.trim(),
        photo: productData.photo || "",
        suppliers: productData.suppliers.trim(),
        stock: productData.stock.trim(),
        price: productData.price.trim(),
        category: productData.category.trim(),
      };

      if (currentProduct) {
        // Update existing product
        await updateProduct({
          variables: {
            id: currentProduct.id,
            input: sanitizedData,
          },
        });
      } else {
        // Create new product
        await createProduct({
          variables: { input: sanitizedData },
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving product:", err);

      // Extract the error message from GraphQL error
      const apolloError = err as { graphQLErrors?: { message: string }[] };

      if (apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0) {
        const graphQLError = apolloError.graphQLErrors[0];
        const errorMsg = graphQLError.message;

        // Parse specific error messages from the backend
        if (
          errorMsg.includes("Product with name") &&
          errorMsg.includes("from supplier")
        ) {
          // This is the case where a product with the same name and supplier already exists
          setErrorMessage(errorMsg);
        } else if (errorMsg.includes("details already exists")) {
          // Generic uniqueness error
          setErrorMessage(
            "A product with the same name and supplier already exists. Please use a different name or supplier."
          );
        } else {
          // Other errors
          setErrorMessage(errorMsg);
        }
      } else {
        // Fallback for non-GraphQL errors
        const errorMsg =
          err instanceof Error ? err.message : "An unknown error occurred";
        setErrorMessage(`Unable to save product: ${errorMsg}`);
      }
    }
  };

  // Apply filters when search button is clicked
  const applyFilters = () => {
    setFilters({
      name: searchTerm || undefined,
      category: selectedCategory || undefined,
      suppliers: selectedSupplier || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    });
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSupplier("");
    setMinPrice("");
    setMaxPrice("");
    setFilters({});
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // Toggle filter panel
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filteredProducts = data?.getProducts?.products || [];

  // Pagination logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
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
        Error loading products: {error.message}
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Product Name"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.filterButton} onClick={toggleFilter}>
            <Icon name="filter" size={16} className={styles.buttonIcon} />
            Filter
          </button>
        </div>
        <div className={styles.addButtonContainer}>
          <button className={styles.addButton} onClick={handleAddNew}>
            <Icon name="add" size={26} className={styles.buttonIcon} />
          </button>
          <p>Add a new product</p>
        </div>
      </div>

      {isFilterOpen && (
        <div className={styles.filterPanel}>
          <div className={styles.filterRow}>
            <div className={styles.filterItem}>
              <label>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Categories</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterItem}>
              <label>Supplier</label>
              <input
                type="text"
                placeholder="Filter by supplier"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className={styles.filterInput}
              />
            </div>
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterItem}>
              <label>Min Price</label>
              <input
                type="text"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterItem}>
              <label>Max Price</label>
              <input
                type="text"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className={styles.filterInput}
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
        <h2 className={styles.tableTitle}>All products</h2>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeaderCell}>Product Info</th>
              <th className={styles.tableHeaderCell}>Category</th>
              <th className={styles.tableHeaderCell}>Stock</th>
              <th className={styles.tableHeaderCell}>Suppliers</th>
              <th className={styles.tableHeaderCell}>Price</th>
              <th className={styles.tableHeaderCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPageItems.length > 0 ? (
              currentPageItems.map((product) => (
                <tr key={product.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{product.name}</td>
                  <td className={styles.tableCell}>{product.category}</td>
                  <td className={styles.tableCell}>{product.stock}</td>
                  <td className={styles.tableCell}>{product.suppliers}</td>
                  <td className={styles.tableCell}>{product.price}</td>
                  <td className={styles.tableCell}>
                    <div className={styles.actionContainer}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(product)}
                      >
                        <Icon name="edit" className="w-5 h-5" />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(product.id)}
                      >
                        <Icon name="delete" className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.tableCell}>
                  No products found.
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

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setErrorMessage(null);
        }}
        onSubmit={handleModalSubmit}
        product={currentProduct}
        categories={availableCategories}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default ProductList;
