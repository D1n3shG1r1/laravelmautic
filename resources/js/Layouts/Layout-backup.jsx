import React from 'react';
import Header from '@/Layouts/Header';  // Import your header component
import Footer from '@/Layouts/Footer';  // Import your footer component

const Layout = ({ children }) => {
    return (
        <div>
            <Header />  {/* Header is included here */}
            <main>{children}</main> {/* The content of each page will go here */}
            <Footer />  {/* Footer is included here */}
        </div>
    );
};

export default Layout;
