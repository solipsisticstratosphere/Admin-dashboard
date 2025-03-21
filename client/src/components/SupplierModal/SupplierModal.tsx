import { useState, useEffect } from "react";
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
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [company, setCompany] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Active");

  // Reset form or populate with supplier data when modal opens/changes
  useEffect(() => {
    if (isOpen) {
      if (supplier) {
        // Edit mode - populate form with supplier data
        setName(supplier.name);
        setAddress(supplier.address);
        setCompany(supplier.company);
        setDate(supplier.date);
        setAmount(supplier.amount);
        setStatus(supplier.status);
      } else {
        // Create mode - reset form
        setName("");
        setAddress("");
        setCompany("");
        setDate(new Date().toISOString().split("T")[0]); // Today's date
        setAmount("");
        setStatus("Active");
      }
    }
  }, [isOpen, supplier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Submit the form data
    onSubmit({
      name,
      address,
      company,
      date,
      amount,
      status,
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {supplier ? "Edit Supplier" : "Add New Supplier"}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Supplier name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address" className={styles.label}>
              Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={styles.input}
              placeholder="Supplier address"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="company" className={styles.label}>
              Company
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={styles.input}
              placeholder="Company name"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="date" className={styles.label}>
                Delivery Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="amount" className={styles.label}>
                Amount
              </label>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={styles.input}
                placeholder="Amount"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.label}>
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={styles.select}
              required
            >
              <option value="Active">Active</option>
              <option value="Deactive">Deactive</option>
            </select>
          </div>

          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}

          <div className={styles.buttonContainer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {supplier ? "Update Supplier" : "Add Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierModal;
