import React, { useState, useRef, useEffect } from 'react';

import DropdownWithChosen from "@/Components/DropdownWithChosen";
import InputLabel from "@/Components/InputLabel";
import TextInput from '@/Components/TextInput';
//import Dropdown from '@/Components/Dropdown';
//import styles from "../../css/Modules/CampaignBuilder.module.css"; // Import styles from the CSS module


const CampaignBuilder = ({PageTitle,csrfToken,Params}) => {
    console.log(Params);
    const CSRFTOKEN = csrfToken;
    const CAMPAIGN_ID = Params.campaignId;
    const segments = Params.segments;
    const decisions = Params.decisions;
    const actions = Params.actions;
    const conditions = Params.conditions;

    useEffect(() => {
      // Apply chosen.js to all elements with the 'campaign-event-selector' class
      if (window.jQuery) {
        
        // Initialize the Select2 plugin
        $('#contactSegments').select2({
          placeholder: "Select contact segments",
          allowClear: true,
          width: '100%', // Makes it responsive
          dropdownParent: $('#campaignSourceModal'), // Ensures dropdown is within the modal
        });
  
        // Cleanup function to destroy chosen instances
        return () => {
          //$('.campaign-event-selector').chosen('destroy');
          $('#contactSegments').select2('destroy');
        };
      }
    }, []); // Empty dependency array ensures it only runs once when the component mounts
  
    // Prevent modal from closing on backdrop click
    useEffect(() => {
      const handleClickOutside = (event) => {
        // Check if the click is outside any modal content (i.e., the modal backdrop)
        const modalElements = document.querySelectorAll('.modal');
        modalElements.forEach(modalElement => {
          if (event.target === modalElement) {
            event.stopPropagation();
          }
        });
      };
  
      // Add event listener to the document to detect clicks on the backdrop
      document.addEventListener('click', handleClickOutside);
  
      // Cleanup the event listener when the component is unmounted
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, []);
  
    /*Create Add Source Node */
    const createAddSourceNode = () => {
      //show the options to Add-Campaign-Source
        
      const CampaignEventPanelElm = document.getElementById("CampaignEventPanel");
      const parentLeft = 545;
      const left = parentLeft - 150;
      const top = 85;
       
      CampaignEventPanelElm.classList.remove("hide");
      //CampaignEventPanelElm.style.left = left + "" + "px";
      CampaignEventPanelElm.style.top = top + "" + "px";
      //CampaignEventPanelElm.style.width = "500px";
      //CampaignEventPanelElm.style.height = "280px";

      document.getElementById("CampaignEventPanelLists").classList.remove("hide");
      document.getElementById("SourceGroupList").classList.remove("hide");

    };
  
    useEffect(() => {
      // Calling createAddSourceNode when the component mounts
      createAddSourceNode();
    }, []); // Empty dependency array ensures it only runs once when the component mounts
  
    // Select event type
    const [eventType, setEventType] = useState(null);
    const [parentNodeId, setParentNodeId] = useState(null);
    const [anchor, setAnchor] = useState(null);
  
    const selectEvent = (event, type) => {
      const anchorData = event.target.dataset.anchor;
      const parentnodeid = event.target.dataset.parentnodeid;
  
      setParentNodeId(parentnodeid);
      setAnchor(anchorData);
  
      type = type.toLowerCase();
  
      // Set the event type to trigger conditional rendering
      if (['source', 'decision', 'action', 'condition'].includes(type)) {
        setEventType(type);
      } else {
        // Reset state if no valid type is provided
        setEventType(null);
      }
    };

    const handleSelectChange = (event, value) => {
      const selectedOption = event.target.selectedOptions[0];
      const selectedFunction = selectedOption.getAttribute('data-function');

      if (selectedFunction === "selectCampaignSource") {
        selectCampaignSource(event);
      }
    };

    const contactSourceDropdownOptions = [
      {
        title:"Contacts that are members of the selected segments will be automatically added to this campaign.",
        value: "lists",
        label: "Contact Segments",
        function: "selectCampaignSource",
        className:"option_campaignLeadSource_lists",
        id:"campaignLeadSource_lists"
      },
      {
        title:"Contacts created from submissions for the selected forms will be automatically added to this campaign.",
        value: "forms",
        label: "Campaign Forms",
        function: "selectOtherFunction",
        className:"option_campaignLeadSource_forms",
        id:"campaignLeadSource_forms"
      },
    ];

    
    const selectCampaignSource = (event) =>{
      const sourceType = event.target.value;
      const optionVal = event.target.selectedOptions[0].value;
      const optionDataHref = event.target.selectedOptions[0].dataset.href;
      const optionDataTarget = event.target.selectedOptions[0].dataset.target;

      const CampaignEventPanelElm = document.getElementById("CampaignEventPanel");
      CampaignEventPanelElm.classList.add("hide");
      
      document.getElementById("CampaignEventPanelLists").classList.add("hide");
      document.getElementById("SourceGroupList").classList.add("hide");

      //show modal
      const campaignSourceModal = new bootstrap.Modal(document.getElementById('campaignSourceModal'));
      campaignSourceModal.show();
    }

    const addSource = (srcElmId) => {
      // add campaign-source to source-node
      //contactSegments

      const srcElm = document.getElementById(srcElmId);
      const srcVal = srcElm.value;
      //const srcSlctOptArr = srcElm.selectedOptions;
      const srcSlctOptArr = Array.from(srcElm.selectedOptions); // Convert HTMLCollection to an array
      var selectedSegments = [];
      var selectedSegmentsStr = '';

      var selectedSegmentsTxt = [];
      var selectedSegmentsTxtStr = '';

      //console.log(srcElm);
      //console.log(srcVal);
      //console.log(srcSlctOptArr);

      // Loop through selected options and collect their values
      srcSlctOptArr.forEach((v, i) => {
          var tmpOptVal = v.value; // Directly use v (the current option)
          var tmpOptTxt = v.text;
          selectedSegments[i] = tmpOptVal;
          selectedSegmentsTxt[i] = tmpOptTxt;
      });

      if (selectedSegments.length == 0){
          document.getElementById("contactSourceErrMsg").classList.remove("hide");
          document.getElementById("contactSourceErrMsg").classList.add("requiredTxt");
          document.getElementById("contactSegmentsLable").classList.add("requiredTxt");

          const select2Element = document.querySelector("#campaignSourceModal .select2-selection.select2-selection--multiple");
          if (select2Element) {
              select2Element.classList.add("required");
          }

          return false;
      }else{

          // Add and remove classes for elements
          document.getElementById("contactSourceErrMsg").classList.add("hide");
          document.getElementById("contactSourceErrMsg").classList.remove("requiredTxt");
          document.getElementById("contactSegmentsLable").classList.remove("requiredTxt");

          const select2Element = document.querySelector("#campaignSourceModal .select2-selection.select2-selection--multiple");
          if (select2Element) {
              select2Element.classList.remove("required");
          }

          // Join selected segments into strings if there are any
          if (selectedSegments.length > 0) {
              selectedSegmentsStr = selectedSegments.join(",");
              selectedSegmentsTxtStr = selectedSegmentsTxt.join(",");
          }

          
          //add campaign segments    
          var url = 'addcampaignsegment';
          var postJson = {"_token":CSRFTOKEN, "campaignId":CAMPAIGN_ID, "segments":selectedSegmentsStr,"segmentsName":selectedSegmentsTxtStr};
          httpRequest(url, postJson, function(resp){
          
              if(resp.C == 100){
                  const segmentsName = resp.R.segmentsName;
                  var truncateSegmentsName = truncateString(segmentsName, 18);
                  //hide initial source node
                  const newSrcElmNode = document.getElementById("CampaignEvent_newsource");
                  newSrcElmNode.classList.add('hide');

                  // create campaign/contact source
                  var nodeType = 'source';
                  var nodeId = 'CampaignEvent_lists'; //'CampaignEvent_new-'+generateSecureUniqueId();
                  var nodeContent = '<i class="mr-sm fa fa-list"></i> '+truncateSegmentsName;
                  var dataConnected = '';
                  var eventOrder = 0;
                  const propJson = {
                      "type":nodeType,
                      "id":nodeId,
                      "parentNodeId":"",
                      "parentNodeType":"",
                      "eventOrder":eventOrder,
                      "content":nodeContent,
                      "dataConnected":dataConnected
                  };

                  const x = 545;
                  const y = 50;
                  createNode(propJson, x, y);

                  //close source list modal
                  const action = 'add';
                  const modalId = 'campaignSourceModal';
                  closeModal(action,modalId);
              }
          });
      }
    };

    const closeModal = (action,modalId) => {
          
        if(modalId == "campaignSourceModal"){
            
            if(action == 'cancel'){
                
                const contactSourceErrMsgElm = document.getElementById("contactSourceErrMsg");
                contactSourceErrMsgElm.classList.add("hide");
                contactSourceErrMsgElm.classList.remove("requiredTxt");
                const contactSegmentsLableElm = document.getElementById("contactSegmentsLable");
                contactSegmentsLableElm.classList.remove("requiredTxt");

                const CampaignEventPanelElm = document.getElementById("CampaignEventPanel");
                CampaignEventPanelElm.classList.remove("hide");
                document.getElementById("CampaignEventPanelLists").classList.remove("hide");
                document.getElementById("SourceGroupList").classList.remove("hide");
                const SourceList = document.getElementById("SourceList");
                SourceList.value = '';
                
                const event = new Event('chosen:updated');
                SourceList.dispatchEvent(event);
                
            }else if(action == 'add'){
                
                const CampaignEventPanelElm = document.getElementById("CampaignEventPanel");
                CampaignEventPanelElm.classList.add("hide");
                
                document.getElementById("CampaignEventPanelLists").classList.add("hide");
                document.getElementById("SourceGroupList").classList.add("hide");
                const SourceList = document.getElementById("SourceList");
                SourceList.value = '';
                
                const event = new Event('chosen:updated');
                SourceList.dispatchEvent(event);
            }

        }else if(modalId == "campaignEventModal"){
            
            if(action == 'cancel'){
                var DecisionList = document.getElementById("DecisionList");
                DecisionList.value = '';
                var event = new Event('chosen:updated');
                DecisionList.dispatchEvent(event);

                var ConditionList = document.getElementById("ConditionList");
                ConditionList.value = '';
                var event = new Event('chosen:updated');
                ConditionList.dispatchEvent(event);

                var ActionList = document.getElementById("ActionList");
                ActionList.value = '';
                var event = new Event('chosen:updated');
                ActionList.dispatchEvent(event);

            }else if(action == 'add'){
                var DecisionList = document.getElementById("DecisionList");
                DecisionList.value = '';
                var event = new Event('chosen:updated');
                DecisionList.dispatchEvent(event);

                var ConditionList = document.getElementById("ConditionList");
                ConditionList.value = '';
                var event = new Event('chosen:updated');
                ConditionList.dispatchEvent(event);

                var ActionList = document.getElementById("ActionList");
                ActionList.value = '';
                var event = new Event('chosen:updated');
                ActionList.dispatchEvent(event);
            }

            $("#campaignEventModal .loading-placeholder").removeClass("hide");
            $("#campaignEventModal #event-modal-body-content").html("");
        }

        $('#'+modalId).modal('hide');
    };

  return (
    <div>
      <div id="campaign-builder" className="builder campaign-builder live builder-active" style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}>
        
        <div className="btns-builder">
          <button type="button" className="btn btn-primary btn-apply-builder">Save</button>
          <button type="button" className="btn btn-primary btn-close-campaign-builder">Close Builder</button>
        </div>
        <div id="builder-errors" className="alert alert-danger" role="alert" style={{ display: 'none' }}>test</div>

        <div id="CampaignEventPanel" className="hide">
          <div id="CampaignEventPanelGroups" className="groups-enabled-3 hide">
            <div className="row">
              <div className="mr-0 ml-0 pl-xs pr-xs campaign-group-container col-md-4" id="DecisionGroupSelector">
                <div className="panel panel-success mb-0">
                  <div className="panel-heading">
                    <div className="col-xs-8 col-sm-10 np">
                      <h3 className="panel-title">Decision</h3>
                    </div>
                    <div className="col-xs-4 col-sm-2 pl-0 pr-0 pt-10 pb-10 text-right">
                      <i className="hidden-xs fa fa-random fa-lg"></i>
                      <button className="decisionSlctBtn visible-xs pull-right btn btn-sm btn-default btn-nospin text-success" data-type="Decision" onClick={(e) => selectEvent(e, 'decision')}>Select</button>
                    </div>
                  </div>
                  <div className="panel-body">
                    A decision is made when a contact decides to take action or not (e.g. opened an email).
                  </div>
                  <div className="hidden-xs panel-footer text-center">
                    <button className="decisionSlctBtn btn btn-lg btn-default btn-nospin text-success" data-type="Decision" onClick={(e) => selectEvent(e, 'decision')}>Select</button>
                  </div>
                </div>
              </div>
              <div className="mr-0 ml-0 pl-xs pr-xs campaign-group-container col-md-4" id="ActionGroupSelector">
                <div className="panel panel-primary mb-0">
                  <div className="panel-heading">
                    <div className="col-xs-8 col-sm-10 np">
                      <h3 className="panel-title">Action</h3>
                    </div>
                    <div className="col-xs-4 col-sm-2 pl-0 pr-0 pt-10 pb-10 text-right">
                      <i className="hidden-xs fa fa-bullseye fa-lg"></i>
                      <button className="actionSlctBtn visible-xs pull-right btn btn-sm btn-default btn-nospin text-primary" data-type="Action" onClick={(e) => selectEvent(e, 'action')}>Select</button>
                    </div>
                  </div>
                  <div className="panel-body">
                    An action is something executed by Mautic (e.g. send an email).
                  </div>
                  <div className="hidden-xs panel-footer text-center">
                    <button className="actionSlctBtn btn btn-lg btn-default btn-nospin text-primary" data-type="Action" onClick={(e) => selectEvent(e, 'action')}>Select</button>
                  </div>
                </div>
              </div>
              <div className="mr-0 ml-0 pl-xs pr-xs campaign-group-container col-md-4" id="ConditionGroupSelector">
                <div className="panel panel-danger mb-0">
                  <div className="panel-heading">
                    <div className="col-xs-8 col-sm-10 np">
                      <h3 className="panel-title">Condition</h3>
                    </div>
                    <div className="col-xs-4 col-sm-2 pl-0 pr-0 pt-10 pb-10 text-right">
                      <i className="hidden-xs fa fa-filter fa-lg"></i>
                      <button className="conditionSlctBtn visible-xs pull-right btn btn-sm btn-default btn-nospin text-danger" data-type="Condition" onClick={(e) => selectEvent(e, 'condition')}>Select</button>
                    </div>
                  </div>
                  <div className="panel-body">
                    A condition is based on known profile field values or submitted form data.
                  </div>
                  <div className="hidden-xs panel-footer text-center">
                    <button className="conditionSlctBtn btn btn-lg btn-default btn-nospin" data-type="Condition" onClick={(e) => selectEvent(e, 'condition')}>Select</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="mr-0 ml-0 pl-xs pr-xs campaign-group-container col-md-12">
                <div id="CampaignPasteContainer" className="panel hide">
                  <div id="CampaignPasteDescription" className="panel-body">
                    <div><b>Insert cloned event here</b></div>
                    <div><span className="text-muted">Name: </span><span data-campaign-event-clone="sourceEventName"></span></div>
                    <div><span className="text-muted">From: </span><span data-campaign-event-clone="sourceCampaignName"></span></div>
                  </div>
                  <div className="panel-footer">
                    <a id="EventInsertButton" data-toggle="ajax" data-target="CampaignEvent_" data-ignore-formexit="true" data-method="POST" data-hide-loadingbar="true" href="/s/campaigns/events/insert?campaignId=mautic_312a76bbb3c6d0553fb080987a6e787182db510d&anchor=leadsource&anchorEventType=source" className="btn btn-lg btn-default">Insert</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="CampaignEventPanelLists" className="hide">
            <div id="SourceGroupList" className="EventGroupList eventList hide">
              <h4 className="mb-xs">
                <span>Contact Sources</span>
              </h4>
              <DropdownWithChosen
                id="SourceListd"
                className="campaign-event-selector"
                data-function="selectCampaignSource"
                options={contactSourceDropdownOptions}
                onChangeHandler={handleSelectChange}
                placeholder="Select a source"
              />
            </div>

            <div id="ActionGroupList" className="EventGroupList eventList hide">
              <h4 className="mb-xs">
                <span>Actions</span>
                <button className="pull-right btn btn-xs btn-nospin btn-primary">
                  <i className="fa fa-fw ri-corner-right-up-line"></i>
                </button>
              </h4>
              <select id="ActionList" className="campaign-event-selector" style={{ display: 'none' }} data-eventtype="action" onChange={(e) => selectDecision(e)}>
                <option value=""></option>
                {actions.map((action) => (
                    <option
                    key={`act_${action.id}`}
                    id={`campaignEvent_${action.event}`}
                    className={`option_campaignEvent_${action.event}`}
                    title={action.description}
                    value={action.value}
                    >
                    {action.title}
                    </option>
                ))}
                </select>

            </div>

            <div id="DecisionGroupList" className="EventGroupList eventList hide">
              <h4 className="mb-xs">
                <span>Decisions</span>
                <button className="pull-right btn btn-xs btn-nospin btn-success">
                  <i className="fa fa-fw ri-corner-right-up-line"></i>
                </button>
              </h4>
              <select id="DecisionList" className="campaign-event-selector" style={{ display: 'none' }} data-eventtype="decision" onChange={(e) => selectDecision(e)}>
                <option value=""></option>
                {decisions.map((decision) => (
                    <option
                    key={`desc_${decision.id}`}
                    id={`campaignEvent_${decision.event}`}
                    className={`option_campaignEvent_${decision.event}`}
                    title={decision.description}
                    value={decision.value}
                    >
                    {decision.title}
                    </option>
                ))}
              </select>
            </div>
            
            <div id="ConditionGroupList" className="EventGroupList eventList hide">
              <h4 className="mb-xs">
                <span>Conditions</span>
                <button className="pull-right btn btn-xs btn-nospin btn-danger">
                  <i className="fa fa-fw ri-corner-right-up-line"></i>
                </button>
              </h4>
              <select id="ConditionList" className="campaign-event-selector" style={{ display: 'none' }} data-eventtype="condition" onChange={(e) => selectDecision(e)}>
                <option value=""></option>
                {conditions.map((condition) => (
                    <option
                    key={`cond_${condition.id}`}
                    id={`campaignEvent_${condition.event}`}
                    className={`option_campaignEvent_${condition.event}`}
                    title={condition.description}
                    value={condition.value}
                    >
                    {condition.title}
                    </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        <div className="builder-content" style={{ overflow: 'auto' }}>
          <div id="CampaignCanvas">
            <div id="CampaignEvent_newsource" className="text-center list-campaign-source list-campaign-leadsource" style={{ left: '545px', top: '50px' }}>
              <div className="campaign-event-content">
                <div>
                  <span className="campaign-event-name ellipsis">
                    <i className="mr-sm ri-team-line"></i> Add a contact source...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="modal fade in" id="campaignSourceModal" tabIndex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title" id="contactModalLabel">Contact Source</h3>
              <h6 className="text-muted">Contacts that are members of the selected segments will be automatically added to this campaign.</h6>
            </div>
            <div className="modal-body">
              
                <div className="mb-3">
                  <InputLabel id="contactSegmentsLable" htmlFor="contactSegments" className="form-label" value="Contact segments *"></InputLabel>
                  <select id="contactSegments" multiple="multiple" className="form-select" style={{ width: '100%' }}>
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
                  <div id="contactSourceErrMsg" className="hide">A value is required.</div>
                </div>
              
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => addSource('contactSegments')}>+ Add</button>
              <button type="button" className="btn btn-secondary" onClick={() => closeModal('cancel', 'campaignSourceModal')}>Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade in" id="campaignEventModal" tabIndex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <div className="loading-placeholder">Loading...</div>
              <div id="event-modal-body-content" className="modal-body-content">

              </div>
            </div>
            <div className="modal-footer">
              <div className="modal-form-buttons">
                <button type="button" className="btn btn-default btn-save btn-copy" onClick={() => saveEvent()}> <i className="ri-add-line"></i> Add</button>
                <button type="button" className="btn btn-default btn-cancel btn-copy" onClick={() => cancelEvent()} data-bs-dismiss="modal"><i className="ri-close-line"></i> Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilder;


