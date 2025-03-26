import React from "react";
import { ClipLoader } from "react-spinners";
import styles from "./Loader.module.css";

interface LoaderProps {
  size?: number;
  color?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = 50,
  color = "#3498db",
  fullScreen = true,
}) => {
  return (
    <div
      className={fullScreen ? styles.loaderFullScreen : styles.loaderContainer}
    >
      <ClipLoader size={size} color={color} />
      <p className={styles.loadingText}>Loading...</p>
    </div>
  );
};

export default Loader;
