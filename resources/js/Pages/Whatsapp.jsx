import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/Layouts/Layout';  // Import the layout component
import NavLink from '@/Components/NavLink';
import LinkButton from '@/Components/LinkButton';
import ConfirmBox from '@/Components/ConfirmBox';

import Styles from "../../css/Modules/Emails.module.css"; // Import styles from the CSS module

const Whatsapp = ({ pageTitle, csrfToken, params }) => {
    
    return (
        <Layout pageTitle={pageTitle}>
            <div className="midde_cont">
                <div className="container-fluid">
                    <div className="row column_title">
                        <div className="col-md-12">
                            <div className="page_title row">
                                <div className="col-md-6">
                                    <h2>Whatsapp</h2>
                                </div>
                                <div className={`${Styles.textAlignRight} col-md-6`}>
                                    <NavLink className="btn cur-p btn-outline-primary" href="#">
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
                                        <h2>Messages List</h2>
                                    </div>
                                </div>
                                <div className="table_section padding_infor_info">
                                    <div className="table-responsive-sm">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Date created</th>
                                                    <th>Created by</th>
                                                    <th>ID</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td colSpan="5" style={{ textAlign: "center" }}>
                                                        Coming soon.
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
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

export default Whatsapp;
