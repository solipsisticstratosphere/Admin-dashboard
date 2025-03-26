import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm, SubmitHandler } from "react-hook-form";
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
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Omit<Supplier, "id">>({
    defaultValues: {
      name: "",
      address: "",
      company: "",
      date: new Date().toISOString().split("T")[0],
      amount: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (supplier) {
      setValue("name", supplier.name);
      setValue("address", supplier.address);
      setValue("company", supplier.company);
      setValue("date", supplier.date);
      setValue("amount", supplier.amount);
      setValue("status", supplier.status);
    } else {
      reset({
        name: "",
        address: "",
        company: "",
        date: new Date().toISOString().split("T")[0],
        amount: "",
        status: "Active",
      });
    }
  }, [supplier, isOpen, setValue, reset]);

  const onSubmitHandler: SubmitHandler<Omit<Supplier, "id">> = (data) => {
    onSubmit(data);
  };

  if (!isOpen) return null;

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

        <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)}>
          <div className={styles.formRows}>
            <div className={styles.formGroup}>
              <input
                placeholder="Supplier Name"
                type="text"
                id="name"
                {...register("name", { required: "Supplier name is required" })}
                className={`${styles.input} ${
                  errors.name ? styles.inputError : ""
                }`}
              />
              {errors.name && (
                <div className={styles.fieldError}>{errors.name.message}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                placeholder="Address"
                type="text"
                id="address"
                {...register("address", { required: "Address is required" })}
                className={`${styles.input} ${
                  errors.address ? styles.inputError : ""
                }`}
              />
              {errors.address && (
                <div className={styles.fieldError}>
                  {errors.address.message}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                placeholder="Company"
                type="text"
                id="company"
                {...register("company", { required: "Company is required" })}
                className={`${styles.input} ${
                  errors.company ? styles.inputError : ""
                }`}
              />
              {errors.company && (
                <div className={styles.fieldError}>
                  {errors.company.message}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                placeholder="Delivery Date"
                type="date"
                id="date"
                {...register("date", { required: "Delivery date is required" })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <input
                placeholder="Amount"
                type="text"
                id="amount"
                {...register("amount", {
                  required: "Amount is required",
                  pattern: {
                    value: /^\d+(\.\d+)?$/,
                    message: "Amount must be a valid number",
                  },
                })}
                className={`${styles.input} ${
                  errors.amount ? styles.inputError : ""
                }`}
              />
              {errors.amount && (
                <div className={styles.fieldError}>{errors.amount.message}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <select
                id="status"
                {...register("status", { required: "Status is required" })}
                className={styles.select}
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
