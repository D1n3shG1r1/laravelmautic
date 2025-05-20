import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/Layouts/Layout';  // Import the layout component
import NavLink from '@/Components/NavLink';
import LinkButton from '@/Components/LinkButton';
import ConfirmBox from '@/Components/ConfirmBox';

import { Link } from '@inertiajs/react'; // Ensure you're using Inertia's Link

import Styles from "../../css/Modules/Segments.module.css"; // Import styles from the CSS module

const Segments = ({ pageTitle, csrfToken, params }) => {
    const segment = params.segment;
    const contacts = params.contacts;
    const campaigns = params.campaigns;

    
    const viewCampaign = (id) =>{
        window.location.href = window.url('campaign/view/'+id);
    };

    const viewContact = (id) =>{
        window.location.href = window.url('contact/edit/'+id);
    };
  
    return (
        <Layout pageTitle={pageTitle}>
            <div className="midde_cont">
                <div className="container-fluid">
                    <div className="row column_title">
                        <div className="col-md-12">
                            <div className="page_title row">
                                <div className="col-md-6">
                                    <h2>Segment</h2>
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
                        <div className="col-md-9">
                            <div className="row">
                                <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                <div className="full graph_head">
                                    <div className="heading1 margin_0">
                                        <h5>Details</h5>
                                    </div>
                                </div>

                                <div className="table_section padding_infor_info">
                                    <div className="table-responsive-sm">
    
                                        <h5>{segment.name}</h5>
                                        <div dangerouslySetInnerHTML={{ __html: segment.description }}></div>

                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <th>Created by</th>
                                                    <td>{segment.created_by_user}</td>
                                                </tr>
                                                <tr>
                                                    <th>Created on</th>
                                                    <td>{segment.date_added}</td>
                                                </tr>
                                                <tr>
                                                    <th>Modified by</th>
                                                    <td>{segment.modified_by_user}</td>
                                                </tr>
                                                <tr>
                                                    <th>Last modified</th>
                                                    <td>Email</td>
                                                </tr>
                                                <tr>
                                                    <th>ID</th>
                                                    <td>{segment.id}</td>
                                                </tr>
                                                <tr>
                                                    <th>Contacts</th>
                                                    <td>{contacts.length}</td>
                                                </tr>
                                            
                                            </tbody>
                                        </table>
                                    </div>
                                </div>



                                </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                            <div className="white_shd full margin_bottom_30">
                                <div className="full graph_head">
                                    <div className="heading1 margin_0">
                                        <h5>Contacts</h5>
                                    </div>
                                </div>
                                <div className="table_section padding_infor_info">
                                    <div className="table-responsive-sm">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>ID</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {contacts.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6" style={{ textAlign: "center" }}>
                                                            No contacts available.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    contacts.map(contact => (
                                                        <tr key={contact.id}>
                                                            <td>
                                                                {contact.firstname}
                                                                &nbsp;
                                                                {contact.lastname}
                                                            </td>
                                                            <td>
                                                                {contact.email}
                                                            </td>
                                                            <td>
                                                                {contact.id}
                                                            </td>
                                                            
                                                            <td>
                                                                <LinkButton type="button" className={`btn p-0`} onClick={() => viewContact(
                                                                    contact.id)} title="View">
                                                                    <i className={`${Styles.filterTrashIcon} fa fa-eye`}></i>
                                                                </LinkButton>

                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-md-3">
                            <div className="white_shd full margin_bottom_30">
                                <div className="full graph_head">
                                    <div className="heading1 margin_0">
                                        <h5>Associated Campaigns</h5>
                                    </div>
                                </div>

                                <div className="table_section padding_infor_info">
                                    <div className="table-responsive-sm">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>ID</th>
                                                    {/*<th>Action</th>*/}
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {campaigns.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="2" style={{ textAlign: "center" }}>
                                                            No campaigns associated.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    campaigns.map(campaign => (
                                                        <tr key={campaign.id}>
                                                            <td>{campaign.name}</td>
                                                            <td>{campaign.id}</td>
                                                            {/*<td>
                                                                <LinkButton type="button" className={`btn p-0`} onClick={() => viewCampaign(
                                                                    campaign.id)} title="View">
                                                                    <i className={`${Styles.filterTrashIcon} fa fa-eye`}></i>
                                                                </LinkButton>
                                                            </td>*/}
                                                        </tr>
                                                )))}
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

export default Segments;
