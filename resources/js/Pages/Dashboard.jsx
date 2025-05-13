import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/Layouts/Layout';  // Import the layout component
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';
import Styles from "../../css/Modules/Dashboard.module.css"; // Import styles from the CSS module

const dashBoard = ({pageTitle,csrfToken,Params}) => {
    const contactsCount = Params.contactsCount;
    const segmentsCount = Params.segmentsCount;
    const campaignsCount = Params.campaignsCount;
    const tagsCount = Params.tagsCount;
    const contactChart = Params.contactChart;
    const upcomingCampaigns = Params.upcomingCampigns;

    const user = {};

    useEffect(() => {
        const ctx = document.getElementById("contact_chart").getContext("2d");
        new Chart(ctx, getChartJs('line', contactChart)); // Initialize chart with configuration
    }, []);  // Empty array to ensure this runs only once after mount

    // Get chart configuration
    const getChartJs = (type, contactChart) => {
        let config = null;

        if (type === 'line') {
            var dataValsObj = contactChart.data;
            const dataVals = [];
            $.each(dataValsObj, function(k,v){
                dataVals.push(v);
            });
            
            config = {
                type: 'line',
                data: {
                    labels: contactChart.labels,
                    datasets: [{
                        label: "All contacts",
                        data: dataVals,
                        borderColor: 'rgba(33, 150, 243, 1)',
                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                        pointBorderColor: 'rgba(33, 150, 243, 1)',
                        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                        pointBorderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    legend: {
                        display: true // Ensure the legend is visible
                    }
                }
            };
        }
        return config;  // Return the config object to be used by Chart.js
    };



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
                                <p className="total_no">{contactsCount}</p>
                                <p className="head_couter">Contacts</p>
                                </div>   
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="full counter_section margin_bottom_30 blue1_bg">
                            <div className="couter_icon">
                                <div> 
                                <i className="fa fa-pie-chart"></i>
                                </div>
                            </div>
                            <div className="counter_no">
                                <div>
                                <p className="total_no">{segmentsCount}</p>
                                <p className="head_couter">Segments</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="full counter_section margin_bottom_30 green_bg">
                            <div className="couter_icon">
                                <div> 
                                <i className="fa fa-bullhorn"></i>
                                </div>
                            </div>
                            <div className="counter_no">
                                <div>
                                <p className="total_no" title="Pending Applications">{campaignsCount}</p>
                                <p className="head_couter" title="Pending Applications">Campaigns</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="full counter_section margin_bottom_30 red_bg">
                            <div className="couter_icon">
                                <div> 
                                <i className="fa fa-tags"></i>
                                </div>
                            </div>
                            <div className="counter_no">
                                <div>
                                <p className="total_no">{tagsCount}</p>
                                <p className="head_couter">Tags</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>

                    {/*<!-- graph -->*/}
                    <div className="row column2 graph margin_bottom_30">
                        <div className="col-md-l2 col-lg-6">
                           <div className="white_shd full">
                              <div className="full graph_head">
                                 <div className="heading1 margin_0">
                                    <h2>Contacts Created</h2>
                                 </div>
                              </div>
                              <div className="full graph_revenue">
                                 <div className="row">
                                    <div className="col-md-12">
                                       <div className="content">
                                          <div className="area_chart">
                                             <canvas height="120" id="contact_chart"></canvas>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="col-md-l2 col-lg-6">
                           <div className="white_shd full">
                              <div className="full graph_head">
                                 <div className="heading1 margin_0">
                                    <h2>Upcoming Campaigns</h2>
                                 </div>
                              </div>
                              <div className="table_section padding_infor_info">
                                 <div className="table-responsive-sm">
                                    <table className={`table table-striped ${Styles.tableCampaign}`}>
                                       <thead>
                                          <tr>
                                             <th>Campaign name</th>
                                             <th>Active On</th>
                                             <th>Expires On</th>
                                          </tr>
                                       </thead>
                                       <tbody>
                                       
                                        {
                                        upcomingCampaigns.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" style={{ textAlign: "center" }}>
                                                    No campaigns available.
                                                </td>
                                            </tr>
                                        ) : (upcomingCampaigns.map(upCamp => (
                                            <tr key={upCamp.id}>
                                                <td>{upCamp.name}</td>
                                                <td>{upCamp.publish_up}</td>
                                                <td>{upCamp.publish_down}</td>
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
                    {/*<!-- end graph -->*/}


                </div>
            </div>
        </Layout>
    );
};
export default dashBoard;