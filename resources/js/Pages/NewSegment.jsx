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

const newcontact = ({pageTitle,csrfToken,params}) => {
    console.log(params);
    const [editorData, setEditorData] = useState('');
    const ckMaxlength = 160;
    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        
        if(data.length >= ckMaxlength){
            setEditorData(data);
        }else{
            setEditorData(data.slice(0, ckMaxlength)); 
        }
        
    };
    
    const [isLoading, setIsLoading] = useState(false);
    
    const formRef = useRef();
    
    // States for form values and errors
    const [formValues, setFormValues] = useState({
        name:'',
        alias:'',
        publicname:'',
    });

    // Handle form values update
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
        ...formValues,
        [name]: value
        });
    };

    
    const contactsOptions = JSON.parse(params.contactFilters);
    var filterIdx = 0;
    const handleSelectChange = (event, value) => {

        console.log(event);
        console.log(value);
        
        const selectedOption = event.target.selectedOptions[0];
        const opt_id = selectedOption.getAttribute('id');
        const opt_title = selectedOption.getAttribute('title');
        const opt_value = selectedOption.getAttribute('value');
        const opt_label = selectedOption.getAttribute('label');
        const opt_class = selectedOption.getAttribute('class');
        const opt_function = selectedOption.getAttribute('function');
        const opt_datafieldobject = selectedOption.getAttribute('datafieldobject');
        const opt_datafieldtype = selectedOption.getAttribute('datafieldtype');
        const opt_datafieldoperators = selectedOption.getAttribute('datafieldoperators');
        
        const panelParamsObj = {
            idx:filterIdx,
            id:opt_id,
            title:opt_title,
            value:opt_value,
            label:opt_label,
            datafieldobject:opt_datafieldobject,
            datafieldtype:opt_datafieldtype,
            datafieldoperators:opt_datafieldoperators
        };

        const newPanelContainer = document.createElement('div');
        newPanelContainer.classList.add('panel-container');

        const panel = <SegmentFilterPanel panelparams={panelParamsObj}></SegmentFilterPanel>

        //const panelContainer = document.getElementById('contactlist_filters');
        //panelContainer.appendChild(newPanelContainer);

        // Render the new SegmentFilterPanel inside the newly created div
        //ReactDOM.createRoot(newPanelContainer).render(panel);

        const panelContainer = ReactDOM.createRoot(document.getElementById('contactlist_filters'));
        panelContainer.render(panel);

        // Render the new SegmentFilterPanel inside the existing container
        
        filterIdx++;
    };
    
