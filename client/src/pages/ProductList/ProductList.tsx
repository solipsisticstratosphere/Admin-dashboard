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

const ITEMS_PER_PAGE = 5;

const ProductList = () => {
  const { loading, error, data, refetch } =
    useQuery<ProductsData>(GET_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      const errorMsg =
        err instanceof Error ? err.message : "An unknown error occurred";

      // Parse GraphQL error message which is typically in the format:
      // "GraphQL error: Product with name X already exists"
      let errorDetails = errorMsg;
      if (errorMsg.includes("GraphQL error:")) {
        errorDetails = errorMsg.split("GraphQL error:")[1].trim();
      }

      // Common patterns in error messages
      if (
        errorDetails.includes("already exists") ||
        errorDetails.includes("Unique constraint") ||
        errorDetails.includes("Duplicate")
      ) {
        setErrorMessage(
          "A product with this name already exists. Please use a different name."
        );
      } else if (errorDetails.includes("validation")) {
        setErrorMessage(
          "Please check your inputs. Some fields have validation errors."
        );
      } else {
        setErrorMessage(`Unable to save product: ${errorDetails}`);
      }
    }
  };

  const filteredProducts =
    data?.getProducts?.products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button className={styles.filterButton}>
            <svg
              className={styles.buttonIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter
          </button>
        </div>
        <button className={styles.addButton} onClick={handleAddNew}>
          <svg
            className={styles.buttonIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add a new product
        </button>
      </div>

      <div className={styles.tableHeader}>
        <h2 className="text-lg font-semibold">All products</h2>
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
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(product.id)}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
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
