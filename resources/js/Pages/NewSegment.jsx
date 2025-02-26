import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/Layouts/Layout';  // Import the layout component
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';
import DropdownWithChosen from "@/Components/DropdownWithChosen";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Styles from "../../css/Modules/Segments.module.css"; // Import styles from the CSS module

const newcontact = ({pageTitle,csrfToken,params}) => {
    
    const [editorData, setEditorData] = useState('');
    const ckMaxlength = 160;
    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        
        if(data.length >= ckMaxlength){
            setEditorData(data);
        }else{
            setEditorData(data.slice(0, ckMaxlength)); 
        }
        
    };
    
    const [isLoading, setIsLoading] = useState(false);
    
    const formRef = useRef();
    
    // States for form values and errors
    const [formValues, setFormValues] = useState({
        name:'',
        alias:'',
        publicname:'',
    });

    // Handle form values update
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
        ...formValues,
        [name]: value
        });
    };

    const save = (event) => {
        event.preventDefault();

        const minLength = 2;
        const maxLength = 50;
        const validCharacters = /^[A-Za-z0-9\s]+$/; // Only letters, numbers and spaces
    
        const name = document.getElementById("name").value;
        const alias = document.getElementById("fname").value;
        const publicname = document.getElementById("publicname").value;
        

        /*const titleObj = validateTitle(title);
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
        */

        setIsLoading(true);
        
        var url = "segment/save";
        var postJson = {
            "_token":csrfToken,
            
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
    <Layout pageTitle={pageTitle}>
        <div className="midde_cont">
            <div className="container-fluid">
                
                <div className="row column_title">
                    <div className="col-md-12">
                        <div className="page_title">
                            <h2>New Segment</h2>
                        </div>
                    </div>
                </div>
                
                
                
                <div className="row column1">
                    
                    <div className="col-md-9">
                        <div className="white_shd full margin_bottom_30">
                            {/*<div className="full graph_head">
                                <div className="heading1 margin_0">
                                <h2>Tab Bar Style 1</h2>
                                </div>
                            </div>*/}
                            <div className="full inner_elements">
                                <div className="row">
                                <div className="col-md-12">
                                    <div className="tab_style1">
                                        <div className="tabbar padding_infor_info">
                                            <nav>
                                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                <a className="nav-item nav-link active" id="nav-details-tab" data-toggle="tab" href="#nav-details" role="tab" aria-controls="nav-details" aria-selected="true">Details</a>
                                                <a className="nav-item nav-link" id="nav-filters-tab" data-toggle="tab" href="#nav-filters" role="tab" aria-controls="nav-filters" aria-selected="false">Filters</a>
                                                
                                            </div>
                                            </nav>
                                            <div className="tab-content" id="nav-tabContent">
                                            <div className="tab-pane fade show active" id="nav-details" role="tabpanel" aria-labelledby="nav-details-tab">
                                                
                                                <div className="full dis_flex center_text">
                                                    <form className="profile_contant" ref={formRef} onSubmit={save}>
                                                        <div className="form-group mb-3">
                                                            <div className="row mb-3">
                                                                <div className="col-md-6">
                                                                    <InputLabel className="form-label" value="Name"/>
                                                                    <TextInput type="text" className="form-control" name="name" id="name" placeholder="Title" value={formValues.name} onChange={handleInputChange} />
                                                                </div>
                                                                
                                                                <div className="col-md-6">
                                                                    <InputLabel className="form-label" value="Alias"/>
                                                                    <TextInput type="text" className="form-control" name="alias" id="alias" placeholder="Autogenerated" value={formValues.alias} onChange={handleInputChange} />
                                                                </div>
                                                            </div>

                                                            <div className="row mb-3">
                                                                <div className="col-md-6">
                                                                    <InputLabel className="form-label" value="Public name"/>
                                                                    <TextInput type="text" className="form-control" name="publicname" id="publicname" placeholder="Autogenerated" value={formValues.publicname} onChange={handleInputChange} />
                                                                </div>
                                                            </div>
                                                            
                                                            <div row mb-3>
                                                                <div className="col-md-12">
                                                                    <InputLabel className="form-label" value="Description"/>
                                                                    <CKEditor
                                                                        editor={ClassicEditor}
                                                                        data={editorData}
                                                                        onChange={handleEditorChange} // Handle change in CKEditor
                                                                        config={{
                                                                            // If you have a commercial license key, you can add it like this:
                                                                            licenseKey: 'GPL',
                                                                            toolbar: [
                                                                                'undo', 'redo', '|',
                                                                                'bold', 'italic', 'underline'
                                                                              ],  // Specify only the desired toolbar items
                                                                        }}
                                                                    />
                                                                    <div style={{ marginTop: '10px', color: 'gray' }}>{editorData.length} / {ckMaxlength} characters</div>
                                                                </div>
                                                            </div>

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
                                            <div className="tab-pane fade" id="nav-filters" role="tabpanel" aria-labelledby="nav-filters-tab">
                                                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et 
                                                    quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos 
                                                    qui ratione voluptatem sequi nesciunt.
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
                    <div className="col-md-3">
                        <div className="white_shd full margin_bottom_30"></div>
                    </div>

                </div>
            </div>
        </div>
    </Layout>
);
};

export default newcontact;