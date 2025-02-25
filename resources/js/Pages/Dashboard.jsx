import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/Layouts/Layout';  // Import the layout component
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';

const dashBoard = ({pageTitle,csrfToken,params}) => {
    const user = {};
    return (
        <Layout pageTitle={pageTitle}>
            <div className="midde_cont">
                <div className="container-fluid">
                    <div className="row column_title">
                    <div className="col-md-12">
                        <div className="page_title">
                            <h2>Dashboard</h2>
                        </div>
                    </div>
                    </div>
                    <div className="row column1">
                    <div className="col-md-6 col-lg-3">
                        <div className="full counter_section margin_bottom_30 yellow_bg">
                            <div className="couter_icon">
                                <div> 
                                <i className="fa fa-group"></i>
                                </div>
                            </div>
                            <div className="counter_no">
                                <div>
                                <p className="total_no">152</p>
                                <p className="head_couter">My Applicants</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="full counter_section margin_bottom_30 blue1_bg">
                            <div className="couter_icon">
                                <div> 
                                <i className="fa fa-file-text-o"></i>
                                </div>
                            </div>
                            <div className="counter_no">
                                <div>
                                <p className="total_no">545</p>
                                <p className="head_couter">My Applications</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="full counter_section margin_bottom_30 green_bg">
                            <div className="couter_icon">
                                <div> 
                                <i className="fa fa-clock-o"></i>
                                </div>
                            </div>
                            <div className="counter_no">
                                <div>
                                <p className="total_no" title="Pending Applications">45</p>
                                <p className="head_couter" title="Pending Applications">Pending</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="full counter_section margin_bottom_30 red_bg">
                            <div className="couter_icon">
                                <div> 
                                <i className="fa fa-comments-o"></i>
                                </div>
                            </div>
                            <div className="counter_no">
                                <div>
                                <p className="total_no">41</p>
                                <p className="head_couter">Pending Applications</p>
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
export default dashBoard;