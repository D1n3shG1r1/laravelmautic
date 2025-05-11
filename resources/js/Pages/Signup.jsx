import React, { useState, useRef, useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';  // Import the layout component
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';

import Styles from "../../css/Modules/SignInSignUp.module.css"; // Import styles from the CSS module

const SignUpHtml = ({pageTitle,csrfToken,params}) => {
    const [isLoading, setIsLoading] = useState(false);

    const formRef = useRef();
    
    // States for form values and errors
    const [formValues, setFormValues] = useState({
        fname: '',
        lname: '',
        company: '',
        email: '',
        password: '',
        confirmpassword: ''
    });

    // Handle form values update
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
        ...formValues,
        [name]: value
        });
    };

    const signUp = (event) =>{
        event.preventDefault();
        
        const fname = document.getElementById("fname").value;
        const lname = document.getElementById("lname").value;
        const company = document.getElementById("company").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmpassword = document.getElementById("confirmpassword").value;
        
        const fnameObj = validateName(fname);
        const lnameObj = validateName(lname);
        const companyObj = validateName(company);
        const psswdObj = validatePassword(password);
        const cpsswdObj = validatePassword(confirmpassword);
        
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
        
        if(!isRealVal(company)){
            var err = 1;
            var msg = "Company name is required.";
            showToastMsg(err, msg);
            return false;
        }
        
        if(companyObj.Err === 1){
            var err = 1;
            var msg = companyObj.Msg;
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
        
        if(!isRealVal(password)){
            var err = 1;
            var msg = "Password is required.";
            showToastMsg(err, msg);
            return false;
        }
        
        if(psswdObj.Err === 1){
            var err = 1;
            var msg = psswdObj.Msg;
            showToastMsg(err, msg);
            return false;
        }
        
        if(!isRealVal(confirmpassword)){
            var err = 1;
            var msg = "Confirm password is required.";
            showToastMsg(err, msg);
            return false;
        }
        
        if(cpsswdObj.Err === 1){
            var err = 1;
            var msg = cpsswdObj.Msg;
            showToastMsg(err, msg);
            return false;
        }

        setIsLoading(true);
        
        var url = "signup";
        var postJson = {
            "_token":csrfToken,
            "firstName":fname,
            "lastName":lname,
            "company":company,
            "email":email,
            "password":password,
            "password_confirmation":confirmpassword
        };
        
        httpRequest(url, postJson, function(resp){
            var C = resp.C;
            var error = resp.M.error;
            var msg = resp.M.message;
            var R = resp.R;

            if(C == 100 && error == 0){
                //signup successfull
                showToastMsg(error, msg);
                window.location.href = params.signinUrl;

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
        <GuestLayout pageTitle={pageTitle}>
            <div className="full_container">
                <div className="container">
                    <div className="center verticle_center full_height">
                    <div className="login_section">
                        <div className="logo_login">
                            <div className="center">
                                <img width="210" src="images/sciplogo.png" alt="#" />
                            </div>
                        </div>
                        <div className="login_form">
                            <form ref={formRef} onSubmit={signUp}>
                                <fieldset>
                                <div className="field">
                                    <InputLabel className={`${Styles.formLabel} label_field`} value="First Name" />
                                    <TextInput type="text" className={`${Styles.formInput}`} id="fname" name="fname" placeholder="First Name" value={formValues.fname} onChange={handleInputChange}/>
                                </div>
                                <div className="field">
                                    <InputLabel className={`${Styles.formLabel} label_field`} value="Last Name" />
                                    <TextInput type="text" className={`${Styles.formInput}`} id="lname" name="lname" placeholder="Last Name" value={formValues.lname} onChange={handleInputChange}/>
                                </div>
                                <div className="field">
                                    <InputLabel className={`${Styles.formLabel} label_field`} value="Company" />
                                    <TextInput type="text" className={`${Styles.formInput}`} id="company" name="company" placeholder="Company" value={formValues.company} onChange={handleInputChange}/>
                                </div>
                                <div className="field">
                                    <InputLabel className={`${Styles.formLabel} label_field`} value="Email Address" />
                                    <TextInput type="email" className={`${Styles.formInput}`} id="email" name="email" placeholder="Email Address" value={formValues.email} onChange={handleInputChange}/>
                                </div>
                                <div className="field">
                                    <InputLabel className={`${Styles.formLabel} label_field`} value="Password" />
                                    <TextInput type="password" className={`${Styles.formInput}`} id="password" name="password" placeholder="Password" value={formValues.password} onChange={handleInputChange}/>
                                </div>
                                <div className="field">
                                    <InputLabel className={`${Styles.formLabel} label_field`} value="Confirm Password" />
                                    <TextInput type="password" className={`${Styles.formInput}`} id="confirmpassword" name="confirmpassword" placeholder="Confirm Password" value={formValues.confirmpassword} onChange={handleInputChange}/>
                                </div>
                                {/*<div className="field">
                                    <InputLabel className="label_field hidden" value=">hidden label"/>
                                    <InputLabel className="form-check-label">
                                        <Checkbox type="checkbox" className="form-check-input" />
                                        Remember Me
                                    </InputLabel>
                                    <NavLink className="forgot" href="">Forgotten Password?</NavLink>
                                </div>*/}
                                <div className={`${Styles.textAlignRight} field margin_0`}>
                                    <NavLink href="signin" className="label_field" >Already have an account? → Sign In</NavLink>
                                    <PrimaryButton type="submit" isLoading={isLoading} className="main_bt">Sing Up</PrimaryButton>
                                </div>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
};

export default SignUpHtml;