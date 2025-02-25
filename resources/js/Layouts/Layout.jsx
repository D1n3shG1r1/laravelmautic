import React from 'react';
import { Helmet } from 'react-helmet';
import Styles from "../../css/Modules/Layout.module.css"; // Import styles from the CSS module
const Layout = ({pageTitle, children }) => {
    const user = window.authUser;  // This will be null or 0 if no user is logged in
    const userFullName = window.fullName;
    const userEmail = window.email;
    const baseUrl = window.url();
    const logoPng = window.url('images/sciplogo.png');
    const userPng = window.url('images/user.png');
    const userPng2 = window.url('images/user-white.png');
    const dashboardUrl = window.url('dashboard');
    const contactsUrl = window.url('contacts');
    const companiesUrl = window.url('companies');
    const segmentsUrl = window.url('segments');
    const campaignsUrl = window.url('campaigns');
    return (
        <>
        <Helmet>
        <title>{pageTitle}</title>
        </Helmet>
        <div className="full_container">
            <div className="inner_container">
            {/*<!-- Sidebar  -->*/}
            <nav id="sidebar">
                <div className="sidebar_blog_1">
                    <div className="sidebar-header">
                        <div className="logo_section">
                        <a href="dashboard"><img className="logo_icon img-responsive" src={logoPng} alt="#" /></a>
                        
                        </div>
                     </div>
                    <div className="sidebar_user_info">
                        <div className="icon_setting"></div>
                        <div className="user_profle_side">
                        <div className="user_img">
                        <img className="profilephotoimg img-responsive" src={userPng}/></div>
                        <div className="user_info">
                        <h6>{userFullName}</h6>
                        <h6 className={`${Styles.sideBarUserEmail}`}>{userEmail}</h6>
                        
                            <p><span className="online_animation"></span> Online</p>
                        </div>
                        </div>
                    </div> 
                </div>
                <div className="sidebar_blog_2">
                    <h4>General</h4>
                    <ul className="list-unstyled components">
                        <li><a href={dashboardUrl}><i className="fa fa-line-chart yellow_color"></i> <span>Dashboard</span></a></li>
                        <li><a href={contactsUrl}><i className="fa fa-user orange_color"></i> <span>Contacts</span></a></li>
                        <li><a href={companiesUrl}><i className="fa fa-building-o orange_color"></i> <span>Companies</span></a></li>
                        <li><a href={segmentsUrl}><i className="fa fa-pie-chart orange_color"></i> <span>Segments</span></a></li>
                        <li><a href={campaignsUrl}><i className="fa fa-bullhorn orange_color"></i> <span>Campaigns</span></a></li>
                        
                    </ul>
                </div>
            </nav>
            {/*<!-- end sidebar -->*/}
            {/*<!-- right content -->*/}
            <div id="content">
                {/*<!-- topbar -->*/}
                <div className="topbar">
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <div className="full">
                        <button type="button" id="sidebarCollapse" className="sidebar_toggle"><i className="fa fa-bars"></i></button>
                        <div className="logo_section">
                            <a href="dashboard"><img className="img-responsive logoblack logoblackpngdk" src={logoPng} alt="#" /></a>
                        </div>
                        <div className="right_topbar">
                            <div className="icon_info">
                                <ul>
                                    <li><a href="#"><i className="fa fa-bell-o"></i><span className="badge">2</span></a></li>
                                    <li><a href="#"><i className="fa fa-question-circle"></i></a></li>
                                    <li><a href="#"><i className="fa fa-envelope-o"></i><span className="badge">3</span></a></li>
                                </ul>
                                <ul className="user_profile_dd">
                                    <li>
                                    <a className="dropdown-toggle" data-toggle="dropdown"><img className="profilephotoimg img-responsive rounded-circle" src={userPng2} alt="#" /><span className="name_user">{userFullName}</span></a>
                        
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#">My Profile</a>
                                        <a className="dropdown-item" href="#">Settings</a>
                                        <a className="dropdown-item" href="#"><span>Sign Out</span> <i className="fa fa-sign-out"></i></a>
                                    </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        </div>
                    </nav>
                </div>
                {/*<!-- end topbar -->*/}
                    {children}
                {/*<!-- footer -->*/}
                <div className="container-fluid">
                    <div className="footer">
                    <p>Copyright © 2025. All rights reserved.Powered by: SCIP</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
    );
};

export default Layout;
