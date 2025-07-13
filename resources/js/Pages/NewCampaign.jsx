import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/Layouts/Layout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';
import ToggleButton from "@/Components/ToggleButton";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ReactDOM from 'react-dom/client';
import DropdownWithChosen from "@/Components/DropdownWithChosen";
//import { renderComponent } from '@/Components/Utils/renderComponent'; // Import the utility function
import NodeEndpoints from '@/Components/NodeEndpoints';
import DecisionEventHtml from '@/Components/DecisionEventHtml';
import "bootstrap-icons/font/bootstrap-icons.css";
import Styles from "../../css/Modules/Campaigns.module.css";

const newcampaign = ({pageTitle,csrfToken,params}) => {
    
    const jsPlumbInstanceRef = useRef(null);

    const CSRFTOKEN = csrfToken;
    const CAMPAIGN_ID = params.campaignId;
    const segments = params.segments;
    const decisions = params.decisions;
    const actions = params.actions;
    const conditions = params.conditions;
    
    const descriptionMaxLength = 160;
    const [editorData, setEditorData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef();
    
    // States for form values and errors
    const [formValues, setFormValues] = useState({
        title: '',
        fname: '',
        lname: '',
        email: '',
        company: '',
        position: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        mobile: '',
        phone: '',
        points: 0,
        fax: '',
        website: '',
        facebook: '',
        foursquare: '',
        instagram: '',
        linkedin: '',
        skype: '',
        twitter: '',
        stage: '',
        contactowner: '',
        tags: ''
    });

    // Handle form values update
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
        ...formValues,
        [name]: value
        });
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        if (data.length > descriptionMaxLength) {
            // Truncate the string if it exceeds the max length
            const truncatedData = data.slice(0, descriptionMaxLength);
            setEditorData(truncatedData);
            setFormValues((prevValues) => ({
                ...prevValues,
                description: truncatedData // Update description state directly
            }));
        } else {
            setEditorData(data);
            setFormValues((prevValues) => ({
                ...prevValues,
                description: data // Update description state
            }));
        }
    };

    const [toggleValue, setToggleValue] = useState(false);
    const handleToggle = (value) => {
        setToggleValue(value);
    };


    const toggleBuilder = (flag) =>{
      if(flag == 1){
        //launch campaign builder
        document.getElementById("campaign-builder").classList.remove("hide");
      }else{
        //launch campaign builder
        document.getElementById("campaign-builder").classList.add("hide");
      }
      
    }

    const saveCampaign = (event) => {
        
        const minLength = 2;
        const maxLength = 50;
        const validCharacters = /^[A-Za-z0-9\s]+$/; // Only letters, numbers and spaces
        
        
        const campaignname = document.getElementById("campaignname").value;
        const campaigndescription = document.getElementById("campaigndescription").value;
        const active = toggleValue;
        const activateat = document.getElementById("activateat").value;
        const deactivateat = document.getElementById("deactivateat").value;
        
        const sourceNodeStyle = document.getElementById("CampaignEvent_lists").getAttribute("style");

        const eventNodes = document.getElementsByClassName("eventNode").length;
        var nodeStyles = [];

        if(!isRealVal(campaignname)){
          var err = 1;
          var msg = "Campaign Name is required.";
          showToastMsg(err, msg);
          return false;
        }
        
        if(campaignname.length < minLength || campaignname.length > maxLength){
          var err = 1;
          var msg = "Campaign Name must be between 2 and 50 characters long.";
          showToastMsg(err, msg);
          return false;
        }
        
        if(!validCharacters.test(campaignname)){
          var err = 1;
          var msg = "Campaign Name can only contain letters, numbers and spaces.";
          showToastMsg(err, msg);
          return false;
        }
        
        if(!isRealVal(eventNodes) || eventNodes == 0){
          var err = 1;
          var msg = "At least one event is required. Use the Launch Campaign Builder button to add one.";
          showToastMsg(err, msg);
          return false;
        
        }else{

          const eventNodesElms = document.getElementsByClassName("eventNode");
          $.each(eventNodesElms, function(k,elm){
              //dataVals.push(v);
              var nodeId = $(elm).attr("id");
              var styleAttr = $(elm).attr("style");
              var nodeIdParts = nodeId.split("-");
              var eventId = nodeIdParts[1];
              nodeStyles.push({"eventId":eventId, "style":styleAttr});

          });
        }
        
          setIsLoading(true);
          var url = "campaign/save";
          var postJson = {
              "_token":csrfToken,
              "tempId":CAMPAIGN_ID,
              "name":campaignname,
              "description":campaigndescription,
              "active":active,
              "activateat":activateat,
              "deactivateat":deactivateat,
              "sourceNodeStyle":sourceNodeStyle,
              "nodeStyles":nodeStyles
          }

          console.log(postJson);

          httpRequest(url, postJson, function(resp){
            var C = resp.C;
            var error = resp.M.error;
            var msg = resp.M.message;
            var R = resp.R;

            if(C == 100 && error == 0){
                //signup successfull
                showToastMsg(error, msg);
                window.location.href = params.campaignsUrl;

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

    const cancelCampain = () => {
      window.location.href = window.url('campaigns');  
    }
    
    /*campaign Builder Code*/

    useEffect(() => {
        if (window.jQuery) {
          //console.log(params);
          // Initialize jsPlumb instance
          const instance = jsPlumb.getInstance({
              container: document.getElementById("campaign-builder"),
              //container: document.getElementById("CampaignCanvas"),
          });

          jsPlumbInstanceRef.current = instance;
  
          // Initialize the Select2 plugin
          $('#contactSegments').select2({
            placeholder: "Select contact segments",
            allowClear: true,
            width: '100%', // Makes it responsive
            dropdownParent: $('#campaignSourceModal'), // Ensures dropdown is within the modal
          });
    
          // Cleanup function to destroy chosen instances
          return () => {
            instance.reset();
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


    const closeEventPanelGroups = () => {
      
      const CampaignEventPanelElm = document.getElementById("CampaignEventPanel");
      CampaignEventPanelElm.classList.add("hide");

      const CampaignEventPanelGroupsElm = document.getElementById("CampaignEventPanelGroups");
      CampaignEventPanelGroupsElm.classList.add("hide");
    }

    /*Create other Nodes */
    const createNode = (propJson, x, y) => {
        /*Create other Nodes */
        const type = propJson.type;
        const id = propJson.id;
        const parentNodeType = propJson.parentNodeType;
        const parentNodeAnchor = propJson.parentNodeAnchor;
        const parentNodeId = propJson.parentNodeId;
        const eventOrder = propJson.eventOrder;
        const content = propJson.content;
        const dataConnected = propJson.dataConnected;
        
        var classType = 'list-campaign-leadsource';
        if(type == 'decision'){
            classType = 'list-campaign-decision';
        }else if(type == 'action'){
            classType = 'list-campaign-action';
        }else if(type == 'condition'){
            classType = 'list-campaign-condition';
        }else{
            classType = 'list-campaign-leadsource';
        }
        
        //create node div
        const node = document.createElement("div");
        node.id = id;
        node.className = "sourceNode workflow-node draggable list-campaign-source jtk-endpoint-anchor-leadsource CampaignEvent_lists jtk-managed jtk-endpoint-anchor-leadsourceleft jtk-endpoint-anchor-leadsourceright jtk-draggable";
        node.setAttribute("data-type", type);
        node.setAttribute("data-parent-type", parentNodeType);
        node.setAttribute("data-parent-node", parentNodeId);
        node.setAttribute("data-event-order", eventOrder);
        
        node.innerHTML = content;
        node.style.position = "absolute";
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
  
        if(classType != ''){
            node.classList.add(classType);
        }
  
        if (type === 'source') {
          const endpointBottomCenterHolder = document.createElement("div");
          endpointBottomCenterHolder.id = id+'_endpointBottomCenterHolder';
          node.appendChild(endpointBottomCenterHolder);
          //left right endpoints for source node
          /*
          const endpointLeftHolder = document.createElement("div");
          endpointLeftHolder.id = id+'_endpointLeftHolder';
          node.appendChild(endpointLeftHolder);
  
          const endpointRightHolder = document.createElement("div");
          endpointRightHolder.id = id+'_endpointRightHolder';
          node.appendChild(endpointRightHolder); 
          */      
          
        }else if(type === 'decision' || type === 'condition'){
          const endpointTopCenterHolder = document.createElement("div");
          endpointTopCenterHolder.id = id+'_endpointTopCenterHolder';
          node.appendChild(endpointTopCenterHolder);
  
          const endpointBottomLeftHolder = document.createElement("div");
          endpointBottomLeftHolder.id = id+'_endpointBottomLeftHolder';
          node.appendChild(endpointBottomLeftHolder);
  
          const endpointBottomRightHolder = document.createElement("div");
          endpointBottomRightHolder.id = id+'_endpointBottomRightHolder';
          node.appendChild(endpointBottomRightHolder);        
        }else if(type === 'action'){
          const endpointTopCenterHolder = document.createElement("div");
          endpointTopCenterHolder.id = id+'_endpointTopCenterHolder';
          node.appendChild(endpointTopCenterHolder);
  
          const endpointBottomCenterHolder = document.createElement("div");
          endpointBottomCenterHolder.id = id+'_endpointBottomCenterHolder';
          node.appendChild(endpointBottomCenterHolder);
        }
  
        //add circles/buttons/endpoints
        document.getElementById("campaign-builder").appendChild(node);
        if (type === 'source') {
          /*const endpointLeft = <NodeEndpoints nodeType={type} endpointType="left" />;
          const endpointRight = <NodeEndpoints nodeType={type} endpointType="right" />;*/
          const endpointBottomCenter = <NodeEndpoints nodeType={type} endpointType="bottom-center" />;
      
          // Assuming `node` is a DOM element where you want to append these components
          /*const rootLeft = ReactDOM.createRoot(document.getElementById(id+'_endpointLeftHolder'));
          const rootRight = ReactDOM.createRoot(document.getElementById(id+'_endpointRightHolder'));*/
          const rootBottomCenter = ReactDOM.createRoot(document.getElementById(id+'_endpointBottomCenterHolder'));
      
          /*rootLeft.render(endpointLeft);
          rootRight.render(endpointRight);*/
          rootBottomCenter.render(endpointBottomCenter);
      
      }else if (type === 'decision' || type === 'condition') {
          const endpointTopCenter = <NodeEndpoints nodeType={type} endpointType="top-center" />;
          const endpointBottomLeft = <NodeEndpoints nodeType={type} endpointType="bottom-left" />;
          const endpointBottomRight = <NodeEndpoints nodeType={type} endpointType="bottom-right" />;
      
          const rootTopCenter = ReactDOM.createRoot(document.getElementById(id+'_endpointTopCenterHolder'));
          const rootBottomLeft = ReactDOM.createRoot(document.getElementById(id+'_endpointBottomLeftHolder'));
          const rootBottomRight = ReactDOM.createRoot(document.getElementById(id+'_endpointBottomRightHolder'));
        
          rootTopCenter.render(endpointTopCenter);
          rootBottomLeft.render(endpointBottomLeft);
          rootBottomRight.render(endpointBottomRight);
      }else if(type == 'action'){
            
          const endpointTopCenter = <NodeEndpoints nodeType={type} endpointType="top-center" />
          const endpointBottomCenter = <NodeEndpoints nodeType={type} endpointType="bottom-center" />
  
          const rootTopCenter = ReactDOM.createRoot(document.getElementById(id+'_endpointTopCenterHolder'));
          const rootBottomCenter = ReactDOM.createRoot(document.getElementById(id+'_endpointBottomCenterHolder'));
            
          rootTopCenter.render(endpointTopCenter);
          rootBottomCenter.render(endpointBottomCenter);
            
      }
        
       // document.getElementById("campaign-builder").appendChild(node);
  
        // Make the node draggable and connectable
        jsPlumbInstanceRef.current.draggable(node);
        
        // Bottom-Left of source (with 10px margin left)
        
        if(parentNodeType == 'source'){
            //source
            var anchSrcX = 0.56;
        }if(parentNodeType == 'action'){
            //action
            var anchSrcX = 0.56;
        }else{
            //decision or condition
            if(parentNodeAnchor == "yes"){
                var anchSrcX = 0.23; //left anchor
            }else if(parentNodeAnchor == "no"){
                var anchSrcX = 0.88; //right anchor
            }
        }
  
        var anchSrcY = 1;
        var anchSrcXornt = -1;
        var anchSrcYornt = 0;
        var anchSrcXofst = -10;
        var anchSrcYofst = 0;
  
        // Bottom-Right of target (with 10px margin right)
        var anchTrgX = 0.46;
        var anchTrgY = 0.03;
        var anchTrgXornt = 1;
        var anchTrgYornt = 0;
        var anchTrgXofst = 10;
        var anchTrgYofst = 0;
  
        if(type != 'source'){
            
  
          jsPlumbInstanceRef.current.connect(node, {
                source: parentNodeId,
                target: id,
                isSource: true,
                isTarget: true,
                anchor: "Continuous",
                anchors: [
                    [anchSrcX, anchSrcY, anchSrcXornt, anchSrcYornt, anchSrcXofst, anchSrcYofst], 
                    [anchTrgX, anchTrgY, anchTrgXornt, anchTrgYornt, anchTrgXofst, anchTrgYofst],
                ],
                endpoint: ["Dot", { radius: 6 }],
                /*paintStyle: { fill: "#4caf50" },
                connector: ["Bezier", { curviness: 50 }],*/
                connectorStyle: { stroke: "#4caf50", strokeWidth: 2 },
  
                Connector: ["Bezier", { curviness: 50 }], // Smooth curved lines
                PaintStyle: { stroke: "#bbb", strokeWidth: 2 }, // Line color and thickness
                HoverPaintStyle: { stroke: "#999", strokeWidth: 3 }, // Line hover style
                EndpointStyle: { fill: "#bbb", radius: 5 }, // Circle at endpoints
  
                overlays: [
                    [
                        "Arrow",
                        {
                        width: 10,
                        length: 10,
                        location: 0.5, // Arrowhead at the end
                        foldback: 0.8, // Arrowhead style
                        id: "arrow",
                        direction: 1, // Points forward
                        paintStyle: { fill: "#bbb" }, // Arrowhead color
                        },
                    ],
                ],
            });

        }
  
    };
    
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
    const selectEvent = (event, type) => {
        console.log('selectEvent');
        console.log(event);
        const anchor = event.target.dataset.anchor;
        const parentnodeid = event.target.dataset.parentnodeid;
        
        if (!parentnodeid || !anchor) {
            console.error('Missing parentnodeid or anchor data');
            return;
        }
    
        // Get the parent node
        const parentNode = document.getElementById(parentnodeid);
        if (!parentNode) {
            console.error('Parent node not found');
            return;
        }
        
        const parentX = parentNode.style.left;
        const parentY = parentNode.style.top;
    
        type = type.toLowerCase();
    
        // Get all the relevant panels
        const campaignEventPanelGroups = document.getElementById("CampaignEventPanelGroups");
        const campaignEventPanelLists = document.getElementById("CampaignEventPanelLists");
        const campaignEventPanelElm = document.getElementById("CampaignEventPanel");
    
        // Hide all elements initially
        campaignEventPanelGroups.classList.add('hide');
        campaignEventPanelLists.classList.remove('hide');
        campaignEventPanelElm.classList.remove('hide');
    
        // Hide all event list elements
        const eventListElements = document.querySelectorAll('.eventList');
        eventListElements.forEach(element => {
            element.classList.add("hide");
        });
    
        // Helper function to set attributes for lists
        const setEventListAttributes = (listId) => {
            const listElement = document.getElementById(listId);
            if (listElement) {
                listElement.setAttribute("data-parentNodeId", parentnodeid);
                listElement.setAttribute("data-anchor", anchor);
            }
        };
    
        // Conditional logic for event types
        switch (type) {
            case 'source':
                document.getElementById("SourceGroupList").classList.remove('hide');
                break;
            case 'decision':
                document.getElementById("DecisionGroupList").classList.remove('hide');
                setEventListAttributes("DecisionList");
                break;
            case 'action':
                document.getElementById("ActionGroupList").classList.remove('hide');
                setEventListAttributes("ActionList");
                break;
            case 'condition':
                document.getElementById("ConditionGroupList").classList.remove('hide');
                setEventListAttributes("ConditionList");
                break;
            default:
                // Reset all elements if type is invalid
                campaignEventPanelLists.classList.add('hide');
                campaignEventPanelElm.classList.add('hide');
                break;
        }
    };

    const handleSelectChange = (event, value) => {
      const selectedOption = event.target.selectedOptions[0];
      const selectedFunction = selectedOption.getAttribute('data-function');
      
      if (selectedFunction === "selectCampaignSource") {
        selectCampaignSource(event);
      }else if(selectedFunction === "selectDecision"){
        selectDecision(event);
      }
    };

    const contactSourceDropdownOptions = [
      {
        key: "lists",
        title: "Contacts that are members of the selected segments will be automatically added to this campaign.",
        value: "lists",
        label: "Contact Segments",
        function: "selectCampaignSource",
        className: "option_campaignLeadSource_lists",
        id: "campaignLeadSource_lists"
      },
      /* you can add more campaign sources according to you
      {
        key: "forms",
        title: "Contacts created from submissions for the selected forms will be automatically added to this campaign.",
        value: "forms",
        label: "Campaign Forms",
        function: "selectOtherFunction",
        className: "option_campaignLeadSource_forms",
        id: "campaignLeadSource_forms"
      },
      */
    ];

    const actionListDropdownOptions = actions.map((action) => {
      return {
        key: `act_${action.id}`,
        title: action.description,
        value: action.value,
        label: action.title,
        function: "selectDecision",
        eventType:"action",
        parentNodeId:"",
        anchor:"",
        className: `option_campaignEvent_${action.event}`,
        id: `campaignEvent_${action.event}`,
      };
    });
    
    const decisionListDropdownOptions = decisions.map((decision) => {
      return {
        key: `act_${decision.id}`,
        title: decision.description,
        value: decision.value,
        label: decision.title,
        function: "selectDecision",  // You can assign the function if needed, it's currently an empty string
        eventType:"decision",
        parentNodeId:"",
        anchor:"",
        className: `option_campaignEvent_${decision.event}`,
        id: `campaignEvent_${decision.event}`,
      };
    });

    const conditionListDropdownOptions = conditions.map((condition) => {
      return {
        key: `act_${condition.id}`,
        title: condition.description,
        value: condition.value,
        label: condition.title,
        function: "selectDecision",  // You can assign the function if needed, it's currently an empty string
        eventType:"condition",
        parentNodeId:"",
        anchor:"",
        className: `option_campaignEvent_${condition.event}`,
        id: `campaignEvent_${condition.event}`,
      };
    });
    
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

    
    const selectDecision = (event) => {
      
      console.log('selectDecisionevent');
      console.log(event);
 
      // Remove the 'hide' class from the loading-placeholder element
      document.querySelector("#campaignEventModal .loading-placeholder").classList.remove("hide");
      const campaignEventModal = new bootstrap.Modal(document.getElementById('campaignEventModal'));
      campaignEventModal.show();
      
      var targetElmId = event.target.id;
      var eventVal = event.target.value;
      //var eventType = event.target.dataset.eventtype;
      var eventType = event.target.selectedOptions[0].dataset.eventtype;
      const parentNodeAnchor = event.target.dataset.anchor;
      const parentNodeId = event.target.dataset.parentnodeid;
      const parentNode = document.getElementById(parentNodeId);
      const parentNodeType =  parentNode.dataset.type; 
      var parentEventOrder =  parentNode.dataset.eventOrder; 
      var anchor = parentNodeAnchor; //'leadsource'; //leadsource
      var parentEventId = 0; //null or 0
      
      if(parentNodeType == "source"){
          //var anchor = 'leadsource'; //leadsource
          parentEventOrder = 0;
      }else{
          var parentNodeIdParts = parentNodeId.split('-');
          parentEventId = parentNodeIdParts[1]; //numeric part
          //var anchor = ''; //yes/no (parent node Yes/No)
      }
      //parentEventId
      var eventOrder = parseInt(parentEventOrder) + 1;
      var type = eventVal; //event value
      var campaignId = CAMPAIGN_ID;
      var anchorEventType = parentNodeType; //source/condition/action/decision (parent node type)
     
      // Generate a unique string based on the current timestamp
      const tempEventId = `${new Date().getTime()}`; //toISOString(); // ISO format string

      const inputData = {
        "anchor":anchor,
        "type":type,
        "eventType":eventType,
        "anchorEventType":anchorEventType,
        "parentEventId":parentEventId,
        "eventOrder":eventOrder,
        "campaignId":campaignId,
        "tempEventId":tempEventId,
        "csrftoken":CSRFTOKEN
      };

      console.log('inputDatad:');
      console.log(inputData);

      const  DecisionEventHtmlObj = <DecisionEventHtml eventVal={eventVal} inputData={inputData} jsPlumbInstanceRef={jsPlumbInstanceRef}/>
      const eventModalBodyContent = ReactDOM.createRoot(document.getElementById('event-modal-body-content'));
      eventModalBodyContent.render(DecisionEventHtmlObj);
      
      document.querySelector("#campaignEventModal .loading-placeholder").classList.add("hide");

      const ElmObj = document.getElementById(targetElmId);
      ElmObj.value = '';
      var updateEvent = new Event('chosen:updated');
      ElmObj.dispatchEvent(updateEvent);

      const eventListElements = document.querySelectorAll('.eventList');
      eventListElements.forEach(element => {
          element.classList.add("hide");
      });

      document.getElementById("CampaignEventPanelLists").classList.add("hide");
      document.getElementById("CampaignEventPanel").classList.add("hide");
      
    };

  const closeActionGroupList = () => {
    const eventListElements = document.querySelectorAll('.eventList');
    eventListElements.forEach(element => {
        element.classList.add("hide");
    });

    document.getElementById("CampaignEventPanelLists").classList.add("hide");
    document.getElementById("CampaignEventPanel").classList.add("hide");
  };

  const closeDecisionGroupList = () => {
    const eventListElements = document.querySelectorAll('.eventList');
    eventListElements.forEach(element => {
        element.classList.add("hide");
    });

    document.getElementById("CampaignEventPanelLists").classList.add("hide");
    document.getElementById("CampaignEventPanel").classList.add("hide");
  };

  const closeConditionGroupList = () => {
    const eventListElements = document.querySelectorAll('.eventList');
    eventListElements.forEach(element => {
        element.classList.add("hide");
    });

    document.getElementById("CampaignEventPanelLists").classList.add("hide");
    document.getElementById("CampaignEventPanel").classList.add("hide");
  };
  
   

  const closeEventListModal = (targetElmId, targetElmParentId) =>{
   
     //hide event dropdown list
      var ElmGroupList = document.getElementById(targetElmParentId);
      ElmGroupList.classList.add('hide');
      ElmGroupList.value = '';
      
      var event = new Event('chosen:updated');
      ElmGroupList.dispatchEvent(event);

      //remove data attributes
      document.getElementById(targetElmId).removeAttribute("data-parentNodeId");
      document.getElementById(targetElmId).removeAttribute("data-anchor");

      const CampaignEventPanelElm = document.getElementById("CampaignEventPanel");
      CampaignEventPanelElm.classList.add('hide');
      
  };
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
                  var nodeContent = '<i class="mr-sm fa fa-list" style="color:#fdb933"></i> '+truncateSegmentsName;
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
                  
                  //create node
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
        $('.modal-backdrop').remove();
        /*var backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove(); // Remove the backdrop div
        }*/
    };


    return (
    <Layout pageTitle={pageTitle}>
        <div className="midde_cont">
            <div className="container-fluid">
                <div className="row column_title">
                    <div className="col-md-12">
                        <div className={`${Styles.marginlrmin40} page_title row`}>
                            <div className="col-md-6">
                                <h2>New Campaign</h2>
                            </div>
                            <div className={`${Styles.textRight} col-md-6`}>
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <PrimaryButton id="builderBtn" type="button" className="btn btn-primary" onClick={() => toggleBuilder(1)}><i className="bi bi-diagram-2"></i> Launch Campaign Builder</PrimaryButton>
                                    
                                    <PrimaryButton type="button" isLoading={isLoading} className="btn btn-primary" onClick={() => saveCampaign()}><i className="bi bi-floppy2-fill"></i> Save</PrimaryButton>
                                    
                                    <PrimaryButton type="button" className="btn btn-primary" onClick={() => cancelCampain()}><i className="bi bi-x"></i> Cancel</PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row column1">
                    <div className="col-md-9">
                    <div className={`${Styles.pdt_5} white_shd full margin_bottom_30`}>
                        <div className={`full price_table padding_infor_info`}>
                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <InputLabel className="form-label" value="Name"/>
                                    <TextInput type="text" className="form-control" name="campaignname" id="campaignname" placeholder="Campaign Name" value={formValues.name} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <InputLabel className="form-label" value="Description"/>
                                    <TextInput type="hidden" className="form-control" name="campaigndescription" id="campaigndescription" placeholder="Description" value={formValues.description} onChange={handleInputChange} />
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={editorData}
                                        onChange={handleEditorChange} 
                                        config={{
                                            licenseKey: 'GPL',
                                            toolbar: [
                                                'undo', 'redo', '|',
                                                'bold', 'italic', 'underline'
                                                ],
                                        }}
                                    />
                                    <div style={{ marginTop: '10px', color: 'gray' }}>{editorData.length} / {descriptionMaxLength} characters</div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className={`${Styles.pdt_5} white_shd full margin_bottom_30`}>
                            <div className={`full price_table padding_infor_info`}>
                            
                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <InputLabel className="form-label" value="Active"/>
                                    <ToggleButton
                                        onToggle={handleToggle} 
                                        onText ={"Yes"}
                                        offText = {"No"}
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <InputLabel className={`form-label ${Styles.required}`} value="Activate at (date)"/>
                                    <TextInput type="date" className="form-control" name="activateat" id="activateat" placeholder="Activate at (date)" value={formValues.activateat} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <InputLabel className={`form-label ${Styles.required}`} value="Deactivate at (date)"/>
                                    <TextInput type="date" className="form-control" name="deactivateat" id="deactivateat" placeholder="Deactivate at (date)" value={formValues.deactivateat} onChange={handleInputChange} />
                                </div>
                            </div>
                            </div>
                            </div>
                            
                        </div>
                </div>
            </div>

        {/** builder html begins **/
        /*http://local.laravelmautic.com/css/custom.css*/
        }
        <div id="campaign-builder" className={`builder campaign-builder live builder-active hide`}>
        
        <div className={`btns-builder btn-group`} role="group">
          {/*<button type="button" className="btn btn-primary btn-apply-builder">Save</button>*/}
          <button type="button" className="btn btn-primary btn-close-campaign-builder" onClick={() => toggleBuilder(0)}>Close Builder</button>
        </div>
        <div id="builder-errors" className={`alert alert-danger`} role="alert" style={{ display: 'none' }}>test</div>
        
        <div id="CampaignEventPanel" className={`hide`}>
          <div id="CampaignEventPanelGroups" className={`groups-enabled-3 hide ${Styles.twoEventsWidth}`}>
            <div className="row">
              <div className="col-md-12 text-right">
                <i className={`hidden-xs bi bi-x fa-lg ${Styles.closeEventPanelGroups}`} onClick={() => closeEventPanelGroups()}></i>
              </div>
            </div>
            <div className="row">
             
              <div className="mr-0 ml-0 pl-xs pr-xs campaign-group-container col-md-4 hide" id="DecisionGroupSelector">
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
              <div className={`mr-0 ml-0 pl-xs pr-xs campaign-group-container col-md-4 ${Styles.eventsWidth}`} id="ActionGroupSelector">
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
                    An action is something executed by SCIP (e.g. send an email).
                  </div>
                  <div className="hidden-xs panel-footer text-center">
                    <button className="actionSlctBtn btn btn-lg btn-default btn-nospin text-primary" data-type="Action" onClick={(e) => selectEvent(e, 'action')}>Select</button>
                  </div>
                </div>
              </div>
              <div className={`mr-0 ml-0 pl-xs pr-xs campaign-group-container col-md-4 ${Styles.eventsWidth}`} id="ConditionGroupSelector">
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
          </div>

          <div id="CampaignEventPanelLists" className="hide">
            <div id="SourceGroupList" className="EventGroupList eventList hide">
              <h4 className="mb-xs">
                <span>Contact Sources</span>
              </h4>
              <DropdownWithChosen
                id="SourceList"
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
                <button onClick={closeActionGroupList} className="pull-right btn btn-xs btn-nospin btn-primary">
                  <i className="fa fa-fw ri-corner-right-up-line"></i>
                </button>
              </h4>
              <DropdownWithChosen
                id="ActionList"
                className="campaign-event-selector"
                data-function="selectDecision"
                options={actionListDropdownOptions}
                onChangeHandler={handleSelectChange}
                placeholder="Select an action"
                data-eventtype="action"
              />
            </div>

            <div id="DecisionGroupList" className="EventGroupList eventList hide">
              <h4 className="mb-xs">
                <span>Decisions</span>
                <button onClick={closeDecisionGroupList} className="pull-right btn btn-xs btn-nospin btn-success">
                  <i className="fa fa-fw ri-corner-right-up-line"></i>
                </button>
              </h4>
              <DropdownWithChosen
                id="DecisionList"
                className="campaign-event-selector"
                data-function="selectDecision"
                options={decisionListDropdownOptions}
                onChangeHandler={handleSelectChange}
                placeholder="Select the decision"
                data-eventtype="decision"
              />
            </div>
            
            <div id="ConditionGroupList" className="EventGroupList eventList hide">
              <h4 className="mb-xs">
                <span>Conditions</span>
                <button onClick={closeConditionGroupList} className="pull-right btn btn-xs btn-nospin btn-danger">
                  <i className="fa fa-fw ri-corner-right-up-line"></i>
                </button>
              </h4>
              <DropdownWithChosen
                id="ConditionList"
                className="campaign-event-selector"
                data-function="selectDecision"
                options={conditionListDropdownOptions}
                onChangeHandler={handleSelectChange}
                placeholder="Select the condition"
                data-eventtype="condition"
              />
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

      <div className="modal fade in" id="campaignSourceModal" tabIndex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel">
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

      <div className="modal fade in" id="campaignEventModal" tabIndex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <div className="loading-placeholder">Loading...</div>
              <div id="event-modal-body-content" className="modal-body-content">

              </div>
            </div>
            
          </div>
        </div>
      </div>
        {/** builder html ends **/}
        </div>
    </Layout>
);
};

export default newcampaign;