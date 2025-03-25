import { useState } from "react";
import { useMutation } from "@apollo/client";
import { VERIFY_ADMIN_PASSWORD } from "../../graphql/auth";
import { useEditMode } from "../../context/EditModeContext";
import styles from "./AdminPasswordDialog.module.css";

const AdminPasswordDialog = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const {
    isPasswordDialogOpen,
    setPasswordDialogOpen,
    setEditMode,
    setAdminPassword,
  } = useEditMode();

  const [verifyAdminPassword, { loading }] = useMutation(
    VERIFY_ADMIN_PASSWORD,
    {
      onCompleted: (data) => {
        if (data.verifyAdminPassword.success) {
          setAdminPassword(password);
          setEditMode(true);
          setPasswordDialogOpen(false);
          setError(null);
        } else {
          setError(data.verifyAdminPassword.message || "Invalid password");
        }
      },
      onError: (error) => {
        setError(error.message || "An error occurred");
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    verifyAdminPassword({
      variables: {
        input: { password },
      },
    });
  };

  const handleCancel = () => {
    setPasswordDialogOpen(false);
    setPassword("");
    setError(null);
  };

  if (!isPasswordDialogOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h2 className={styles.title}>Admin Authentication</h2>
        <p className={styles.description}>
          Enter admin password to enable edit mode
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Enter admin password"
              autoComplete="current-password"
            />
            {error && <p className={styles.error}>{error}</p>}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPasswordDialog;
