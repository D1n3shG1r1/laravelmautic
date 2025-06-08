import React, {useState, useEffect, useRef } from "react";
import Layout from "@/Layouts/Layout";
import GrapesJSBuilder from "@/Components/GrapesJSBuilder";
import BootstrapModal from "@/Components/BootstrapModal";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import ToggleButton from "@/Components/ToggleButton";
import NewsMasterList from "@/Components/NewsMasterList";
import "bootstrap-icons/font/bootstrap-icons.css";
import Styles from "../../css/Modules/Emails.module.css";

const EmailComponent = ({pageTitle, csrfToken, params}) => {
  const themes = params.themes;
  var newsletterThemes = params.newsletterThemes;
  const segments = params.segments;
  const initializedRef = useRef(false);
  const [isListEmail, setIsListEmail] = useState(false);
  useEffect(() => {
    
    if (window.jQuery) {
      // Initialize Bootstrap tooltips
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach((tooltip) => new bootstrap.Tooltip(tooltip));

      
      if (isListEmail === 'list') {
        // Defer initialization to ensure the DOM has updated
        setTimeout(() => {
          if ($('#contactsegment').length && !initializedRef.current) {
            $('#contactsegment').select2({
              placeholder: "Select contact segments",
              allowClear: true,
              width: '100%',
              dropdownParent: $('#contactsegmentParent'),
            });
            initializedRef.current = true;
          }
        }, 0);
      }
  
      return () => {
        if (initializedRef.current && window.jQuery) {
          $('#contactsegment').select2('destroy');
          initializedRef.current = false;
        }
      };
    }
  }, [isListEmail]);
  
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null); // Store the modal instance

  const [isBuilderVisible, setIsBuilderVisible] = useState(false);
  
  
  // Select Email type modal
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then(() => {
      if (modalRef.current) {
        modalInstanceRef.current = new bootstrap.Modal(modalRef.current);
        modalInstanceRef.current.show();
      }
    });

  }, []);
  
  
  const selectEmailType = (type) => {
    
    // Close the modal programmatically
    if (modalInstanceRef.current) {
      modalInstanceRef.current.hide();
    }

    setIsListEmail(type);
    if(type == 'template'){
      //for campaigns
    }

    if(type == 'list'){
      //for newsletters
      //ask for news-content selection
    }

  };

  // State to keep track of the selected theme's key
  const [selectedThemeKey, setSelectedThemeKey] = useState(0);
  const handleTemplateSelect = (theme, key) => {
      setSelectedThemeKey(key); // Set the selected theme key on click
      setSelectedTemplate(theme);
      setSelectedTemplateName(theme.name);
  };

  const [selectedTemplateName, setSelectedTemplateName] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  useEffect(() => {
      if (themes.length > 0 && isListEmail === 'template') {
          
          setSelectedTemplate(themes[0]);
          setSelectedTemplateName(themes[0].name);
          //if template is not customized
          setHtmlContent(themes[0].html);
          setCssContent(themes[0].css);

      }else if(newsletterThemes.length > 0 && isListEmail === 'list'){
        
          toggleNewsMasterList();
          setSelectedTemplate(newsletterThemes[0]);
          setSelectedTemplateName(newsletterThemes[0].name);
          //if template is not customized
          setHtmlContent(newsletterThemes[0].html);
          setCssContent(newsletterThemes[0].css);

      }
  }, [themes, newsletterThemes, isListEmail]);
  
  // Handle the changes received from the child component
  const [htmlContent, setHtmlContent] = useState('');
  const [cssContent, setCssContent] = useState('');
  const onApply = (data) => {
    //if template is customized and get post-back from builder
    setHtmlContent(data.finalHtmlContent);
    setCssContent(data.cssContent);
  };


  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    subject:'',
    internalname:'',
    active:'',
    activateat:'',
    deactivateat:'',
    fromname:'',
    fromaddress:'',
    replytoaddress:'',
    bccaddress:'',
    plaintext :'',
    attachments:'',
  });
  
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const handleInputChange = (e) => {
        
    const { name, value } = e.target;
    setFormValues({
    ...formValues,
    [name]: value
    });
  };

  const [toggleValue, setToggleValue] = useState(false);

  const handleToggle = (value) => {
    setToggleValue(value);
  };

  const save = (event) => {
    //save email
    event.preventDefault();
    
    const minLength = 2;
    const maxLength = 50;
    const validCharacters = /^[A-Za-z0-9\s]+$/; // Only letters, numbers and spaces
    const emailType = isListEmail; //template(For campaigns) list-(For direct mail segments)
    const isPublish = toggleValue;

    const subject = document.getElementById("subject").value.trim();
    const internalname = document.getElementById("internalname").value.trim();

    var selectedSegments = [];
    
    if(emailType === 'list'){
      
      const contactSegments = document.getElementById("contactsegment");
      
      // Convert HTMLCollection to an array
      const srcSlctOptArr = Array.from(contactSegments.selectedOptions);
      
      // Loop through selected options and collect their values
      srcSlctOptArr.forEach((v, i) => {
        var tmpOptVal = v.value; // Directly use v (the current option)
        var tmpOptTxt = v.text;
        selectedSegments[i] = tmpOptVal;
        
      });

    }
    
    const activateat = document.getElementById("activateat").value;
    const deactivateat = document.getElementById("deactivateat").value;
    const fromname = document.getElementById("fromname").value.trim();
    const fromaddress = document.getElementById("fromaddress").value.trim();
    const replytoaddress = document.getElementById("replytoaddress").value.trim();
    const bccaddress = document.getElementById("bccaddress").value.trim();
    const attachments = document.getElementById("attachments").value;
    const plaintext = document.getElementById("plaintext").value.trim();

    //validate subject and internal-name
    if(!isRealVal(subject)){
        var err = 1;
        var msg = "Subject is required.";
        showToastMsg(err, msg);
        return false;
    }
    
    if(subject.length < minLength){
      var err = 1;
      var msg = "Subject must be atleast "+minLength+" characters long.";
      showToastMsg(err, msg);
      return false;
    }

    if(subject.length > maxLength){
      var err = 1;
      var msg = "Subject must not exceed "+maxLength+" characters long.";
      showToastMsg(err, msg);
      return false;
    }

    if(!validCharacters.test(subject)) {
      var err = 1;
      var msg = "Subject can only contain letters and spaces.";
      showToastMsg(err, msg);
      return false;
    }

    if(!isRealVal(internalname)){
      var err = 1;
      var msg = "Internal name is required.";
      showToastMsg(err, msg);
      return false;
    }
    
    if(internalname.length < minLength){
      var err = 1;
      var msg = "Internal name must be atleast "+minLength+" characters long.";
      showToastMsg(err, msg);
      return false;
    }

    if(internalname.length > maxLength){
      var err = 1;
      var msg = "Internal name must not exceed "+maxLength+" characters long.";
      showToastMsg(err, msg);
      return false;
    }

    if(!validCharacters.test(internalname)) {
      var err = 1;
      var msg = "Internal name can only contain letters and spaces.";
      showToastMsg(err, msg);
      return false;
    }

    if (emailType === 'list' && selectedSegments.length == 0){
      var err = 1;
      var msg = "Select the contact segment to run the campaign.";
      showToastMsg(err, msg);
      return false;
    }

    if(!isRealVal(activateat)){
      var err = 1;
      var msg = "The activation date is required.";
      showToastMsg(err, msg);
      return false;
    }

    if(!isRealVal(deactivateat)){
      var err = 1;
      var msg = "The deactivation date is required.";
      showToastMsg(err, msg);
      return false;
    }
    
    //validate email address
    
    if(isRealVal(fromaddress) && !validateEmail(fromaddress)){
      var err = 1;
      var msg = "Enter valid `From email address`.";
      showToastMsg(err, msg);
      return false;
    }

    if(isRealVal(replytoaddress) && !validateEmail(replytoaddress)){
      var err = 1;
      var msg = "Enter valid `Replyto email address`.";
      showToastMsg(err, msg);
      return false;
    }

    if(isRealVal(bccaddress) && !validateEmail(bccaddress)){
      var err = 1;
      var msg = "Enter valid `bcc email address`.";
      showToastMsg(err, msg);
      return false;
    }

    setIsLoading(true);

    var url = "email/save";
    var postJson = {
      "_token":csrfToken,
      "emailType":isListEmail,
      "templateName":selectedTemplateName,
      "html":htmlContent,
      "css":cssContent,
      "subject":subject,
      "internalname":internalname,
      "isPublish":isPublish,
      "segments":selectedSegments,
      "activateat":activateat,
      "deactivateat":deactivateat,
      "fromname":fromname,
      "fromaddress":fromaddress,
      "replytoaddress":replytoaddress,
      "bccaddress":bccaddress,
      "attachments":attachments,
      "plaintext":plaintext,
    };
    
    httpRequest(url, postJson, function(resp){
        var C = resp.C;
        var error = resp.M.error;
        var msg = resp.M.message;
        var R = resp.R;

        if(C == 100 && error == 0){
            showToastMsg(error, msg);
            window.location.href = params.emailsUrl;

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

  const cancel = () => {
    window.location.href = window.url('emails');
  };

  const [isVisibleNewsList, setIsVisibleNewsList] = useState(false);
  const [newsletterResponse, setNewsletterResponse] = useState(null);
 
  const toggleNewsMasterList = () => {
    setIsVisibleNewsList(!isVisibleNewsList);
  };

  const handleNewsletterResponse = (response) => {
    // Handle the response here
    setNewsletterResponse(response);
    setIsVisibleNewsList(false);  // Hides the component
    
    const key = 0;
    const theme = response.R[key];
    handleTemplateSelect(theme, key);
  };

  // Function to cancel and hide NewsMasterList
  const cancelNewsletter = () => {
    setIsVisibleNewsList(false);  // Hides the component
      window.location.href = window.url('emails');
  };

  return (
    <Layout pageTitle={pageTitle}>
      <div className="midde_cont">
        <form ref={formRef} onSubmit={save} method="post">
        <div className="container-fluid">
          <div className="row column_title">
            <div className="col-md-12">
              <div className="page_title row">
                <div className="col-md-6">
                  <h2>New Email</h2>
                </div>
                <div className={`${Styles.textRight} col-md-6`}>
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <PrimaryButton id="builderBtn" type="button" className="btn btn-primary" onClick={() => setIsBuilderVisible(true)}><i className="bi bi-window-sidebar"></i> Builder</PrimaryButton>
                    
                    <PrimaryButton type="submit" isLoading={isLoading} className="btn btn-primary"><i className="bi bi-floppy2-fill"></i> Save</PrimaryButton>
                    
                    <PrimaryButton type="button" className="btn btn-primary" onClick={() => cancel()}><i className="bi bi-x"></i> Cancel</PrimaryButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row column1">
                              
            <div className="col-md-9">
                <div className="full inner_elements white_shd full margin_bottom_30">
                    <div className="row">
                        <div className="col-md-12">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className={`${Styles.borderRadius} nav-link active`} id="theme-tab" data-bs-toggle="tab" data-bs-target="#theme" type="button" role="tab" aria-controls="theme" aria-selected="true">Theme</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className={`${Styles.borderRadius} nav-link`}  id="advanced-tab" data-bs-toggle="tab" data-bs-target="#advanced" type="button" role="tab" aria-controls="advanced" aria-selected="false">Advanced</button>
                                </li>
                                </ul>
                                <div className="tab-content" id="myTabContent">
                                
                                <div className="tab-pane fade show active" id="theme" role="tabpanel" aria-labelledby="theme-tab">
                                  <div className="full dis_flex center_text">
                                    <div className="col-md-12 form-group mb-3">
                                        <InputLabel className="form-label">
                                            Theme&nbsp;<i className="bi bi-question-circle"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            title="Choose the theme that will give the email it's look and feel. Then use the Builder to fill in the contents. WARNING: Changing the theme after building the email may cause content to not display if the two themes do not use the same slots."
                                            style={{ cursor: "pointer" }}></i>
                                        </InputLabel>
                                        
                                        <div className="row mb-3">
                                        {isListEmail === 'template' ? (
                                          themes.map((theme, key) => {
                                            const isSelected = key === selectedThemeKey;
                                            return (
                                              <div key={key} className={`col-md-3 ${Styles.themeList}`}>
                                                <div className={`${Styles.panel} ${Styles.themeListPanel} panel-default theme-selected`}>
                                                  <div className={`${Styles.panelBody} ${Styles.textCenter}`}>
                                                    <h3 className={`${Styles.themeHeading}`}>{theme.name}</h3>
                                                    <a href="#" data-toggle="modal" data-target="#theme-blank">
                                                      <div
                                                        style={{
                                                          backgroundImage: `url(${theme.thumbnail})`,
                                                          backgroundRepeat: "no-repeat",
                                                          backgroundSize: "contain",
                                                          backgroundPosition: "center",
                                                          width: "100%",
                                                          height: "250px"
                                                        }}
                                                      ></div>
                                                    </a>
                                                    <a
                                                      href="#"
                                                      type="button"
                                                      data-theme="blank"
                                                      className={`${Styles.selectAnchorBtn} ${Styles.selectThemeLink} btn ${Styles.btnDefault} ${isSelected ? 'hide' : ''}`}
                                                      onClick={() => handleTemplateSelect(theme, key)}
                                                    >
                                                      Select
                                                    </a>
                                                    <button
                                                      type="button"
                                                      className={`select-theme-selected btn ${Styles.btnDefault} ${isSelected ? '' : 'hide'}`}
                                                      disabled
                                                    >
                                                      Selected
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })
                                        ) : isListEmail === 'list' ? (
                                          newsletterThemes.map((themeNwsLtr, key) => {
                                            const isSelected = key === selectedThemeKey;
                                            return (
                                              <div key={key} className={`col-md-3 ${Styles.themeList}`}>
                                                <div className={`${Styles.panel} ${Styles.themeListPanel} panel-default theme-selected`}>
                                                  <div className={`${Styles.panelBody} ${Styles.textCenter}`}>
                                                    <h3 className={`${Styles.themeHeading}`}>{themeNwsLtr.name}</h3>
                                                    <a href="#" data-toggle="modal" data-target="#theme-blank">
                                                      <div
                                                        style={{
                                                          backgroundImage: `url(${themeNwsLtr.thumbnail})`,
                                                          backgroundRepeat: "no-repeat",
                                                          backgroundSize: "contain",
                                                          backgroundPosition: "center",
                                                          width: "100%",
                                                          height: "250px"
                                                        }}
                                                      ></div>
                                                    </a>
                                                    <a
                                                      href="#"
                                                      type="button"
                                                      data-theme="blank"
                                                      className={`${Styles.selectAnchorBtn} ${Styles.selectThemeLink} btn ${Styles.btnDefault} ${isSelected ? 'hide' : ''}`}
                                                      onClick={() => handleTemplateSelect(themeNwsLtr, key)}
                                                    >
                                                      Select
                                                    </a>
                                                    <button
                                                      type="button"
                                                      className={`select-theme-selected btn ${Styles.btnDefault} ${isSelected ? '' : 'hide'}`}
                                                      disabled
                                                    >
                                                      Selected
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })
                                        ):(
                                        <div className="col-12">
                                          <p>No themes to display.</p>
                                        </div>
                                      )}
                                      </div>

                                    </div>
                                  </div>
                                </div>
                                
                                <div className="tab-pane fade" id="advanced" role="tabpanel" aria-labelledby="advanced-tab">
                                  <div className="full dis_flex center_text">
                                    <div className="col-md-6 form-group mb-3">
                                        <div className="row mb-3">
                                            <div className="col-md-12">
                                              <InputLabel className="form-label">
                                                From Name&nbsp;<i
                                                className="bi bi-question-circle"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="top"
                                                title="Set the from name for this email. This will default to the system configuration if left blank."
                                                style={{ cursor: "pointer" }}
                                              ></i>
                                              </InputLabel>
                                              <TextInput type="text" className="form-control" name="fromname" id="fromname" placeholder="From Name" value={formValues.fromname} onChange={handleInputChange} />
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-md-12">
                                              <InputLabel className="form-label">
                                                From Address&nbsp;<i
                                                className="bi bi-question-circle"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="top"
                                                title="Set the from address for this email. This will default to the system configuration if left blank."
                                                style={{ cursor: "pointer" }}
                                                ></i>
                                              </InputLabel>
                                              <TextInput type="text" className="form-control" name="fromaddress" id="fromaddress" placeholder="From Address" value={formValues.fromaddress} onChange={handleInputChange} />
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-md-12">
                                                <InputLabel className="form-label">
                                                  Reply to Address&nbsp;<i
                                                  className="bi bi-question-circle"
                                                  data-bs-toggle="tooltip"
                                                  data-bs-placement="top"
                                                  title="Leave blank to use the from address."
                                                  style={{ cursor: "pointer" }}
                                                  ></i>
                                                </InputLabel>
                                                <TextInput type="text" className="form-control" name="replytoaddress" id="replytoaddress" placeholder="Reply To Address" value={formValues.replytoaddress} onChange={handleInputChange} />
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-md-12">
                                                <InputLabel className="form-label">
                                                  BCC address&nbsp;<i
                                                  className="bi bi-question-circle"
                                                  data-bs-toggle="tooltip"
                                                  data-bs-placement="top"
                                                  title="Set a BCC address to receive a copy of every email sent."
                                                  style={{ cursor: "pointer" }}
                                                  ></i>
                                                </InputLabel>
                                                <TextInput type="text" className="form-control" name="bccaddress" id="bccaddress" placeholder="BCC Address" value={formValues.bccaddress} onChange={handleInputChange} />
                                            </div>
                                        </div>

                                        <div className="row mb-3 hide">
                                            <div className="col-md-12">
                                                <InputLabel className="form-label">
                                                  Attachments&nbsp;<i
                                                  className="bi bi-question-circle"
                                                  data-bs-toggle="tooltip"
                                                  data-bs-placement="top"
                                                  title="Attachments are sent as file copy and can’t be tracked. To track downloads, use their link in the email content."
                                                  style={{ cursor: "pointer" }}
                                                  ></i>
                                                </InputLabel>
                                                <TextInput type="text" className="form-control" name="attachments" id="attachments" placeholder="Attachments" value={formValues.attachments} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                          
                                        <div className="row mb-3">
                                            <div className="col-md-12">
                                                <InputLabel className="form-label">
                                                  Plain Text Version&nbsp;<i
                                                  className="bi bi-question-circle"
                                                  data-bs-toggle="tooltip"
                                                  data-bs-placement="top"
                                                  title="Use the Email Builder to customize your email's HTML. If you want a plain text version associated with the email, enter the text below."
                                                  style={{ cursor: "pointer" }}
                                                  ></i>
                                                </InputLabel>
                                                <textarea className="form-control" name="plaintext" id="plaintext" placeholder="Type your email content" value={formValues.plaintext} onChange={handleInputChange} ></textarea>
                                            </div>
                                        </div>
                                      </div>

                                    <div className="col-md-6 form-group mb-3">
                                      {/*Custom Headers*/}
                                    </div>


                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
            </div>

            <div className="col-md-3 white_shd">
              <div className={`${Styles.pdt_5} full inner_elements formgroup mb-3 white_shd full margin_bottom_30`}>
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <InputLabel className={`form-label ${Styles.required}`} value="Subject"/>
                      <TextInput type="text" className="form-control" name="subject" id="subject" placeholder="Subject" value={formValues.subject} onChange={handleInputChange} />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                      <div className="col-md-12">
                        <InputLabel className={`form-label ${Styles.required}`} value="Internal Name"/>
                        <TextInput type="text" className="form-control" name="internalname" id="internalname" placeholder="Internal Name" value={formValues.internalname} onChange={handleInputChange} />
                      </div>
                  </div>
                  
                  {isListEmail === 'list' && (
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <InputLabel className={`form-label ${Styles.required}`} value="Contact Segment" />
                        
                        <div id="contactsegmentParent">
                          <select name="contactsegment" 
                          id="contactsegment" multiple="multiple" className="form-select" style={{ width: '100%' }}>
                            {segments.map((segment) => (
                              <option
                              key={`seg_${segment.id}`}
                              id={`campaignSegment_${segment.id}`}
                              title={`${segment.name}(${segment.contacts})`}
                              value={segment.id}>
                                  {`${segment.name}(${segment.contacts})`}
                              </option>
                              ))}
                            </select>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="row mb-3">
                      <div className="col-md-12">
                        <InputLabel className="form-label" value="Available for use"/>
                        <ToggleButton onToggle={handleToggle} />
                      </div>
                  </div>

                  <div className="row mb-3">
                      <div className="col-md-12">
                        <InputLabel className={`form-label ${Styles.required}`} value="Activate at (date)"/>
                        <TextInput type="date" className="form-control" name="activateat" id="activateat" placeholder="Activate at (date)" value={formValues.activateat} onChange={handleInputChange} min={today}/>
                      </div>
                  </div>

                  <div className="row mb-3">
                      <div className="col-md-12">
                        <InputLabel className={`form-label ${Styles.required}`} value="Deactivate at (date)"/>
                        <TextInput type="date" className="form-control" name="deactivateat" id="deactivateat" placeholder="Deactivate at (date)" value={formValues.deactivateat} onChange={handleInputChange} min={formValues.activateat || today}/>
                      </div>
                  </div>
                </div>
                
            </div>

          </div>

        </div>
        </form>

        {/* GrapesJS Builder */}
        {isBuilderVisible && (
        <div className={`${Styles.builderActive}`}>
          <GrapesJSBuilder 
            containerId="grapesjs-container"
            apiUrl="your-api-url"
            isVisible={isBuilderVisible} 
            onClose={() => setIsBuilderVisible(false)} // Handle close from child
            onApply={onApply}

            //onContentChange={handleContentChanges}

            template={selectedTemplate}
          />
        </div>
        )}
        
        {/* Select Template type */}
        <BootstrapModal id="exampleModal" title="What type of email do you want to create?" modalRef={modalRef} onCancel={cancel} showFooter={false}>
          <div className="row">
            <div className="col-md-6">
              <div className={`${Styles.panel} ${Styles.panelSuccess}`}>
                <div className={`${Styles.panelHeading} ${Styles.panelSuccessHeading}`}>
                  <div className="col-xs-8 col-sm-10 np">
                    <h3 className={`${Styles.panelTitle}`}>Campaigns</h3>
                  </div>
                  <div className={`${Styles.textRight} col-xs-4 col-sm-2 pl-0 pr-0`}>
                    <i className="fa fa-envelope-o hidden-xs fa-lg"></i>
                    <button
                      className={`${Styles.textPrimary} ${Styles.visibleXS} ${Styles.pullRight} btn btn-sm btn-default btn-nospin`}
                      onClick={() => selectEmailType("template")}
                    >
                      Select
                    </button>
                  </div>
                </div>
                <div className={`${Styles.panelBody}`}>
                  <ul className={`${Styles.dsListGroup} ds-list-check`}>
                    <li className={`${Styles.dsListGroupLi}`}><i className="mr-2 bi bi-check-circle"></i>For campaigns, forms, and triggers</li>
                    <li className={`${Styles.dsListGroupLi}`}><i className="mr-2 bi bi-check-circle"></i>Allows sending multiple times</li>
                    <li className={`${Styles.dsListGroupLi}`}><i className="mr-2 bi bi-check-circle"></i>Suited for transactional use</li>
                    <li className={`${Styles.dsListGroupLi}`}><i className="mr-2 bi bi-check-circle"></i>Based on users' specific actions</li>
                  </ul>
                </div>
                <div className={`${Styles.textCenter} ${Styles.panelFooter} hidden-xs`}>
                <button className={`btn ${Styles.textSuccess}`} onClick={() => selectEmailType("template")}>Select</button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className={`${Styles.panel} ${Styles.panelPrimary}`}>
                <div className={`${Styles.panelHeading} ${Styles.panelPrimaryHeading}`}>
                  <div className="col-xs-8 col-sm-10 np">
                    <h3 className={`${Styles.panelTitle}`}>Newsletters</h3>
                  </div>
                  <div className={`${Styles.textRight} col-xs-4 col-sm-2 pl-0 pr-0`}>
                    <i className="hidden-xs fa fa-pie-chart fa-lg"></i>
                    <button
                      className={`${Styles.textPrimary} ${Styles.visibleXS} ${Styles.pullRight} btn btn-sm btn-default btn-nospin`}
                      onClick={() => selectEmailType("list")}
                    >
                      Select
                    </button>
                  </div>
                </div>
                <div className={`${Styles.panelBody}`}>
                  <ul className={`${Styles.dsListGroup} ds-list-check`}>
                    <li className={`${Styles.dsListGroupLi}`}><i className="mr-2 bi bi-check-circle"></i>For newsletters, offers, updates, etc.</li>
                    <li className={`${Styles.dsListGroupLi}`}><i className="mr-2 bi bi-check-circle"></i>Allows one send per contact</li>
                    <li className={`${Styles.dsListGroupLi}`}><i className="mr-2 bi bi-check-circle"></i>Designed for marketing use</li>
                    <li className={`${Styles.dsListGroupLi}`}><i className="mr-2 bi bi-check-circle"></i>Used in mass email sending</li>
                  </ul>
                </div>
                <div className={`${Styles.textCenter} ${Styles.panelFooter} hidden-xs`}>
                <button className={`btn ${Styles.textPrimary}`} onClick={() => selectEmailType("list")}>Select</button>
                </div>
              </div>
            </div>
          </div>
        </BootstrapModal>

        {/*--- NewsMasterLetter content ---*/}
        {/* Show NewsMasterList only when isVisible is true */}
        {isVisibleNewsList && (
          <NewsMasterList csrfToken={csrfToken}
          cancelNewsletter={cancelNewsletter}
          onCreateNewsletter={handleNewsletterResponse}
          />
        )}
      </div>
    </Layout>
  );
};

export default EmailComponent;