/*
    // State to hold all panels
    const [panels, setPanels] = useState([]);
    const contactsOptions = JSON.parse(params.contactFilters);
    let filterIdx = 0;

    // Handle select change
    const handleSelectChange = (event) => {
        console.log(event);

        const selectedOption = event.target.selectedOptions[0];
        const opt_id = selectedOption.getAttribute('id');
        const opt_title = selectedOption.getAttribute('title');
        const opt_value = selectedOption.getAttribute('value');
        const opt_label = selectedOption.getAttribute('label');
        const opt_class = selectedOption.getAttribute('class');
        const opt_function = selectedOption.getAttribute('function');
        const opt_datafieldobject = selectedOption.getAttribute('datafieldobject');
        const opt_datafieldtype = selectedOption.getAttribute('datafieldtype');
        const opt_datafieldoperators = selectedOption.getAttribute('datafieldoperators');
        
        const panelParamsObj = {
            idx: filterIdx,
            id: opt_id,
            title: opt_title,
            value: opt_value,
            label: opt_label,
            datafieldobject: opt_datafieldobject,
            datafieldtype: opt_datafieldtype,
            datafieldoperators: opt_datafieldoperators,
        };

        // Append the new panel to the panels state
        setPanels((prevPanels) => [...prevPanels, panelParamsObj]);

        filterIdx++;
    };
*/
    const save = (event) => {
        event.preventDefault();

        const minLength = 2;
        const maxLength = 50;
        const validCharacters = /^[A-Za-z0-9\s]+$/; // Only letters, numbers and spaces
    
        const name = document.getElementById("name").value;
        const alias = document.getElementById("fname").value;
        const publicname = document.getElementById("publicname").value;
        

        /*const titleObj = validateTitle(title);
        const fnameObj = validateName(fname);
        const lnameObj = validateName(lname);
        
        if(!isRealVal(title)){
            var err = 1;
            var msg = "Name title is required.";
            showToastMsg(err, msg);
            return false;
        }
        
        if(titleObj.Err === 1){
            var err = 1;
            var msg = fnameObj.Msg;
            showToastMsg(err, msg);
            return false;
        }
        */

        setIsLoading(true);
        
        var url = "segment/save";
        var postJson = {
            "_token":csrfToken,
            
        };
        
        httpRequest(url, postJson, function(resp){
            var C = resp.C;
            var error = resp.M.error;
            var msg = resp.M.message;
            var R = resp.R;

            if(C == 100 && error == 0){
                //signup successfull
                showToastMsg(error, msg);
                window.location.href = params.signinUrl;

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
                        <div className="white_shd full margin_bottom_30">
                            {/*<div className="full graph_head">
                                <div className="heading1 margin_0">
                                <h2>Tab Bar Style 1</h2>
                                </div>
                            </div>*/}
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
                                                <form className="profile_contant" ref={formRef} onSubmit={save}>
                                                    <div className="form-group mb-3">
                                                        <div className="row mb-3">
                                                            <div className="col-md-6">
                                                                <InputLabel className="form-label" value="Name"/>
                                                                <TextInput type="text" className="form-control" name="name" id="name" placeholder="Title" value={formValues.name} onChange={handleInputChange} />
                                                            </div>
                                                            
                                                            <div className="col-md-6">
                                                                <InputLabel className="form-label" value="Alias"/>
                                                                <TextInput type="text" className="form-control" name="alias" id="alias" placeholder="Autogenerated" value={formValues.alias} onChange={handleInputChange} />
                                                            </div>
                                                        </div>

                                                        <div className="row mb-3">
                                                            <div className="col-md-6">
                                                                <InputLabel className="form-label" value="Public name"/>
                                                                <TextInput type="text" className="form-control" name="publicname" id="publicname" placeholder="Autogenerated" value={formValues.publicname} onChange={handleInputChange} />
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="row mb-3">
                                                            <div className="col-md-12">
                                                                <InputLabel className="form-label" value="Description"/>
                                                                <CKEditor
                                                                    editor={ClassicEditor}
                                                                    data={editorData}
                                                                    onChange={handleEditorChange} // Handle change in CKEditor
                                                                    config={{
                                                                        // If you have a commercial license key, you can add it like this:
                                                                        licenseKey: 'GPL',
                                                                        toolbar: [
                                                                            'undo', 'redo', '|',
                                                                            'bold', 'italic', 'underline'
                                                                            ],  // Specify only the desired toolbar items
                                                                    }}
                                                                />
                                                                <div style={{ marginTop: '10px', color: 'gray' }}>{editorData.length} / {ckMaxlength} characters</div>
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
                                                </form>
                                                </div>
                                            </div>
                                            <div className="tab-pane fade" id="filters" role="tabpanel" aria-labelledby="filters-tab">

                                                <div className="full dis_flex center_text">
                                                    <form className="profile_contant" ref={formRef} onSubmit={save}>

                                                        <div className="alert alert-primary" role="alert">Contacts that match the filters will be added, and contacts that no longer match will be removed. Those manually added will remain untouched.</div>
                                                    
                                                        <div className="row mb-3">
                                                            <div className="col-md-6">
                                                                 
                                                                <FilterDropdownWithChosen id="filterList"
                                                                    options={contactsOptions}
                                                                    onChangeHandler={handleSelectChange}
                                                                    placeholder="Choose one..."
                                                                />
                                                            </div>
                                                        </div>
                                                                    
                                                        <div className="row mb-3">
                                                            <div id="contactlist_filters" className="col-md-12">
                                                            {/*panels.map((panelParamsObj, idx) => (
                                                                        <SegmentFilterPanel key={idx} panelparams={panelParamsObj} />
                                                                    ))*/}
                                                            </div>
                                                        </div>

                                                    </form>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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