import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/Layouts/Layout';  // Import the layout component
import NavLink from '@/Components/NavLink';
import LinkButton from '@/Components/LinkButton';
import ConfirmBox from '@/Components/ConfirmBox';

import Styles from "../../css/Modules/Emails.module.css"; // Import styles from the CSS module

const Emails = ({ pageTitle, csrfToken, params }) => {
    const emails = params.emails.data;
    const links = params.emails.links;

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

    const editEmail = (id) =>{
        window.location.href = window.url('email/edit/'+id);
    };

    const viewEmail = (id) =>{
        window.location.href = window.url('email/view/'+id);
    };
    
    const [showConfirmBox, setShowConfirmBox] = useState(false);
    const [currentId, setCurrentId] = useState(null); // State to hold the current ID
    const [currentName, setCurrentName] = useState(null); // State to hold the current ID
  
    const deleteEmail = (email) =>{
        setCurrentId(email.id); // Set the ID when the confirm box is shown
        setCurrentName(email.name);
        setShowConfirmBox(true); // Show the custom confirmation box
    };
    
    const handleYes = () => {
      
        const url = "email/delete";
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
                document.getElementById("email_rw_"+currentId).remove();
                //window.location.href = params.emailsUrl;

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
                                    <h2>Emails</h2>
                                </div>
                                <div className={`${Styles.textAlignRight} col-md-6`}>
                                    <NavLink className="btn cur-p btn-outline-primary" href="emails/new">
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
                                        <h2>Emails List</h2>
                                    </div>
                                </div>
                                <div className="table_section padding_infor_info">
                                    <div className="table-responsive-sm">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Type</th>
                                                    <th>Date created</th>
                                                    <th>Created by</th>
                                                    <th>ID</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {emails.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" style={{ textAlign: "center" }}>
                                                            No emails available.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    emails.map(email => (
                                                        <tr id={"email_rw_"+email.id} key={email.id}>
                                                            <td>
                                                                {email.name}
                                                            </td>
                                                            <td>
                                                                {email.type}
                                                            </td>
                                                            <td>
                                                                {email.date_added} 
                                                            </td>
                                                            <td>
                                                                {email.created_by_user} 
                                                            </td>
                                                            <td>
                                                                {email.id}
                                                            </td>
                                                            <td>
                                                                <LinkButton type="button" className={`btn p-0`} onClick={() => viewEmail(email.id)} title="View">
                                                                    <i className={`${Styles.filterTrashIcon} fa fa-eye`}></i>
                                                                </LinkButton>

                                                                <span className={`${Styles.buttonSeprator}`}></span>

                                                                <LinkButton type="button" className={`btn p-0`} onClick={() => editEmail(email.id)} title="Edit">
                                                                    <i className={`${Styles.filterTrashIcon} fa fa-edit`}></i>
                                                                </LinkButton>

                                                                <span className={`${Styles.buttonSeprator}`}></span>

                                                                <LinkButton type="button" className={`btn p-0`} onClick={() => deleteEmail(email)} title="Delete">
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
                message={`Delete the email, ${currentName} (${currentId})? It may affect the campaign where it is being used.`}
                onConfirm={handleYes}
                onCancel={handleNo}
            />
            )}
        </Layout>
    );
};

export default Emails;
