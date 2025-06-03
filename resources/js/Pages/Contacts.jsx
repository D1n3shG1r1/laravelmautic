import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/Layouts/Layout';  // Import the layout component
import NavLink from '@/Components/NavLink';
import PrimaryButton from "@/Components/PrimaryButton";
import LinkButton from '@/Components/LinkButton';
import ConfirmBox from '@/Components/ConfirmBox';
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import BootstrapModal from "@/Components/BootstrapModal";
import { Link } from '@inertiajs/react'; // Ensure you're using Inertia's Link
import * as XLSX from 'xlsx';

import Styles from "../../css/Modules/Contacts.module.css"; // Import styles from the CSS module

const Contacts = ({ pageTitle, csrfToken, params }) => {
    
    const contacts = params.contacts.data;
    const links = params.contacts.links;
    const modalRef = useRef();
    
    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltips = [...tooltipTriggerList].map((tooltip) => new bootstrap.Tooltip(tooltip));
        
        return () => {
            tooltips.forEach((tooltip) => tooltip.dispose());
        };

    }, []);

    let prevLink = links[0]?.url || '';
    let nextLink = links[links.length - 1]?.url || '';

    let prevHref = '';
    let prevDisable = '';
    let nextHref = '';
    let nextDisable = '';

    let activePageNum = "";
    // Loop through the links to find the active page number
    links.forEach((link) => {
        if (link.active) {
            activePageNum = link.label; // Assign the active page number
        }
    });

    if (prevLink) {
        prevHref = prevLink;
        prevDisable = "";
    } else {
        prevHref = "#"; // Avoid "javascript:void(0)"
        prevDisable = "disabled";
    }

    if (nextLink) {
        nextHref = nextLink;
        nextDisable = "";
    } else {
        nextHref = "#"; // Avoid "javascript:void(0)"
        nextDisable = "disabled";
    }

    // If activePageNum is not set (for any reason), default to 1
    if (!activePageNum) {
        activePageNum = "1";
    }

    const editContact = (id) =>{
        window.location.href = window.url('contact/edit/'+id);
    };

    const [showConfirmBox, setShowConfirmBox] = useState(false);
    const [currentId, setCurrentId] = useState(null); // State to hold the current ID
    const [currentName, setCurrentName] = useState(null); // State to hold the current ID
  
    const deleteContact = (contact) =>{
        const name = contact.title+' '+contact.firstname+' '+contact.lastname;
        setCurrentId(contact.id); // Set the ID when the confirm box is shown
        setCurrentName(name);
        setShowConfirmBox(true); // Show the custom confirmation box
    };
    
    const handleYes = () => {
      
        const url = "contact/delete";
        const postJson = {
            "_token": csrfToken,
            "id": currentId
        };
        
        httpRequest(url, postJson, function(resp){
            var C = resp.C;
            var error = resp.M.error;
            var msg = resp.M.message;
            var R = resp.R;
            
            if(C == 100 && error == 0){
                //signup successfull
                showToastMsg(error, msg);
                
                document.getElementById("cont_rw_"+currentId).remove();

                //window.location.href = params.contactsUrl;

            }else{
               showToastMsg(error, msg);
            }
        
            setShowConfirmBox(false); // Hide the custom confirmation box
            
        });

      
    };
  
    const handleNo = () => {
      setShowConfirmBox(false); // Hide the custom confirmation box
    };

    
    const downloadSample = () => {
        const link = document.createElement('a');
        link.href = params.sampleFileUrl; // Path relative to the public folder
        link.download = params.sampleFileName; // Optional: rename when downloading
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    

    const cancelUploadXls = () => {
        window.location.href = params.contactsUrl;
    };

    const [importData, setData] = useState([]);
    const [errors, setErrors] = useState([]);
    const requiredColumns = ['Title', 'First Name', 'Last Name', 'Email', 'Mobile', 'Address1', 'Address2', 'City', 'State', 'Pincode', 'Country', 'Company'];
    const fileInputRef = useRef(null);
    
    useEffect(() => {
      const modalEl = document.getElementById('importContactsModal');
  
      const handleModalOpen = () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
          setErrors([]); // Clear errors
        }
      };
  
      modalEl?.addEventListener('shown.bs.modal', handleModalOpen);
  
      return () => {
        modalEl?.removeEventListener('shown.bs.modal', handleModalOpen);
      };
    }, []);

    

    const validateFile = (jsonData) => {
        
        const errorMessages = [];

        // Check for missing required columns
        const columns = Object.keys(jsonData[0] || {});
        requiredColumns.forEach(col => {
            if (!columns.includes(col)) {
                errorMessages.push(`Missing required column: ${col}`);
            }
        });
    
        // Check for empty values in each row
        jsonData.forEach((row, rowIndex) => {
            requiredColumns.forEach(col => {
                const value = row[col];
    
                // Check if the value exists and is a string before calling .trim()
                if (!value || (typeof value === 'string' && value.trim() === "")) {
                    errorMessages.push(`Empty value in "${col}" at row ${rowIndex + 2}`); // Row indexing starts from 1, add 1 for the header row.
                }
            });
        });
    
        return errorMessages;
    };

    const handleFileUpload = (event) => {
        
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            setErrors([]);
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            // Validate the JSON data for required columns and empty values
            const validationErrors = validateFile(jsonData);

            if (validationErrors.length > 0) {
                setErrors(validationErrors); // Show validation errors
            } else {
                setData(jsonData); // Set data if validation passes
                setErrors([]); // Clear errors
            }

            /*if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }*/
        };

        if (file) {
            reader.readAsBinaryString(file);
        }
    };

    const uploadXls = () => {
    
        if(importData.length <= 0){
            var error = 1;
            var msg = 'Please select a valid XLSX file to import contacts.'
            showToastMsg(error, msg);
        }else{

            const url = "contacts/import";
            const postJson = {
                "_token": csrfToken,
                "importData": importData
            };
            
            httpRequest(url, postJson, function(resp){
                var C = resp.C;
                var error = resp.M.error;
                var msg = resp.M.message;
                var R = resp.R;
                
                if(C == 100 && error == 0){
                    //signup successfull
                    showToastMsg(error, msg);

                    setTimeout(function(){
                        window.location.href = params.contactsUrl;
                    }, 1000);
                    
                }else{
                   showToastMsg(error, msg);
                }
            });
        }
        
    };

    return (
        <Layout pageTitle={pageTitle}>
            <div className="midde_cont">
                <div className="container-fluid">
                    <div className="row column_title">
                        <div className="col-md-12">
                            <div className="page_title row">
                                <div className="col-md-6">
                                    <h2>Contacts</h2>
                                </div>
                                <div className={`${Styles.textAlignRight} col-md-6`}>
                                    <NavLink type="button" className="mr-2 btn cur-p btn-outline-primary" data-bs-toggle="modal" data-bs-target="#importContactsModal" title="Upload xls">
                                        <i className={`${Styles.newBtnIcon} fa fa-file-excel-o`}></i>Import
                                    </NavLink>
                                    <NavLink className="btn cur-p btn-outline-primary" href="contacts/new">
                                        <i className={`${Styles.newBtnIcon} fa fa-plus`}></i> New
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="white_shd full margin_bottom_30">
                                <div className="full graph_head">
                                    <div className="heading1 margin_0">
                                        <h2>Contacts List</h2>
                                    </div>
                                </div>
                                <div className="table_section padding_infor_info">
                                    <div className="table-responsive-sm">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Tags</th>
                                                    <th>Date created</th>
                                                    <th>Created by</th>
                                                    <th>ID</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {contacts.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" style={{ textAlign: "center" }}>
                                                            No contacts available.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    contacts.map(contact => (
                                                        <tr id={"cont_rw_"+contact.id} key={contact.id}>
                                                            <td>
                                                                {contact.title} {contact.firstname} {contact.lastname}
                                                            </td>
                                                            <td>
                                                                {contact.email}
                                                            </td>
                                                            <td style={{ lineHeight: "30px" }}>
                                                            {contact.tags.map((tag, index) => (
                                                                <span key={index} className={`${Styles.tagspan}`}>{tag.tag}</span>
                                                            ))}
                                                            </td>
                                                            <td>
                                                                {contact.date_added}
                                                            </td>
                                                            <td>
                                                                {contact.created_by_user}
                                                            </td>

                                                            <td>
                                                                {contact.id}
                                                            </td>
                                                            <td>
                                                                <LinkButton type="button" className={`btn p-0`} onClick={() => editContact(contact.id)} data-bs-toggle="tooltip" title="Edit">
                                                                    <i className={`${Styles.filterTrashIcon} fa fa-edit`}></i>
                                                                </LinkButton>

                                                                <span className={`${Styles.buttonSeprator}`}></span>

                                                                <LinkButton type="button" className={`btn p-0`} onClick={() => deleteContact(contact)} data-bs-toggle="tooltip" title="Delete">
                                                                    <i className={`${Styles.filterTrashIcon} fa fa-trash-o`}></i>
                                                                </LinkButton>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="btn-group mr-2 pagination button_section button_style2">
                                        <a
                                            className={`btn paginate_button previous ${prevDisable}`}
                                            href={prevHref}
                                            aria-controls="DataTables_Table_0"
                                            data-dt-idx="0"
                                            tabIndex="-1"
                                            id="DataTables_Table_0_previous"
                                        >
                                            <i className="fa fa-angle-double-left"></i>
                                        </a>

                                        <a
                                            className="btn active paginate_button current"
                                            aria-controls="DataTables_Table_0"
                                            data-dt-idx="1"
                                            tabIndex="0"
                                        >
                                            {activePageNum}
                                        </a>

                                        <a
                                            className={`btn paginate_button next ${nextDisable}`}
                                            href={nextHref}
                                            aria-controls="DataTables_Table_0"
                                            data-dt-idx="2"
                                            tabIndex="-1"
                                            id="DataTables_Table_0_next"
                                        >
                                            <i className="fa fa-angle-double-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <BootstrapModal id="importContactsModal" title="Import Contacts" modalRef={modalRef} onCancel={cancelUploadXls} showFooter={true} confirmText={'Upload'} onConfirm={uploadXls}>
                <form>
                    <div className="form-group">
                        <div className='row'>
                            <div className='col-md-12'>
                                <InputLabel className='mr-2' value="Select a file to upload from your computer"/>
                                <PrimaryButton type="button" className={`mr-2 btn btn-primary ${Styles.floatRight}`} onClick={() => downloadSample()} data-bs-toggle="tooltip" title="Download sample file">
                                    <i className={`${Styles.newBtnIcon} fa fa-download`}></i> Download Sample File
                                </PrimaryButton>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-12'>
                                <TextInput type="file" accept=".xlsx,.xls" onChange={handleFileUpload} ref={fileInputRef}/>
                            </div>
                        </div>
                        
                        {/* Display validation errors */}
                        {errors.length > 0 && (
                            <div className='row'>
                                <div style={{ color: '#721c24' }} className='marginTop10 col-md-12'>
                                    <h4>Validation Errors:</h4>
                                    <ul className={`alert alert-danger ${Styles.existingContactsUl}`}>
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                        
                        <div className='row'>
                            <div className='col-md-12 text-right'>
                                
                            </div>
                        </div>
                    </div>
                </form>
            </BootstrapModal>                                                    

            {showConfirmBox && (
            <ConfirmBox
                message={`Delete the contact, ${currentName} (${currentId})? It will be removed from all associated records.`}
                onConfirm={handleYes}
                onCancel={handleNo}
            />
            )}
        </Layout>
    );
};

export default Contacts;
