import React, {useState, useEffect, useRef } from "react";
import Layout from "@/Layouts/Layout";
import BootstrapModal from "@/Components/BootstrapModal";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import ToggleButton from "@/Components/ToggleButton";
import ConfirmBox from '@/Components/ConfirmBox';
import "bootstrap-icons/font/bootstrap-icons.css";
import Styles from "../../css/Modules/Settings.module.css";

const SettingsComponent = ({ pageTitle, csrfToken, params }) => {
    
    const smtp = params.smtp;
    const usescipsmtp = params.usescipsmtp;
    const mailerDsn = params.mailerDsn;
    const [toggleValue, setToggleValue] = useState(0);
    const toggleState = usescipsmtp ? true : false;
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSave, setIsLoadingSave] = useState(false);

    useEffect(() => {
        
        handleToggle(usescipsmtp);
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltips = [...tooltipTriggerList].map((tooltip) => new bootstrap.Tooltip(tooltip));
    
        return () => {
            tooltips.forEach((tooltip) => tooltip.dispose());
        };
    }, []);
    
    const [activeTab, setActiveTab] = useState("email"); // Default active tab

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };
    
    const [formValuesDNS, setDNSFormValues] = useState({
        brevoapikey:smtp.brevoapikey || "",
        fromname: smtp.fromname || "",
        replytoaddress: smtp.replytoaddress || "",
        fromemailaddress: smtp.fromemailaddress || "",
        emailreturnpath: smtp.emailreturnpath || "",
        dsnscheme: smtp.dsnscheme || "",
        dsnhost: smtp.dsnhost || "",
        dsnport: smtp.dsnport || "",
        dsnpath: smtp.dsnpath || "",
        dsnuser: smtp.dsnuser || "",
        dsnpassword: smtp.dsnpassword || "",
    });
    
    const formRefDNS = useRef();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDNSFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleToggle = (value) => {
        setToggleValue(value);
    };
    
    const save = (event) => {

        event.preventDefault();
        
        const fromname = document.getElementById("fromname").value.trim();
        const fromemailaddress = document.getElementById("fromemailaddress").value.trim();
        const replytoaddress = document.getElementById("replytoaddress").value.trim();
        const brevoapikey = document.getElementById("brevoapikey").value.trim();
        
        /*const emailreturnpath = document.getElementById("emailreturnpath").value.trim();
        const dsnscheme = document.getElementById("dsnscheme").value.trim();
        const dsnhost = document.getElementById("dsnhost").value.trim();
        const dsnport = document.getElementById("dsnport").value.trim();
        const dsnpath = document.getElementById("dsnpath").value.trim();
        const dsnuser = document.getElementById("dsnuser").value.trim();
        const dsnpassword = document.getElementById("dsnpassword").value.trim();*/
        
        
        if(!isRealVal(fromname)){
            var err = 1;
            var msg = "Set the from name for email sent by system.";
            showToastMsg(err, msg);
            return false;
        }


        if(!isRealVal(fromemailaddress)){
            var err = 1;
            var msg = "Set the from email for email sent by system.";
            showToastMsg(err, msg);
            return false;
        }
        
        if((!toggleValue || toggleValue == 0) && !isRealVal(brevoapikey)){
            var err = 1;
            var msg = "Enter the Brevo API key or enable 'Use SCIP Email Service' to send or receive emails, campaigns, and newsletters.";
            showToastMsg(err, msg);
            return false;
        }
        /*
        if(!isRealVal(dsnscheme)){
            var err = 1;
            var msg = "Set the email dsn scheme.";
            showToastMsg(err, msg);
            return false;
        }

        if(!isRealVal(dsnhost)){
            var err = 1;
            var msg = "Set the email dsn host.";
            showToastMsg(err, msg);
            return false;
        }
        
        if(!isRealVal(dsnport)){
            var err = 1;
            var msg = "Set the email dsn port.";
            showToastMsg(err, msg);
            return false;
        }
        
        if(!isRealVal(dsnpath)){
            var err = 1;
            var msg = "Set the email dsn path.";
            showToastMsg(err, msg);
            return false;
        }

        if(!isRealVal(dsnuser)){
            var err = 1;
            var msg = "Set the email dsn user.";
            showToastMsg(err, msg);
            return false;
        }

        if(!isRealVal(dsnpassword)){
            var err = 1;
            var msg = "Set the email dsn dsnpassword.";
            showToastMsg(err, msg);
            return false;
        }*/
        
        setIsLoadingSave(true);

        var url = "emaildsn/update";
        var postJson = {
            "_token":csrfToken,
            "fromname":fromname,
            "fromemailaddress":fromemailaddress,
            "replytoaddress":replytoaddress,
            /*"emailreturnpath":emailreturnpath,
            "dsnscheme":dsnscheme,
            "dsnhost":dsnhost,
            "dsnport":dsnport,
            "dsnpath":dsnpath,
            "dsnuser":dsnuser,
            "dsnpassword":dsnpassword,*/
            "brevoapikey":brevoapikey,
            "toggleValue":toggleValue
        };
        
        httpRequest(url, postJson, function(resp){
            var C = resp.C;
            var msg = resp.M.message;
            var R = resp.R;

            var error = 0;
            if(C == 100){
                error = 0;
            }else{
                error = 1;
            }

            showToastMsg(0, msg);

            setIsLoadingSave(false);
        });
        
    }

    const sendTestEmail = () => {
        // send test mail
        
        setIsLoading(true);

        var url = "emaildsn/sendtestmail";
        var postJson = {
            "_token":csrfToken,
        };
        
        httpRequest(url, postJson, function(resp){
            var C = resp.C;
            
            var error = resp.M.error;
            var msg = resp.M.message;
            var R = resp.R;

            showToastMsg(error, msg);
            
            setIsLoading(false);
        });
    }

    const cancel = () => {
        window.location.href = window.url('settings');
    }

    return (
        <Layout pageTitle={pageTitle}>
            <div className="middle_cont">
                <div className="container-fluid">
                    <div className="row column_title">
                        <div className="col-md-12">
                            <div className="page_title row">
                                <div className="col-md-6">
                                    <h2>Settings</h2>
                                </div>
                                <div className={`${Styles.textRight} col-md-6`}>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row column1">
                        <div className="col-md-12">
                            <div className="full inner_elements white_shd full margin_bottom_30">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="tab_style3">
                                        <div className="tabbar padding_infor_info">
                                            <div className={`${Styles.navBorderRight} ${Styles.minHeight600} col-md-3 nav flex-column nav-pills`} role="tablist" aria-orientation="vertical">
                                                <a
                                                    className={`nav-link ${activeTab === "email" ? "active" : ""}`}
                                                    onClick={() => handleTabChange("email")}
                                                    role="tab"
                                                >
                                                    Email
                                                </a>
                                                <a
                                                    className={`nav-link ${activeTab === "user" ? "active" : ""}`}
                                                    onClick={() => handleTabChange("user")}
                                                    role="tab"
                                                >
                                                    Authentication
                                                </a>
                                            </div>

                    <div className={`${Styles.tabContent} col-md-9`}>
                        <div className={`tab-pane fade ${activeTab === "email" ? "show active" : "hide"}`} role="tabpanel">

                            <div role="tabpanel" className={`tab-pane bdr-w-0 active in`}>

                                <div className="pt-md pr-md pl-md pb-md">
                                    <form ref={formRefDNS}>
                                    <div className={`${Styles.panel} ${Styles.panelPrimary}`}>
                                        <div className={`${Styles.panelHeading}`}>
                                            <h3 className={`${Styles.panelTitle}`}>Mail Send Settings</h3>
                                        </div>
                                        <div className={`${Styles.panelBody}`}>
                                            {/* Mail Send Settings */}
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="row">
                                                        <div className="form-group col-xs-12">

                                                        <InputLabel className="form-label">
                                                        Name to send mail as&nbsp;<i
                                                        className="bi bi-question-circle"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-placement="top"
                                                        title="Set the from name for email sent by system."
                                                        style={{ cursor: "pointer" }}
                                                        ></i>
                                                        </InputLabel>

                                                        <TextInput type="text" className="form-control" name="fromname" id="fromname" placeholder="From Name" value={formValuesDNS.fromname} onChange={handleInputChange} />


                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="form-group col-xs-12">

                                                        <InputLabel className="form-label">
                                                        Reply to address&nbsp;<i
                                                        className="bi bi-question-circle"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-placement="top"
                                                        title="Leave blank to use the from address."
                                                        style={{ cursor: "pointer" }}
                                                        ></i>
                                                        </InputLabel>
                                                        <TextInput type="text" className="form-control" name="replytoaddress" id="replytoaddress" placeholder="Replyto Email Address" value={formValuesDNS.replytoaddress} onChange={handleInputChange} />


                                                        </div>
                                                    </div>
                                                </div>

                                                
                                                <div className="col-md-6">
                                                    <div className="row">
                                                        <div className="form-group col-xs-12">
                                                        <InputLabel className="form-label">
                                                        E-mail address to send mail from&nbsp;<i
                                                        className="bi bi-question-circle"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-placement="top"
                                                        title="Set the from email for email sent by system."
                                                        style={{ cursor: "pointer" }}
                                                        ></i>
                                                        </InputLabel>
                                                        <TextInput type="text" className="form-control" name="fromemailaddress" id="fromemailaddress" placeholder="From Email Address" value={formValuesDNS.fromemailaddress} onChange={handleInputChange} />
                                                        </div>
                                                    </div>
                                                    
                                                    {/*
                                                    <div className="row">
                                                        <div className="form-group col-xs-12">
                                                        <InputLabel className="form-label">
                                                        Custom return path (bounce) address&nbsp;<i
                                                        className="bi bi-question-circle"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-placement="top"
                                                        title="Set a custom return path/bounce email for emails sent from the system. Note that some mail transports, such as Gmail, will not support this."
                                                        style={{ cursor: "pointer" }}
                                                        ></i>
                                                        </InputLabel>
                                                        <TextInput type="text" className="form-control" name="emailreturnpath" id="emailreturnpath" placeholder="Bounce path" value={formValuesDNS.emailreturnpath} onChange={handleInputChange} />
                                                        </div>
                                                    </div>*/}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email DSN Pane*/}
                                    <div className={`${Styles.panel} ${Styles.panelPrimary}`}>
                                        <div className={`${Styles.panelHeading}`}>
                                            <h3 className={`${Styles.panelTitle}`}>Email DSN</h3>
                                        </div>
                                        <div className={`${Styles.panelBody}`}>
                                            {/* Email DSN Settings */}
                                            <div className="config-dsn-container">
                                            
                                            <div className="row mb-3">
                                                <div className="col-md-12">
                                                    <div className="row">
                                                        <div className="form-group col-xs-12">
                                                        
                                                        <InputLabel className="form-label"
                                                        value="Brevo api key"/>
                                                        
                                                        <TextInput type="text" className="form-control" name="brevoapikey" id="brevoapikey" placeholder="brevo Api Key" value={formValuesDNS.brevoapikey} onChange={handleInputChange}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-3 col-md-12 text-center text-secondary">
                                                <div className="col-md-12">OR</div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <InputLabel className="form-label" value="Use SCIP Email Service"/>
                                                    <ToggleButton onToggle={handleToggle} state={toggleState} onText = "Yes" offText="No"/>
                                                </div> 
                                                <div className="col-md-6">
                                                    <div className="form-inline">
                                                        <div className={`${Styles.testContainerWidth} form-group`}>
                                                            <div className="form-control-static ml-10">
                                                                <span className="text-muted">If you don't have an SMTP account, please use the SCIP Email Service to send and receive emails, newsletters, and campaigns.</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>   
                                            </div>
                                            
                          

    <div className="row">
        <div className="col-md-6">
            {/*<div className={`${Styles.testContainerWidth} form-group`}>
                <div className="form-control-static ml-10">
                    <span className="text-muted">Using currently saved DSN:</span>
                        <code>{mailerDsn}</code>
                </div>
            </div>*/}
        </div>

        <div className="col-md-6">
            <div className={`${Styles.configDsnTestContainer}`}>
                <div className="form-inline">
                    <div className="form-group btn-group" role="group">

                        <PrimaryButton id="sendEmailBtn" type="button" isLoading={isLoading} className="btn btn-primary" onClick={sendTestEmail}><i className="bi bi-window-sidebar"></i> Send test email</PrimaryButton>
                    
                        <PrimaryButton type="button" isLoading={isLoadingSave} className="btn btn-primary" onClick={save}><i className="bi bi-floppy2-fill"></i> Save</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    </div>

                                            {/*
                                            <div className="row">
                                                <div className="col-md-6 col-lg-3">
                                                    <div className="row">
                                                        <div className="form-group col-xs-12">
                                                        
                                                        <InputLabel className="form-label"
                                                        value="Scheme"/>
                                                        
                                                        <TextInput type="text" className="form-control" name="dsnscheme" id="dsnscheme" placeholder="Scheme" value={formValuesDNS.dsnscheme} onChange={handleInputChange}/>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-6 col-lg-3">
                                                    <div className="row">
                                                        <div className="form-group col-xs-12">
                                                        
                                                        <InputLabel className="form-label"
                                                        value="Host"/>
                                                        
                                                        <div className={`${Styles.inputGroup}`}>
                                                            <span className={`${Styles.inputGroupAddon} preaddon`}>
                                                                <span>://</span>
                                                            </span>

                                                            <TextInput type="text" className={`${Styles.inputGroupBorder} form-control`} name="dsnhost" id="dsnhost" placeholder="Host" value={formValuesDNS.dsnhost} onChange={handleInputChange}/>

                                                        </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="col-md-6 col-lg-3">
                                                    <div className="row">
                                                        <div className="form-group col-xs-12">
                                                        
                                                        <InputLabel className="form-label"
                                                        value="Port"/>
                                                        
                                                        <div className={`${Styles.inputGroup}`}>
                                                            <span className={`${Styles.inputGroupAddon} preaddon`}>
                                                                <span>:</span>
                                                            </span>

                                                            <TextInput type="text" className={`${Styles.inputGroupBorder} form-control`} name="dsnport" id="dsnport" placeholder="Port" value={formValuesDNS.dsnport} onChange={handleInputChange}/>
                                                        </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-6 col-lg-3">
                                                    <div className="row">
                                                        <div className="form-group col-xs-12">
                                                        
                                                        <InputLabel className="form-label"
                                                        value="Path"/>
                                                        
                                                        <div className={`${Styles.inputGroup}`}>
                                                            <span className={`${Styles.inputGroupAddon} preaddon`}>
                                                                <span>/</span>
                                                            </span>
                                                            <TextInput type="text" className={`${Styles.inputGroupBorder} form-control`} name="dsnpath" id="dsnpath" placeholder="Path" value={formValuesDNS.dsnpath} onChange={handleInputChange}/>
                                                        </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="row">
                                                <div className="col-md-6">
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="row">
                                                            <div className="form-group col-xs-12">
                                                            <InputLabel className="form-label" value="User"/>
                                                                                
                                                            <TextInput type="text" className="form-control" name="dsnuser" id="dsnuser" placeholder="User" value={formValuesDNS.dsnuser} onChange={handleInputChange}/>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className="row">
                                                        <div className="form-group col-xs-12">
                                                                
                                                        <InputLabel className="form-label" value="Password"/>
                                                            
                                                        <div className={`${Styles.inputGroup}`}>
                                                            <span className={`${Styles.inputGroupAddon} preaddon`}>
                                                                <span>:</span>
                                                            </span>
                                                            <TextInput type="text" className={`${Styles.inputGroupBorder} form-control`} name="dsnpassword" id="dsnpassword" placeholder="Password" value={formValuesDNS.dsnpassword} onChange={handleInputChange}/>
                                                        </div>
                                                        </div>
                                                    </div>

                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <InputLabel className="form-label" value="Use SCIP Email Service"/>
                                                        <ToggleButton onToggle={handleToggle} onText = "Yes" offText="No"/>
                                                    </div> 
                                                    <div className="col-md-6">
                                                        <div className="form-inline">
                                                            <div className={`${Styles.testContainerWidth} form-group`}>
                                                                <div className="form-control-static ml-10">
                                                                    <span className="text-muted">If you don't have an SMTP account, please use the SCIP Email Service to send and receive emails, newsletters, and campaigns.</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>   
                                                </div>
                                                </div>

                                        <div className="col-md-6">
                                            <div className="row">
                                            
                                            <div className={`${Styles.configDsnTestContainer}`}>

                                            <div className="form-inline">
                                                <div className="form-group btn-group" role="group">

                        <PrimaryButton id="builderBtn" type="button" isLoading={isLoading} className="btn btn-primary" onClick={sendTestEmail} disabled><i className="bi bi-window-sidebar"></i> Send test email</PrimaryButton>
                    
                        <PrimaryButton type="button" isLoading={isLoading} className="btn btn-primary" onClick={save} disabled><i className="bi bi-floppy2-fill"></i> Save</PrimaryButton>
                    
                    

                                                </div>

                                            <div className={`${Styles.testContainerWidth} form-group`}>
                                                <div className="form-control-static ml-10">
                                                    <span className="text-muted">Using currently saved DSN:</span>
                                                    <code>{mailerDsn}</code>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        </div>


                                            </div>
                                        </div>

                                            </div>
                                            */}


                                            </div>
                                        </div>
                                    </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className={`tab-pane fade ${activeTab === "user" ? "show active" : "hide"}`} role="tabpanel">
                            <p>Add users and their permissions</p>
                        </div>
                        </div>
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

export default SettingsComponent;
