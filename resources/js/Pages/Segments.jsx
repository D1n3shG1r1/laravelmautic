import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Layout from '@/Layouts/Layout';  // Import the layout component
import NavLink from '@/Components/NavLink';
import TextInput from '@/Components/TextInput';
import LinkButton from '@/Components/LinkButton';
import ConfirmBox from '@/Components/ConfirmBox';
import BootstrapModal from '@/Components/BootstrapModal';
import SegmentFilterPanel from '@/Components/SegmentFilterPanel';
import FilterDropdownWithChosen from '@/Components/FilterDropdownWithChosen';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link } from '@inertiajs/react'; // Ensure you're using Inertia's Link

import Styles from "../../css/Modules/Segments.module.css"; // Import styles from the CSS module
var filtersCount = 0;
const Segments = ({ pageTitle, csrfToken, params }) => {
    const segmentsUrl = params.segmentsUrl;
    const segments = params.segments.data;
    const links = params.segments.links;

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

    const editSegment = (id) =>{
        window.location.href = window.url('segment/edit/'+id);
    };

    const viewSegment = (id) =>{
        window.location.href = window.url('segment/view/'+id);
    };
    
    const [showConfirmBox, setShowConfirmBox] = useState(false);
    const [currentId, setCurrentId] = useState(null); // State to hold the current ID
    const [currentName, setCurrentName] = useState(null); // State to hold the current ID
  
    const deleteSegment = (segment) =>{
        setCurrentId(segment.id); // Set the ID when the confirm box is shown
        setCurrentName(segment.name);
        setShowConfirmBox(true); // Show the custom confirmation box
    };
    
    const handleYes = () => {
      
        const url = "segment/delete";
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
                window.location.href = params.segmentsUrl;

            }else{
               showToastMsg(error, msg);
            }
        
            setShowConfirmBox(false); // Hide the custom confirmation box
            
        });

      
    };
  
    const handleNo = () => {
      setShowConfirmBox(false); // Hide the custom confirmation box
    };
  
    const modalRef = useRef(null);
    const filterFormRef = useRef(null);
    const openFilter = () => {
        console.log('open filter');
    };

    const applyFilter = (e) => {
        e.preventDefault();
    
        var filterInputs = document.getElementsByClassName("filter-input");
        var isBlank = false;
        
        for (var i = 0; i < filterInputs.length; i++) {
            if (filterInputs[i].value.trim() === "") {
                isBlank = true;
                break;  // Exit the loop if a blank input is found
            }
        }

        if(isBlank){
            var err = 1;
            var msg = "Filters are required.";
            showToastMsg(err, msg);
            return false;
        }else{
            
            //setIsLoading(true);
            filterFormRef.current.submit();
            

            /*var url = "segments";

            // Check if the form exists
            const segmentForm = document.getElementById("contactlistFiltersForm");
            if (!segmentForm) {
                console.log("Form not found!");
                setIsLoading(false);
                return;
            }

            // Log the formData contents for debugging
            var formDataJson = $("#contactlistFiltersForm").serialize();
            
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
            });*/
        }


    };

    const filterCancel = () => {
        
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
      if(filterIdx > 0){
        newPanelContainer.classList.add('filterAndOrGlue');
      }
      
      
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

    return (
        <Layout pageTitle={pageTitle}>
            <div className="midde_cont">
                <div className="container-fluid">
                    <div className="row column_title">
                        <div className="col-md-12">
                            <div className="page_title row">
                                <div className="col-md-6">
                                    <h2>Segments</h2>
                                </div>
                                <div className={`${Styles.textAlignRight} col-md-6`}>
                                    <NavLink className="btn cur-p btn-outline-primary" href="segments/new">
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
                                        <h2>Segments List</h2>
                                    </div>
                                    <PrimaryButton id="filter" className={`${Styles.filterBtn} btn btn-outline-primary`} data-bs-toggle="modal" data-bs-target="#filterModal" onClick={() => openFilter()}>Filter by contacts</PrimaryButton>
                                </div>
                                <div className="table_section padding_infor_info">
                                    <div className="table-responsive-sm">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>#contacts</th>
                                                    <th>Date created</th>
                                                    <th>Created by</th>
                                                    <th>ID</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {segments.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6" style={{ textAlign: "center" }}>
                                                            No segments available.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    segments.map(segment => (
                                                        <tr key={segment.id}>
                                                            <td>
                                                                {segment.name}
                                                            </td>
                                                            <td>
                                                                {segment.contacts}
                                                            </td>
                                                            <td>
                                                                {segment.date_added} 
                                                            </td>
                                                            <td>
                                                                {segment.created_by_user} 
                                                            </td>
                                                            <td>
                                                                {segment.id}
                                                            </td>
                                                            <td>
                                                                <LinkButton type="button" className={`btn p-0`} onClick={() => viewSegment(segment.id)} title="View">
                                                                    <i className={`${Styles.filterTrashIcon} fa fa-eye`}></i>
                                                                </LinkButton>

                                                                <span className={`${Styles.buttonSeprator}`}></span>
                                                                
                                                                <LinkButton type="button" className={`btn p-0`} onClick={() => editSegment(segment.id)} title="Edit">
                                                                    <i className={`${Styles.filterTrashIcon} fa fa-edit`}></i>
                                                                </LinkButton>

                                                                <span className={`${Styles.buttonSeprator}`}></span>

                                                                <LinkButton type="button" className={`btn p-0`} onClick={() => deleteSegment(segment)} title="Delete">
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
            {showConfirmBox && (
            <ConfirmBox
                message={`Delete the segment, ${currentName} (${currentId})?`}
                onConfirm={handleYes}
                onCancel={handleNo}
            />
            )}
{/*onConfirm, onCancel, confirmText = "Understood", modalRef, showFooter = true*/}
            <BootstrapModal id="filterModal" title="Contact filter" modalRef={modalRef} onCancel={filterCancel} onConfirm={applyFilter} confirmText={"Apply"} showFooter={true}>
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
                    <form ref={filterFormRef} id="contactlistFiltersForm" action={segmentsUrl} method="GET">
                    <TextInput type="hidden" name="filterby" defaultValue="contacts"/>
                    <div id="contactlist_filters" className="col-md-12"></div>
                    </form>
                </div> 
            </BootstrapModal>

        </Layout>
    );
};

export default Segments;
