//import React, { useEffect, useRef } from "react";
import { forwardRef, useEffect, useRef } from 'react';
import "chosen-js/chosen.css";
import "chosen-js";
export default forwardRef(
function DropdownWithChosen({ id, options, onChangeHandler, placeholder, isMultiple}, ref){
    
    const selectRef = ref ? ref : useRef();
  
    useEffect(() => {
      // Initialize Chosen.js on the dropdown
      $(selectRef.current).chosen({
        width: "100%",
        no_results_text: "No results match",
        placeholder_text_single: placeholder || "Select an option",
      });
  
      // Attach event listener for Chosen.js `chosen:change`
      $(selectRef.current).on("change", (event) => {
        const selectedValue = $(event.target).val();
        if (onChangeHandler) {
          onChangeHandler(event, selectedValue);
        }
      });
  
      // Cleanup Chosen.js on component unmount
      return () => {
        $(selectRef.current).chosen("destroy");
      };
    }, [onChangeHandler, placeholder]);
  
    return (
      <select id={id} ref={selectRef} className="campaign-event-selector" multiple={isMultiple}>
        <option value="">{placeholder || "Select..."}</option>
        {options.map((option) => (
          <option
            key={option.key}
            value={option.value}
            data-function={option.function||""}
            data-href={option.href||""}
            data-eventtype={option.eventType||""}
            data-parentnodeid={option.parentNodeId||""}
            data-anchor={option.anchor||""}
            className={option.className}
            id={option.id}
            title={option.title}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);