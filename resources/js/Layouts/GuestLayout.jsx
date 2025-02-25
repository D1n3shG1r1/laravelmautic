import React from 'react';
import { Helmet } from 'react-helmet';

const GuestLayout = ({pageTitle, children }) => {
    return (
        <>
        <Helmet><title>{pageTitle}</title></Helmet>
        {children}
        </>
    );
};

export default GuestLayout;
