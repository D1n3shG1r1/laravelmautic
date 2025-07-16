import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/Layouts/Layout';
import NavLink from '@/Components/NavLink';
import LinkButton from '@/Components/LinkButton';
import "bootstrap-icons/font/bootstrap-icons.css";
import Styles from "../../css/Modules/Campaigns.module.css";

const campaign = ({pageTitle,csrfToken,params}) => {
    const jsPlumbInstanceRef = useRef(null);

    const campaignsUrl = params.campaignsUrl;
    const campaignId = params.campaignId;
    const campaign = params.campaign;
    const segments = params.segments;
    const events = params.events;
    const decisions = params.decisions;
    const actions = params.actions;
    const conditions = params.conditions;
    const contacts = params.contacts;
    
    const canvasSettings = campaign.canvas_settings;
    
    useEffect(() => {
        
        // Initialize Bootstrap tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach((tooltip) => new bootstrap.Tooltip(tooltip));

        // Initialize jsPlumb instance
        const instance = jsPlumb.getInstance({
            container: document.getElementById("campaign-builder"),
        });

        jsPlumbInstanceRef.current = instance;

        toggleBuilder(0);

        return () => {};
          
    }, []);

    const toggleBuilder = (flag) =>{
    if(flag == 1){
        //launch campaign preview
        document.getElementById("campaign-builder").classList.remove("hide");
        generatePreview();
    }else{
        //hide campaign preview
        document.getElementById("campaign-builder").classList.add("hide");
        document.querySelectorAll('.workflow-node').forEach(el => el.remove());
        setActiveTab("nav-contacts");
    }
    
    }

    const parseStyleString = (styleString) => {
        const styleObj = {};
        const result = {
            position: null,
            left: null,
            top: null
        };
    
        styleString.split(";").forEach(rule => {
            const [key, value] = rule.split(":").map(s => s.trim());
            if (key && value) {
                styleObj[key] = value;
            }
        });
    
        if (styleObj.position) {
            result.position = styleObj.position;
        }
        if (styleObj.left) {
            result.left = parseFloat(styleObj.left);
        }
        if (styleObj.top) {
            result.top = parseFloat(styleObj.top);
        }
    
        return result;
    }
    
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
        var nodeClass = 'sourceNode';
        if(type == 'decision'){
            classType = 'list-campaign-decision';
            nodeClass = 'eventNode';
        }else if(type == 'action'){
            classType = 'list-campaign-action';
            nodeClass = 'eventNode';
        }else if(type == 'condition'){
            classType = 'list-campaign-condition';
            nodeClass = 'eventNode';
        }else{
            classType = 'list-campaign-leadsource';
            nodeClass = 'sourceNode';
        }
        
        //create node div
        const node = document.createElement("div");
        node.id = id;
        node.className = "workflow-node draggable list-campaign-source jtk-endpoint-anchor-leadsource CampaignEvent_lists jtk-managed jtk-endpoint-anchor-leadsourceleft jtk-endpoint-anchor-leadsourceright jtk-draggable";
        node.setAttribute("data-type", type);
        node.setAttribute("data-parent-type", parentNodeType);
        node.setAttribute("data-parent-node", parentNodeId);
        node.setAttribute("data-event-order", eventOrder);
        
        node.innerHTML = content;
        node.style.position = "absolute";
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
  
        if(nodeClass != ''){
            node.classList.add(nodeClass);
        }

        if(classType != ''){
            node.classList.add(classType);
        }
  
        //add circles/buttons/endpoints
        document.getElementById("campaign-builder").appendChild(node);
        
        // Make the node draggable and connectable
        //jsPlumbInstanceRef.current.draggable(node);
        
        // Bottom-Left of source (with 10px margin left)
        var strokeColor = "#d5d4d4";
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
                strokeColor = "#00b49d";
            }else if(parentNodeAnchor == "no"){
                var anchSrcX = 0.88; //right anchor
                strokeColor = "#ffb79f";
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
  
        if (type !== 'source') {
            jsPlumbInstanceRef.current.connect({
                source: parentNodeId,
                target: id,
                anchors: [
                    [anchSrcX, anchSrcY, anchSrcXornt, anchSrcYornt, anchSrcXofst, anchSrcYofst],
                    [anchTrgX, anchTrgY, anchTrgXornt, anchTrgYornt, anchTrgXofst, anchTrgYofst],
                ],
                endpoint: ["Dot", { radius: 6 }],
                paintStyle: { stroke: lineColor, strokeWidth: 2 },
                hoverPaintStyle: { stroke: lineHoverColor, strokeWidth: 3 },
                endpointStyle: { fill: circleColor, radius: 5 },
                connector: ["Bezier", { curviness: 50 }],
                overlays: [
                    [
                        "Arrow",
                        {
                            width: 10,
                            length: 10,
                            location: 0.5,
                            foldback: 0.8,
                            id: "arrow",
                            direction: 1,
                            paintStyle: { fill: arrowColor },
                        },
                    ],
                ],
            });
        }
  
    };

    const createEventNode = (propJson, x, y) => {
        /*Create other Nodes */
        const type = propJson.type;
        const id = propJson.id;
        const parentEventType = propJson.parentEventType;
        const parentEventTypeValue = propJson.parentEventTypeValue;
        const parentNodeType = propJson.parentNodeType;
        const parentNodeAnchor = propJson.parentNodeAnchor;
        const parentNodeId = propJson.parentNodeId;
        const eventOrder = propJson.eventOrder;
        const content = propJson.content;
        const dataConnected = propJson.dataConnected;

        const triggerMode = propJson.triggerMode;
        const triggerDate = propJson.triggerDate;
        const triggerInterval = propJson.triggerInterval;
        const triggerIntervalUnit = propJson.triggerIntervalUnit;
        
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
        node.className = "eventNode workflow-node draggable list-campaign-source jtk-endpoint-anchor-leadsource CampaignEvent_lists jtk-managed jtk-endpoint-anchor-leadsourceleft jtk-endpoint-anchor-leadsourceright jtk-draggable";
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
    
        if(triggerMode == 'interval' || triggerMode == 'date'){
            const intervalNode = document.createElement("span");
            intervalNode.id = id + '-interval';
            if(triggerMode == 'interval'){
              intervalNode.innerText = 'Trigger after '+triggerInterval+' '+triggerIntervalUnit;
            }else{
              intervalNode.innerText = 'Trigger on '+triggerDate;
            }
              
            intervalNode.style.border = '1px solid #fdb933';
            intervalNode.style.top = '-45px';
            intervalNode.style.left = '0';
            intervalNode.style.width = '100%';
            intervalNode.style.borderRadius = '3px';
            intervalNode.style.textAlign = 'center';
            intervalNode.style.boxShadow = '0px 0px 3px rgba(0, 0, 0, 0.2)';
            intervalNode.style.backgroundColor = '#ffffff';
            intervalNode.style.color = '#fdb933';
            intervalNode.style.padding = '0px 5px 0 5px';
            intervalNode.style.position = 'absolute';
            node.appendChild(intervalNode);
        }


        //add circles/buttons/endpoints
        document.getElementById("campaign-builder").appendChild(node);
        
        
        // Make the node draggable and connectable
        //jsPlumbInstanceRef.current.draggable(node);
        
        
        //endpoint connecting line
        // Bottom-Left of source (with 10px margin left)
        var strokeColor = "#d5d4d4";
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
                strokeColor = "#00b49d";
            }else if(parentNodeAnchor == "no"){
                var anchSrcX = 0.88; //right anchor
                strokeColor = "#f86b4f";
            }
        }
        
        
        var lineHoverColor = strokeColor;
        var lineColor = strokeColor;
        var circleColor = strokeColor;
        var arrowColor = strokeColor;

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
    
        if (type !== 'source') {
            jsPlumbInstanceRef.current.connect({
                source: parentNodeId,
                target: id,
                anchors: [
                    [anchSrcX, anchSrcY, anchSrcXornt, anchSrcYornt, anchSrcXofst, anchSrcYofst],
                    [anchTrgX, anchTrgY, anchTrgXornt, anchTrgYornt, anchTrgXofst, anchTrgYofst],
                ],
                endpoint: ["Dot", { radius: 6 }],
                paintStyle: { stroke: lineColor, strokeWidth: 2 },
                hoverPaintStyle: { stroke: lineHoverColor, strokeWidth: 3 },
                endpointStyle: { fill: circleColor, radius: 5 },
                connector: ["Bezier", { curviness: 50 }],
                overlays: [
                    [
                        "Arrow",
                        {
                            width: 10,
                            length: 10,
                            location: 0.5,
                            foldback: 0.8,
                            id: "arrow",
                            direction: 1,
                            paintStyle: { fill: arrowColor },
                        },
                    ],
                ],
            });
        }
        
    };

    const generatePreview = () => {
        
        document.querySelectorAll('.workflow-node').forEach(el => el.remove());

        const positionsObj = parseStyleString(canvasSettings);   
        
        //create source node
        
        const segmentsName = segments.map(segment => segment.name).join(', ');
        var truncateSegmentsName = truncateString(segmentsName, 18);
        
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

        const x = positionsObj.left;
        const y = positionsObj.top;
        
        //create node
        createNode(propJson, x, y);

         // Create event nodes only if there are events
    if (events.length > 0) {
        events.forEach(event => {
            const eventPos = parseStyleString(event.xy_positions);

            let resp_parentEventId;
            if (event.parentEventType === "source") {
                resp_parentEventId = "CampaignEvent_lists";
            } else {
                resp_parentEventId = 'CampaignEvent_new-' + event.parentId;
            }

            const nodeIconMap = {
                decision: '<i class="hidden-xs fa fa-random fa-lg" style="color:#00b49d"></i>',
                action: '<i class="hidden-xs fa fa-bullseye fa-lg" style="color:#9babeb"></i>',
                condition: '<i class="hidden-xs fa fa-filter fa-lg" style="color:#ffb79f"></i>'
            };

            const nodeIcon = nodeIconMap[event.eventType] || '';
            const nodeType = event.eventType;
            const nodeId = 'CampaignEvent_new-' + event.id;
            const nodeContent = nodeIcon + ' ' + event.name; // truncate if needed
            const dataConnected = '';
            const eventOrder = event.eventOrder;

            const propJson = {
                type: nodeType,
                id: nodeId,
                parentNodeId: resp_parentEventId,
                parentNodeType: event.parentEventType,
                parentEventType: event.eventType,
                parentEventTypeValue: event.type,
                parentNodeAnchor: event.decision_path,
                triggerMode : event.trigger_mode,
                triggerDate : event.trigger_date,
                triggerInterval : event.trigger_interval,
                triggerIntervalUnit : event.trigger_interval_unit,
                eventOrder: eventOrder,
                content: nodeContent,
                dataConnected: dataConnected,
            };

            createEventNode(propJson, eventPos.left, eventPos.top);
        });
    }
        
    };



    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("nav-contacts"); // Default active tab

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        
        if(tabName == "nav-preview"){
            toggleBuilder(1);
        }
        
    };

    const viewContact = (id) =>{
        window.location.href = window.url('contact/edit/'+id);
    };

    return (
        <Layout pageTitle={pageTitle}>
            <div className="midde_cont">
                <div className="container-fluid">
                    <div className="row column_title">
                        <div className="col-md-12">
                            <div className="page_title row">
                                <div className="col-md-6">
                                    <h2>Campaign</h2>
                                </div>
                                <div className={`${Styles.textAlignRight} col-md-6`}>
                                    {/*<NavLink className="btn cur-p btn-outline-primary" href="campaigns/new">
                                        <i className={`${Styles.newBtnIcon} fa fa-plus`}></i> New
                                    </NavLink>*/}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                <div className="full graph_head">
                                    <div className="heading1 margin_0">
                                        <h5>Details</h5>
                                    </div>
                                </div>

                                <div className="table_section padding_infor_info">
                                    <div className="table-responsive-sm">
    
                                        <h5>{campaign.name}</h5>
                                        <div dangerouslySetInnerHTML={{ __html: campaign.description }}></div>

                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <th>Created by</th>
                                                    <td>{campaign.created_by_user}</td>
                                                </tr>
                                                <tr>
                                                    <th>Created on</th>
                                                    <td>{campaign.date_added}</td>
                                                </tr>
                                                <tr>
                                                    <th>Modified by</th>
                                                    <td>{campaign.modified_by_user}</td>
                                                </tr>
                                                <tr>
                                                    <th>Last modified</th>
                                                    <td>{campaign.date_modified}</td>
                                                </tr>

                                                <tr>
                                                    <th>Available from</th>
                                                    <td>{campaign.publish_up}</td>
                                                </tr>
                                                <tr>
                                                    <th>Available to</th>
                                                    <td>{campaign.publish_down}</td>
                                                </tr>

                                                <tr>
                                                    <th>ID</th>
                                                    <td>{campaign.id}</td>
                                                </tr>

                                                <tr>
                                                    <th>Contact Segments</th>
                                                    <td>{segments.map(segment => segment.name).join(', ')}</td>
                                                </tr>
                                            
                                            </tbody>
                                        </table>
                                    </div>
                                </div>



                                </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                    <div className="full graph_head">
                                        <div className="heading1 margin_0">
                                            <h2></h2>
                                        </div>
                                    </div>
                                    <div className="full inner_elements">
                                        <div className="row">
                                            <div className="col-md-12">
                                            <div className="tab_style1">
                                                <div className="tabbar padding_infor_info">
                                                    <nav>
                                                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                        
                                                        <a className={`nav-item nav-link ${activeTab === "nav-contacts" ? "active" : ""}`} id="nav-contact-tab" data-bs-toggle="tab" role="tab" aria-controls="nav-contacts" aria-selected="false"
                                                        onClick={() => handleTabChange("nav-contacts")}>Contacts</a>
                                                        
                                                        <a className={`nav-item nav-link ${activeTab === "nav-decisions" ? "active" : ""}`} id="nav-decisions-tab" data-bs-toggle="tab" role="tab" aria-controls="nav-decisions" aria-selected="false" onClick={() => handleTabChange("nav-decisions")}>Decisions</a>
                                                        
                                                        <a className={`nav-item nav-link ${activeTab === "nav-actions" ? "active" : ""}`} id="nav-actions-tab" data-bs-toggle="tab" role="tab" aria-controls="nav-actions" aria-selected="false"
                                                        onClick={() => handleTabChange("nav-actions")}>Actions</a>

                                                        <a className={`nav-item nav-link ${activeTab === "nav-conditions" ? "active" : ""}`} id="nav-conditions-tab" data-bs-toggle="tab" role="tab" aria-controls="nav-conditions"aria-selected="false"
                                                        onClick={() => handleTabChange("nav-conditions")}>Conditions</a>

                                                        <a className={`nav-item nav-link ${activeTab === "nav-preview" ? "active" : ""}`} id="nav-preview-tab" data-bs-toggle="tab" role="tab" aria-controls="nav-preview" aria-selected="true"
                                                        onClick={() => handleTabChange("nav-preview")}>Preview</a>

                                                        </div>
                                                    </nav>

                                                    <div className="tab-content" id="nav-tabContent">
                                                        
                                                    <div className={`tab-pane fade ${activeTab === "nav-contacts" ? "show active" : "hide"}`} id="nav-contacts" role="tabpanel" aria-labelledby="nav-contacts-tab">
                                                        <div className="table-responsive-sm">
                                                            <table className="table">
                                                                <tbody>
                                                                    {contacts.length === 0 ? (
                                                                        <tr>
                                                                            <td colSpan="4" style={{ textAlign: "center" }}>
                                                                                No contacts available.
                                                                            </td>
                                                                        </tr>
                                                                    ) : (
                                                                        contacts.map(contact => (
                                                                            <tr id={"contact_rw_"+contact.id} key={contact.id}>
                                                                                <td>
                                                                                    {contact.firstname}
                                                                                    &nbsp;
                                                                                    {contact.lastname}
                                                                                </td>
                                                                                <td>
                                                                                    {contact.email}
                                                                                </td>
                                                                                <td>
                                                                                    {contact.id}
                                                                                </td>
                                                                                <td>
                                                                                    <LinkButton type="button" className={`btn p-0`} onClick={() => viewContact(
                                                                                        contact.id)} data-bs-toggle="tooltip" title="View" data-original-title="View">
                                                                                        <i className={`${Styles.filterTrashIcon} fa fa-eye`}></i>
                                                                                    </LinkButton>
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>

                                                        <div className={`tab-pane fade ${activeTab === "nav-decisions" ? "show active" : "hide"}`} id="nav-decisions" role="tabpanel" aria-labelledby="nav-decisions-tab">
            <div className="table-responsive-sm">
                <table className="table">
                    <tbody>
                        {decisions.length === 0 ? (
                            <tr>
                                <td colSpan="2" style={{ textAlign: "center" }}>
                                    No decisions available.
                                </td>
                            </tr>
                        ) : (
                            decisions.map(decision => (
                                //name success failed completed pending successPercent failedPercent
                                
                                <tr id={"dec_rw_"+decision.id} key={decision.id}>
                                    <td>
                                        <span className={`${Styles.label} ${Styles.labelSuccess}`} data-bs-toggle="tooltip" data-bs-placement="top" title="Success percent" data-original-title="Success percent">{decision.successPercent}%</span>
                                        
                                        <span className={`${Styles.label} ${Styles.labelDanger}`} data-bs-toggle="tooltip" data-bs-placement="top" title="Failed percent" data-original-title="Failed percent">{decision.failedPercent}%</span>
                                        
                                        <span className={`${Styles.label} ${Styles.labelWarning}`} data-bs-toggle="tooltip" data-bs-placement="top" title="Completed actions" data-original-title="Completed actions">{decision.completed}</span>
                                    
                                        <span className={`${Styles.label} ${Styles.labelDefault}`} data-bs-toggle="tooltip" data-bs-placement="top" title="Pending actions" data-original-title="Pending actions">{decision.pending}</span>
                                    
                                    </td>
                                    <td>
                                        {decision.name}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
                                                        </div>

                                                        <div className={`tab-pane fade ${activeTab === "nav-actions" ? "show active" : "hide"}`} id="nav-actions" role="tabpanel" aria-labelledby="nav-actions-tab">
            <div className="table-responsive-sm">
                <table className="table">
                    <tbody>
                        {actions.length === 0 ? (
                            <tr>
                                <td colSpan="2" style={{ textAlign: "center" }}>
                                    No actions available.
                                </td>
                            </tr>
                        ) : (
                            actions.map(action => (
                                //name success failed completed pending successPercent failedPercent
                                <tr id={"act_rw_"+action.id} key={action.id}>
                                    <td>
                                        <span className={`${Styles.label} ${Styles.labelSuccess}`} data-bs-toggle="tooltip" title="Success percent"  data-original-title="Success percent"> {action.successPercent}%</span>
                                        
                                        <span className={`${Styles.label} ${Styles.labelDanger}`} data-bs-toggle="tooltip" title="Failed percent" 
                                        data-original-title="Failed percent">
                                        {action.failedPercent}%</span>
                                        
                                        <span className={`${Styles.label} ${Styles.labelWarning}`} data-bs-toggle="tooltip" title="Completed actions" data-original-title="Completed actions">{action.completed}</span>
                                    
                                        <span className={`${Styles.label} ${Styles.labelDefault}`} data-bs-toggle="tooltip" title="Pending actions" data-original-title="Pending actions">{action.pending}</span>
                                    </td>
                                    <td>
                                        {action.name}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
                                                        </div>

                                                        <div className={`tab-pane fade ${activeTab === "nav-conditions" ? "show active" : "hide"}`} id="nav-conditions" role="tabpanel" aria-labelledby="nav-conditions-tab">
            <div className="table-responsive-sm">
                <table className="table">
                    <tbody>
                        {conditions.length === 0 ? (
                            <tr>
                                <td colSpan="2" style={{ textAlign: "center" }}>
                                    No conditions available.
                                </td>
                            </tr>
                        ) : (
                            conditions.map(condition => (
                                //name success failed completed pending successPercent failedPercent
                                <tr id={"cond_rw_"+condition.id} key={condition.id}>
                                    <td>
                                        <span className={`${Styles.label} ${Styles.labelSuccess}`} data-bs-toggle="tooltip" title="Success percent" data-original-title="Success percent">{condition.successPercent}%</span>
                                        
                                        <span className={`${Styles.label} ${Styles.labelDanger}`} data-bs-toggle="tooltip" title="Failed percent" data-original-title="Failed percent">{condition.failedPercent}%</span>
                                        
                                        <span className={`${Styles.label} ${Styles.labelWarning}`} data-bs-toggle="tooltip" title="Completed actions" data-original-title="Completed actions">{condition.completed}</span>
                                    
                                        <span className={`${Styles.label} ${Styles.labelDefault}`} data-bs-toggle="tooltip" title="Pending actions" data-original-title="Pending actions">{condition.pending}</span>
                                    </td>
                                    <td>
                                        {condition.name}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
                                                        </div>

                                                        <div className={`tab-pane fade ${activeTab === "nav-preview" ? "show active" : "hide"}`} id="nav-preview" role="tabpanel" aria-labelledby="nav-preview-tab">Loading...</div>

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
                </div>
            </div>

            <div id="campaign-builder" className={`builder campaign-builder live builder-active hide`}>
                <div className={`btns-builder btn-group`} role="group">
                    <button type="button" className="btn btn-primary btn-close-campaign-builder" onClick={() => toggleBuilder(0)}>Close Preview</button>
                </div>
            </div>

        </Layout>
    );
};

export default campaign;