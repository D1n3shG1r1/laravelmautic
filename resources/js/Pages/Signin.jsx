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
    const [showPassword, setShowPassword] = useState(false);

    const formRef = useRef();
    
    // States for form values and errors
    const [formValues, setFormValues] = useState({
        email: '',
        password: ''
    });

    // Handle form values update
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
        ...formValues,
        [name]: value
        });
    };

    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev);
    };

    const signIn = (event) =>{
        event.preventDefault();
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
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
        
        setIsLoading(true);
        
        var url = "signin";
        var postJson = {
            "_token":csrfToken,
            "email":email,
            "password":password
        };
        
        httpRequest(url, postJson, function(resp){
            var C = resp.C;
            var error = resp.M.error;
            var msg = resp.M.message;
            var R = resp.R;

            if(C == 100 && error == 0){
                //signin successfull
                showToastMsg(error, msg);
                window.location.href = params.dashboardUrl;

            }else{
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
                            <form ref={formRef} onSubmit={signIn}>
                                <fieldset>
                                <div className="field">
                                    <InputLabel className={`${Styles.formLabel} label_field`} value="Email Address" />
                                    <TextInput type="email" className={`${Styles.formInput}`} id="email" name="email" placeholder="Email Address" value={formValues.email} onChange={handleInputChange}/>
                                </div>
                                <div className="field">
                                    <InputLabel className={`${Styles.formLabel} label_field`} value="Password" />
                                    <TextInput type={showPassword ? 'text' : 'password'} className={`${Styles.formInput}`} id="password" name="password" placeholder="Password" value={formValues.password} onChange={handleInputChange}/>
                                    
                                    <button type="button" onClick={togglePasswordVisibility} className={`password-toggle-btn ${Styles.passwordToggle}`} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <i className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                    </button>

                                </div>
                                <div className={`field margin_0`}>
                                    <div className={`${Styles.textAlignRight} field margin_0`}>
                                        <NavLink href="signup" className="label_field" >Create an account? → Sign Up</NavLink>
                                        <PrimaryButton type="submit" isLoading={isLoading} className="main_bt">Sign In</PrimaryButton>
                                    </div>
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