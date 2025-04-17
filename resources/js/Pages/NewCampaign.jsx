import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/Layouts/Layout';  // Import the layout component
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';
import DropdownWithChosen from "@/Components/DropdownWithChosen";
import ToggleButton from "@/Components/ToggleButton";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import "bootstrap-icons/font/bootstrap-icons.css";
import Styles from "../../css/Modules/Campaigns.module.css"; // Import styles from the CSS module

const newcampaign = ({pageTitle,csrfToken,params}) => {
    
    const descriptionMaxLength = 160;
    const [editorData, setEditorData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef();
    
    // States for form values and errors
    const [formValues, setFormValues] = useState({
        title: '',
        fname: '',
        lname: '',
        email: '',
        company: '',
        position: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        mobile: '',
        phone: '',
        points: 0,
        fax: '',
        website: '',
        facebook: '',
        foursquare: '',
        instagram: '',
        linkedin: '',
        skype: '',
        twitter: '',
        stage: '',
        contactowner: '',
        tags: ''
    });

    // Handle form values update
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
        ...formValues,
        [name]: value
        });
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        if (data.length > descriptionMaxLength) {
            // Truncate the string if it exceeds the max length
            const truncatedData = data.slice(0, descriptionMaxLength);
            setEditorData(truncatedData);
            setFormValues((prevValues) => ({
                ...prevValues,
                description: truncatedData // Update description state directly
            }));
        } else {
            setEditorData(data);
            setFormValues((prevValues) => ({
                ...prevValues,
                description: data // Update description state
            }));
        }
    };

    const [toggleValue, setToggleValue] = useState(false);
    const handleToggle = (value) => {
        setToggleValue(value);
    };

    const save = (event) => {
        return false;
        event.preventDefault();
        console.log('Submitting Selected Tags:', selectedTags); 
        const minLength = 2;
        const maxLength = 50;
        const validCharacters = /^[A-Za-z0-9\s]+$/; // Only letters, numbers and spaces
    
        const title = document.getElementById("title").value;
        const fname = document.getElementById("fname").value;
        const lname = document.getElementById("lname").value;
        const email = document.getElementById("email").value;
        const address1 = document.getElementById("address1").value;
        const address2 = document.getElementById("address2").value;
        const city = document.getElementById("city").value;
        const state = document.getElementById("state").value;
        const zip = document.getElementById("zip").value;
        const country = document.getElementById("country").value;
        const mobile = document.getElementById("mobile").value;
        const contactTags = selectedTags;
        
        /*
        const company = document.getElementById("company").value;
        const position = document.getElementById("position").value;
        const phone = document.getElementById("phone").value;
        const points = document.getElementById("points").value;
        const fax = document.getElementById("fax").value;
        const website = document.getElementById("website").value;
        const facebook = document.getElementById("facebook").value;
        const foursquare = document.getElementById("foursquare").value;
        const instagram = document.getElementById("instagram").value;
        const linkedin = document.getElementById("linkedin").value;
        const skype = document.getElementById("skype").value;
        const twitter = document.getElementById("twitter").value;
        const stage = document.getElementById("stage").value;
        const contactowner = document.getElementById("contactowner").value;
        const tags = document.getElementById("tags").value;
       */

        const titleObj = validateTitle(title);
        const fnameObj = validateName(fname);
        const lnameObj = validateName(lname);
        
        if(!isRealVal(title)){
            var err = 1;
            var msg = "Name title is required.";
            showToastMsg(err, msg);
            return false;
        }
        
        if(titleObj.Err === 1){
            var err = 1;
            var msg = fnameObj.Msg;
            showToastMsg(err, msg);
            return false;
        }

        if(!isRealVal(fname)){
            var err = 1;
            var msg = "First name is required.";
            showToastMsg(err, msg);
            return false;
        }
        
        if(fnameObj.Err === 1){
            var err = 1;
            var msg = fnameObj.Msg;
            showToastMsg(err, msg);
            return false;
        }
        
        if(!isRealVal(lname)){
            var err = 1;
            var msg = "Last name is required.";
            showToastMsg(err, msg);
            return false;
        }
        
        if(lnameObj.Err === 1){
            var err = 1;
            var msg = lnameObj.Msg;
            showToastMsg(err, msg);
            return false;
        }
        
        if(!isRealVal(email)){
            var err = 1;
            var msg = "Email is required.";
            showToastMsg(err, msg);
            return false;
        }
        
        if(!validateEmail(email)){
            var err = 1;
            var msg = "Enter valid email.";
            showToastMsg(err, msg);
            return false;
        }
        
        if(isRealVal(address1)){
            if(address1.length < minLength || address1.length > maxLength){
                var err = 1;
                var msg = "Address Line must be between 2 and 50 characters long.";
                showToastMsg(err, msg);
                return false;
            }

            if(!validCharacters.test(address1)){
                var err = 1;
                var msg = "Address Line can only contain letters and spaces.";
                showToastMsg(err, msg);
                return false;
            }

        }

        if(isRealVal(address2)){
            if(address2.length < minLength || address2.length > maxLength){
                var err = 1;
                var msg = "Address Line must be between 2 and 50 characters long.";
                showToastMsg(err, msg);
                return false;
            }

            if(!validCharacters.test(address2)){
                var err = 1;
                var msg = "Address Line can only contain letters and spaces.";
                showToastMsg(err, msg);
                return false;
            }

        }

        if(isRealVal(city)){
            if(city.length < minLength || city.length > maxLength){
                var err = 1;
                var msg = "City must be between 2 and 50 characters long.";
                showToastMsg(err, msg);
                return false;
            }

            if(!validCharacters.test(city)){
                var err = 1;
                var msg = "City can only contain letters and spaces.";
                showToastMsg(err, msg);
                return false;
            }

        }

        if(isRealVal(state)){
            if(state.length < minLength || state.length > maxLength){
                var err = 1;
                var msg = "State must be between 2 and 50 characters long.";
                showToastMsg(err, msg);
                return false;
            }

            if(!validCharacters.test(state)){
                var err = 1;
                var msg = "State can only contain letters and spaces.";
                showToastMsg(err, msg);
                return false;
            }

        }

        if(isRealVal(zip)){
            if(zip.length < minLength || zip.length > maxLength){
                var err = 1;
                var msg = "Zip must be between 2 and 50 characters long.";
                showToastMsg(err, msg);
                return false;
            }

            if(!validCharacters.test(zip)){
                var err = 1;
                var msg = "Zip can only contain letters and spaces.";
                showToastMsg(err, msg);
                return false;
            }

        }

        if(isRealVal(country)){
            if(country.length < minLength || country.length > maxLength){
                var err = 1;
                var msg = "Country must be between 2 and 50 characters long.";
                showToastMsg(err, msg);
                return false;
            }

            if(!validCharacters.test(country)){
                var err = 1;
                var msg = "Country can only contain letters and spaces.";
                showToastMsg(err, msg);
                return false;
            }

        }

        if(isRealVal(mobile) && !validateMobile(mobile)){
            var err = 1;
            var msg = "Enter valid mobile number.";
            showToastMsg(err, msg);
            return false;
        }

        setIsLoading(true);
        
        var url = "contact/save";
        var postJson = {
            "_token":csrfToken,
            "title":title,
            "firstname":fname,
            "lastname":lname,
            "email":email,
            "address1":address1,
            "address2":address2,
            "city":city,
            "state":state,
            "zipcode":zip,
            "country":country,
            "mobile":mobile,
            "tags":contactTags
        };
        
        httpRequest(url, postJson, function(resp){
            var C = resp.C;
            var error = resp.M.error;
            var msg = resp.M.message;
            var R = resp.R;

            if(C == 100 && error == 0){
                //signup successfull
                showToastMsg(error, msg);
                window.location.href = params.contactsUrl;

            }else{
                if(C == 102){
                    //backend validations
                    msg = JSON.stringify(R); 
                }
                showToastMsg(error, msg);
            }

            setIsLoading(false);
        });
        
    };

    return (
    <Layout pageTitle={pageTitle}>
        <div className="midde_cont">
            <div className="container-fluid">
                <div className="row column_title">
                    <div className="col-md-12">
                        <div className={`${Styles.marginlrmin40} page_title row`}>
                            <div className="col-md-6">
                                <h2>New Campaign</h2>
                            </div>
                            <div className={`${Styles.textRight} col-md-6`}>
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <PrimaryButton id="builderBtn" type="button" className="btn btn-primary"><i className="bi bi-diagram-2"></i> Launch Campaign Builder</PrimaryButton>
                                    
                                    <PrimaryButton type="submit" isLoading={isLoading} className="btn btn-primary"><i className="bi bi-floppy2-fill"></i> Save</PrimaryButton>
                                    
                                    <PrimaryButton type="button" className="btn btn-primary" onClick={() => cancel()}><i className="bi bi-x"></i> Cancel</PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row column1">
                    <div className="col-md-9">
                    <div className={`${Styles.pdt_5} white_shd full margin_bottom_30`}>
                        <div className={`full price_table padding_infor_info`}>
                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <InputLabel className="form-label" value="Name"/>
                                    <TextInput type="text" className="form-control" name="name" id="name" placeholder="Campaign Name" value={formValues.name} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <InputLabel className="form-label" value="Description"/>
                                    
                                    <TextInput type="hidden" className="form-control" name="description" id="description" placeholder="Description" value={formValues.description} onChange={handleInputChange} />
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={editorData}
                                        onChange={handleEditorChange} 
                                        config={{
                                            licenseKey: 'GPL',
                                            toolbar: [
                                                'undo', 'redo', '|',
                                                'bold', 'italic', 'underline'
                                                ],
                                        }}
                                    />
                                    <div style={{ marginTop: '10px', color: 'gray' }}>{editorData.length} / {descriptionMaxLength} characters</div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className={`${Styles.pdt_5} white_shd full margin_bottom_30`}>
                            <div className={`full price_table padding_infor_info`}>
                            
                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <InputLabel className="form-label" value="Active"/>
                                    <ToggleButton
                                        onToggle={handleToggle} 
                                        onText ={"Yes"}
                                        offText = {"No"}
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <InputLabel className={`form-label ${Styles.required}`} value="Activate at (date)"/>
                                    <TextInput type="date" className="form-control" name="activateat" id="activateat" placeholder="Activate at (date)" value={formValues.activateat} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <InputLabel className={`form-label ${Styles.required}`} value="Deactivate at (date)"/>
                                    <TextInput type="date" className="form-control" name="deactivateat" id="deactivateat" placeholder="Deactivate at (date)" value={formValues.deactivateat} onChange={handleInputChange} />
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

export default newcampaign;