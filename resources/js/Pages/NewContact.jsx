import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/Layouts/Layout';  // Import the layout component
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';
import DropdownWithChosen from "@/Components/DropdownWithChosen";
import Styles from "../../css/Modules/Contacts.module.css"; // Import styles from the CSS module

const newcontact = ({pageTitle,csrfToken,params}) => {

    //title fname lname email company position address1 address2 city state mobile phone points fax website facebook foursquare instagram linkedin skype twitter stage contactowner tags
    const tags = params.tags;
    const [isLoading, setIsLoading] = useState(false);
    
    // State to hold the selected tag ids
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        //if (window.jQuery) {
          // Initialize Select2 for the tags select input
        $('#contactTags').select2({
            placeholder: "Select contact tags",
            allowClear: true,
            width: '100%', // Makes it responsive
            dropdownParent: $('#tagsContainer'),
        });

        // Listen to the change event on the select2 element
        $('#contactTags').on('change', function () {
            const selectedValues = $(this).val(); // Get the selected values from Select2
            setSelectedTags(selectedValues); // Update state
            console.log('Selected Tags:', selectedValues); // Log the selected values for debugging
        });

        // Cleanup Select2 and event listener when the component unmounts
        return () => {
            $('#contactTags').select2('destroy'); // Destroy Select2 instance
            $('#contactTags').off('change'); // Remove the change event listener
        };
        //}
      }, []);
    
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

    const handleTagChange = (event) => {
        const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value);
        setSelectedTags(selectedValues);
        console.log('Selected Tags:', selectedValues); 
    };

    const save = (event) => {
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
         <style>
            {`
                #tagsContainer .select2-container .selection {
                    width: 100%;
                }

                #contactTags {
                    width: 100% !important;
                }
            `}
        </style>
        <div className="midde_cont">
            <div className="container-fluid">
                <div className="row column_title">
                    <div className="col-md-12">
                        <div className="page_title">
                            <h2>New Contact</h2>
                        </div>
                    </div>
                </div>
                <div className="row column1">
                    {/*<div className="col-md-3">
                        <span className={`${Styles.photoSpan} white_shd`}>
                            <img src=""/>
                        </span>
                    </div>*/}
                    <div className="col-md-12">
                        <div className="white_shd full margin_bottom_30">
                            {/*<div className="full graph_head">
                                <div className="heading1 margin_0">
                                    <h2>My Profile</h2>
                                </div>
                            </div>*/}
                            <div className="full price_table padding_infor_info">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="full dis_flex center_text">
                                        <form className="profile_contant" ref={formRef} onSubmit={save}>
                                            <div className="form-group roww mb-3">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <InputLabel htmlFor="fname" className="form-label" value="Name"/>
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="col-md-2">
                                                        <TextInput type="text" className="form-control" name="title" id="title" placeholder="Title" value={formValues.title} onChange={handleInputChange} />
                                                    </div>
                                                    <div className="col-md-5">
                                                        <TextInput type="text" className="form-control" name="fname" id="fname" placeholder="First Name" value={formValues.fname} onChange={handleInputChange} />
                                                    </div>
                                                    <div className="col-md-5">
                                                        <TextInput type="text" className="form-control" name="lname" id="lname" placeholder="Last Name" value={formValues.lname} onChange={handleInputChange} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group mb-3">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <InputLabel className="form-label" value="Email"/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-12">
                                                        <TextInput type="email" className="form-control" name="email" id="email" placeholder="Email" value={formValues.email} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Company
                                            <div className="form-group mb-3">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <InputLabel className="form-label" value="Company"/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <TextInput type="text" className="form-control" name="company" id="company" placeholder="Company" value={formValues.company} onChange={handleInputChange}/>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <TextInput type="text" className="form-control" name="position" id="position" placeholder="Position" value={formValues.position} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                            </div>
                                            */}
                                            <div className="form-group mb-3">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <InputLabel className="form-label" value="Address"/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-12">
                                                        <TextInput type="text" className="form-control" name="address1" id="address1" placeholder="Address Line 1" value={formValues.address1} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-12">
                                                        <TextInput type="text" className="form-control" name="address2" id="address2" placeholder="Address Line 2" value={formValues.address2} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <TextInput type="text" className="form-control" name="city" id="city" placeholder="City" value={formValues.city} onChange={handleInputChange}/>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <TextInput type="text" className="form-control" name="state" id="state" placeholder="State" value={formValues.state} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <TextInput type="text" className="form-control" name="zip" id="zip" placeholder="Zip" value={formValues.zip} onChange={handleInputChange}/>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <TextInput type="text" className="form-control" name="country" id="country" placeholder="Country" value={formValues.country} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="form-group mb-3">
                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <InputLabel className="form-label" value="Mobile"/>
                                                        <TextInput type="text" className="form-control" name="mobile" id="mobile" placeholder="Mobile" value={formValues.mobile} onChange={handleInputChange}/>
                                                    </div>
                                                
                                                    <div id="tagsContainer" className="col-md-6">
                                                        <InputLabel className="form-label" value="Tags"/>
                                                        <select id="contactTags" multiple="multiple" className="form-select"
                                                        style={{ width: '100%' }}
                                                        value={selectedTags}>
                                                        {tags.map((tag) => (
                                                            <option
                                                            key={`tag_${tag.id}`}
                                                            id={`tag_${tag.id}`}
                                                            title={`${tag.tag}`}
                                                            value={tag.id}>
                                                                {`${tag.tag}`}
                                                            </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Other Optional Fields
                                            <div className="form-group mb-3">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <InputLabel className="form-label" value="Phone"/>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <TextInput type="text" className="form-control" name="phone" id="phone" placeholder="Phone" value={formValues.phone} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="form-group mb-3">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <InputLabel className="form-label" value="Points"/>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <TextInput type="text" className="form-control" name="points" id="points" placeholder="Points" value={formValues.points} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group mb-3">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <InputLabel className="form-label" value="Fax"/>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <TextInput type="text" className="form-control" name="fax" id="fax" placeholder="Fax" value={formValues.fax} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="form-group mb-3">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <InputLabel className="form-label" value="Website"/>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <TextInput type="text" className="form-control" name="website" id="website" placeholder="Website" value={formValues.website} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group mb-3">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <InputLabel className="form-label" value="Social"/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-12">
                                                        <TextInput type="text" className="form-control" name="facebook" id="facebook" placeholder="Facebook" value={formValues.facebook} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-12">
                                                        <TextInput type="text" className="form-control" name="foursquare" id="foursquare" placeholder="Foursquare" value={formValues.foursquare} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-12">
                                                        <TextInput type="text" className="form-control" name="instagram" id="instagram" placeholder="Instagram" value={formValues.instagram} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-12">
                                                        <TextInput type="text" className="form-control" name="linkedin" id="linkedin" placeholder="Linkedin" value={formValues.linkedin} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-12">
                                                        <TextInput type="text" className="form-control" name="skype" id="skype" placeholder="Skype" value={formValues.skype} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-12">
                                                        <TextInput type="text" className="form-control" name="twitter" id="twitter" placeholder="Twitter" value={formValues.twitter} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group mb-3">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <InputLabel className="form-label" value="Stage"/>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <TextInput type="text" className="form-control" name="stage" id="stage" placeholder="Stage" value={formValues.stage} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="form-group mb-3">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <InputLabel className="form-label" value="Contact Owner"/>
                                                        <TextInput type="text" className="form-control" name="contactowner" id="contactowner" placeholder="Contact Owner" value={formValues.contactowner} onChange={handleInputChange}/>
                                                    </div>
                                                    <div id="tagsContainer" className="col-md-6">
                                                    </div>
                                                </div>
                                            </div>
                                            */}
                                                
                                            <div className="form-group mb-3">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                    </div>
                                                    <div className={`${Styles.textAlignRight} col-md-6`}>
                                                        <PrimaryButton type="submit" isLoading={isLoading} className="main_bt">Save</PrimaryButton>
                                                    </div>
                                                </div>
                                            </div>

                                        </form>    
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
);
};

export default newcontact;