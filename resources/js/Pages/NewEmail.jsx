import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Layout from '@/Layouts/Layout';  // Import the layout component
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';

import GrapesJSBuilder from '@/Components/GrapesJSBuilder'; // Import the GrapesJS component

import Styles from "../../css/Modules/Emails.module.css"; // Import styles from the CSS module

const EmailComponent = ({pageTitle,csrfToken,params}) => {

  const options = {
    fromElement: false, // Start with HTML content inside the container
    storageManager: { autoload: 0 }, // Optionally disable storage for now
    height: '600px',
  };

  return (
    <Layout pageTitle={pageTitle}>
        <div className="midde_cont">
            <div className="container-fluid">
              <div className="row column_title">
                  <div className="col-md-12">
                      <div className="page_title">
                          <h2>GrapesJS Builder in React</h2>
                      </div>
                  </div>
              </div>
              <div className="row column1">
                  <div className="col-md-12">
                    {/* Use the GrapesJS builder component */}
                    <GrapesJSBuilder containerId="editor" options={options} />
                  </div>
              </div>
            </div>
        </div>
    </Layout>
  );
};
  
export default EmailComponent;