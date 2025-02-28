import React, { useEffect, useRef, forwardRef } from "react";
import "chosen-js/chosen.css";
import "chosen-js";

export default forwardRef(function FilterDropdownWithChosen({ id, options, onChangeHandler, placeholder, isMultiple }, ref) {
  const selectRef = ref || useRef();

  useEffect(() => {
    // Initialize Chosen.js once
    const $select = $(selectRef.current);
    $select.chosen({
      width: "100%",
      no_results_text: "No results match",
      placeholder_text_single: placeholder || "Select an option",
    });

    // Attach event listener for Chosen.js `chosen:change`
    const handleChange = (event) => {
      const selectedValue = $(event.target).val();
      if (onChangeHandler) {
        onChangeHandler(event, selectedValue);
      }
    };

    // Bind the event handler only once
    $select.off("change", handleChange); // Unbind any previous handlers
    $select.on("change", handleChange);

    // Cleanup Chosen.js when the component unmounts
    return () => {
      $select.off("change", handleChange); // Unbind the event handler on cleanup
      $select.chosen("destroy"); // Destroy the Chosen instance
    };
  }, [onChangeHandler, placeholder]); // Dependencies for useEffect

  return (
    <select id={id} ref={selectRef} className="campaign-event-selector" multiple={isMultiple}>
      <option value="">Select...</option>
      {options.map((option) => (
        <option
          key={option.key}
          id={option.id}
          title={option.title}
          value={option.value}
          label={option.label}
          className={option.className}
          function={option.function}
          datafieldobject={option.dataFieldObject}
          datafieldtype={option.dataFieldType}
          datafieldoperators={JSON.stringify(option.dataFieldOperators)}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
});