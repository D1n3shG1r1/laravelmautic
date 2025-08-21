import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Layout from '@/Layouts/Layout';  // Import the layout component
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import ToggleButton from "@/Components/ToggleButton";
import Radiobutton from "@/Components/Radiobutton";
import Checkbox from '@/Components/Checkbox';
import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Styles from "../../css/Modules/Widgets.module.css";

const NewWidget = ({pageTitle,csrfToken,params}) => {
    
    const widget = params.widget;
    const preSelectedCheckBox = params.widget.parameters;
    
    const descriptionMaxLength = 160;
    const [isLoading, setIsLoading] = useState(false);
    const [editorData, setEditorData] = useState('');

    const formRef = useRef();
    
    const [formValues, setFormValues] = useState({
        widgetName:widget.name || '',
        widgetPurpose:widget.purpose || '',
        widgetWebsite:widget.website || '',
        widgetType: widget.widgetType || 'webform', //default is webform [webform, popup, webhook]
        description:widget.description || '',
        widgetHeading:widget.widgetHeading || 'Join Our List'
    });
    
    useEffect(() => {
    
        if (window.jQuery) {
          // Initialize Bootstrap tooltips
          const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
          tooltipTriggerList.forEach((tooltip) => new bootstrap.Tooltip(tooltip));
        }

    }, []);


    const paragraphRef = useRef(null);

    const handleCopy = () => {
        const text = paragraphRef.current?.innerText;

        if (!navigator.clipboard) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showToastMsg(0, "Copied to clipboard!");
            } catch (err) {
                console.error('Fallback: Copy failed', err);
                showToastMsg(1, 'Fallback: Copy failed' + err);
            }
            document.body.removeChild(textarea);
            return;
        }

        // Modern method
        navigator.clipboard.writeText(text)
            .then(() => {
                
                showToastMsg(0, "Copied to clipboard!");
            })
            .catch((err) => {
                //console.error('Copy failed', err);
                showToastMsg(1, 'Failed to copy: ' + err);
            });
    };

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

    const [toggleState, setToggleState] = useState(widget.active);
    const [toggleValue, setToggleValue] = useState(widget.active);
    const handleToggle = (value) => {
        setToggleValue(value);
    };

    const [selectedType, setSelectedType] = useState('webform');

    const [isWidgetTypeLocked, setIsWidgetTypeLocked] = useState(false);
    const handleChange = (e) => {
        
        const { value } = e.target;
        setSelectedType(value);
        setFormValues(prev => ({
            ...prev,
            widgetType: value
        }));
        setIsWidgetTypeLocked(false); // Lock selection after first change
    };
    
    const Update = () => {
        
        const checkedFields = Object.entries(checkboxState)
        .filter(([_, isChecked]) => isChecked)
        .map(([key]) => key);

        const uncheckedFields = Object.entries(checkboxState)
        .filter(([_, isChecked]) => !isChecked)
        .map(([key]) => key);

        const { widgetName, widgetPurpose, widgetWebsite, widgetType, description, widgetHeading } = formValues;

        if (!isRealVal(widgetName)) {
            showToastMsg(1, "Widget name is required.");
            return;
        } else if (!isRealVal(widgetPurpose)) {
            showToastMsg(1, "Widget purpose is required.");
            return;
        } else if (!isRealVal(widgetWebsite)) {
            showToastMsg(1, "Widget website is required.");
            return;
        } else{
            setIsLoading(true);
        
            var url = "widget/Update";
            var postJson = {
                "_token":csrfToken,
                "id":widget.id,
                "widgetName":widgetName,
                "widgetPurpose":widgetPurpose,
                "widgetWebsite":widgetWebsite,
                "widgetType":widgetType,
                "widgetDescription":description,
                "widgetHeading":widgetHeading,
                "active":toggleValue,
                "checkedFields":checkedFields,
                "uncheckedFields":uncheckedFields
            };
            
            httpRequest(url, postJson, function(resp){
                var C = resp.C;
                var error = resp.M.error;
                var msg = resp.M.message;
                var R = resp.R;

                if(C == 100 && error == 0){
                    
                    showToastMsg(error, msg);
                    
                }else{
                    
                    showToastMsg(error, msg);
                }

                setIsLoading(false);
            });
        }

    }

    const allCheckboxFields = [
        'inputFirstName',
        'inputLastName',
        'inputEmail',
        'inputCompany',
        'inputPhone',
        'inputReason',
        'inputCountry',
        'inputMessage',
    ];

    const [checkboxState, setCheckboxState] = useState(() => {
        const initialState = {};
        allCheckboxFields.forEach(field => {
            initialState[field] = preSelectedCheckBox.includes(field);
        });
        return initialState;
    });

    const handleCheckboxChange = (event) => {
        const { id, checked } = event.target;
        
        // Prevent unchecking for these three checkboxes
        if (id === "inputFirstName" || id === "inputLastName" || id === "inputEmail") {
            setCheckboxState((prevState) => ({
                ...prevState,
                [id]: true,  // Always set these fields to true (checked)
            }));
        } else {
            setCheckboxState((prevState) => ({
                ...prevState,
                [id]: checked,  // For other checkboxes, update normally
            }));
        }
    };
    
    //const [widgetHeading, setWidgetHeading] = useState("Join Our List");
    const [widgetHeading, setWidgetHeading] = useState(formValues.widgetHeading);
    

    const PopupPreview = ({ heading }) => (
        <div id="widget-popup" style={{
            /*display: 'none',
            position: 'fixed',*/
            bottom: '20px',
            right: '20px',
            background: '#fff',
            border: '1px solid #ccc',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '400px',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
            /*transform: 'translateY(100%)',*/
            transform: 'translateY(0)',
            transition: 'transform 0.4s ease-in-out, opacity 0.4s',
            opacity: 1,
            zIndex: 1000
        }}>
            
            <button
                onClick={() => {
                    document.getElementById('widget-popup').style.display = 'none';
                }}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#999'
                }}
                title="Close"
            >
                &times;
            </button>

            <h4 id="widget-heading" style={{ marginBottom: '16px', color: '#333' }}>{heading}</h4>

            {checkboxState.inputFirstName && (
                <div id="widget-fname-container" style={{ marginBottom: '12px', width: '50%', float: 'left',padding: '5px', marginBottom: '12px' }}>
                    <input type="text" id="widget-fname" placeholder="First Name" style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px',
                        background: '#f9f9f9'
                    }} />
                </div>
            )}

            {checkboxState.inputLastName && (
            <div id="widget-lname-container" style={{ marginBottom: '12px', width: '50%', float: 'left',padding: '5px', marginBottom: '12px' }}>
                <input type="text" id="widget-lname" placeholder="Last Name" style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    background: '#f9f9f9'
                }} />
            </div>
            )}

            {checkboxState.inputEmail && (
            <div id="widget-email-container" style={{ marginBottom: '12px', width: '50%', float: 'left',padding: '5px', marginBottom: '12px' }}>
                <input type="email" id="widget-email" placeholder="Email" style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    background: '#f9f9f9'
                }} />
            </div>
            )}

            {checkboxState.inputPhone && (
            <div id="widget-phone-container" style={{ marginBottom: '12px', width: '50%', float: 'left',padding: '5px', marginBottom: '12px' }}>
                <input type="text" id="widget-phone" placeholder="Mobile Number" style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    background: '#f9f9f9'
                }} />
            </div>
            )}

            {checkboxState.inputCompany && (
            <div id="widget-company-container" style={{ marginBottom: '12px', width: '50%', float: 'left',padding: '5px', marginBottom: '12px' }}>
                <input type="text" id="widget-company" placeholder="Company" style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    background: '#f9f9f9'
                }} />
            </div>
            )}

            {checkboxState.inputCountry && (
            <div id="widget-country-container" style={{ marginBottom: '12px', width: '50%', float: 'left',padding: '5px', marginBottom: '12px' }}>
                <input type="text" id="widget-country" placeholder="Country" style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    background: '#f9f9f9'
                }} />
            </div>
            )}

            {checkboxState.inputReason && (
            <div id="widget-reasontocontact-container" style={{ marginBottom: '12px', width: '100%', float: 'left',padding: '5px', marginBottom: '12px' }}>
                <input type="text" id="widget-reasontocontact" placeholder="Reason to Contact" style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    background: '#f9f9f9'
                }} />
            </div>
            )}

            {checkboxState.inputMessage && (
            <div id="widget-message-container" style={{ marginBottom: '12px', width: '100%', float: 'left',padding: '5px', marginBottom: '12px' }}>
                <textarea id="widget-message" rows="3" placeholder="Message" style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    background: '#f9f9f9',
                    resize:'none'
                }}></textarea>
            </div>
            )}

            <button id="yw-submit" style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '12px',
                width: '100%',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
            }}>Submit</button>

            <div id="yw-feedback" style={{
                marginTop: '12px',
                fontSize: '14px',
                display: 'none'
            }}></div>
        </div>
    );

    return (
        <Layout pageTitle={pageTitle}>
            <div className="midde_cont">
                <div className="container-fluid">
                
                    <div className="row column_title">
                        <div className="col-md-12">
                            <div className="page_title">
                                <h2>Edit Widget</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row column1">
                        <div className="col-md-7">
                        <div className="white_shd full margin_bottom_30">
                            <div className="full price_table padding_infor_info">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="full center_text">
                                            <form id="segmentForm" ref={formRef}>
                                                <div className="form-group roww mb-3">
                                                    
                                                    <div className="row mb-3">
                                                        <div className="col-md-6">
                                                            <InputLabel htmlFor="widgetName"  className="form-label" value="Name"/>
                                                            <TextInput type="text" className="form-control" name="widgetName" id="widgetName" placeholder="Name" value={formValues.widgetName} onChange={handleInputChange} />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <InputLabel htmlFor="widgetPurpose"  className="form-label" value="Purpose"/>
                                                            <TextInput type="text" className="form-control" name="widgetPurpose" id="widgetPurpose" placeholder="Purpose" value={formValues.widgetPurpose} onChange={handleInputChange} />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="row mb-3">
                                                    {formValues.widgetType === 'webform' ? (
                                                            <div className="col-md-12">
                                                            <TextInput type="hidden" className="form-control" name="widgetWebsite" id="widgetWebsite" placeholder="Page Link" value={formValues.widgetWebsite} onChange={handleInputChange} />
                                                            </div>
                                                        ):(
                                                            <div className="col-md-12">
                                                            <InputLabel htmlFor="widgetWebsite"  className="form-label" >Page Link
                                                            &nbsp;
                                                            <i className="bi bi-question-circle"
                                                            data-bs-toggle="tooltip" data-bs-placement="top"
                                                            title="URL of the page where the widget will be integrated."
                                                            style={{ cursor:"pointer" }}></i>
                                                            </InputLabel>

                                                            <TextInput type="text" className="form-control" name="widgetWebsite" id="widgetWebsite" placeholder="Page Link" value={formValues.widgetWebsite} onChange={handleInputChange} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    
                                                    <div className="row mb-3">
                                                        <div className="col-md-6">
                                                            <InputLabel htmlFor="widgetWebsite"  className="form-label" >Widget Type
                                                            &nbsp;
                                                            <i className="bi bi-question-circle"
                                                            data-bs-toggle="tooltip" data-bs-placement="top"
                                                            title="Choose between Popup or Webhook integration."
                                                            style={{ cursor:"pointer" }}></i>
                                                            </InputLabel>
                                                            
                                                            <InputLabel htmlFor="widgetWebsite"  className="form-control" >{formValues.widgetType}</InputLabel>
                                                            
                                                            <TextInput type="hidden" className="form-control" name="widgetType" id="widgetType"
                                                            value={formValues.widgetType} onChange={handleInputChange} />

                                                            {/*
                                                            Popup:
                                                            Displays as a popup on your site where the widget is embedded.

                                                            Webhook:
                                                            Sends submitted data to your server using a POST request.

                                                            Webform:
                                                            Opens a standalone form page via a link.
                                                            */}
                                                            {/*
                                                            <Radiobutton
                                                                label="Webform"
                                                                name="widgetType"
                                                                value="webform" 
                                                                checked={selectedType === 'webform'}
                                                                onChange={handleChange}
                                                                disabled={isWidgetTypeLocked}
                                                            />

                                                            <Radiobutton
                                                                label="Popup"
                                                                name="widgetType"
                                                                value="popup" 
                                                                checked={selectedType === 'popup'}
                                                                onChange={handleChange}
                                                                disabled={isWidgetTypeLocked}
                                                            />

                                                            <Radiobutton
                                                                label="Webhook"
                                                                name="widgetType"
                                                                value="webhook" 
                                                                checked={selectedType === 'webhook'}
                                                                onChange={handleChange}
                                                                disabled={isWidgetTypeLocked}
                                                            />*/}
                                                        </div>
                                                        <div className="col-md-6">
                                                            <InputLabel className="form-label" value="Active"/>
                                                            <ToggleButton onToggle={handleToggle}  onText ={"Yes"} offText = {"No"} state={toggleState} />
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
                                                    
                                                    {(formValues.widgetType === 'popup' || formValues.widgetType === 'webform') ? (
                                                    <div className="row mb-3">
                                                        <div className="col-md-12">
                                                            <InputLabel htmlFor="widgetHeading" className="form-label" value="Popup Heading" />
                                                            <TextInput
                                                                type="text"
                                                                className="form-control"
                                                                name="widgetHeading"
                                                                id="widgetHeading"
                                                                placeholder="Enter popup title"
                                                                value={formValues.widgetHeading}
                                                                onChange={(e) => setFormValues({ ...formValues, widgetHeading: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    ) : (
                                                        <TextInput
                                                        type="hidden"
                                                        className="form-control"
                                                        name="widgetHeading"
                                                        id="widgetHeading"
                                                        placeholder="Enter popup title"
                                                        value={formValues.widgetHeading}
                                                        onChange={(e) => setFormValues({ ...formValues, widgetHeading: e.target.value })}
                                                        />
                                                    )}

                                                    <div className="row mb-3">
                                                        <div className="col-md-12">
                                                            <InputLabel className="form-label" value="Contact Fields"/>
                                                        </div>
                                                        
                                                        <div className="row">
                                                            <div className="col-md-4">
                                                            <Checkbox id="inputFirstName"
                                                            checked={checkboxState.inputFirstName}
                                                            onChange=
                                                            {handleCheckboxChange}
                                                            ></Checkbox>
                                                            <InputLabel htmlFor="inputFirstName" className="form-label px-1" value="First Name"/>
                                                            </div>

                                                            <div className="col-md-4">
                                                            <Checkbox id="inputLastName"
                                                            checked={checkboxState.inputLastName}
                                                            onChange={handleCheckboxChange}></Checkbox>
                                                            <InputLabel htmlFor="inputLastName" className="form-label px-1" value="Last Name"/>
                                                            </div>

                                                            <div className="col-md-4">
                                                            <Checkbox id="inputEmail" 
                                                            checked={checkboxState.inputEmail}
                                                            onChange={handleCheckboxChange}
                                                            ></Checkbox>
                                                            <InputLabel htmlFor="inputEmail" className="form-label px-1" value="Email"/>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="row">
                                                            <div className="col-md-4">
                                                            <Checkbox id="inputPhone"
                                                            checked={checkboxState.inputPhone}
                                                            onChange={handleCheckboxChange}></Checkbox>
                                                            <InputLabel htmlFor="inputPhone" className="form-label px-1" value="Mobile Number"/>
                                                            </div>
                                                            
                                                            <div className="col-md-4">
                                                            <Checkbox id="inputCompany"
                                                            checked={checkboxState.inputCompany}
                                                            onChange={handleCheckboxChange}
                                                            ></Checkbox>
                                                            <InputLabel htmlFor="inputCompany" className="form-label px-1" value="Company"/>
                                                            </div>

                                                            <div className="col-md-4">
                                                            <Checkbox id="inputCountry"
                                                            checked={checkboxState.inputCountry}
                                                            onChange={handleCheckboxChange}></Checkbox>
                                                            <InputLabel htmlFor="inputCountry" className="form-label px-1" value="Country"/>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="row">
                                                            
                                                            <div className="col-md-4">
                                                            <Checkbox id="inputReason"
                                                            checked={checkboxState.inputReason}
                                                            onChange={handleCheckboxChange}
                                                            ></Checkbox>
                                                            <InputLabel htmlFor="inputReason" className="form-label px-1" value="Reason to Contact"/>
                                                            </div>

                                                            <div className="col-md-4">
                                                            <Checkbox id="inputMessage"
                                                            checked={checkboxState.inputMessage}
                                                            onChange={handleCheckboxChange}></Checkbox>
                                                            <InputLabel htmlFor="inputMessage" className="form-label px-1" value="Message"/>
                                                            </div>
                                                            
                                                        </div>
                                                    </div>

                                                    <div className='row mb-3'>
                                                        <div className="col-md-6"></div>
                                                        <div className="col-md-6 text-end">
                                                            <PrimaryButton type="button" isLoading={isLoading} className="main_bt" onClick={Update}>Update</PrimaryButton>
                                                        </div>
                                                    </div>

                                                </div>
                                            </form>
                                        </div>
                                    </div>    
                                </div>
                            </div>
                        </div>

                        </div>

                        <div className="col-md-5">
                            <div className="white_shd full margin_bottom_30">
                                <div className="full price_table padding_infor_info">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="full center_text">
                                            
                                            <InputLabel className="form-label" value="Code snippet"/>

                                            <i className="float-end bi bi-copy"
                                            data-bs-toggle="tooltip" data-bs-placement="top"
                                            title="Click to copy the code"
                                            style={{ cursor:"pointer" }} onClick={handleCopy}></i>

                                            <p ref={paragraphRef} id="codeSnippet" 
                                            className={`${Styles.codeSnippetText} form-control`}>{widget.snippetCode}</p>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {(formValues.widgetType === 'popup' || formValues.widgetType === 'webform') && (
                            <div className="white_shd full margin_bottom_30">
                                <div className="full price_table padding_infor_info">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="full center_text">
                                                <InputLabel className="form-label" value="Form Preview"/>
                                                <PopupPreview heading={formValues.widgetHeading}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )}

                            
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
);
};

export default NewWidget;