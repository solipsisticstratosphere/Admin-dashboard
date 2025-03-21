import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./ProductModal.module.css";

interface Product {
  id: string;
  photo: string;
  name: string;
  suppliers: string;
  stock: string;
  price: string;
  category: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: Omit<Product, "id">) => void;
  product: Product | null;
  categories: string[];
  errorMessage?: string | null;
}

const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
  errorMessage,
}: ProductModalProps) => {
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    photo: "",
    name: "",
    suppliers: "",
    stock: "",
    price: "",
    category: "",
  });

  // Form validation state
  const [validation, setValidation] = useState({
    name: true,
    suppliers: true,
    stock: true,
    price: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        photo: product.photo,
        name: product.name,
        suppliers: product.suppliers,
        stock: product.stock,
        price: product.price,
        category: product.category,
      });
    } else {
      setFormData({
        photo: "",
        name: "",
        suppliers: "",
        stock: "",
        price: "",
        category: categories.length > 0 ? categories[0] : "",
      });
    }

    // Reset validation state when modal opens
    setValidation({
      name: true,
      suppliers: true,
      stock: true,
      price: true,
    });
  }, [product, categories]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation errors on change
    if (!validation[name as keyof typeof validation]) {
      setValidation((prev) => ({
        ...prev,
        [name]: true,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newValidation = {
      name: formData.name.trim() !== "",
      suppliers: formData.suppliers.trim() !== "",
      stock: /^\d+$/.test(formData.stock.trim()),
      price: /^\d+(\.\d+)?$/.test(formData.price.trim()),
    };

    setValidation(newValidation);

    return Object.values(newValidation).every((isValid) => isValid);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Sanitize the data before submitting
    const sanitizedData = {
      photo: formData.photo.trim(),
      name: formData.name.trim(),
      suppliers: formData.suppliers.trim(),
      stock: formData.stock.trim(),
      price: formData.price.trim(),
      category: formData.category.trim(),
    };

    onSubmit(sanitizedData);
  };

  if (!isOpen) return null;

  // Use React's createPortal to render the modal to the document body
  return createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {product ? "Edit Product" : "Add a new product"}
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <svg
              className={styles.closeIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Product Info
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.input} ${
                !validation.name ? styles.inputError : ""
              }`}
              required
            />
            {!validation.name && (
              <div className={styles.fieldError}>Product name is required</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={styles.select}
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="stock" className={styles.label}>
              Stock
            </label>
            <input
              type="text"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={`${styles.input} ${
                !validation.stock ? styles.inputError : ""
              }`}
              required
            />
            {!validation.stock && (
              <div className={styles.fieldError}>
                Stock must be a valid number
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="suppliers" className={styles.label}>
              Suppliers
            </label>
            <input
              type="text"
              id="suppliers"
              name="suppliers"
              value={formData.suppliers}
              onChange={handleChange}
              className={`${styles.input} ${
                !validation.suppliers ? styles.inputError : ""
              }`}
              required
            />
            {!validation.suppliers && (
              <div className={styles.fieldError}>Supplier is required</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price" className={styles.label}>
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`${styles.input} ${
                !validation.price ? styles.inputError : ""
              }`}
              required
            />
            {!validation.price && (
              <div className={styles.fieldError}>
                Price must be a valid number
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="photo" className={styles.label}>
              Photo URL
            </label>
            <input
              type="url"
              id="photo"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton}>
              {product ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ProductModal;
