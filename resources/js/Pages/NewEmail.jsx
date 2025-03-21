import React, {useState, useEffect, useRef } from "react";
import Layout from "@/Layouts/Layout";
import GrapesJSBuilder from "@/Components/GrapesJSBuilder";
import BootstrapModal from "@/Components/BootstrapModal";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import ToggleButton from "@/Components/ToggleButton";
import "bootstrap-icons/font/bootstrap-icons.css";
import Styles from "../../css/Modules/Emails.module.css";

const EmailComponent = ({pageTitle, csrfToken, params}) => {
  const themes = params.themes;

  const blankThumbnail = window.url('themes/blank/thumbnail.png');
  const brienzThumbnail = window.url('themes/brienz/thumbnail.png');
  
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null); // Store the modal instance

  const [isBuilderVisible, setIsBuilderVisible] = useState(false);
  //const applyBuilder = () => {};

  // Handle the changes received from the child component
  const [htmlContent, setHtmlContent] = useState('');
  const [cssContent, setCssContent] = useState('');
  const applyBuilder = (updatedHtmlContent, updatedCssContent) => {
    
    console.log('updatedHtmlContent, updatedCssContent');
    console.log(updatedHtmlContent);
    console.log(updatedCssContent);

    
    setHtmlContent(updatedHtmlContent);
    setCssContent(updatedCssContent);
  };


  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then(() => {
      if (modalRef.current) {
        modalInstanceRef.current = new bootstrap.Modal(modalRef.current);
        modalInstanceRef.current.show();
      }
    });
  }, []);

  const [isListEmail, setIsListEmail] = useState(false);
  const selectEmailType = (type) => {
    console.log("Selected email type:", type);
    setIsListEmail(type);
    // Close the modal programmatically
    if (modalInstanceRef.current) {
      modalInstanceRef.current.hide();
    }
  };

  // State to keep track of the selected theme's key
  const [selectedThemeKey, setSelectedThemeKey] = useState(0);
  const handleTemplateSelect = (theme, key) => {
      setSelectedThemeKey(key); // Set the selected theme key on click
      setSelectedTemplate(theme);
  };

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  useEffect(() => {
      if (themes.length > 0) {
          setSelectedTemplate(themes[0]);
      }
  }, [themes]);


  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    alias: '',
    publicname: '',
    description: ''
  });
  
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
    console.log("Toggle value:", value);
  };

  const save = () => {

  };

  const cancel = () => {
    window.location.href = window.url('emails');
  }

  return (
    <Layout pageTitle={pageTitle}>
      <div className="midde_cont">
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
                    <PrimaryButton type="button" className="btn btn-primary"><i className="bi bi-floppy2-fill"></i> Save</PrimaryButton>
                    <PrimaryButton type="button" className="btn btn-primary" onClick={() => cancel()}><i className="bi bi-x"></i> Cancel</PrimaryButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row column1">
                              
            <div className="col-md-9">
                <form id="segmentForm" className="white_shd full margin_bottom_30" ref={formRef} onSubmit={save} method="post">
                    <div className="full inner_elements">
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
                                            <div className="row mb-3">
                                              
                                            {themes.map((theme, key) => {
                                                const isSelected = key === selectedThemeKey;
                                            return (
                                                <div key={key} className={`col-md-3 ${Styles.themeList}`}>
                                                    <div className={`${Styles.panel} ${Styles.themeListPanel} panel-default theme-selected`}>
                                                        <div className={`${Styles.panelBody} ${Styles.textCenter}`}>
                                                            <h3 className={`${Styles.themeHeading}`}>{theme.name}</h3>
                                                            <a href="#" data-toggle="modal" data-target="#theme-blank">
                                                                <div style={{
                                                                    backgroundImage: `url(${theme.thumbnail})`,
                                                                    backgroundRepeat: "no-repeat",
                                                                    backgroundSize: "contain",
                                                                    backgroundPosition: "center",
                                                                    width: "100%",
                                                                    height: "250px"
                                                                }}></div>
                                                            </a>

                                                            {/* Conditionally apply 'hide' to <a> and <button> based on selected theme */}
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
                                        })}


                                              {/* Blank Theme*/}
                                              {/*<div className={`col-md-3 ${Styles.themeList}`}>
                                                <div className={`${Styles.panel} ${Styles.themeListPanel} panel-default theme-selected`}>
                                                <div className={`${Styles.panelBody} ${Styles.textCenter}`}>
                                                <h3 className={`${Styles.themeHeading}`}>Blank</h3>
                                                <a href="#" data-toggle="modal" data-target="#theme-blank">
                                                    <div style={{backgroundImage: `url(${blankThumbnail})`,backgroundRepeat:"no-repeat",backgroundSize:"contain", backgroundPosition:"center", width: "100%", height: "250px"}}></div>
                                                </a>
                                                <a href="#" type="button" data-theme="blank" className={`${Styles.selectAnchorBtn} ${Styles.selectThemeLink} btn ${Styles.btnDefault} hide`} onClick={() => handleTemplateSelect(templates[0])}>Select</a>
                                                <button type="button" className={`select-theme-selected btn ${Styles.btnDefault}`} disabled="disabled">
                                                    Selected
                                                </button>
                                                </div>
                                                </div>
                                                                    
                                                <div className="modal fade" id="theme-blank" role="dialog" aria-labelledby="blank">
                                                  <div className="modal-dialog" role="document">
                                                        <div className="modal-content">
                                                          <div className="modal-header">
                                                              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                                                              <h4 className="modal-title" id="blank">Blank</h4>
                                                          </div>
                                                          <div className="modal-body">
                                                            <div style={{backgroundImage: `url(${blankThumbnail})`,backgroundRepeat:"no-repeat",backgroundSize:"contain", backgroundPosition:"center", width: "100%", height: "600px"}}></div>
                                                          </div>
                                                        </div>
                                                    </div>
                                                </div>
                                              </div>*/}
                                              {/* Brienz Theme*/}          
                                              {/*<div className={`col-md-3 ${Styles.themeList}`}>
                                                <div className={`${Styles.panel} ${Styles.themeListPanel} panel-default`}>
                                                  <div className={`${Styles.panelBody} ${Styles.textCenter}`}>
                                                    <h3 className={`${Styles.themeHeading}`}>Brienz</h3>
                                                    <a href="#" data-toggle="modal" data-target="#theme-brienz">
                                                    <div 
                                                      style={{
                                                        backgroundImage: `url(${brienzThumbnail})`, 
                                                        backgroundRepeat: "no-repeat",
                                                        backgroundSize: "contain", 
                                                        backgroundPosition: "center",
                                                        width: "100%", 
                                                        height: "250px"
                                                      }}
                                                    ></div>
                                                  </a>

                                                    
                                                    <a href="#" type="button" data-theme="brienz" className={`${Styles.selectAnchorBtn} ${Styles.selectThemeLink} btn ${Styles.btnDefault}`} onClick={() => handleTemplateSelect(templates[1])}>Select</a>

                                                    <button type="button" className={`select-theme-selected btn ${Styles.btnDefault} hide`} disabled="disabled">Selected</button>
                                                    </div>
                                                </div>
                                                                    
                                                <div className="modal fade" id="theme-brienz" role="dialog" aria-labelledby="brienz">
                                                  <div className="modal-dialog" role="document">
                                                    <div className="modal-content">
                                                      <div className="modal-header">
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                                                        <h4 className="modal-title" id="brienz">Brienz</h4>
                                                      </div>
                                                      <div className="modal-body">
                                                          <div style={{backgroundImage: `url(${brienzThumbnail})`, backgroundRepeat:"no-repeat",backgroundSize:"contain", backgroundPosition:"center", width: "100%", height: "600px"}}></div>
                                                      </div>
                                                    </div>
                                                    </div>
                                                </div>
                                              </div>*/}


                                            </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="tab-pane fade" id="advanced" role="tabpanel" aria-labelledby="advanced-tab">
                                      <div className="full dis_flex center_text">
                                        <div className="col-md-6 form-group mb-3">
                                            <div className="row mb-3">
                                                <div className="col-md-12">
                                                  <InputLabel className="form-label" value="From Name"/>
                                                  <TextInput type="text" className="form-control" name="fromname" id="fromname" placeholder="From Name" value={formValues.name} onChange={handleInputChange} />
                                                </div>
                                            </div>
                                            
                                            <div className="row mb-3">
                                                <div className="col-md-12">
                                                  <InputLabel className="form-label" value="From Address"/>
                                                  <TextInput type="text" className="form-control" name="fromaddress" id="fromaddress" placeholder="From Address" value={formValues.name} onChange={handleInputChange} />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-12">
                                                    <InputLabel className="form-label" value="Reply to Address"/>
                                                    <TextInput type="text" className="form-control" name="replytoaddress" id="replytoaddress" placeholder="Reply To Address" value={formValues.name} onChange={handleInputChange} />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-12">
                                                    <InputLabel className="form-label" value="BCC Address"/>
                                                    <TextInput type="text" className="form-control" name="bccaddress" id="bccaddress" placeholder="BCC Address" value={formValues.name} onChange={handleInputChange} />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-12">
                                                    <InputLabel className="form-label" value="Attachments"/>
                                                    <TextInput type="text" className="form-control" name="attachments" id="attachments" placeholder="Attachments" value={formValues.name} onChange={handleInputChange} />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-12">
                                                    <InputLabel className="form-label" value="Plain Text Version"/>
                                                    <textarea className="form-control" name="plaintext" id="plaintext" placeholder="Type your email content" value={formValues.name} onChange={handleInputChange} ></textarea>
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
                </form>
            </div>

            <div className="col-md-3 white_shd">
                
                <form id="segmentForm" className="full margin_bottom_30" ref={formRef} onSubmit={save} method="post">
                <div className={`${Styles.pdt_5} full inner_elements formgroup mb-3`}>
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <InputLabel className="form-label" value="Subject"/>
                      <TextInput type="text" className="form-control" name="subject" id="subject" placeholder="Subject" value={formValues.name} onChange={handleInputChange} />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                      <div className="col-md-12">
                        <InputLabel className="form-label" value="Internal Name"/>
                        <TextInput type="text" className="form-control" name="internalname" id="internalname" placeholder="Internal Name" value={formValues.name} onChange={handleInputChange} />
                      </div>
                  </div>
                  {isListEmail === 'list' && (
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <InputLabel className="form-label" value="Contact Segment" />
                        <TextInput 
                          type="text" 
                          className="form-control" 
                          name="contactsegment" 
                          id="contactsegment" 
                          placeholder="Contact Segment" 
                          value={formValues.name} 
                          onChange={handleInputChange} 
                        />
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
                        <InputLabel className="form-label" value="Activate at (date/time)"/>
                        <TextInput type="text" className="form-control" name="activateat" id="activateat" placeholder="Activate at (date/time)" value={formValues.name} onChange={handleInputChange} />
                      </div>
                  </div>

                  <div className="row mb-3">
                      <div className="col-md-12">
                        <InputLabel className="form-label" value="Deactivate at (date/time)"/>
                        <TextInput type="text" className="form-control" name="deactivateat" id="deactivateat" placeholder="Deactivate at (date/time)" value={formValues.name} onChange={handleInputChange} />
                      </div>
                  </div>
                </div>
                </form>
                
            </div>

          </div>

        </div>

        {/* GrapesJS Builder */}
        {isBuilderVisible && (
        <div className={`${Styles.builderActive}`}>
          <GrapesJSBuilder 
            containerId="grapesjs-container"
            apiUrl="your-api-url"
            isVisible={isBuilderVisible} 
            onClose={() => setIsBuilderVisible(false)} // Handle close from child
            onApply={() => applyBuilder}

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
                <div className={`row ${Styles.panelHeading} ${Styles.panelSuccessHeading}`}>
                  <div className="col-xs-8 col-sm-10 np">
                    <h3 className={`${Styles.panelTitle}`}>Template Email</h3>
                  </div>
                  <div className={`${Styles.textRight} col-xs-4 col-sm-2 pl-0 pr-0 pt-10 pb-10`}>
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
                <PrimaryButton className={`btn ${Styles.textSuccess}`} onClick={() => selectEmailType("template")}>Select</PrimaryButton>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className={`${Styles.panel} ${Styles.panelPrimary}`}>
                <div className={`row ${Styles.panelHeading} ${Styles.panelPrimaryHeading}`}>
                  <div className="col-xs-8 col-sm-10 np">
                    <h3 className={`${Styles.panelTitle}`}>Segment Email</h3>
                  </div>
                  <div className={`${Styles.textRight} col-xs-4 col-sm-2 pl-0 pr-0 pt-10 pb-10`}>
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
                <PrimaryButton className={`btn ${Styles.textPrimary}`} onClick={() => selectEmailType("list")}>Select</PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </BootstrapModal>
      </div>
    </Layout>
  );
};

export default EmailComponent;