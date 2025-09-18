import React, { useEffect, useState, useRef } from 'react';
import Layout from '@/Layouts/Layout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import DropdownWithChosen from "@/Components/DropdownWithChosen";
import PrimaryButton from '@/Components/PrimaryButton';
import ToggleButton from "@/Components/ToggleButton";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'react-phone-number-input/style.css';
import Styles from '../../css/Modules/Contacts.module.css';

const NewNews = ({ pageTitle, csrfToken, params }) => {
    const formRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const website = params.website;
    const websitesUrl = params.websitesUrl;

/*id", "name", "purpose", "description", "websitelink", "date_added", "created_by", "created_by_user", "created_by_company", "date_modified", "modified_by", "modified_by_user", "active", "frequency", "monthday", "weekdays"*/

    const [formData, setFormData] = useState({
        id:website.id || 0,
        name:website.name || '',
        purpose:website.purpose || '',
        websiteLink:website.websitelink || '',
        description:website.description || '',
        active:website.active || 0,
        frequency:website.frequency || '',
        monthday:website.monthday || '',
        weekdays:website.weekdays || []
    });

    const frequencyDropdownOptions = [
        {
            key: "daily",
            title: "",
            value: "daily",
            label: "Daily",
            function: "frequencyType",
            className: "frequencyList",
            id: "frq_daily"
        },
        {
            key: "weekly",
            title: "",
            value: "weekly",
            label: "Once a Week",
            function: "frequencyType",
            className: "frequencyList",
            id: "frq_weekly"
        },
        {
            key: "customweekdays",
            title: "",
            value: "customweekdays",
            label: "Custom Weekdays",
            function: "frequencyType",
            className: "frequencyList",
            id: "frq_customweekdays"
        },
        {
            key: "monthly",
            title: "",
            value: "monthly",
            label: "Once a Month",
            function: "frequencyType",
            className: "frequencyList",
            id: "frq_monthly"
        },
    ];

    const dayOfMonthOptions = [];

    for (let i = 1; i <= 31; i++) {
        dayOfMonthOptions.push({
            key: `day_${i}`,
            title: "",
            value: i,
            label: `Day ${i}`,
            function: "dayOfMonth",
            className: "dayList",
            id: `day_${i}`
        });
    }


    const [selectedFrequency, setSelectedFrequency] = useState(formData.frequency);
    const [selectedMonthDay, setSelectedMonthDay] = useState(formData.monthday);
    const [selectedWeekdays, setSelectedWeekdays] = useState(formData.weekdays);
    const [toggleState, setToggleState] = useState(website.active);
    const [toggleValue, setToggleValue] = useState(formData.active);

    const handleSelectChange = (event, value) => {
    
        const selectedOption = event.target.selectedOptions[0];
        const selectedFunction = selectedOption.getAttribute('data-function');
        
        if(selectedFunction === "frequencyType"){
            frequencyType(event);
        }

        if(selectedFunction === "dayOfMonth"){
            dayOfMonth(event);
        }

    };
    
    

    const frequencyType = (event) => {
        
        // Uncheck all other checkboxes
        $("input[name='days[]']").not(event.target).prop('checked', false);
        
        
        const sourceType = event.target.value;
        const optionVal = event.target.selectedOptions[0].value;

        setSelectedFrequency(optionVal); // <-- Track selected frequency
    
        $("#weeklyOptions").addClass("hide");
        $("#monthlyOptions").addClass("hide");

        if(optionVal === "weekly" || optionVal === "customweekdays"){
            $("#weeklyOptions").removeClass("hide");
        }
        
        if(optionVal === "monthly"){
            $("#monthlyOptions").removeClass("hide");
        }
    };

    
    const dayOfMonth = (event) => {
        const selectedValue = event.target.value;
        setSelectedMonthDay(selectedValue);
    };

    useEffect(() => {
        const handler = (e) => {
            if (selectedFrequency === "weekly") {
                // Uncheck all other checkboxes
                $("input[name='days[]']").not(e.target).prop('checked', false);
            }
        };
    
        $("input[name='days[]']").on("change", handler);
    
        // Cleanup
        return () => {
            $("input[name='days[]']").off("change", handler);
        };
    }, [selectedFrequency]);

    
    const handleCheckboxChange = (e) => {
        const value = e.target.value;
    
        // Check frequency type before making changes
        if (selectedFrequency === "weekly") {
            // For weekly, only allow one checkbox to be checked at a time
            setSelectedWeekdays([value]);
        } else if (selectedFrequency === "customweekdays") {
            // For custom weekdays, allow multiple checkboxes to be selected
            setSelectedWeekdays((prevSelected) => {
                if (prevSelected.includes(value)) {
                    // Uncheck the checkbox
                    return prevSelected.filter((day) => day !== value);
                } else {
                    // Check the checkbox
                    return [...prevSelected, value];
                }
            });
        }
    };
    
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

    const handleToggle = (value) => {
        setToggleValue(value);
    };

    const save = () => {

        //name purpose websiteLink description active
        const active = toggleValue;
        const { name, purpose, websiteLink, description} = formData;
        
        if (!name) return showToastMsg(1, 'Enter website name.');
        if (!purpose) return showToastMsg(1, 'Enter purpose.');
        if (!websiteLink) return showToastMsg(1, 'Enter page link.');
        //if (!description) return showToastMsg(1, 'Enter description.');
        
        // Frequency validation
        if (!selectedFrequency) {
            return showToastMsg(1, 'Please select a frequency.');
        }

        // If frequency is weekly or custom weekdays, validate weekdays selection
        if ((selectedFrequency === "weekly" || selectedFrequency === "customweekdays") && selectedWeekdays.length === 0) {
            return showToastMsg(1, 'Please select at least one weekday.');
        }

        // If frequency is monthly, validate the selected month-day
        if (selectedFrequency === "monthly" && !selectedMonthDay) {
            return showToastMsg(1, 'Please select a day of the month.');
        }

        setIsLoading(true);

        var url = "scrapwebsite/update";
        // Send data to the server (example placeholder)
        const postJson = {
            "_token":csrfToken,
            "id":formData.id,
            "name":name,
            "purpose":purpose,
            "websiteLink":websiteLink,
            "description":description,
            "active":active,
            "selectedFrequency": selectedFrequency,  // Add this
            "selectedMonthDay": selectedMonthDay,  // Add this
            "selectedWeekdays": selectedWeekdays,  // Add this
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
                                                    <InputLabel value="Frequency" />
                                                    <DropdownWithChosen
                                                        id="frequency"
                                                        className="campaign-event-selector"
                                                        data-function="selectFrequency"
                                                        options={frequencyDropdownOptions}
                                                        onChangeHandler={handleSelectChange}
                                                        value={selectedFrequency}
                                                        placeholder="Select frequency"/>
                                                </div> 
                                                
                                                <div id="weeklyOptions" className="form-group mb-3 hide">
                                                    <InputLabel htmlFor="weekdays" value="Select Days" />
                                                    
                                                    <div className="row">
                                                    <div className="col-md-2">
                                                        <Checkbox id="day_monday" className="row-check" name="days[]" value="Monday" checked={selectedWeekdays.includes('Monday')} onChange={handleCheckboxChange}/>
                                                        <InputLabel className="mx-2" htmlFor="day_monday" value="Monday" />
                                                    </div>
                                                    
                                                    <div className="col-md-2">
                                                        <Checkbox id="day_tuesday" className="row-check" name="days[]" value="Tuesday" checked={selectedWeekdays.includes('Tuesday')} onChange={handleCheckboxChange}/>
                                                        <InputLabel className="mx-2" htmlFor="day_tuesday" value="Tuesday" />
                                                    </div>

                                                    <div className="col-md-2">    
                                                        <Checkbox id="day_wednesday" className="row-check" name="days[]" value="Wednesday" checked={selectedWeekdays.includes('Wednesday')} onChange={handleCheckboxChange}/>
                                                        <InputLabel className="mx-2" htmlFor="day_wednesday" value="Wednesday" />
                                                    </div>    
                                                    
                                                    <div className="col-md-2">    
                                                        <Checkbox id="day_thursday" className="row-check" name="days[]" value="Thursday" checked={selectedWeekdays.includes('Thursday')} onChange={handleCheckboxChange}/>
                                                        <InputLabel className="mx-2" htmlFor="day_thursday" value="Thursday" />
                                                    </div>

                                                    <div className="col-md-2">    
                                                        <Checkbox id="day_friday" className="row-check" name="days[]" value="Friday" checked={selectedWeekdays.includes('Friday')} onChange={handleCheckboxChange}/>
                                                        <InputLabel className="mx-2" htmlFor="day_friday" value="Friday" />
                                                    </div>   

                                                    <div className="col-md-2">    
                                                        <Checkbox id="day_saturday" className="row-check" name="days[]" value="Saturday" checked={selectedWeekdays.includes('Saturday')} onChange={handleCheckboxChange}/>
                                                        <InputLabel className="mx-2" htmlFor="day_saturday" value="Saturday" />
                                                    </div>

                                                    <div className="col-md-2">    
                                                        <Checkbox id="day_sunday" className="row-check" name="days[]" value="Sunday" checked={selectedWeekdays.includes('Sunday')} onChange={handleCheckboxChange}/>
                                                        <InputLabel className="mx-2" htmlFor="day_sunday" value="Sunday" />
                                                    </div>
                                                    </div>
                                                </div>
                                                
                                                <div id="monthlyOptions" className="form-group mb-3 hide">
                                                    <InputLabel htmlFor="dayOfMonth" value="Day of the Month" />
                                                    <DropdownWithChosen
                                                        id="dayOfMonth"
                                                        className="campaign-event-selector"
                                                        data-function="dayOfMonth"
                                                        options={dayOfMonthOptions}
                                                        onChangeHandler={handleSelectChange}
                                                        value={selectedMonthDay}
                                                        placeholder="Select Day of the Month"/>
                                                </div>
        
                                                <div className="form-group mb-3">
                                                    <InputLabel className="form-label" value="Active"/>
                                                    <ToggleButton
                                                        onToggle={handleToggle} 
                                                        onText ={"Yes"}
                                                        offText = {"No"}
                                                        state={toggleState}
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
