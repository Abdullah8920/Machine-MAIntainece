export default function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  as = "input",
  options = [],
  required = false,
  disabled = false,
}) {
  const fieldStyle = {
    width: "100%",
    padding: "12px 14px",
    marginTop: "6px",
    borderRadius: "8px",
    border: "1px solid var(--ink-3)",
    background: disabled ? "var(--ink-3)" : "var(--ink-2)",
    color: disabled ? "var(--paper-dim)" : "var(--paper)",
    fontSize: "15px",
    cursor: disabled ? "not-allowed" : "text",
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        style={{
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--paper-dim)",
          fontWeight: 600,
        }}
      >
        {label}
        {required && <span style={{ color: "var(--amber)" }}> *</span>}
      </label>

      {as === "select" ? (
        <select name={name} value={value} onChange={onChange} disabled={disabled} style={fieldStyle}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
          style={{ ...fieldStyle, resize: "vertical" }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={fieldStyle}
        />
      )}
    </div>
  );
}
