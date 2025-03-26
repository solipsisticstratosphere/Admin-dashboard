import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm, SubmitHandler } from "react-hook-form";
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
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Omit<Product, "id">>();

  useEffect(() => {
    if (product) {
      setValue("photo", product.photo);
      setValue("name", product.name);
      setValue("suppliers", product.suppliers);
      setValue("stock", product.stock);
      setValue("price", product.price);
      setValue("category", product.category);
    } else {
      reset({
        photo: "",
        name: "",
        suppliers: "",
        stock: "",
        price: "",
        category: categories.length > 0 ? categories[0] : "",
      });
    }
  }, [product, categories, setValue, reset]);

  const onSubmitHandler: SubmitHandler<Omit<Product, "id">> = (data) => {
    onSubmit(data);
  };

  if (!isOpen) return null;

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

        <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)}>
          <div className={styles.formRows}>
            <div className={styles.formGroup}>
              <input
                placeholder="Product Name"
                type="text"
                id="name"
                {...register("name", { required: "Product name is required" })}
                className={`${styles.input} ${
                  errors.name ? styles.inputError : ""
                }`}
              />
              {errors.name && (
                <div className={styles.fieldError}>{errors.name.message}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <select
                id="category"
                {...register("category", { required: "Category is required" })}
                className={styles.select}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <input
                placeholder="Stock"
                type="text"
                id="stock"
                {...register("stock", {
                  required: "Stock is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Stock must be a valid number",
                  },
                })}
                className={`${styles.input} ${
                  errors.stock ? styles.inputError : ""
                }`}
              />
              {errors.stock && (
                <div className={styles.fieldError}>{errors.stock.message}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                placeholder="Suppliers"
                type="text"
                id="suppliers"
                {...register("suppliers", { required: "Supplier is required" })}
                className={`${styles.input} ${
                  errors.suppliers ? styles.inputError : ""
                }`}
              />
              {errors.suppliers && (
                <div className={styles.fieldError}>
                  {errors.suppliers.message}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                placeholder="Price"
                type="text"
                id="price"
                {...register("price", {
                  required: "Price is required",
                  pattern: {
                    value: /^\d+(\.\d+)?$/,
                    message: "Price must be a valid number",
                  },
                })}
                className={`${styles.input} ${
                  errors.price ? styles.inputError : ""
                }`}
              />
              {errors.price && (
                <div className={styles.fieldError}>{errors.price.message}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                type="url"
                id="photo"
                {...register("photo")}
                className={styles.input}
                placeholder="https://example.com/image.jpg"
              />
            </div>
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
