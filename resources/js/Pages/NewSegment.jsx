import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Layout from '@/Layouts/Layout';  // Import the layout component
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';
import FilterDropdownWithChosen from "@/Components/FilterDropdownWithChosen";
import SegmentFilterPanel from "@/Components/SegmentFilterPanel";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Styles from "../../css/Modules/Segments.module.css"; // Import styles from the CSS module
var filtersCount = 0;
const newcontact = ({pageTitle,csrfToken,params}) => {
    //console.log(pageTitle,csrfToken,params);
    var decsriptionData = '';
    const formRef = useRef();

    const descriptionMaxLength = 160;
    const [formValues, setFormValues] = useState({
        name: '',
        purpose: '',
        objective: '',
        alias: '',
        publicname: '',
        description: ''
    });
    const [editorData, setEditorData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        if (data.length > descriptionMaxLength) {
            // Truncate the string if it exceeds the max length
            const truncatedData = data.slice(0, descriptionMaxLength);
            setEditorData(truncatedData);
            setFormValues((prevValues) => ({
                ...prevValues,
                description: truncatedData // Update description state directly
            }));
        } else {
            setEditorData(data);
            setFormValues((prevValues) => ({
                ...prevValues,
                description: data // Update description state
            }));
        }
    };
    const handleInputChange = (e) => {
        
        const { name, value } = e.target;
        setFormValues({
        ...formValues,
        [name]: value
        });
    };

    
    const contactsOptions = JSON.parse(params.contactFilters);
    const [filterIdx, setFilterIdx] = useState(0);
    
    const removePanel = (panelId) => {
        const element = document.getElementById('panel-container-'+panelId);
      if (element) {
        element.remove();  // Remove the element with the specified ID
        
        const panels = document.getElementsByClassName('panelContainer');
        if(panels.length > 0){
            panels[0].childNodes[0].childNodes[0].classList.add("hide");
        }

        filtersCount = filtersCount - 1;
      } else {
        console.log('Element not found!');
      }   
    };

    const handleSelectChange = (event, value) => {
      
      // Avoiding duplicate code in handleSelectChange and getting only the selected option
      const selectedOption = event.target.selectedOptions[0];
      const panelParamsObj = {
        idx: filterIdx,
        id: selectedOption.getAttribute('id'),
        title: selectedOption.getAttribute('title'),
        value: selectedOption.getAttribute('value'),
        label: selectedOption.getAttribute('label'),
        datafieldobject: selectedOption.getAttribute('datafieldobject'),
        datafieldtype: selectedOption.getAttribute('datafieldtype'),
        datafieldoperators: selectedOption.getAttribute('datafieldoperators'),
      };
  
      const newPanelContainer = document.createElement('div');
      newPanelContainer.setAttribute('id', 'panel-container-' + filterIdx);
      newPanelContainer.classList.add('panelContainer');
  
      const panels = document.getElementsByClassName('panelContainer');
      
      // Create and render the new panel
      const panel = <SegmentFilterPanel panelparams={panelParamsObj} totalPanels={panels.length}
      removePanel={() => removePanel(filterIdx)}/>;
      const contactlistFilters = document.getElementById('contactlist_filters');
      contactlistFilters.appendChild(newPanelContainer);
  
      const panelContainer = ReactDOM.createRoot(newPanelContainer);
      panelContainer.render(panel);
  
      // Increment filterIdx state to track the panel index
      setFilterIdx(prevIdx => prevIdx + 1);
      filtersCount = filtersCount + 1;

      document.getElementById("filterList").value = "";
    };
    

    const save = (event) => {
        
        event.preventDefault();

        const minLength = 2;
        const maxLength = 50;
        const validCharacters = /^[A-Za-z0-9\s]+$/; // Only letters, numbers and spaces

        const name = document.getElementById("name").value;
        /*const alias = document.getElementById("alias").value;
        const publicname = document.getElementById("publicname").value;*/
        const descriptionData = document.getElementById("description").value;

        var filterInputs = document.getElementsByClassName("filter-input");
        var isBlank = false;
        
        for (var i = 0; i < filterInputs.length; i++) {
            if (filterInputs[i].value.trim() === "") {
                isBlank = true;
                break;  // Exit the loop if a blank input is found
            }
        }

        const nameObj = validateTitle(name);

        if (!isRealVal(name)) {
            var err = 1;
            var msg = "Segment Name is required.";
            showToastMsg(err, msg);
            return false;
        }

        if (nameObj.Err === 1) {
            var err = 1;
            var msg = nameObj.Msg;
            showToastMsg(err, msg);
            return false;
        }

        if(filtersCount <= 0){
            var err = 1;
            var msg = "Please add filters to include the contacts in the segment.";
            showToastMsg(err, msg);
            return false;
        }

        if(isBlank){
            var err = 1;
            var msg = "Filters are required.";
            showToastMsg(err, msg);
            return false;
        }

        setIsLoading(true);

        var url = "segment/save";

        // Check if the form exists
        const segmentForm = document.getElementById("segmentForm");
        if (!segmentForm) {
            console.log("Form not found!");
            setIsLoading(false);
            return;
        }

        // Log the formData contents for debugging
        var formDataJson = $("#segmentForm").serialize();
        
        // Send data to the server (example placeholder)
        const postJson = {
            "_token": csrfToken,
            "formData": formDataJson
        };
        
        httpRequest(url, postJson, function(resp){
            var C = resp.C;
            var error = resp.M.error;
            var msg = resp.M.message;
            var R = resp.R;
            
            if(C == 100 && error == 0){
                //signup successfull
                showToastMsg(error, msg);
                window.location.href = params.segmentsUrl;

            }else{
                if(C == 102){
                    //backend validations
                    msg = JSON.stringify(R); 
                }
                showToastMsg(error, msg);
            }
            
            setIsLoading(false);
        });
        
    };

    return (
    <Layout pageTitle={pageTitle}>
        <div className="midde_cont">
            <div className="container-fluid">
            
                <div className="row column_title">
                    <div className="col-md-12">
                        <div className="page_title">
                            <h2>New Segment</h2>
                        </div>
                    </div>
                </div>
                
                
                
                <div className="row column1">
                    
                    <div className="col-md-9">
                        <form id="segmentForm" className="white_shd full margin_bottom_30" ref={formRef} onSubmit={save} method="post">
                            <div className="full inner_elements">
                                <div className="row">
                                    <div className="col-md-12">
                                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className={`${Styles.borderRadius} nav-link active`} id="details-tab" data-bs-toggle="tab" data-bs-target="#details" type="button" role="tab" aria-controls="details" aria-selected="true">Details</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className={`${Styles.borderRadius} nav-link`}  id="filters-tab" data-bs-toggle="tab" data-bs-target="#filters" type="button" role="tab" aria-controls="filters" aria-selected="false">Filters</button>
                                            </li>
                                            </ul>
                                            <div className="tab-content" id="myTabContent">
                                            <div className="tab-pane fade show active" id="details" role="tabpanel" aria-labelledby="details-tab">
                                                <div className="full dis_flex center_text">
                                                    <div className="col-md-12 form-group mb-3">
                                                        <div className="row mb-3">
                                                            <div className="col-md-12">
                                                                <InputLabel className="form-label" value="Name"/>
                                                                <TextInput type="text" className="form-control" name="name" id="name" placeholder="Segment Name" value={formValues.name} onChange={handleInputChange} />
                                                            </div>
                                                        </div>

                                                        <div className="row mb-3">
                                                            <div className="col-md-12">
                                                                <InputLabel className="form-label" value="Purpose"/>
                                                                <TextInput type="text" className="form-control" name="purpose" id="purpose" placeholder="Purpose" value={formValues.purpose} onChange={handleInputChange} />
                                                            </div>
                                                        </div>

                                                        
                                                        <div className="row mb-3">
                                                            <div className="col-md-12">
                                                                <InputLabel className="form-label" value="Objective"/>
                                                                <TextInput type="text" className="form-control" name="objective" id="objective" placeholder="Objective" value={formValues.objective} onChange={handleInputChange} />
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="row mb-3">
                                                            <div className="col-md-12">
                                                                <InputLabel className="form-label" value="Description"/>
                                                                
                                                                <TextInput type="hidden" className="form-control" name="description" id="description" placeholder="Autogenerated" value={formValues.description} onChange={handleInputChange} />
                                                                <CKEditor
                                                                    editor={ClassicEditor}
                                                                    data={editorData}
                                                                    onChange={handleEditorChange} 
                                                                    config={{
                                                                        licenseKey: 'GPL',
                                                                        toolbar: [
                                                                            'undo', 'redo', '|',
                                                                            'bold', 'italic', 'underline'
                                                                            ],
                                                                    }}
                                                                />
                                                                <div style={{ marginTop: '10px', color: 'gray' }}>{editorData.length} / {descriptionMaxLength} characters</div>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-md-6">
                                                            </div>
                                                            <div className={`${Styles.textAlignRight} col-md-6`}>
                                                                <PrimaryButton type="submit" isLoading={isLoading} className="main_bt">Save</PrimaryButton>
                                                            </div>
                                                        </div>


                                                    </div>
                                                
                                                </div>
                                            </div>
                                            <div className="tab-pane fade" id="filters" role="tabpanel" aria-labelledby="filters-tab">

                                                <div className="full dis_flex center_text">
                                                    <div className="form-group mb-3">
                                                            <div className="row mb-3">
                                                            <div className="col-md-12">
                                                            <div className="alert alert-primary" role="alert">Contacts that match the filters will be added, and contacts that no longer match will be removed. Those manually added will remain untouched.</div>
                                                            </div>
                                                            </div>

                                                            <div className="row mb-3">
                                                            <div className="col-md-6">
                                                                <FilterDropdownWithChosen
                                                                id="filterList"
                                                                options={contactsOptions}
                                                                onChangeHandler={handleSelectChange}
                                                                placeholder="Choose one..."
                                                                />
                                                            </div>
                                                            </div>

                                                            <div className="row mb-3">
                                                            <div id="contactlist_filters" className="col-md-12">
                                                            
                                                            </div>
                                                            </div>       

                                                        </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-3">
                        <div className="white_shd full margin_bottom_30"></div>
                    </div>

                </div>
                
            </div>
        </div>
    </Layout>
);
};

export default newcontact;