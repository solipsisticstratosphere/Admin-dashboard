import React from "react";

export type IconName =
  | "coins"
  | "dashboard"
  | "orders"
  | "products"
  | "customers"
  | "suppliers"
  | "logout"
  | "filter"
  | "add"
  | "edit"
  | "delete"
  | "menu";

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  color?: string;
  title?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  className = "",
  size = 24,
  color,
  title,
}) => {
  // Используем публичный путь для Vite
  const basePath = import.meta.env.BASE_URL || "/";

  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke={color || "currentColor"}
      aria-hidden={!title}
      role={title ? "img" : "presentation"}
      aria-label={title}
      tabIndex={-1}
    >
      {title && <title>{title}</title>}
      <use href={`${basePath}sprite.svg#${name}`} />
    </svg>
  );
};

export default Icon;
