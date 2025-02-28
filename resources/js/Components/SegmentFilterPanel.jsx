import React, { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import Styles from "../../css/Modules/Segments.module.css"; // Import styles from the CSS module

const SegmentFilterPanel = ({ panelparams, totalPanels, removePanel}) => {
    const { idx, id, title, value, label, datafieldobject, datafieldtype, datafieldoperators } = panelparams;
    const opt_datafieldoperators = JSON.parse(datafieldoperators);
    totalPanels++;
    /*var totalPanels = 1;
    const removePanel = () =>{
        //function will pass as a parameter
    };*/
    const isFirstPanel = idx === 0;
    const isSinglePanel = totalPanels === 1;

    const [filterValue, setFilterValue] = useState('gmail.com');
    const [glueValue, setGlueValue] = useState('and'); // Add state for glue selection
    const [operatorValue, setOperatorValue] = useState(Object.keys(opt_datafieldoperators)[0]); // Set default operator value

    const handleFilterChange = (e) => {
        setGlueValue(e.target.value);
        // Update filter positioning or perform any other action you need
        // Mautic.updateFilterPositioning(e.target);
    };

    const handleOperatorChange = (e) => {
        setOperatorValue(e.target.value);
        // Handle the operator change logic
        // Mautic.convertLeadFilterInput(e.target);
    };

    return (
        <div className={`${Styles.panel} ${Styles.uiSortableHandle}`} id={`leadlist_filters_${idx}`}>
            
                <div className={`${Styles.panelHeading} ${isFirstPanel || isSinglePanel ? Styles.hide : ''}`}>

                    <div className={`${Styles.panelGlue} col-sm-2 pl-0`}>
                        <select
                            id={`leadlist_filters_${idx}_glue`}
                            name={`leadlist[filters][${idx}][glue]`}
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
                                name={`leadlist[filters][${idx}][operator]`}
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
                                    <div className="row">
                                        <div className="form-group col-xs-12">
                                            <input
                                                type="text"
                                                id={`leadlist_filters_${idx}_properties_filter`}
                                                name={`leadlist[filters][${idx}][properties][filter]`}
                                                required="required"
                                                className="form-control"
                                                autoComplete="off"
                                                value={filterValue}
                                                onChange={(e) => setFilterValue(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-2 col-sm-1">
                        
                            <PrimaryButton type="button" className={`btn cur-p btn-outline-danger ${Styles.pullRight}`} onClick={removePanel}><i className="fa fa-trash-o"></i></PrimaryButton>
                            
                        </div>

                        <input type="hidden" id={`leadlist_filters_${idx}_field`} name={`leadlist[filters][${idx}][field]`} autoComplete="off" value={value} />
                        <input type="hidden" id={`leadlist_filters_${idx}_type`} name={`leadlist[filters][${idx}][type]`} autoComplete="off" value={datafieldtype} />
                        <input type="hidden" id={`leadlist_filters_${idx}_object`} name={`leadlist[filters][${idx}][object]`} autoComplete="off" value={datafieldobject} />
                    </div>
                </div>
            
        </div>
    );
};

export default SegmentFilterPanel;
