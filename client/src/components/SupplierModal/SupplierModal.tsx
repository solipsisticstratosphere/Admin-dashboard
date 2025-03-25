import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./SupplierModal.module.css";

interface Supplier {
  id: string;
  name: string;
  address: string;
  company: string;
  date: string;
  amount: string;
  status: string;
}

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (supplierData: Omit<Supplier, "id">) => void;
  supplier: Supplier | null;
  errorMessage: string | null;
}

const SupplierModal = ({
  isOpen,
  onClose,
  onSubmit,
  supplier,
  errorMessage,
}: SupplierModalProps) => {
  const [formData, setFormData] = useState<Omit<Supplier, "id">>({
    name: "",
    address: "",
    company: "",
    date: "",
    amount: "",
    status: "Active",
  });

  // Form validation state
  const [validation, setValidation] = useState({
    name: true,
    address: true,
    company: true,
    amount: true,
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        address: supplier.address,
        company: supplier.company,
        date: supplier.date,
        amount: supplier.amount,
        status: supplier.status,
      });
    } else {
      setFormData({
        name: "",
        address: "",
        company: "",
        date: new Date().toISOString().split("T")[0], // Today's date
        amount: "",
        status: "Active",
      });
    }

    // Reset validation state when modal opens
    setValidation({
      name: true,
      address: true,
      company: true,
      amount: true,
    });
  }, [supplier, isOpen]);

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
      address: formData.address.trim() !== "",
      company: formData.company.trim() !== "",
      amount: /^\d+(\.\d+)?$/.test(formData.amount.trim()),
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
      name: formData.name.trim(),
      address: formData.address.trim(),
      company: formData.company.trim(),
      date: formData.date,
      amount: formData.amount.trim(),
      status: formData.status,
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
            {supplier ? "Edit Supplier" : "Add a new supplier"}
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

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRows}>
            <div className={styles.formGroup}>
              <input
                placeholder="Supplier Name"
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
                <div className={styles.fieldError}>
                  Supplier name is required
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                placeholder="Address"
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`${styles.input} ${
                  !validation.address ? styles.inputError : ""
                }`}
                required
              />
              {!validation.address && (
                <div className={styles.fieldError}>Address is required</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                placeholder="Company"
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`${styles.input} ${
                  !validation.company ? styles.inputError : ""
                }`}
                required
              />
              {!validation.company && (
                <div className={styles.fieldError}>Company is required</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                placeholder="Delivery Date"
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <input
                placeholder="Amount"
                type="text"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={`${styles.input} ${
                  !validation.amount ? styles.inputError : ""
                }`}
                required
              />
              {!validation.amount && (
                <div className={styles.fieldError}>
                  Amount must be a valid number
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="Active">Active</option>
                <option value="Deactive">Deactive</option>
              </select>
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton}>
              {supplier ? "Update" : "Add"}
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

export default SupplierModal;
