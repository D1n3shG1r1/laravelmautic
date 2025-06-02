import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import NodeEndpoints from '@/Components/NodeEndpoints';
//import CreateNode from '@/Components/CreateNode';
const DecisionModalContent = ({inputData, jsPlumbInstanceRef}) => {
  
  const jsPlumbInstanceReff = jsPlumbInstanceRef;
  const anchor = inputData.anchor;
  const type = inputData.type;
  const eventType = inputData.eventType;
  const anchorEventType = inputData.anchorEventType;
  const parentEventId = inputData.parentEventId;
  const eventOrder = inputData.eventOrder;
  const campaignId = inputData.campaignId;
  const tempEventId = inputData.tempEventId;
  const csrftoken = inputData.csrftoken;

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
      $('#campaignevent_properties_device_type').select2({
        placeholder: "Select devices",
        allowClear: true,
        width: '100%', // Makes it responsive
      });

      $('#campaignevent_properties_device_brand').select2({
        placeholder: "Select devices",
        allowClear: true,
        width: '100%', // Makes it responsive
      });

      $('#campaignevent_properties_device_os').select2({
        placeholder: "Select devices",
        allowClear: true,
        width: '100%', // Makes it responsive
      });

      // Cleanup function to destroy chosen instances
      return () => {
        $('#campaignevent_properties_device_type').select2('destroy');
        $('#campaignevent_properties_device_brand').select2('destroy');
        $('#campaignevent_properties_device_os').select2('destroy');
      };

    }
  }, []); // Empty dependency array ensures it only runs once when the component mounts

  const createNode = (propJson, x, y) => {
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
      const endpointLeft = <NodeEndpoints nodeType={type} endpointType="left" parentEventType={parentEventType} parentEventTypeValue={parentEventTypeValue} />;
      const endpointRight = <NodeEndpoints nodeType={type} endpointType="right" parentEventType={parentEventType} parentEventTypeValue={parentEventTypeValue}/>;
      const endpointBottomCenter = <NodeEndpoints nodeType={type} endpointType="bottom-center" parentEventType={parentEventType} parentEventTypeValue={parentEventTypeValue}/>;
  
      // Assuming `node` is a DOM element where you want to append these components
      const rootLeft = ReactDOM.createRoot(document.getElementById(id+'_endpointLeftHolder'));
      const rootRight = ReactDOM.createRoot(document.getElementById(id+'_endpointRightHolder'));
      const rootBottomCenter = ReactDOM.createRoot(document.getElementById(id+'_endpointBottomCenterHolder'));
  
      rootLeft.render(endpointLeft);
      rootRight.render(endpointRight);
      rootBottomCenter.render(endpointBottomCenter);
  
  }else if (type === 'decision' || type === 'condition') {
      const endpointTopCenter = <NodeEndpoints nodeType={type} endpointType="top-center" parentEventType={parentEventType} parentEventTypeValue={parentEventTypeValue}/>;
      const endpointBottomLeft = <NodeEndpoints nodeType={type} endpointType="bottom-left" parentEventType={parentEventType} parentEventTypeValue={parentEventTypeValue}/>;
      const endpointBottomRight = <NodeEndpoints nodeType={type} endpointType="bottom-right" parentEventType={parentEventType} parentEventTypeValue={parentEventTypeValue}/>;
  
      const rootTopCenter = ReactDOM.createRoot(document.getElementById(id+'_endpointTopCenterHolder'));
      const rootBottomLeft = ReactDOM.createRoot(document.getElementById(id+'_endpointBottomLeftHolder'));
      const rootBottomRight = ReactDOM.createRoot(document.getElementById(id+'_endpointBottomRightHolder'));
    
      rootTopCenter.render(endpointTopCenter);
      rootBottomLeft.render(endpointBottomLeft);
      rootBottomRight.render(endpointBottomRight);
  }else if(type == 'action'){
        
      const endpointTopCenter = <NodeEndpoints nodeType={type} endpointType="top-center" parentEventType={parentEventType} parentEventTypeValue={parentEventTypeValue}/>
      const endpointBottomCenter = <NodeEndpoints nodeType={type} endpointType="bottom-center" parentEventType={parentEventType} parentEventTypeValue={parentEventTypeValue}/>

      const rootTopCenter = ReactDOM.createRoot(document.getElementById(id+'_endpointTopCenterHolder'));
      const rootBottomCenter = ReactDOM.createRoot(document.getElementById(id+'_endpointBottomCenterHolder'));
        
      rootTopCenter.render(endpointTopCenter);
      rootBottomCenter.render(endpointBottomCenter);
        
  }
    
    // document.getElementById("campaign-builder").appendChild(node);

    // Make the node draggable and connectable
    jsPlumbInstanceReff.current.draggable(node);
    
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

    if(type != 'source'){
      jsPlumbInstanceReff.current.connect({
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
      var deviceType = document.getElementById("campaignevent_properties_device_type").value;
      var deviceBrand = document.getElementById("campaignevent_properties_device_brand").value;
      var deviceOS = document.getElementById("campaignevent_properties_device_os").value;

      if(!isRealVal(eventName)){
          var err = 1;
          var msg = "Event name is required.";
          showToastMsg(err, msg);
          return false;
      }else if(!isRealVal(deviceType)){
          var err = 1;
          var msg = "Device type is required.";
          showToastMsg(err, msg);
          return false;
      }else if(!isRealVal(deviceBrand)){
          var err = 1;
          var msg = "Device brand is required.";
          showToastMsg(err, msg);
          return false;
      }else if(!isRealVal(deviceOS)){
          var err = 1;
          var msg = "Device os is required.";
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
                var resp_eventTypeType = resp_campaignevent.type;
                var resp_eventOrder = resp_campaignevent.eventOrder;
                var resp_parentEventId = resp_campaignevent.parentEventId;
                var parentEventType = resp_campaignevent.parentEventType;
                var parentEventTypeValue = resp_campaignevent.parentEventTypeValue;
                
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
                const nodeIconMap = {
                  decision: '<i class="hidden-xs fa fa-random fa-lg" style="color:#00b49d"></i>',
                  action: '<i class="hidden-xs fa fa-bullseye fa-lg" style="color:#9babeb"></i>',
                  condition: '<i class="hidden-xs fa fa-filter fa-lg" style="color:#ffb79f"></i>'
                };
  
                const nodeIcon = nodeIconMap[resp_eventType] || '';
                
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
                    "parentEventType":parentEventType,
                    "parentEventTypeValue":parentEventTypeValue,
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
        <h3>Device visit</h3>
        <h6 className="text-muted">Trigger device on a page/url hit.</h6>
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

        {/* Device Type Dropdown */}
        <div className="row">
          <div className="form-group col-xs-12">
            <div id="campaignevent_properties">
              <div className="row">
                <div className="form-group col-xs-12">
                  <label
                    className="control-label"
                    htmlFor="campaignevent_properties_device_type"
                  >
                    Device type
                  </label>
                  <div className="choice-wrapper">
                    <select id="campaignevent_properties_device_type" name="campaignevent[properties][device_type][]" className="form-control form-select" autoComplete="false" multiple="multiple">
                      <option value="desktop">desktop</option>
                      <option value="smartphone">smartphone</option>
                      <option value="tablet">tablet</option>
                      <option value="feature phone">feature phone</option>
                      <option value="console">console</option>
                      <option value="tv">tv</option>
                      <option value="car browser">car browser</option>
                      <option value="smart display">smart display</option>
                      <option value="camera">camera</option>
                      <option value="portable media player">portable media player</option>
                      <option value="phablet">phablet</option>
                      <option value="smart speaker">smart speaker</option>
                      <option value="wearable">wearable</option>
                      <option value="peripheral">peripheral</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Device Brand Dropdown */}
              <div className="row">
                <div className="form-group col-xs-12">
                  <label
                    className="control-label"
                    htmlFor="campaignevent_properties_device_brand"
                  >
                    Device brand
                  </label>
                  <div className="choice-wrapper">
                    <select
                      id="campaignevent_properties_device_brand"
                      name="campaignevent[properties][device_brand][]"
                      className="form-control form-select"
                      autoComplete="false"
                      multiple="multiple"
                    >
                        <option value="5E">2E</option>
                        <option value="2F">F2 Mobile</option>
                        <option value="3Q">3Q</option>
                        <option value="J7">7 Mobile</option>
                        <option value="2Q">3GNET</option>
                        <option value="4G">4Good</option>
                        <option value="27">3GO</option>
                        <option value="04">4ife</option>
                        <option value="36">360</option>
                        <option value="88">8848</option>
                        <option value="41">A1</option>
                        <option value="00">Accent</option>
                        <option value="AE">Ace</option>
                        <option value="AC">Acer</option>
                        <option value="3K">Acteck</option>
                        <option value="A9">Advan</option>
                        <option value="AD">Advance</option>
                        <option value="76">Adronix</option>
                        <option value="AF">AfriOne</option>
                        <option value="A3">AGM</option>
                        <option value="J0">AG Mobile</option>
                        <option value="AZ">Ainol</option>
                        <option value="AI">Airness</option>
                        <option value="AT">Airties</option>
                        <option value="0A">AIS</option>
                        <option value="AW">Aiwa</option>
                        <option value="85">Aiuto</option>
                        <option value="AK">Akai</option>
                        <option value="Q3">AKIRA</option>
                        <option value="1A">Alba</option>
                        <option value="AL">Alcatel</option>
                        <option value="20">Alcor</option>
                        <option value="7L">ALDI NORD</option>
                        <option value="6L">ALDI SÜD</option>
                        <option value="3L">Alfawise</option>
                        <option value="4A">Aligator</option>
                        <option value="AA">AllCall</option>
                        <option value="3A">AllDocube</option>
                        <option value="A2">Allview</option>
                        <option value="A7">Allwinner</option>
                        <option value="A1">Altech UEC</option>
                        <option value="66">Altice</option>
                        <option value="A5">altron</option>
                        <option value="KN">Amazon</option>
                        <option value="AG">AMGOO</option>
                        <option value="9A">Amigoo</option>
                        <option value="AO">Amoi</option>
                        <option value="54">AMCV</option>
                        <option value="60">Andowl</option>
                        <option value="7A">Anry</option>
                        <option value="A0">ANS</option>
                        <option value="74">Anker</option>
                        <option value="3N">Aoson</option>
                        <option value="O8">AOC</option>
                        <option value="J2">AOYODKG</option>
                        <option value="55">AOpen</option>
                        <option value="AP">Apple</option>
                        <option value="AR">Archos</option>
                        <option value="AB">Arian Space</option>
                        <option value="A6">Ark</option>
                        <option value="5A">ArmPhone</option>
                        <option value="AN">Arnova</option>
                        <option value="AS">ARRIS</option>
                        <option value="AQ">Aspera</option>
                        <option value="40">Artel</option>
                        <option value="21">Artizlee</option>
                        <option value="8A">Asano</option>
                        <option value="90">Asanzo</option>
                        <option value="1U">Astro</option>
                        <option value="A4">Ask</option>
                        <option value="A8">Assistant</option>
                        <option value="AU">Asus</option>
                        <option value="6A">AT&amp;T</option>
                        <option value="2A">Atom</option>
                        <option value="Z2">Atvio</option>
                        <option value="AX">Audiovox</option>
                        <option value="AJ">AURIS</option>
                        <option value="ZA">Avenzo</option>
                        <option value="AH">AVH</option>
                        <option value="AV">Avvio</option>
                        <option value="AY">Axxion</option>
                        <option value="XA">Axioo</option>
                        <option value="AM">Azumi Mobile</option>
                        <option value="BO">BangOlufsen</option>
                        <option value="BN">Barnes &amp; Noble</option>
                        <option value="BB">BBK</option>
                        <option value="0B">BB Mobile</option>
                        <option value="B6">BDF</option>
                        <option value="BE">Becker</option>
                        <option value="B5">Beeline</option>
                        <option value="B0">Beelink</option>
                        <option value="BL">Beetel</option>
                        <option value="BQ">BenQ</option>
                        <option value="BS">BenQ-Siemens</option>
                        <option value="4Y">Benzo</option>
                        <option value="BY">BS Mobile</option>
                        <option value="BZ">Bezkam</option>
                        <option value="9B">Bellphone</option>
                        <option value="63">Beyond</option>
                        <option value="BG">BGH</option>
                        <option value="6B">Bigben</option>
                        <option value="B8">BIHEE</option>
                        <option value="1B">Billion</option>
                        <option value="BA">BilimLand</option>
                        <option value="BH">BioRugged</option>
                        <option value="BI">Bird</option>
                        <option value="BT">Bitel</option>
                        <option value="B7">Bitmore</option>
                        <option value="BK">Bkav</option>
                        <option value="5B">Black Bear</option>
                        <option value="BF">Black Fox</option>
                        <option value="B2">Blackview</option>
                        <option value="BP">Blaupunkt</option>
                        <option value="BU">Blu</option>
                        <option value="B3">Bluboo</option>
                        <option value="2B">Bluedot</option>
                        <option value="BD">Bluegood</option>
                        <option value="LB">Bluewave</option>
                        <option value="7B">Blloc</option>
                        <option value="UB">Bleck</option>
                        <option value="Q2">Blow</option>
                        <option value="BM">Bmobile</option>
                        <option value="B9">Bobarry</option>
                        <option value="B4">bogo</option>
                        <option value="BW">Boway</option>
                        <option value="BX">bq</option>
                        <option value="8B">Brandt</option>
                        <option value="BV">Bravis</option>
                        <option value="BR">Brondi</option>
                        <option value="BJ">BrightSign</option>
                        <option value="B1">Bush</option>
                        <option value="4Q">Bundy</option>
                        <option value="C9">CAGI</option>
                        <option value="CT">Capitel</option>
                        <option value="G3">CG Mobile</option>
                        <option value="37">CGV</option>
                        <option value="CP">Captiva</option>
                        <option value="CF">Carrefour</option>
                        <option value="CS">Casio</option>
                        <option value="R4">Casper</option>
                        <option value="CA">Cat</option>
                        <option value="BC">Camfone</option>
                        <option value="CJ">Cavion</option>
                        <option value="4D">Canal Digital</option>
                        <option value="02">Cell-C</option>
                        <option value="34">CellAllure</option>
                        <option value="7C">Celcus</option>
                        <option value="CE">Celkon</option>
                        <option value="62">Centric</option>
                        <option value="C2">Changhong</option>
                        <option value="CH">Cherry Mobile</option>
                        <option value="C3">China Mobile</option>
                        <option value="CI">Chico Mobile</option>
                        <option value="HG">CHIA</option>
                        <option value="1C">Chuwi</option>
                        <option value="L8">Clarmin</option>
                        <option value="25">Claresta</option>
                        <option value="CD">Cloudfone</option>
                        <option value="6C">Cloudpad</option>
                        <option value="C0">Clout</option>
                        <option value="CN">CnM</option>
                        <option value="CY">Coby Kyros</option>
                        <option value="XC">Cobalt</option>
                        <option value="C6">Comio</option>
                        <option value="CL">Compal</option>
                        <option value="CQ">Compaq</option>
                        <option value="C7">ComTrade Tesla</option>
                        <option value="C8">Concord</option>
                        <option value="CC">ConCorde</option>
                        <option value="C5">Condor</option>
                        <option value="4C">Conquest</option>
                        <option value="3C">Contixo</option>
                        <option value="8C">Connex</option>
                        <option value="53">Connectce</option>
                        <option value="9C">Colors</option>
                        <option value="CO">Coolpad</option>
                        <option value="4R">CORN</option>
                        <option value="1O">Cosmote</option>
                        <option value="CW">Cowon</option>
                        <option value="75">Covia</option>
                        <option value="33">Clementoni</option>
                        <option value="CR">CreNova</option>
                        <option value="CX">Crescent</option>
                        <option value="CK">Cricket</option>
                        <option value="CM">Crius Mea</option>
                        <option value="0C">Crony</option>
                        <option value="C1">Crosscall</option>
                        <option value="CU">Cube</option>
                        <option value="CB">CUBOT</option>
                        <option value="CV">CVTE</option>
                        <option value="C4">Cyrus</option>
                        <option value="D5">Daewoo</option>
                        <option value="DA">Danew</option>
                        <option value="DT">Datang</option>
                        <option value="D7">Datawind</option>
                        <option value="7D">Datamini</option>
                        <option value="6D">Datalogic</option>
                        <option value="D1">Datsun</option>
                        <option value="DB">Dbtel</option>
                        <option value="DL">Dell</option>
                        <option value="DE">Denver</option>
                        <option value="DS">Desay</option>
                        <option value="DW">DeWalt</option>
                        <option value="DX">DEXP</option>
                        <option value="DG">Dialog</option>
                        <option value="DI">Dicam</option>
                        <option value="D4">Digi</option>
                        <option value="D3">Digicel</option>
                        <option value="DH">Digihome</option>
                        <option value="DD">Digiland</option>
                        <option value="Q0">DIGIFORS</option>
                        <option value="9D">Ditecma</option>
                        <option value="D2">Digma</option>
                        <option value="1D">Diva</option>
                        <option value="D6">Divisat</option>
                        <option value="X6">DIXON</option>
                        <option value="DM">DMM</option>
                        <option value="DN">DNS</option>
                        <option value="DC">DoCoMo</option>
                        <option value="DF">Doffler</option>
                        <option value="D9">Dolamee</option>
                        <option value="DO">Doogee</option>
                        <option value="D0">Doopro</option>
                        <option value="DV">Doov</option>
                        <option value="DP">Dopod</option>
                        <option value="DR">Doro</option>
                        <option value="D8">Droxio</option>
                        <option value="DJ">Dragon Touch</option>
                        <option value="DU">Dune HD</option>
                        <option value="EB">E-Boda</option>
                        <option value="EJ">Engel</option>
                        <option value="2E">E-Ceros</option>
                        <option value="E8">E-tel</option>
                        <option value="EP">Easypix</option>
                        <option value="EQ">Eagle</option>
                        <option value="EA">EBEST</option>
                        <option value="E4">Echo Mobiles</option>
                        <option value="ES">ECS</option>
                        <option value="35">ECON</option>
                        <option value="E6">EE</option>
                        <option value="EK">EKO</option>
                        <option value="EY">Einstein</option>
                        <option value="EM">Eks Mobility</option>
                        <option value="4K">EKT</option>
                        <option value="7E">ELARI</option>
                        <option value="03">Electroneum</option>
                        <option value="Z8">ELECTRONIA</option>
                        <option value="L0">Element</option>
                        <option value="EG">Elenberg</option>
                        <option value="EL">Elephone</option>
                        <option value="JE">Elekta</option>
                        <option value="4E">Eltex</option>
                        <option value="ED">Energizer</option>
                        <option value="E1">Energy Sistem</option>
                        <option value="3E">Enot</option>
                        <option value="8E">Epik One</option>
                        <option value="E7">Ergo</option>
                        <option value="EC">Ericsson</option>
                        <option value="05">Erisson</option>
                        <option value="ER">Ericy</option>
                        <option value="EE">Essential</option>
                        <option value="E2">Essentielb</option>
                        <option value="6E">eSTAR</option>
                        <option value="EN">Eton</option>
                        <option value="ET">eTouch</option>
                        <option value="1E">Etuline</option>
                        <option value="EU">Eurostar</option>
                        <option value="E9">Evercoss</option>
                        <option value="EV">Evertek</option>
                        <option value="E3">Evolio</option>
                        <option value="EO">Evolveo</option>
                        <option value="E0">EvroMedia</option>
                        <option value="XE">ExMobile</option>
                        <option value="4Z">Exmart</option>
                        <option value="EH">EXO</option>
                        <option value="EX">Explay</option>
                        <option value="E5">Extrem</option>
                        <option value="EF">EXCEED</option>
                        <option value="QE">EWIS</option>
                        <option value="EI">Ezio</option>
                        <option value="EZ">Ezze</option>
                        <option value="5F">F150</option>
                        <option value="F6">Facebook</option>
                        <option value="FA">Fairphone</option>
                        <option value="FM">Famoco</option>
                        <option value="17">FarEasTone</option>
                        <option value="9R">FaRao Pro</option>
                        <option value="FB">Fantec</option>
                        <option value="FE">Fengxiang</option>
                        <option value="F7">Fero</option>
                        <option value="FI">FiGO</option>
                        <option value="F1">FinePower</option>
                        <option value="FX">Finlux</option>
                        <option value="F3">FireFly Mobile</option>
                        <option value="F8">FISE</option>
                        <option value="FL">Fly</option>
                        <option value="QC">FLYCAT</option>
                        <option value="FN">FNB</option>
                        <option value="FD">Fondi</option>
                        <option value="0F">Fourel</option>
                        <option value="44">Four Mobile</option>
                        <option value="F0">Fonos</option>
                        <option value="F2">FORME</option>
                        <option value="F5">Formuler</option>
                        <option value="FR">Forstar</option>
                        <option value="RF">Fortis</option>
                        <option value="FO">Foxconn</option>
                        <option value="FT">Freetel</option>
                        <option value="F4">F&amp;U</option>
                        <option value="1F">FMT</option>
                        <option value="FG">Fuego</option>
                        <option value="FU">Fujitsu</option>
                        <option value="FW">FNF</option>
                        <option value="GT">G-TiDE</option>
                        <option value="G9">G-Touch</option>
                        <option value="0G">GFive</option>
                        <option value="GM">Garmin-Asus</option>
                        <option value="GA">Gateway</option>
                        <option value="99">Galaxy Innovations</option>
                        <option value="GD">Gemini</option>
                        <option value="GN">General Mobile</option>
                        <option value="2G">Genesis</option>
                        <option value="G2">GEOFOX</option>
                        <option value="GE">Geotel</option>
                        <option value="GH">Ghia</option>
                        <option value="2C">Ghong</option>
                        <option value="GG">Gigabyte</option>
                        <option value="GS">Gigaset</option>
                        <option value="GZ">Ginzzu</option>
                        <option value="1G">Gini</option>
                        <option value="GI">Gionee</option>
                        <option value="G4">Globex</option>
                        <option value="G7">GoGEN</option>
                        <option value="GC">GOCLEVER</option>
                        <option value="GB">Gol Mobile</option>
                        <option value="GL">Goly</option>
                        <option value="GX">GLX</option>
                        <option value="G5">Gome</option>
                        <option value="G1">GoMobile</option>
                        <option value="GO">Google</option>
                        <option value="G0">Goophone</option>
                        <option value="6G">Gooweel</option>
                        <option value="GR">Gradiente</option>
                        <option value="GP">Grape</option>
                        <option value="G6">Gree</option>
                        <option value="3G">Greentel</option>
                        <option value="GF">Gretel</option>
                        <option value="82">Gresso</option>
                        <option value="GU">Grundig</option>
                        <option value="HF">Hafury</option>
                        <option value="HA">Haier</option>
                        <option value="HE">HannSpree</option>
                        <option value="HK">Hardkernel</option>
                        <option value="HS">Hasee</option>
                        <option value="H6">Helio</option>
                        <option value="ZH">Hezire</option>
                        <option value="HL">Hi-Level</option>
                        <option value="3H">Hi</option>
                        <option value="H2">Highscreen</option>
                        <option value="Q1">High Q</option>
                        <option value="1H">Hipstreet</option>
                        <option value="HI">Hisense</option>
                        <option value="HC">Hitachi</option>
                        <option value="H8">Hitech</option>
                        <option value="H1">Hoffmann</option>
                        <option value="H0">Hometech</option>
                        <option value="HM">Homtom</option>
                        <option value="HZ">Hoozo</option>
                        <option value="H7">Horizon</option>
                        <option value="HO">Hosin</option>
                        <option value="H3">Hotel</option>
                        <option value="HV">Hotwav</option>
                        <option value="HW">How</option>
                        <option value="WH">Honeywell</option>
                        <option value="HP">HP</option>
                        <option value="HT">HTC</option>
                        <option value="HD">Huadoo</option>
                        <option value="HU">Huawei</option>
                        <option value="HX">Humax</option>
                        <option value="HR">Hurricane</option>
                        <option value="H5">Huskee</option>
                        <option value="HY">Hyrican</option>
                        <option value="HN">Hyundai</option>
                        <option value="7H">Hyve</option>
                        <option value="3I">i-Cherry</option>
                        <option value="IJ">i-Joy</option>
                        <option value="IM">i-mate</option>
                        <option value="IO">i-mobile</option>
                        <option value="OF">iOutdoor</option>
                        <option value="IB">iBall</option>
                        <option value="IY">iBerry</option>
                        <option value="7I">iBrit</option>
                        <option value="I2">IconBIT</option>
                        <option value="IC">iDroid</option>
                        <option value="IG">iGet</option>
                        <option value="IH">iHunt</option>
                        <option value="IA">Ikea</option>
                        <option value="8I">IKU Mobile</option>
                        <option value="2K">IKI Mobile</option>
                        <option value="IK">iKoMo</option>
                        <option value="I7">iLA</option>
                        <option value="2I">iLife</option>
                        <option value="1I">iMars</option>
                        <option value="U4">iMan</option>
                        <option value="IL">IMO Mobile</option>
                        <option value="I3">Impression</option>
                        <option value="FC">INCAR</option>
                        <option value="2H">Inch</option>
                        <option value="6I">Inco</option>
                        <option value="IW">iNew</option>
                        <option value="IF">Infinix</option>
                        <option value="I0">InFocus</option>
                        <option value="II">Inkti</option>
                        <option value="81">InfoKit</option>
                        <option value="I5">InnJoo</option>
                        <option value="26">Innos</option>
                        <option value="IN">Innostream</option>
                        <option value="I4">Inoi</option>
                        <option value="IQ">INQ</option>
                        <option value="QN">iQ&amp;T</option>
                        <option value="IS">Insignia</option>
                        <option value="IT">Intek</option>
                        <option value="IX">Intex</option>
                        <option value="IV">Inverto</option>
                        <option value="32">Invens</option>
                        <option value="4I">Invin</option>
                        <option value="I1">iOcean</option>
                        <option value="IP">iPro</option>
                        <option value="8Q">IQM</option>
                        <option value="I6">Irbis</option>
                        <option value="5I">Iris</option>
                        <option value="IR">iRola</option>
                        <option value="IU">iRulu</option>
                        <option value="9I">iSWAG</option>
                        <option value="86">IT</option>
                        <option value="IZ">iTel</option>
                        <option value="0I">iTruck</option>
                        <option value="I8">iVA</option>
                        <option value="IE">iView</option>
                        <option value="0J">iVooMi</option>
                        <option value="UI">ivvi</option>
                        <option value="I9">iZotron</option>
                        <option value="JA">JAY-Tech</option>
                        <option value="KJ">Jiake</option>
                        <option value="J6">Jeka</option>
                        <option value="JF">JFone</option>
                        <option value="JI">Jiayu</option>
                        <option value="JG">Jinga</option>
                        <option value="VJ">Jivi</option>
                        <option value="JK">JKL</option>
                        <option value="JO">Jolla</option>
                        <option value="J5">Just5</option>
                        <option value="JV">JVC</option>
                        <option value="JS">Jesy</option>
                        <option value="KT">K-Touch</option>
                        <option value="K4">Kaan</option>
                        <option value="K7">Kaiomy</option>
                        <option value="KL">Kalley</option>
                        <option value="K6">Kanji</option>
                        <option value="KA">Karbonn</option>
                        <option value="K5">KATV1</option>
                        <option value="K0">Kata</option>
                        <option value="KZ">Kazam</option>
                        <option value="KD">KDDI</option>
                        <option value="KS">Kempler &amp; Strauss</option>
                        <option value="K3">Keneksi</option>
                        <option value="KX">Kenxinda</option>
                        <option value="K1">Kiano</option>
                        <option value="KI">Kingsun</option>
                        <option value="KF">KINGZONE</option>
                        <option value="46">Kiowa</option>
                        <option value="KV">Kivi</option>
                        <option value="64">Kvant</option>
                        <option value="0K">Klipad</option>
                        <option value="KC">Kocaso</option>
                        <option value="KK">Kodak</option>
                        <option value="KG">Kogan</option>
                        <option value="KM">Komu</option>
                        <option value="KO">Konka</option>
                        <option value="KW">Konrow</option>
                        <option value="KB">Koobee</option>
                        <option value="7K">Koolnee</option>
                        <option value="K9">Kooper</option>
                        <option value="KP">KOPO</option>
                        <option value="KR">Koridy</option>
                        <option value="K2">KRONO</option>
                        <option value="KE">Krüger&amp;Matz</option>
                        <option value="5K">KREZ</option>
                        <option value="KH">KT-Tech</option>
                        <option value="Z6">KUBO</option>
                        <option value="K8">Kuliao</option>
                        <option value="8K">Kult</option>
                        <option value="KU">Kumai</option>
                        <option value="6K">Kurio</option>
                        <option value="KY">Kyocera</option>
                        <option value="KQ">Kyowon</option>
                        <option value="1K">Kzen</option>
                        <option value="LQ">LAIQ</option>
                        <option value="L6">Land Rover</option>
                        <option value="L2">Landvo</option>
                        <option value="LA">Lanix</option>
                        <option value="LK">Lark</option>
                        <option value="Z3">Laurus</option>
                        <option value="LV">Lava</option>
                        <option value="LC">LCT</option>
                        <option value="L5">Leagoo</option>
                        <option value="U3">Leben</option>
                        <option value="LD">Ledstar</option>
                        <option value="L1">LeEco</option>
                        <option value="4B">Leff</option>
                        <option value="L4">Lemhoov</option>
                        <option value="LN">Lenco</option>
                        <option value="LE">Lenovo</option>
                        <option value="LT">Leotec</option>
                        <option value="LP">Le Pan</option>
                        <option value="L7">Lephone</option>
                        <option value="LZ">Lesia</option>
                        <option value="L3">Lexand</option>
                        <option value="LX">Lexibook</option>
                        <option value="LG">LG</option>
                        <option value="LF">Lifemaxx</option>
                        <option value="LJ">L-Max</option>
                        <option value="LI">Lingwin</option>
                        <option value="5L">Linsar</option>
                        <option value="LW">Linnex</option>
                        <option value="LO">Loewe</option>
                        <option value="YL">Loview</option>
                        <option value="1L">Logic</option>
                        <option value="LM">Logicom</option>
                        <option value="0L">Lumigon</option>
                        <option value="LU">Lumus</option>
                        <option value="L9">Luna</option>
                        <option value="LR">Luxor</option>
                        <option value="LY">LYF</option>
                        <option value="LL">Leader Phone</option>
                        <option value="QL">LT Mobile</option>
                        <option value="MQ">M.T.T.</option>
                        <option value="MN">M4tel</option>
                        <option value="XM">Macoox</option>
                        <option value="92">MAC AUDIO</option>
                        <option value="MJ">Majestic</option>
                        <option value="23">Magnus</option>
                        <option value="NH">Manhattan</option>
                        <option value="5M">Mann</option>
                        <option value="MA">Manta Multimedia</option>
                        <option value="Z0">Mantra</option>
                        <option value="2M">Masstel</option>
                        <option value="50">Matrix</option>
                        <option value="7M">Maxcom</option>
                        <option value="ZM">Maximus</option>
                        <option value="6X">Maxtron</option>
                        <option value="0D">MAXVI</option>
                        <option value="MW">Maxwest</option>
                        <option value="M0">Maze</option>
                        <option value="YM">Maze Speed</option>
                        <option value="87">Malata</option>
                        <option value="3D">MDC Store</option>
                        <option value="09">meanIT</option>
                        <option value="M3">Mecer</option>
                        <option value="0M">Mecool</option>
                        <option value="MC">Mediacom</option>
                        <option value="MK">MediaTek</option>
                        <option value="MD">Medion</option>
                        <option value="M2">MEEG</option>
                        <option value="MP">MegaFon</option>
                        <option value="X0">mPhone</option>
                        <option value="3M">Meitu</option>
                        <option value="M1">Meizu</option>
                        <option value="0E">Melrose</option>
                        <option value="MU">Memup</option>
                        <option value="ME">Metz</option>
                        <option value="MX">MEU</option>
                        <option value="MI">MicroMax</option>
                        <option value="MS">Microsoft</option>
                        <option value="1X">Minix</option>
                        <option value="OM">Mintt</option>
                        <option value="MO">Mio</option>
                        <option value="M7">Miray</option>
                        <option value="8M">Mito</option>
                        <option value="MT">Mitsubishi</option>
                        <option value="M5">MIXC</option>
                        <option value="2D">MIVO</option>
                        <option value="1Z">MiXzo</option>
                        <option value="ML">MLLED</option>
                        <option value="LS">MLS</option>
                        <option value="4M">Mobicel</option>
                        <option value="M6">Mobiistar</option>
                        <option value="MH">Mobiola</option>
                        <option value="MB">Mobistel</option>
                        <option value="6W">MobiWire</option>
                        <option value="9M">Mobo</option>
                        <option value="M4">Modecom</option>
                        <option value="MF">Mofut</option>
                        <option value="MR">Motorola</option>
                        <option value="MV">Movic</option>
                        <option value="MM">Mpman</option>
                        <option value="MZ">MSI</option>
                        <option value="3R">MStar</option>
                        <option value="M9">MTC</option>
                        <option value="N4">MTN</option>
                        <option value="72">M-Tech</option>
                        <option value="9H">M-Horse</option>
                        <option value="1R">Multilaser</option>
                        <option value="1M">MYFON</option>
                        <option value="MY">MyPhone</option>
                        <option value="51">Myros</option>
                        <option value="M8">Myria</option>
                        <option value="6M">Mystery</option>
                        <option value="3T">MyTab</option>
                        <option value="MG">MyWigo</option>
                        <option value="08">Nabi</option>
                        <option value="N7">National</option>
                        <option value="NC">Navcity</option>
                        <option value="6N">Navitech</option>
                        <option value="7V">Navitel</option>
                        <option value="N3">Navon</option>
                        <option value="NP">Naomi Phone</option>
                        <option value="NE">NEC</option>
                        <option value="8N">Necnot</option>
                        <option value="NF">Neffos</option>
                        <option value="1N">Neomi</option>
                        <option value="NA">Netgear</option>
                        <option value="NU">NeuImage</option>
                        <option value="NW">Newgen</option>
                        <option value="N9">Newland</option>
                        <option value="0N">Newman</option>
                        <option value="NS">NewsMy</option>
                        <option value="ND">Newsday</option>
                        <option value="HB">New Balance</option>
                        <option value="XB">NEXBOX</option>
                        <option value="NX">Nexian</option>
                        <option value="N8">NEXON</option>
                        <option value="N2">Nextbit</option>
                        <option value="NT">NextBook</option>
                        <option value="4N">NextTab</option>
                        <option value="NG">NGM</option>
                        <option value="NZ">NG Optics</option>
                        <option value="NN">Nikon</option>
                        <option value="NI">Nintendo</option>
                        <option value="N5">NOA</option>
                        <option value="N1">Noain</option>
                        <option value="N6">Nobby</option>
                        <option value="JN">NOBUX</option>
                        <option value="NB">Noblex</option>
                        <option value="NK">Nokia</option>
                        <option value="NM">Nomi</option>
                        <option value="2N">Nomu</option>
                        <option value="NR">Nordmende</option>
                        <option value="7N">NorthTech</option>
                        <option value="5N">Nos</option>
                        <option value="NO">Nous</option>
                        <option value="NQ">Novex</option>
                        <option value="NJ">NuAns</option>
                        <option value="NL">NUU Mobile</option>
                        <option value="N0">Nuvo</option>
                        <option value="NV">Nvidia</option>
                        <option value="NY">NYX Mobile</option>
                        <option value="O3">O+</option>
                        <option value="OT">O2</option>
                        <option value="O7">Oale</option>
                        <option value="OC">OASYS</option>
                        <option value="OB">Obi</option>
                        <option value="O1">Odys</option>
                        <option value="O9">Ok</option>
                        <option value="OA">Okapia</option>
                        <option value="OD">Onda</option>
                        <option value="ON">OnePlus</option>
                        <option value="OX">Onix</option>
                        <option value="3O">ONYX BOOX</option>
                        <option value="O4">ONN</option>
                        <option value="2O">OpelMobile</option>
                        <option value="OH">Openbox</option>
                        <option value="OP">OPPO</option>
                        <option value="OO">Opsson</option>
                        <option value="OR">Orange</option>
                        <option value="O5">Orbic</option>
                        <option value="OS">Ordissimo</option>
                        <option value="OK">Ouki</option>
                        <option value="0O">OINOM</option>
                        <option value="QK">OKWU</option>
                        <option value="OE">Oukitel</option>
                        <option value="OU">OUYA</option>
                        <option value="OV">Overmax</option>
                        <option value="30">Ovvi</option>
                        <option value="O2">Owwo</option>
                        <option value="OY">Oysters</option>
                        <option value="O6">Oyyu</option>
                        <option value="OZ">OzoneHD</option>
                        <option value="7P">P-UP</option>
                        <option value="PM">Palm</option>
                        <option value="PN">Panacom</option>
                        <option value="PA">Panasonic</option>
                        <option value="PT">Pantech</option>
                        <option value="PB">PCBOX</option>
                        <option value="PC">PCD</option>
                        <option value="PD">PCD Argentina</option>
                        <option value="PE">PEAQ</option>
                        <option value="PG">Pentagram</option>
                        <option value="PQ">Pendoo</option>
                        <option value="93">Perfeo</option>
                        <option value="1P">Phicomm</option>
                        <option value="4P">Philco</option>
                        <option value="PH">Philips</option>
                        <option value="5P">Phonemax</option>
                        <option value="PO">phoneOne</option>
                        <option value="PI">Pioneer</option>
                        <option value="PJ">PiPO</option>
                        <option value="8P">Pixelphone</option>
                        <option value="9O">Pixela</option>
                        <option value="PX">Pixus</option>
                        <option value="QP">Pico</option>
                        <option value="9P">Planet Computers</option>
                        <option value="PY">Ployer</option>
                        <option value="P4">Plum</option>
                        <option value="22">Pluzz</option>
                        <option value="P8">PocketBook</option>
                        <option value="0P">POCO</option>
                        <option value="PV">Point of View</option>
                        <option value="PL">Polaroid</option>
                        <option value="PP">PolyPad</option>
                        <option value="P5">Polytron</option>
                        <option value="P2">Pomp</option>
                        <option value="P0">Poppox</option>
                        <option value="PS">Positivo</option>
                        <option value="3P">Positivo BGH</option>
                        <option value="P3">PPTV</option>
                        <option value="FP">Premio</option>
                        <option value="PR">Prestigio</option>
                        <option value="P9">Primepad</option>
                        <option value="6P">Primux</option>
                        <option value="2P">Prixton</option>
                        <option value="PF">PROFiLO</option>
                        <option value="P6">Proline</option>
                        <option value="P1">ProScan</option>
                        <option value="P7">Protruly</option>
                        <option value="R0">ProVision</option>
                        <option value="PU">PULID</option>
                        <option value="QH">Q-Touch</option>
                        <option value="QB">Q.Bell</option>
                        <option value="QI">Qilive</option>
                        <option value="QM">QMobile</option>
                        <option value="QT">Qtek</option>
                        <option value="QA">Quantum</option>
                        <option value="QU">Quechua</option>
                        <option value="QO">Qumo</option>
                        <option value="UQ">Qubo</option>
                        <option value="R2">R-TV</option>
                        <option value="RA">Ramos</option>
                        <option value="0R">Raspberry</option>
                        <option value="R9">Ravoz</option>
                        <option value="RZ">Razer</option>
                        <option value="RC">RCA Tablets</option>
                        <option value="2R">Reach</option>
                        <option value="RB">Readboy</option>
                        <option value="RE">Realme</option>
                        <option value="R8">RED</option>
                        <option value="RD">Reeder</option>
                        <option value="Z9">REGAL</option>
                        <option value="RP">Revo</option>
                        <option value="RI">Rikomagic</option>
                        <option value="RM">RIM</option>
                        <option value="RN">Rinno</option>
                        <option value="RX">Ritmix</option>
                        <option value="R7">Ritzviva</option>
                        <option value="RV">Riviera</option>
                        <option value="6R">Rivo</option>
                        <option value="RR">Roadrover</option>
                        <option value="R1">Rokit</option>
                        <option value="RK">Roku</option>
                        <option value="R3">Rombica</option>
                        <option value="R5">Ross&amp;Moor</option>
                        <option value="RO">Rover</option>
                        <option value="R6">RoverPad</option>
                        <option value="RQ">RoyQueen</option>
                        <option value="RT">RT Project</option>
                        <option value="RG">RugGear</option>
                        <option value="RU">Runbo</option>
                        <option value="RL">Ruio</option>
                        <option value="RY">Ryte</option>
                        <option value="X5">Saba</option>
                        <option value="8L">S-TELL</option>
                        <option value="89">Seatel</option>
                        <option value="X1">Safaricom</option>
                        <option value="SG">Sagem</option>
                        <option value="4L">Salora</option>
                        <option value="SA">Samsung</option>
                        <option value="S0">Sanei</option>
                        <option value="12">Sansui</option>
                        <option value="SQ">Santin</option>
                        <option value="SY">Sanyo</option>
                        <option value="S9">Savio</option>
                        <option value="Y4">SCBC</option>
                        <option value="CZ">Schneider</option>
                        <option value="G8">SEG</option>
                        <option value="SD">Sega</option>
                        <option value="9G">Selenga</option>
                        <option value="SV">Selevision</option>
                        <option value="SL">Selfix</option>
                        <option value="0S">SEMP TCL</option>
                        <option value="S1">Sencor</option>
                        <option value="SN">Sendo</option>
                        <option value="01">Senkatel</option>
                        <option value="S6">Senseit</option>
                        <option value="EW">Senwa</option>
                        <option value="24">Seeken</option>
                        <option value="61">Seuic</option>
                        <option value="SX">SFR</option>
                        <option value="SH">Sharp</option>
                        <option value="7S">Shift Phones</option>
                        <option value="RS">Shtrikh-M</option>
                        <option value="3S">Shuttle</option>
                        <option value="13">Sico</option>
                        <option value="SI">Siemens</option>
                        <option value="1S">Sigma</option>
                        <option value="70">Silelis</option>
                        <option value="SJ">Silent Circle</option>
                        <option value="10">Simbans</option>
                        <option value="98">Simply</option>
                        <option value="52">Singtech</option>
                        <option value="31">Siragon</option>
                        <option value="83">Sirin labs</option>
                        <option value="GK">SKG</option>
                        <option value="SW">Sky</option>
                        <option value="SK">Skyworth</option>
                        <option value="14">Smadl</option>
                        <option value="19">Smailo</option>
                        <option value="SR">Smart Electronic</option>
                        <option value="49">Smart</option>
                        <option value="47">SmartBook</option>
                        <option value="3B">Smartab</option>
                        <option value="80">SMARTEC</option>
                        <option value="SC">Smartfren</option>
                        <option value="S7">Smartisan</option>
                        <option value="1Q">Smotreshka</option>
                        <option value="SF">Softbank</option>
                        <option value="9L">SOLE</option>
                        <option value="JL">SOLO</option>
                        <option value="16">Solone</option>
                        <option value="OI">Sonim</option>
                        <option value="SO">Sony</option>
                        <option value="SE">Sony Ericsson</option>
                        <option value="X2">Soundmax</option>
                        <option value="8S">Soyes</option>
                        <option value="77">SONOS</option>
                        <option value="PK">Spark</option>
                        <option value="FS">SPC</option>
                        <option value="6S">Spectrum</option>
                        <option value="43">Spectralink</option>
                        <option value="SP">Spice</option>
                        <option value="84">Sprint</option>
                        <option value="QS">SQOOL</option>
                        <option value="S4">Star</option>
                        <option value="OL">Starlight</option>
                        <option value="18">Starmobile</option>
                        <option value="2S">Starway</option>
                        <option value="45">Starwind</option>
                        <option value="SB">STF Mobile</option>
                        <option value="S8">STK</option>
                        <option value="GQ">STG Telecom</option>
                        <option value="S2">Stonex</option>
                        <option value="ST">Storex</option>
                        <option value="71">StrawBerry</option>
                        <option value="69">Stylo</option>
                        <option value="9S">Sugar</option>
                        <option value="06">Subor</option>
                        <option value="SZ">Sumvision</option>
                        <option value="0H">Sunstech</option>
                        <option value="S3">SunVan</option>
                        <option value="5S">Sunvell</option>
                        <option value="5Y">Sunny</option>
                        <option value="SU">SuperSonic</option>
                        <option value="79">SuperTab</option>
                        <option value="S5">Supra</option>
                        <option value="ZS">Suzuki</option>
                        <option value="0W">Swipe</option>
                        <option value="SS">SWISSMOBILITY</option>
                        <option value="1W">Swisstone</option>
                        <option value="W7">SWTV</option>
                        <option value="SM">Symphony</option>
                        <option value="4S">Syrox</option>
                        <option value="TM">T-Mobile</option>
                        <option value="TK">Takara</option>
                        <option value="73">Tambo</option>
                        <option value="9N">Tanix</option>
                        <option value="T5">TB Touch</option>
                        <option value="TC">TCL</option>
                        <option value="T0">TD Systems</option>
                        <option value="H4">Technicolor</option>
                        <option value="Z5">Technika</option>
                        <option value="TX">TechniSat</option>
                        <option value="TT">TechnoTrend</option>
                        <option value="TP">TechPad</option>
                        <option value="9E">Techwood</option>
                        <option value="T7">Teclast</option>
                        <option value="TB">Tecno Mobile</option>
                        <option value="91">TEENO</option>
                        <option value="2L">Tele2</option>
                        <option value="TL">Telefunken</option>
                        <option value="TG">Telego</option>
                        <option value="T2">Telenor</option>
                        <option value="TE">Telit</option>
                        <option value="65">Telia</option>
                        <option value="TD">Tesco</option>
                        <option value="TA">Tesla</option>
                        <option value="9T">Tetratab</option>
                        <option value="TZ">teXet</option>
                        <option value="29">Teknosa</option>
                        <option value="T4">ThL</option>
                        <option value="TN">Thomson</option>
                        <option value="O0">Thuraya</option>
                        <option value="TI">TIANYU</option>
                        <option value="8T">Time2</option>
                        <option value="TQ">Timovi</option>
                        <option value="2T">Tinai</option>
                        <option value="TF">Tinmo</option>
                        <option value="TH">TiPhone</option>
                        <option value="Y3">TOKYO</option>
                        <option value="T1">Tolino</option>
                        <option value="0T">Tone</option>
                        <option value="TY">Tooky</option>
                        <option value="T9">Top House</option>
                        <option value="42">Topway</option>
                        <option value="TO">Toplux</option>
                        <option value="7T">Torex</option>
                        <option value="TS">Toshiba</option>
                        <option value="T8">Touchmate</option>
                        <option value="5R">Transpeed</option>
                        <option value="T6">TrekStor</option>
                        <option value="T3">Trevi</option>
                        <option value="TJ">Trifone</option>
                        <option value="4T">Tronsmart</option>
                        <option value="11">True</option>
                        <option value="JT">True Slim</option>
                        <option value="J1">Trio</option>
                        <option value="5C">TTEC</option>
                        <option value="TU">Tunisie Telecom</option>
                        <option value="1T">Turbo</option>
                        <option value="TR">Turbo-X</option>
                        <option value="5X">TurboPad</option>
                        <option value="5T">TurboKids</option>
                        <option value="TV">TVC</option>
                        <option value="TW">TWM</option>
                        <option value="Z1">TWZ</option>
                        <option value="6T">Twoe</option>
                        <option value="15">Tymes</option>
                        <option value="UC">U.S. Cellular</option>
                        <option value="UG">Ugoos</option>
                        <option value="U1">Uhans</option>
                        <option value="UH">Uhappy</option>
                        <option value="UL">Ulefone</option>
                        <option value="UA">Umax</option>
                        <option value="UM">UMIDIGI</option>
                        <option value="UZ">Unihertz</option>
                        <option value="3Z">UZ Mobile</option>
                        <option value="UX">Unimax</option>
                        <option value="US">Uniscope</option>
                        <option value="U2">UNIWA</option>
                        <option value="UO">Unnecto</option>
                        <option value="UU">Unonu</option>
                        <option value="UN">Unowhy</option>
                        <option value="UK">UTOK</option>
                        <option value="3U">IUNI</option>
                        <option value="UT">UTStarcom</option>
                        <option value="6U">UTime</option>
                        <option value="5V">VAIO</option>
                        <option value="WV">VAVA</option>
                        <option value="VA">Vastking</option>
                        <option value="VP">Vargo</option>
                        <option value="VB">VC</option>
                        <option value="VN">Venso</option>
                        <option value="VQ">Vega</option>
                        <option value="4V">Verico</option>
                        <option value="V4">Verizon</option>
                        <option value="VR">Vernee</option>
                        <option value="VX">Vertex</option>
                        <option value="VE">Vertu</option>
                        <option value="VL">Verykool</option>
                        <option value="V8">Vesta</option>
                        <option value="VT">Vestel</option>
                        <option value="V6">VGO TEL</option>
                        <option value="VD">Videocon</option>
                        <option value="VW">Videoweb</option>
                        <option value="VS">ViewSonic</option>
                        <option value="V7">Vinga</option>
                        <option value="V3">Vinsoc</option>
                        <option value="0V">Vipro</option>
                        <option value="VI">Vitelcom</option>
                        <option value="8V">Viumee</option>
                        <option value="V5">Vivax</option>
                        <option value="VV">Vivo</option>
                        <option value="6V">VIWA</option>
                        <option value="VZ">Vizio</option>
                        <option value="9V">Vision Touch</option>
                        <option value="VK">VK Mobile</option>
                        <option value="JM">v-mobile</option>
                        <option value="V0">VKworld</option>
                        <option value="VM">Vodacom</option>
                        <option value="VF">Vodafone</option>
                        <option value="V2">Vonino</option>
                        <option value="1V">Vontar</option>
                        <option value="VG">Vorago</option>
                        <option value="2V">Vorke</option>
                        <option value="V1">Voto</option>
                        <option value="Z7">VOX</option>
                        <option value="VO">Voxtel</option>
                        <option value="VY">Voyo</option>
                        <option value="VH">Vsmart</option>
                        <option value="V9">Vsun</option>
                        <option value="VU">Vulcan</option>
                        <option value="3V">VVETIME</option>
                        <option value="WA">Walton</option>
                        <option value="WM">Weimei</option>
                        <option value="WE">WellcoM</option>
                        <option value="W6">WELLINGTON</option>
                        <option value="WD">Western Digital</option>
                        <option value="WT">Westpoint</option>
                        <option value="WY">Wexler</option>
                        <option value="3W">WE</option>
                        <option value="WP">Wieppo</option>
                        <option value="W2">Wigor</option>
                        <option value="WI">Wiko</option>
                        <option value="WF">Wileyfox</option>
                        <option value="WS">Winds</option>
                        <option value="WN">Wink</option>
                        <option value="9W">Winmax</option>
                        <option value="W5">Winnovo</option>
                        <option value="WU">Wintouch</option>
                        <option value="W0">Wiseasy</option>
                        <option value="2W">Wizz</option>
                        <option value="W4">WIWA</option>
                        <option value="WL">Wolder</option>
                        <option value="WG">Wolfgang</option>
                        <option value="WO">Wonu</option>
                        <option value="W1">Woo</option>
                        <option value="WR">Wortmann</option>
                        <option value="WX">Woxter</option>
                        <option value="X3">X-BO</option>
                        <option value="XT">X-TIGI</option>
                        <option value="XV">X-View</option>
                        <option value="X4">X.Vision</option>
                        <option value="XG">Xgody</option>
                        <option value="QX">XGIMI</option>
                        <option value="XL">Xiaolajiao</option>
                        <option value="XI">Xiaomi</option>
                        <option value="XN">Xion</option>
                        <option value="XO">Xolo</option>
                        <option value="XR">Xoro</option>
                        <option value="XS">Xshitou</option>
                        <option value="4X">Xtouch</option>
                        <option value="X8">Xtratech</option>
                        <option value="YD">Yandex</option>
                        <option value="YA">Yarvik</option>
                        <option value="Y2">Yes</option>
                        <option value="YE">Yezz</option>
                        <option value="YK">Yoka TV</option>
                        <option value="YO">Yota</option>
                        <option value="YT">Ytone</option>
                        <option value="Y1">Yu</option>
                        <option value="Y0">YUHO</option>
                        <option value="YN">Yuno</option>
                        <option value="YU">Yuandao</option>
                        <option value="YS">Yusun</option>
                        <option value="YJ">YASIN</option>
                        <option value="YX">Yxtel</option>
                        <option value="0Z">Zatec</option>
                        <option value="2Z">Zaith</option>
                        <option value="PZ">Zebra</option>
                        <option value="ZE">Zeemi</option>
                        <option value="ZN">Zen</option>
                        <option value="ZK">Zenek</option>
                        <option value="ZL">Zentality</option>
                        <option value="ZF">Zfiner</option>
                        <option value="ZI">Zidoo</option>
                        <option value="FZ">ZIFRO</option>
                        <option value="ZX">Ziox</option>
                        <option value="ZO">Zonda</option>
                        <option value="ZP">Zopo</option>
                        <option value="ZT">ZTE</option>
                        <option value="ZU">Zuum</option>
                        <option value="ZY">Zync</option>
                        <option value="ZQ">ZYQ</option>
                        <option value="Z4">ZH&amp;K</option>
                        <option value="OW">öwn</option>
                        <option value="WB">Web TV</option>
                        <option value="XX">Unknown</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Device OS Dropdown */}
              <div className="row">
                <div className="form-group col-xs-12">
                  <label
                    className="control-label"
                    htmlFor="campaignevent_properties_device_os"
                  >
                    Device OS
                  </label>
                  <div className="choice-wrapper">
                    <select
                      id="campaignevent_properties_device_os"
                      name="campaignevent[properties][device_os][]"
                      className="form-control form-select"
                      autoComplete="false"
                      multiple="multiple"
                    >
                        <option value="Android">Android</option>
                        <option value="AmigaOS">AmigaOS</option>
                        <option value="BlackBerry">BlackBerry</option>
                        <option value="Brew">Brew</option>
                        <option value="BeOS">BeOS</option>
                        <option value="Chrome OS">Chrome OS</option>
                        <option value="Firefox OS">Firefox OS</option>
                        <option value="Gaming Console">Gaming Console</option>
                        <option value="Google TV">Google TV</option>
                        <option value="IBM">IBM</option>
                        <option value="iOS">iOS</option>
                        <option value="RISC OS">RISC OS</option>
                        <option value="GNU/Linux">GNU/Linux</option>
                        <option value="Mac">Mac</option>
                        <option value="Mobile Gaming Console">Mobile Gaming Console</option>
                        <option value="Real-time OS">Real-time OS</option>
                        <option value="Other Mobile">Other Mobile</option>
                        <option value="Symbian">Symbian</option>
                        <option value="Unix">Unix</option>
                        <option value="WebTV">WebTV</option>
                        <option value="Windows">Windows</option>
                        <option value="Windows Mobile">Windows Mobile</option>
                        <option value="Other Smart TV">Other Smart TV</option>
                    </select>
                  </div>
                </div>
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
