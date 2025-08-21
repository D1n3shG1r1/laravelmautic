import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Layout from '@/Layouts/Layout';  // Import the layout component
import NavLink from '@/Components/NavLink';
import TextInput from '@/Components/TextInput';
import LinkButton from '@/Components/LinkButton';
import ConfirmBox from '@/Components/ConfirmBox';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link } from '@inertiajs/react'; // Ensure you're using Inertia's Link
import Styles from "../../css/Modules/Widgets.module.css";

const Widgets = ({ pageTitle, csrfToken, params }) => {
    const widgetsUrl = params.widgetsUrl;
    const widgets = params.widgets.data;
    const links = params.widgets.links;

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

    const editWidget = (id) =>{
        window.location.href = window.url('widget/edit/'+id);
    };
    
    /*const viewWidget = (id) =>{
        window.location.href = window.url('widget/view/'+id);
    };*/
    
    const [showConfirmBox, setShowConfirmBox] = useState(false);
    const [currentId, setCurrentId] = useState(null); // State to hold the current ID
    const [currentName, setCurrentName] = useState(null); // State to hold the current ID
  
    const deleteWidget = (widget) =>{
        setCurrentId(widget.id); // Set the ID when the confirm box is shown
        setCurrentName(widget.name);
        setShowConfirmBox(true); // Show the custom confirmation box
    };
    
    const handleYes = () => {
      
        const url = "widget/delete";
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
  
    return (
        <Layout pageTitle={pageTitle}>
            <div className="midde_cont">
                <div className="container-fluid">
                    <div className="row column_title">
                        <div className="col-md-12">
                            <div className="page_title row">
                                <div className="col-md-6">
                                    <h2>Widgets</h2>
                                </div>
                                <div className={`${Styles.textAlignRight} col-md-6`}>
                                    <NavLink className="btn cur-p btn-outline-primary" href="widgets/new">
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
                                        <h2>Widgets List</h2>
                                    </div>
                                </div>
                                <div className="table_section padding_infor_info">
                                    <div className="table-responsive-sm">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Purpose</th>
                                                    <th>Domain</th>
                                                    <th>Date created</th>
                                                    <th>Created by</th>
                                                    <th>ID</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {widgets.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6" style={{ textAlign: "center" }}>
                                                            No widgets available.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    widgets.map(widget => (
                                                        <tr key={widget.id}>
                                                            <td>
                                                                {widget.name}
                                                            </td>
                                                            <td>
                                                                {widget.purpose}
                                                            </td>
                                                            <td>
                                                                {widget.website}
                                                            </td>
                                                            <td>
                                                                {widget.date_added} 
                                                            </td>
                                                            <td>
                                                                {widget.created_by_user} 
                                                            </td>
                                                            <td>
                                                                {widget.id}
                                                            </td>
                                                            <td>
                                                                
                                                                <LinkButton type="button" className={`btn p-0`} onClick={() => editWidget(widget.id)} title="Edit">
                                                                    <i className={`${Styles.filterTrashIcon} fa fa-edit`}></i>
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
            
        </Layout>
    );
};

export default Widgets;
