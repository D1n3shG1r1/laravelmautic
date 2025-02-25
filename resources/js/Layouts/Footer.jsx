import React from 'react';

const Footer = () => {
    // Check if the user is logged in by checking the global window.authUser
    const user = window.authUser;  // This will be null if no user is logged in

    const currentYear = new Date().getFullYear();
    /*{user ? (
        <>
        </>
    ) : (
        <>
        </>
    )}*/
    return (
        <footer>
            <div className="container-fluid">
                <div className="footer">
                    <p>Copyright © {currentYear}. All rights reserved.SCIP</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

