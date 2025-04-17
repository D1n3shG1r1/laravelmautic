import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ToggleButton = ({ onToggle, state = false, onText = "ON", offText = "OFF" }) => {
  const [isOn, setIsOn] = useState(state);

  const toggle = () => {
    const newState = !isOn;
    setIsOn(newState);

    if (onToggle) {
      onToggle(newState ? 1 : 0); // Pass 1 for ON and 0 for OFF
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
        {isOn ? onText : offText}
      </label>
    </div>
  );
};

export default ToggleButton;

/*
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
*/
