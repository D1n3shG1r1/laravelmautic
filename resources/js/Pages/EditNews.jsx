import React, { useState, useRef } from 'react';
import Layout from '@/Layouts/Layout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'react-phone-number-input/style.css';
import Styles from '../../css/Modules/Contacts.module.css';

const EditNews = ({ pageTitle, csrfToken, params }) => {
    const newsData = params.data;
    const formRef = useRef();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        id:newsData.id,
        website: newsData.websiteName || '',
        pageLink: newsData.websiteUrl || '',
        heading: newsData.heading || '',
        subHeading: newsData.subHeading || '',
        body: newsData.selectorData || '',
        author: newsData.author || '',
        publishedOn: newsData.publishDate || '',
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

    const save = () => {
        
        const { id, website, pageLink, heading, subHeading, body, author, publishedOn } = formData;

        if (!website) return showToastMsg(1, 'Enter website name.');
        if (!pageLink) return showToastMsg(1, 'Enter page link.');
        if (!heading) return showToastMsg(1, 'Enter heading.');
        if (!subHeading) return showToastMsg(1, 'Enter subheading.');
        if (!body) return showToastMsg(1, 'Enter body content.');
        if (!author) return showToastMsg(1, 'Enter author name.');
        if (!publishedOn) return showToastMsg(1, 'Enter publish date.');

        setIsLoading(true);

        var url = "news/websiteupdate";
        // Send data to the server (example placeholder)
        const postJson = {
            "_token": csrfToken,
            "id":id,
            "website": website,
            "pageLink": pageLink,
            "heading": heading,
            "subHeading": subHeading,
            "body": body,
            "author":author,
            "publishedOn":publishedOn,
        };
        
        httpRequest(url, postJson, function(resp){
            var C = resp.C;
            var error = resp.M.error;
            var msg = resp.M.message;
            var R = resp.R;
            
            showToastMsg(error, msg);

            if(C == 100 && error == 0){
                
                window.location.href = params.newsUrl;

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
                            </div>
                        </div>
                    </div>
                    <div className="row column1">
                        <div className="col-md-12">
                            <div className="white_shd full margin_bottom_30">
                                <div className="full price_table padding_infor_info">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <form className="profile_contant" ref={formRef}>
                                                <TextInput id="websiteid" type="hidden" value={formData.website}/>
                                                <div className="form-group mb-3">
                                                    <InputLabel htmlFor="website" value="Website" />
                                                    <TextInput id="website" type="text" className="form-control" placeholder="Website" value={formData.website} onChange={handleInputChange} />
                                                </div>

                                                <div className="form-group mb-3">
                                                    <InputLabel htmlFor="pageLink" value="Page Link" />
                                                    <TextInput id="pageLink" type="text" className="form-control" placeholder="Page Link" value={formData.pageLink} onChange={handleInputChange} />
                                                </div>

                                                <div className="form-group mb-3">
                                                    <InputLabel value="Heading" />
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={formData.heading}
                                                        onChange={(event, editor) => handleEditorChange('heading', editor.getData())}
                                                        config={{
                                                            licenseKey: 'GPL',
                                                            toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'underline'],
                                                        }}
                                                    />
                                                </div>

                                                <div className="form-group mb-3">
                                                    <InputLabel value="Sub Heading" />
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={formData.subHeading}
                                                        onChange={(event, editor) => handleEditorChange('subHeading', editor.getData())}
                                                        config={{
                                                            licenseKey: 'GPL',
                                                            toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'underline'],
                                                        }}
                                                    />
                                                </div>

                                                <div className="form-group mb-3">
                                                    <InputLabel value="Content" />
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={formData.body}
                                                        onChange={(event, editor) => handleEditorChange('body', editor.getData())}
                                                        config={{
                                                            licenseKey: 'GPL',
                                                            toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'underline'],
                                                        }}
                                                    />
                                                </div>

                                                <div className="form-group mb-3">
                                                    <InputLabel value="Author" />
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={formData.author}
                                                        onChange={(event, editor) => handleEditorChange('author', editor.getData())}
                                                        config={{
                                                            licenseKey: 'GPL',
                                                            toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'underline'],
                                                        }}
                                                    />
                                                </div>

                                                <div className="form-group mb-3">
                                                    <InputLabel htmlFor="publishedOn" value="Published on" />
                                                    <TextInput id="publishedOn" type="date" className="form-control" value={formData.publishedOn} onChange={handleInputChange} />
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

export default EditNews;
