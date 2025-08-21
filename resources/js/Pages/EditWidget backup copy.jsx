import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Layout from '@/Layouts/Layout';  // Import the layout component
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import ToggleButton from "@/Components/ToggleButton";
import Checkbox from '@/Components/Checkbox';
import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';

import Styles from "../../css/Modules/Widgets.module.css";

const NewWidget = ({pageTitle,csrfToken,params}) => {
    const widget = params.widget;
    
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef();

    const [formValues, setFormValues] = useState({
        widgetName:widget.name || '',
        widgetWebsite:widget.website || '',
        widgetPurpose:widget.purpose || '',
    });
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
        ...formValues,
        [name]: value
        });
    };

    const [toggleState, setToggleState] = useState(widget.active);
    const [toggleValue, setToggleValue] = useState(widget.active);
    const handleToggle = (value) => {
        setToggleValue(value);
    };

    

    const Update = () => {
        
        const { widgetName, widgetPurpose, widgetWebsite } = formValues;

        if (!isRealVal(widgetName)) {
            showToastMsg(1, "Widget name is required.");
            return;
        } else if (!isRealVal(widgetPurpose)) {
            showToastMsg(1, "Widget purpose is required.");
            return;
        } else if (!isRealVal(widgetWebsite)) {
            showToastMsg(1, "Widget website is required.");
            return;
        }else{
            setIsLoading(true);
        
            var url = "widget/Update";
            var postJson = {
                "_token":csrfToken,
                "id":widget.id,
                "widgetName":widgetName,
                "widgetPurpose":widgetPurpose,
                "widgetWebsite":widgetWebsite,
                "active":toggleValue
            };
            
            httpRequest(url, postJson, function(resp){
                var C = resp.C;
                var error = resp.M.error;
                var msg = resp.M.message;
                var R = resp.R;

                if(C == 100 && error == 0){
                    
                    showToastMsg(error, msg);
                    
                }else{
                    
                    showToastMsg(error, msg);
                }

                setIsLoading(false);
            });
        }

    }

    return (
        <Layout pageTitle={pageTitle}>
            <div className="midde_cont">
                <div className="container-fluid">
                
                    <div className="row column_title">
                        <div className="col-md-12">
                            <div className="page_title">
                                <h2>Edit Widget</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row column1">
                        <div className="col-md-7">
                        <div className="white_shd full margin_bottom_30">
                            <div className="full price_table padding_infor_info">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="full center_text">
                                            <form id="segmentForm" ref={formRef}>
                                                <div className="form-group roww mb-3">
                                                    
                                                    <div className="row mb-3">
                                                        <div className="col-md-6">
                                                            <InputLabel htmlFor="widgetName"  className="form-label" value="Name"/>
                                                            <TextInput type="text" className="form-control" name="widgetName" id="widgetName" placeholder="Name" value={formValues.widgetName} onChange={handleInputChange} />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <InputLabel htmlFor="widgetPurpose"  className="form-label" value="Purpose"/>
                                                            <TextInput type="text" className="form-control" name="widgetPurpose" id="widgetPurpose" placeholder="Purpose" value={formValues.widgetPurpose} onChange={handleInputChange} />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="row mb-3">
                                                        <div className="col-md-6">
                                                            <InputLabel htmlFor="widgetWebsite"  className="form-label" value="Domain"/>
                                                            <TextInput type="text" className="form-control" name="widgetWebsite" id="widgetWebsite" placeholder="Domain" value={formValues.widgetWebsite} onChange={handleInputChange} />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <InputLabel className="form-label" value="Active"/>
                                                            <ToggleButton
                                                            onToggle={handleToggle} onText ={"Yes"}
                                                            offText = {"No"} state={toggleState} />
                                                        </div>
                                                    </div>

                                                    <div className='row mb-3'>
                                                        <div className="col-md-6"></div>
                                                        <div className="col-md-6 text-end">
                                                            <PrimaryButton type="button" isLoading={isLoading} className="main_bt" onClick={Update}>Update</PrimaryButton>
                                                        </div>
                                                    </div>

                                                </div>
                                            </form>
                                        </div>
                                    </div>    
                                </div>
                            </div>
                        </div>

                        </div>

                        <div className="col-md-5">
                            <div className="white_shd full margin_bottom_30">
                                <div className="full price_table padding_infor_info">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="full center_text">
                                            
                                            <InputLabel className="form-label" value="Code snippet"/>

                                            <p id="codeSnippet" className="form-control">
                                                {widget.snippetCode}
                                            </p>


                                            </div>
                                        </div>
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

export default NewWidget;