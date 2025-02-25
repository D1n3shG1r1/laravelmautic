import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/Layouts/Layout';  // Import the layout component
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';

import Styles from "../../css/Modules/Contacts.module.css"; // Import styles from the CSS module

const contacts = ({pageTitle,csrfToken,params}) => {
    const contacts = params.contacts.data;
    const currentPage = params.contacts.current_page;
    const first_page_url = params.contacts.first_page_url;
    const from = params.contacts.from;
    const last_page = params.contacts.last_page;
    const last_page_url = params.contacts.last_page_url;
    const links = params.contacts.links;
    const next_page_url = params.contacts.next_page_url;
    const path = params.contacts.path;
    const per_page = params.contacts.per_page;
    const prev_page_url = params.contacts.prev_page_url;
    const to = params.contacts.to;
    const total = params.contacts.total;
        
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
                            <NavLink className="btn cur-p btn-outline-primary" href="contacts/new"><i className={`${Styles.newBtnIcon} fa fa-plus`}></i>New</NavLink>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                <div className="white_shd full margin_bottom_30">
                    <div className="full graph_head">
                        <div className="heading1 margin_0"><h2>Contacts List</h2></div>
                    </div>
                    <div className="table_section padding_infor_info">
                        <div className="table-responsive-sm">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                                            
                                <tr>
                                    <td>Test Contact-1</td>
                                    <td>contact1@example.com</td>
                                    <td>1</td>
                                </tr>
                                
                                <tr>
                                    <td>Test Contact-2</td>
                                    <td>contact2@example.com</td>
                                    <td>2</td>
                                </tr>

                                <tr>
                                    <td>Test Contact-3</td>
                                    <td>contact3@example.com</td>
                                    <td>3</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>

                        <div className="btn-group mr-2 pagination button_section button_style2">
                            
                
                        <a className="btn paginate_button previous disabled" aria-controls="DataTables_Table_0" data-dt-idx="0" tabindex="-1" id="DataTables_Table_0_previous"><i className="fa fa-angle-double-left"></i></a>
                    
                        <a className="btn active paginate_button current" aria-controls="DataTables_Table_0" data-dt-idx="1" tabindex="0">1</a>
                    
                        <a className="btn paginate_button next disabled" aria-controls="DataTables_Table_0" data-dt-idx="2" tabindex="-1" id="DataTables_Table_0_next"><i className="fa fa-angle-double-right"></i></a>    
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
export default contacts;