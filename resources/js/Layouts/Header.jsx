import React from 'react';

const Header = () => {
    // Check if the user is logged in by checking the global window.authUser
    const user = window.authUser;  // This will be null or 0 if no user is logged in
    const userFullName = window.fullName;
    const userEmail = window.email;
    
    /*
    {user ? (
        <>
        </>
    ) : (
        <>
        </>
    )}
    */
    return (
        <header>
            <div className="full_container">
                <div className="inner_container">
                    {/* Sidebar */}
                    <nav id="sidebar">
                        <div className="sidebar_blog_1">
                            <div className="sidebar-header">
                                <div className="logo_section">
                                    <a href="/dashboard">
                                        <img
                                            className="logo_icon img-responsive"
                                            src="images/sciplogo.png"
                                            alt="Logo"
                                        />
                                    </a>
                                </div>
                            </div>
                            <div className="sidebar_user_info">
                                <div className="icon_setting"></div>
                                <div className="user_profle_side">
                                    <div className="user_img">
                                        <img
                                            className="profilephotoimg img-responsive"
                                            src="images/user.png"
                                            alt="Profile"
                                        />
                                    </div>
                                    <div className="user_info">
                                        <h6>{userFullName}</h6>
                                        <h6>{userEmail}</h6>
                                        <p><span className="online_animation"></span> Online</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sidebar_blog_2">
                            <h4>Role</h4>
                            <ul className="list-unstyled components">
                                <li><a href="/dashboard"><i className="fa fa-dashboard yellow_color"></i> <span>Dashboard</span></a></li>
                                <li><a href="/contacts"><i className="fa fa-user orange_color"></i> <span>Contacts</span></a></li>
                                <li><a href="/companies"><i className="fa fa-file-o orange_color"></i> <span>Companies</span></a></li>
                                <li><a href="/segments"><i className="fa fa-file-text-o orange_color"></i> <span>Segments</span></a></li>
                                <li><a href="/campaigns"><i className="fa fa-group orange_color"></i> <span>Campaigns</span></a></li>
                                <li><a href="/tags"><i className="fa fa-briefcase blue1_color"></i> <span>Tags</span></a></li>
                            </ul>
                        </div>
                    </nav>
                    {/* End Sidebar */}

                    {/* Right Content */}
                    <div id="content">
                        {/* Topbar */}
                        <div className="topbar">
                            <nav className="navbar navbar-expand-lg navbar-light">
                                <div className="full">
                                    <button type="button" id="sidebarCollapse" className="sidebar_toggle">
                                        <i className="fa fa-bars"></i>
                                    </button>
                                    <div className="logo_section">
                                        <a href="/dashboard">
                                            <img
                                                className="img-responsive logoblack logoblackpngdk"
                                                src="images/sciplogo.png"
                                                alt="Logo"
                                            />
                                        </a>
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
                                                    <a className="dropdown-toggle" data-toggle="dropdown">
                                                        <img
                                                            className="profilephotoimg img-responsive rounded-circle"
                                                            src="images/user-white.png"
                                                            alt="User"
                                                        />
                                                        <span className="name_user">{userFullName}</span>
                                                    </a>
                                                    <div className="dropdown-menu">
                                                        <a className="dropdown-item" href="">My Profile</a>
                                                        <a className="dropdown-item" href="#">Settings</a>
                                                        <a className="dropdown-item" href="#">
                                                            <span>Sign Out</span> <i className="fa fa-sign-out"></i>
                                                        </a>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </div>
                        {/* End Topbar */}
                    </div>
                    {/* End Right Content */}
                </div>
            </div>
        </header>
    );
};

export default Header;