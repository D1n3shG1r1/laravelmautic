import React, { useState, useRef } from 'react';
import Layout from '@/Layouts/Layout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import ToggleButton from "@/Components/ToggleButton";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'react-phone-number-input/style.css';
import Styles from '../../css/Modules/Contacts.module.css';

const NewNews = ({ pageTitle, csrfToken, params }) => {
    const formRef = useRef();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name:'',
        purpose:'',
        websiteLink:'',
        description:'',
        active:'',
    });

    const handleEditorChange = (field, data) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: data,
        }));
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const [toggleValue, setToggleValue] = useState(false);
    const handleToggle = (value) => {
        setToggleValue(value);
    };

    const save = () => {
        const active = toggleValue;
        const { name, purpose, websiteLink, description} = formData;
        
        if (!name) return showToastMsg(1, 'Enter website name.');
        if (!purpose) return showToastMsg(1, 'Enter purpose.');
        if (!websiteLink) return showToastMsg(1, 'Enter page link.');
        //if (!description) return showToastMsg(1, 'Enter description.');
        

        setIsLoading(true);

        var url = "scrap/newwebsitesave";
        // Send data to the server (example placeholder)
        const postJson = {
            "_token": csrfToken,
            "name": name,
            "purpose":purpose,
            "websiteLink":websiteLink,
            "description":description,
            "active":active
        };
        
        httpRequest(url, postJson, function(resp){
            var C = resp.C;
            var error = resp.M.error;
            var msg = resp.M.message;
            var R = resp.R;
            
            showToastMsg(error, msg);

            if(C == 100 && error == 0){
                
               // window.location.href = params.websitesUrl;

            }else{
                showToastMsg(error, msg);
            }
            
            setIsLoading(false);
        });
    };

    return (
        <Layout pageTitle={pageTitle}>
            <style>{`
                #tagsContainer .select2-container .selection {
                    width: 100%;
                }
                #contactTags {
                    width: 100% !important;
                }
            `}</style>
            <div className="midde_cont">
                <div className="container-fluid">
                    <div className="row column_title">
                        <div className="col-md-12">
                            <div className="page_title">
                                <h2>New Website</h2>
                                <p>Add a new website to scrape automatically.</p>
                            </div>
                        </div>
                    </div>
                    <div className="row column1">
                        <div className="col-md-12">
                            <div className="white_shd full margin_bottom_30">
                                <div className="full price_table padding_infor_info">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <form className="profile_contant" ref={formRef} onSubmit={save}>
                                                <div className="form-group mb-3">
                                                    <InputLabel htmlFor="name" value="Name" />
                                                    <TextInput id="name" type="text" className="form-control" placeholder="Name" value={formData.name} onChange={handleInputChange} />
                                                </div>
                                                
                                                <div className="form-group mb-3">
                                                    <InputLabel htmlFor="purpose" value="Purpose" />
                                                    <TextInput id="purpose" type="text" className="form-control" placeholder="Purpose" value={formData.purpose} onChange={handleInputChange} />
                                                </div>
                                                
                                                <div className="form-group mb-3">
                                                    <InputLabel htmlFor="websiteLink" value="Page Link" />
                                                    <TextInput id="websiteLink" type="text" className="form-control" placeholder="Page Link" value={formData.websiteLink} onChange={handleInputChange} />
                                                </div>

                                                <div className="form-group mb-3">
                                                    <InputLabel value="Description" />
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={formData.description}
                                                        onChange={(event, editor) => handleEditorChange('description', editor.getData())}
                                                        config={{
                                                            height: '500px',
                                                            licenseKey: 'GPL',
                                                            toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'underline'],
                                                        }}
                                                    />
                                                </div>

                                                <div className="form-group mb-3">
                                                    <InputLabel className="form-label" value="Active"/>
                                                    <ToggleButton
                                                        onToggle={handleToggle} 
                                                        onText ={"Yes"}
                                                        offText = {"No"}
                                                    />
                                                </div>
                            
                                                <div className="form-group mb-3">
                                                    <div className="row">
                                                        <div className="col-md-6"></div>
                                                        <div className={`${Styles.textAlignRight} col-md-6`}>
                                                            <PrimaryButton type="button" isLoading={isLoading} className="main_bt" onClick={save}>
                                                                Save
                                                            </PrimaryButton>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
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

export default NewNews;
