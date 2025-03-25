import { useEditMode } from "../../context/EditModeContext";
import styles from "./EditModeToggle.module.css";
import Icon from "../UI/Icon";

const EditModeToggle = () => {
  const { isEditMode, toggleEditMode } = useEditMode();

  return (
    <div className={styles.container}>
      <button
        className={`${styles.toggleButton} ${isEditMode ? styles.active : ""}`}
        onClick={toggleEditMode}
        aria-label={isEditMode ? "Disable edit mode" : "Enable edit mode"}
        tabIndex={0}
      >
        <Icon name="edit" size={18} className={styles.icon} />
        <span>{isEditMode ? "Edit Mode: ON" : "Edit Mode"}</span>
      </button>
    </div>
  );
};

export default EditModeToggle;
