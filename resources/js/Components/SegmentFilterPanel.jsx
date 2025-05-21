import React, { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import Styles from "../../css/Modules/Segments.module.css"; // Import styles from the CSS module

const SegmentFilterPanel = ({ panelparams, totalPanels, removePanel}) => {
    const { idx, id, title, value, label, datafieldobject, datafieldtype, datafieldoperators, operator, glue, propertiesFilter } = panelparams;
    const opt_datafieldoperators = JSON.parse(datafieldoperators);
    totalPanels++;

    const isFirstPanel = idx === 0;
    const isSinglePanel = totalPanels === 1;

    const [filterValue, setFilterValue] = useState(propertiesFilter);

    
    var initialGlueValue = isFirstPanel || isSinglePanel ? 'and' : 'or';
    if(glue != ""){
        initialGlueValue = glue;
    }
    
    const [glueValue, setGlueValue] = useState(initialGlueValue);

    
    if(operator != ""){
        var [operatorValue, setOperatorValue] = useState(operator);
    }else{
        var [operatorValue, setOperatorValue] = useState(Object.keys(opt_datafieldoperators)[0]); // Set default operator value
    }
    
    const handleFilterChange = (e) => {
        setGlueValue(e.target.value);
        const elmId = e.target.getAttribute("id");
        const IdParts = elmId.split("_");
        const idNum = IdParts[2];
        
        if(e.target.value == "and"){
            document.getElementById("panel-container-"+idNum).classList.add("filterAndOrGlue");
        }else if(e.target.value == "or"){
            document.getElementById("panel-container-"+idNum).classList.remove("filterAndOrGlue");
        }

    };

    const handleOperatorChange = (e) => {
        setOperatorValue(e.target.value);
        // Handle the operator change logic
        // Mautic.convertLeadFilterInput(e.target);
    };

    const renderInput = () => {

        const inputProps = {
            id: `leadlist_filters_${idx}_properties_filter`,
            name: `filters[${idx}][properties][filter]`,
            //required: true,
            className: "form-control filter-input",
            autoComplete: "off",
            value: filterValue,
            onChange: (e) => setFilterValue(e.target.value),
        };

          
        // Case 1: If value matches specific fields, return text input
        if (['firstname', 'lastname', 'address1', 'address2', 'city', 'zipcode', 'generated_email_domain', 'position', 'company', 'facebook', 'foursquare', 'instagram', 'skype', 'twitter', 'linkedin'].includes(value)) {
            return <input {...inputProps} type="text" />;
        }

        // Case 2: If value is 'website', return URL input
        if (value === 'website') {
            return <input {...inputProps} type="url" />;
        }

        // Case 3: If value is 'fax', 'mobile', or 'phone', return tel input
        if (['fax', 'mobile', 'phone'].includes(value)) {
            return <input {...inputProps} type="tel" />;
        }

        // Case 4: If value matches 'attribution_date', 'last_active', or 'date_modified', return datetime-local input
        if (['attribution_date', 'last_active', 'date_modified'].includes(value)) {
            return <input {...inputProps} type="datetime-local" />;
        }

        // Case 5: If value matches 'date_added' or 'date_identified', return date input
        if (['date_added', 'date_identified'].includes(value)) {
            return <input {...inputProps} type="date" />;
        }

        // Default case for unsupported field types, return text input
        return <input {...inputProps} type="text" />;
      };

    return (
        <div className={`${Styles.panel} ${Styles.uiSortableHandle}`} id={`leadlist_filters_${idx}`}>
            
                <div className={`${Styles.panelHeading} ${isFirstPanel || isSinglePanel ? Styles.hide : ''}`}>

                    <div className={`${Styles.panelGlue} col-sm-2 pl-0`}>
                        <select
                            id={`leadlist_filters_${idx}_glue`}
                            name={`filters[${idx}][glue]`}
                            className={`form-control not-chosen ${Styles.glueSelect}`}
                            onChange={handleFilterChange}
                            value={glueValue} // Control the selected value via state
                            autoComplete="off"
                        >
                            <option value="and">and</option>
                            <option value="or">or</option>
                        </select>
                    </div>
                </div>
                <div className={`${Styles.panelBody}`}>
                    <div className='row'>
                        <div className="col-xs-6 col-sm-3 field-name">
                            <i className="fa fa-user" aria-hidden="true"></i>
                            <span>{label}</span>
                        </div>

                        <div className="col-xs-6 col-sm-3 padding-none">
                            <select
                                id={`leadlist_filters_${idx}_operator`}
                                name={`filters[${idx}][operator]`}
                                className="form-control not-chosen"
                                onChange={handleOperatorChange}
                                value={operatorValue} // Control the selected operator via state
                                autoComplete="off"
                            >
                                {Object.entries(opt_datafieldoperators).map(([key, val]) => (
                                    <option key={key} value={val}>
                                        {key}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-xs-10 col-sm-5 padding-none">
                            <div className="properties-form">
                                <div id={`leadlist_filters_${idx}_properties`}>
                                    <div className="rrow">
                                        <div className="form-group col-xs-12">
                                            {renderInput()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-2 col-sm-1">
                        
                            <PrimaryButton type="button" className={`btn cur-p btn-outline-danger ${Styles.pullRight} ${Styles.filterTrash}`} onClick={removePanel}><i className={`${Styles.filterTrashIcon} fa fa-trash-o`}></i></PrimaryButton>
                            
                        </div>

                        <input type="hidden" id={`leadlist_filters_${idx}_field`} name={`filters[${idx}][field]`} autoComplete="off" value={value} />
                        <input type="hidden" id={`leadlist_filters_${idx}_type`} name={`filters[${idx}][type]`} autoComplete="off" value={datafieldtype} />
                        <input type="hidden" id={`leadlist_filters_${idx}_object`} name={`filters[${idx}][object]`} autoComplete="off" value={datafieldobject} />
                    </div>
                </div>
            
        </div>
    );
};

export default SegmentFilterPanel;
