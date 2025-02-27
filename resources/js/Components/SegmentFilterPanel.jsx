import React, { useState } from 'react';

const SegmentFilterPanel = ({ panelparams }) => {
    const { idx, id, title, value, label, datafieldobject, datafieldtype, datafieldoperators } = panelparams;
    const opt_datafieldoperators = JSON.parse(datafieldoperators);

    const [filterValue, setFilterValue] = useState('gmail.com');

    const handleFilterChange = (e) => {
        setFilterValue(e.target.value);
        // Update filter positioning or perform any other action you need
        // Mautic.updateFilterPositioning(e.target);
    };

    const handleOperatorChange = (e) => {
        // Handle the operator change logic
        // Mautic.convertLeadFilterInput(e.target);
    };

    return (
        <div className="panel ui-sortable-handle" id={`leadlist_filters_${idx}`}>
            <div className="panel-heading hide">
                <div className="panel-glue col-sm-2 pl-0 ">
                    <select
                        id={`leadlist_filters_${idx}_glue`}
                        name={`leadlist[filters][${idx}][glue]`}
                        className="form-control not-chosen glue-select"
                        onChange={handleFilterChange}
                        autoComplete="off"
                    >
                        <option value="and" selected="selected">and</option>
                        <option value="or">or</option>
                    </select>
                </div>
            </div>
            <div className="panel-body">
                <div className="col-xs-6 col-sm-3 field-name">
                    <i className="object-icon fa ri-user-6-fill" aria-hidden="true"></i>
                    <span>{label}</span>
                </div>

                <div className="col-xs-6 col-sm-3 padding-none">
                    <select
                        id={`leadlist_filters_${idx}_operator`}
                        name={`leadlist[filters][${idx}][operator]`}
                        className="form-control not-chosen"
                        onChange={handleOperatorChange}
                        autoComplete="off"
                    >
                        {Object.entries(opt_datafieldoperators).map(([key, val]) => (
                            <option key={key} value={val}>{key}</option>
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
                    <a href="#" className="remove-selected btn btn-default text-danger pull-right">
                        <i className="ri-delete-bin-line"></i>
                    </a>
                </div>

                <input type="hidden" id={`leadlist_filters_${idx}_field`} name={`leadlist[filters][${idx}][field]`} autoComplete="off" value={value} />
                <input type="hidden" id={`leadlist_filters_${idx}_type`} name={`leadlist[filters][${idx}][type]`} autoComplete="off" value={datafieldtype} />
                <input type="hidden" id={`leadlist_filters_${idx}_object`} name={`leadlist[filters][${idx}][object]`} autoComplete="off" value={datafieldobject} />
            </div>
        </div>
    );
};

export default SegmentFilterPanel;
