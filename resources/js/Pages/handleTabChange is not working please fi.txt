handleTabChange is not working please fix this

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
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("email"); // Default active tab

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };

    const formRef = useRef();
    const [formValues, setFormValues] = useState({
        /*emailData
        is_published name description subject from_address from_name reply_to_address bcc_address use_owner_as_mailer template plain_text custom_html email_type publish_up publish_down*/
        /*subject: emailData.subject || "",
        internalname: emailData.name || "",
        active: emailData.is_published || false,
        activateat: emailData.publish_up || "",
        deactivateat: emailData.publish_down || "",
        fromname: emailData.from_name || "",
        fromaddress: emailData.from_address || "",
        replytoaddress: emailData.reply_to_address || "",
        bccaddress: emailData.bcc_address || "",
        plaintext: emailData.plain_text || "",
        attachments: "",*/
    });
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
        ...formValues,
        [name]: value
        });
    };

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
                                            <div className="col-md-3 nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
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
                        <div className={`tab-pane ${activeTab === "email" ? "show active" : ""}`} role="tabpanel">

                            <div role="tabpanel" className={`tab-pane bdr-w-0 active in`} id="emailconfig">

                                <div className="pt-md pr-md pl-md pb-md">
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
                                                        <TextInput type="text" className="form-control" name="fromname" id="fromname" placeholder="From Name" value={formValues.fromname} onChange={handleInputChange} />


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
                                                        <TextInput type="text" className="form-control" name="replytoaddress" id="replytoaddress" placeholder="Replyto Email Address" value={formValues.fromname} onChange={handleInputChange} />


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
                                                        <TextInput type="text" className="form-control" name="fromemailaddress" id="fromemailaddress" placeholder="From Email Address" value={formValues.fromname} onChange={handleInputChange} />
                                                        </div>
                                                    </div>

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
                                                        <TextInput type="text" className="form-control" name="emailreturnpath" id="emailreturnpath" placeholder="Bounce path" value={formValues.fromname} onChange={handleInputChange} />
                                                        </div>
                                                    </div>
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
                                            <div className="row">
                                                <div className="col-md-6 col-lg-3">
                                                    <div className="row">
                                                        <div className="form-group col-xs-12">
                                                        
                                                        <InputLabel className="form-label"
                                                        value="Scheme"/>
                                                        
                                                        <TextInput type="text" className="form-control" name="dsnscheme" id="dsnscheme" placeholder="Scheme" value={formValues.fromname} onChange={handleInputChange}/>
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

                                                            <TextInput type="text" className={`${Styles.inputGroupBorder} form-control`} name="dsnhost" id="dsnhost" placeholder="Host" value={formValues.fromname} onChange={handleInputChange}/>
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

                                                            <TextInput type="text" className={`${Styles.inputGroupBorder} form-control`} name="dsnport" id="dsnport" placeholder="Port" value={formValues.fromname} onChange={handleInputChange}/>
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
                                                            <TextInput type="text" className={`${Styles.inputGroupBorder} form-control`} name="dsnpath" id="dsnpath" placeholder="Path" value={formValues.fromname} onChange={handleInputChange}/>
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
                                                                                
                                                            <TextInput type="text" className="form-control" name="dsnuser" id="dsnuser" placeholder="User" value={formValues.fromname} onChange={handleInputChange}/>
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
                                                            <TextInput type="text" className={`${Styles.inputGroupBorder} form-control`} name="dsnpassword" id="dsnpassword" placeholder="Password" value={formValues.fromname} onChange={handleInputChange}/>
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
                                                <div className="form-group">

                                                <PrimaryButton type="button" isLoading={isLoading} className="btn btn-primary">Send test email</PrimaryButton>
                                                </div>

                                            <div className={`${Styles.testContainerWidth} form-group`}>
                                                <div className="form-control-static ml-10">
                                                    <span className="text-muted">Using currently saved DSN:</span>
                                                    <code>smtp://5c7439003%40smtp-brevo.comt:SECRET@smtp-relay.brevo.comp:587</code>
                                                </div>
                                            </div>
                                        </div>

                                            
                                            /
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

                        <div className={`tab-pane fade ${activeTab === "user" ? "show active" : ""}`} role="tabpanel">
                            <p>Content for user tab.</p>
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