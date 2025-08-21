export default function Radiobutton({ label, name, value, checked, onChange }) {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="radio"
        name={name}
        value={value}
        id={`${name}-${value}`}
        checked={checked}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={`${name}-${value}`}>
        {label}
      </label>
    </div>
  );
}

