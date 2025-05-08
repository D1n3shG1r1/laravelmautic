import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import NodeEndpoints from '@/Components/NodeEndpoints';
//import CreateNode from '@/Components/CreateNode';
const DecisionModalContent = (inputData) => {
  
  const anchor = inputData.inputData.anchor;
  const type = inputData.inputData.type;
  const eventType = inputData.inputData.eventType;
  const anchorEventType = inputData.inputData.anchorEventType;
  const parentEventId = inputData.inputData.parentEventId;
  const eventOrder = inputData.inputData.eventOrder;
  const campaignId = inputData.inputData.campaignId;
  const tempEventId = inputData.inputData.tempEventId;
  const csrftoken = inputData.inputData.csrftoken;

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltips = [...tooltipTriggerList].map((tooltip) => new bootstrap.Tooltip(tooltip));
  
    return () => {
      tooltips.forEach((tooltip) => tooltip.dispose());
    };
  }, []);

  useEffect(() => {
    if (window.jQuery) {
        
      // Initialize the Select2 plugin
      $('#campaignevent_properties_channels').select2({
        placeholder: "Select devices",
        allowClear: true,
        width: '100%', // Makes it responsive
      });

      // Cleanup function to destroy chosen instances
      return () => {
        $('#campaignevent_properties_channels').select2('destroy');
      };

    }
  }, []); // Empty dependency array ensures it only runs once when the component mounts

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
    node.className = "workflow-node draggable list-campaign-source jtk-endpoint-anchor-leadsource CampaignEvent_lists jtk-managed jtk-endpoint-anchor-leadsourceleft jtk-endpoint-anchor-leadsourceright jtk-draggable";
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

      const endpointLeftHolder = document.createElement("div");
      endpointLeftHolder.id = id+'_endpointLeftHolder';
      node.appendChild(endpointLeftHolder);

      const endpointRightHolder = document.createElement("div");
      endpointRightHolder.id = id+'_endpointRightHolder';
      node.appendChild(endpointRightHolder);        
      
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
      const endpointLeft = <NodeEndpoints nodeType={type} endpointType="left" />;
      const endpointRight = <NodeEndpoints nodeType={type} endpointType="right" />;
      const endpointBottomCenter = <NodeEndpoints nodeType={type} endpointType="bottom-center" />;
  
      // Assuming `node` is a DOM element where you want to append these components
      const rootLeft = ReactDOM.createRoot(document.getElementById(id+'_endpointLeftHolder'));
      const rootRight = ReactDOM.createRoot(document.getElementById(id+'_endpointRightHolder'));
      const rootBottomCenter = ReactDOM.createRoot(document.getElementById(id+'_endpointBottomCenterHolder'));
  
      rootLeft.render(endpointLeft);
      rootRight.render(endpointRight);
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
    // Initialize jsPlumb instance
    const instance = jsPlumb.getInstance({
        //container: document.getElementById("campaign-builder"),
        container: document.getElementById("CampaignCanvas"),
    });

    instance.draggable(node);
    
    //endpoint connecting line
    /*instance.addEndpoint(node, {
        source: parentNodeId,
        target: id,
        anchor: "Continuous",
        isSource: true,
        isTarget: true,
        endpoint: ["Dot", { radius: 6 }],
        paintStyle: { fill: "#4caf50" },
        connector: ["Bezier", { curviness: 50 }],
        connectorStyle: { stroke: "#4caf50", strokeWidth: 2 },
    });*/

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
        

        instance.connect(node, {
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

  const formRef = useRef();
  const saveEvent = (event) =>{
      event.preventDefault();

      var anchorInput = document.getElementById("campaignevent_anchor").value;
      var typeInput = document.getElementById("campaignevent_type").value;
      var eventTypeInput = document.getElementById("campaignevent_eventType").value;
      var anchorEventTypeInput = document.getElementById("campaignevent_anchorEventType").value;
      var eventIdInput = document.getElementById("campaignevent_eventId").value;
      var eventOrderInput = document.getElementById("campaignevent_eventOrder").value;
      var parentEventIdInput = document.getElementById("campaignevent_parentEventId").value;
      var campaignIdInput = document.getElementById("campaignevent_campaignId").value;
      
      var eventName = document.getElementById("campaignevent_name").value;
      var channels = document.getElementById("campaignevent_properties_channels").value;
      

      if(!isRealVal(eventName)){
          var err = 1;
          var msg = "Event name is required.";
          showToastMsg(err, msg);
          return false;
      }else if(!isRealVal(channels)){
          var err = 1;
          var msg = "Channel is required.";
          showToastMsg(err, msg);
          return false;
      }else{
        //campaignevent_form
        //serialize and form post
        //method="post"
        //action="/savenewevent"
        //const form = document.querySelector('form');
        
        /*const form = document.getElementById('campaignevent_form');        
        const formData = new FormData(form);
        const serialized = new URLSearchParams(formData).toString();
        console.log(serialized);
        //console.log(formData);
        */

        const formData = new FormData(formRef.current);
        const serializedData = new URLSearchParams(formData).toString();
        console.log('serializedData');
        console.log(serializedData);  // The serialized data string
        
        var url = 'savenewevent';
        var postJson = {"_token":csrftoken, "eventData":serializedData};
        httpRequest(url, postJson, function(resp){
            if(resp.C == 100){
              //close modal
                //$("#campaignEventModal .loading-placeholder").removeClass("hide");
                //$("#campaignEventModal #event-modal-body-content").html("");
                //$('#'+modalId).modal('hide');
                //$('.modal-backdrop').remove();
                cancelEvent();       
                //CreateNode
                //add event node
                var resp_campaignId = resp.R.campaignId;
                var resp_eventId  = resp.R.eventId;
                var resp_eventData = resp.R.eventData;
                var resp_campaignevent = resp_eventData.campaignevent;
                
                var resp_eventType = resp_campaignevent.eventType;
                var resp_eventOrder = resp_campaignevent.eventOrder;
                var resp_parentEventId = resp_campaignevent.parentEventId;
                
                var resp_parentNodeType = resp_campaignevent.anchorEventType;
                var resp_parentNodeAnchor = resp_campaignevent.anchor;
                if(resp_parentNodeType == "source"){
                    resp_parentEventId = "CampaignEvent_lists";
                }else{
                    resp_parentEventId = 'CampaignEvent_new-'+resp_parentEventId;
                }
                

                var resp_eventName = resp_campaignevent.name;
                var truncateEventName = resp_eventName;

                // create node
                var nodeIcon = '';
                if(resp_eventType == "decision"){
                    nodeIcon = '<i class="hidden-xs fa fa-random fa-lg"></i>';
                }else if(resp_eventType == "action"){
                    nodeIcon = '<i class="hidden-xs fa fa-bullseye fa-lg"></i>';
                }else if(resp_eventType == "condition"){
                    nodeIcon = '<i class="hidden-xs fa fa-filter fa-lg"></i>';
                }
                
                var nodeType = resp_eventType;
                var nodeId = 'CampaignEvent_new-'+resp_eventId;
                var nodeContent = nodeIcon+' '+truncateEventName;
                var dataConnected = '';
                var eventOrder = resp_eventOrder;
                const propJson = {
                    "type":nodeType,
                    "id":nodeId,
                    "parentNodeId":resp_parentEventId,
                    "parentNodeType":resp_parentNodeType,
                    "parentNodeAnchor":resp_parentNodeAnchor,
                    "eventOrder":eventOrder,
                    "content":nodeContent,
                    "dataConnected":dataConnected
                };

                
                if(resp_parentNodeType == "source"){
                    var parentNode = document.getElementById("CampaignEvent_lists");
                }else{
                    
                    var parentNode = document.getElementById(resp_parentEventId);
                }    
                
                const parentLeftStr = parentNode.style.left;
                const parentTopStr = parentNode.style.top;
                
                var x = parseInt(parentLeftStr) - 100;
                var y = parseInt(parentTopStr) + 105;

                //create node
                createNode(propJson, x, y);
                //return <CreateNode propJson={propJson} x={x} y={y} />
            }
        });

      }
  };
  
  const cancelEvent = () =>{
    const action = "cancel";
    const modalId = "campaignEventModal";
    //closeModal(action,modalId);

    $("#campaignEventModal .loading-placeholder").removeClass("hide");
    $("#campaignEventModal #event-modal-body-content").html("");
    $('#'+modalId).modal('hide');
    $('.modal-backdrop').remove();
  };

  return (
    <>
    <form
        id="campaignevent_form"
        noValidate=""
        autoComplete="false"
        data-toggle="ajax"
        role="form"
        name="campaignevent"
        ref={formRef} onSubmit={saveEvent}
      >
    <div className="bundle-form">
      <div className="bundle-form-header mb-10">
        <h3>Add Do Not Contact</h3>
        <h6 className="text-muted">Add DoNotContact flag to the contact</h6>
      </div>
        
        <input
          type="hidden"
          id="campaignevent_canvasSettings_droppedX"
          name="campaignevent[canvasSettings][droppedX]"
          autoComplete="false"
        />
        <input
          type="hidden"
          id="campaignevent_canvasSettings_droppedY"
          name="campaignevent[canvasSettings][droppedY]"
          autoComplete="false"
        />

        {/* Name Input */}
        <div className="row">
          <div className="form-group col-xs-12">
            <label className="control-label" htmlFor="campaignevent_name">
              Name
            </label>
            <input
              type="text"
              id="campaignevent_name"
              name="campaignevent[name]"
              className="form-control"
              autoComplete="false"
            />
          </div>
        </div>

        {/* Hidden Field for Anchor */}
        <input
          type="hidden"
          id="campaignevent_anchor"
          name="campaignevent[anchor]"
          autoComplete="false"
          value={anchor}
        />

        <div class="row">
            <div class="form-group col-xs-12">
            
            <div id="campaignevent_properties">
                <div class="row">
                    <div class="form-group col-xs-12 ">
                        <label class="control-label" for="campaignevent_properties_channels">
                        Channels</label>
                        <div class="choice-wrapper">
                        <select id="campaignevent_properties_channels" name="campaignevent[properties][channels][]" class="form-control" autoComplete="false" multiple="multiple">
                            <option>Emails</option>
                        </select>
                       </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="form-group col-xs-12">
                        <label class="control-label" for="campaignevent_properties_reason">
                        Reason</label>
                        <textarea id="campaignevent_properties_reason" name="campaignevent[properties][reason]" class="form-control" autocomplete="false"></textarea>
                    </div>
                </div>

            </div>
        </div>
         {/* Hidden Fields */}
         <input
          type="hidden"
          id="campaignevent_type"
          name="campaignevent[type]"
          autoComplete="false"
          value={type}
        />
        <input
          type="hidden"
          id="campaignevent_eventType"
          name="campaignevent[eventType]"
          autoComplete="false"
          value={eventType}
        />
        <input
          type="hidden"
          id="campaignevent_anchorEventType"
          name="campaignevent[anchorEventType]"
          autoComplete="false"
          value={anchorEventType}
        />
        <input
          type="hidden"
          id="campaignevent_eventId"
          name="campaignevent[eventId]"
          autoComplete="false"
          value={tempEventId}
        />
        <input
          type="hidden"
          id="campaignevent_eventOrder"
          name="campaignevent[eventOrder]"
          autoComplete="false"
          value={eventOrder}
        />
        <input
          type="hidden"
          id="campaignevent_parentEventId"
          name="campaignevent[parentEventId]"
          autoComplete="false"
          value={parentEventId}
        />
        <input
          type="hidden"
          id="campaignevent_campaignId"
          name="campaignevent[campaignId]"
          autoComplete="false"
          value={campaignId}
        />
        <input
          type="hidden"
          id="campaignevent__token"
          name="campaignevent[_token]"
          autoComplete="false"
          value=""
        />
        </div>
        </div>

        <div className="modal-footer">
            <div className="modal-form-buttons">
                <button type="submit" className="btn btn-default btn-save btn-copy"> <i className="ri-add-line"></i> Add</button>
                <button type="button" className="btn btn-default btn-cancel btn-copy" onClick={() => cancelEvent()} data-bs-dismiss="modal"><i className="ri-close-line"></i> Cancel</button>
            </div>
        </div>
        </form>
        </>
    );
};


export default DecisionModalContent;