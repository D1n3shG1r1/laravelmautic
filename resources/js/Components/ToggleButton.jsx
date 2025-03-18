import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ToggleButton = ({ onToggle }) => {
  const [isOn, setIsOn] = useState(false);

  const toggle = () => {
    setIsOn(!isOn);
    if (onToggle) {
      onToggle(!isOn);
    }
  };
  
  return (
    <div className="form-check form-switch d-flex align-items-center">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id="toggleSwitch"
        checked={isOn}
        onChange={toggle}
        style={{ width: "3em", height: "1.8em" }}
      />
      <label className="form-check-label ms-3" htmlFor="toggleSwitch">
        {isOn ? "ON" : "OFF"}
      </label>
    </div>
  );
};

export default ToggleButton;
