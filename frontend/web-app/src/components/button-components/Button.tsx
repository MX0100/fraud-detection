import "./Button.css";
import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`custom-button ${className}`}
      style={styles.button}
    >
      {label}
    </button>
  );
};

const styles = {
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default Button;
