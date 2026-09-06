const styles = {
  base: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "10px",
    border: "none",
    fontFamily: "var(--font-display)",
    fontSize: "17px",
    fontWeight: 600,
    letterSpacing: "0.02em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "transform 0.12s ease, opacity 0.12s ease",
  },
  primary: {
    background: "var(--amber)",
    color: "var(--ink)",
  },
  secondary: {
    background: "var(--ink-3)",
    color: "var(--paper)",
    border: "1px solid var(--steel)",
  },
  ghost: {
    background: "transparent",
    color: "var(--steel)",
    border: "1px solid var(--ink-3)",
  },
  danger: {
    background: "transparent",
    color: "var(--danger)",
    border: "1px solid var(--danger)",
  },
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.base,
        ...styles[variant],
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(0.98)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {children}
    </button>
  );
}
