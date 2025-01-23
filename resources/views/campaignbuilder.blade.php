<!-- Ensure you are including the correct version of jsPlumb -->
<!--<link rel="stylesheet" href="/css/bootstrap5.css"/>-->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="/css/libraries.css"/>
<link rel="stylesheet" href="/css/app.css"/>
<link rel="stylesheet" href="/css/custom.css"/>

<link href="https://cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.min.css" rel="stylesheet" />
<!-- Include Select2 CSS -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" rel="stylesheet" />


<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
<script src="/js/jsplumb.min.js"></script>
<script src="/js/script.js"></script>
<style>
    body {
        font-family: "Source Sans 3",Helvetica,Arial,sans-serif;
        font-size: 13px;
        line-height: 1.3856;
        color: #262d33;
        background-color: #f8f8f8;
    }

    .hide {
        display: none!important;
    }

    #CampaignEventPanel {
        position: absolute;
        padding: 10px 20px;
        background-color: #ededed;
        border: 1px solid #cdcdcd;
        border-radius: 4px;
        z-index: 1035;
    }

    /*.row {
        display: flex;
        flex-wrap: wrap;
        margin-right: -15px;
        margin-left: -15px;
    }*/

    .pl-5, .pl-xs {
        padding-left: 5px!important;
    }

    .pr-5, .pr-xs {
        padding-right: 5px!important;
    }
    
    .ml-0 {
        margin-left: 0px!important;
    }

    .mr-0 {
        margin-right: 0px!important;
    }

    /**/

    #campaign-builder {
        position: relative;
        background: #ffffff;
        border: 1px solid #ddd;
        overflow: auto;
        width: 100%;
        height: 600px;
    }

    .workflow-node {
        width: 200px;
        height: 45px;
        background: #fff;
        /*border: 1px solid #ddd;*/
        border-radius: 3px;
        text-align: left;
        /*line-height: 45px;*/
        font-family: Arial, sans-serif;
        /*font-weight: bold;*/
        cursor: move;
        color: #262d33;
        /*color: #333;*/
        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
        position: absolute;
    }

    /*Defining node colors */
    /*
    .workflow-node[data-type="source"] {
        border: solid 1px #fdb933;
    }

    .workflow-node[data-type="decision"] {
        border: solid 1px #00b49d;
    }

    .workflow-node[data-type="action"] {
        border: solid 1px #9babeb;
    }

    .workflow-node[data-type="condition"] {
        border: solid 1px #ffb79f;
    }
    */
    

    .workflow-nodee[data-type="client"] {
        border-color: #ff5722; /* Red */
        background: #fff3e0;  /* Light red background */
    }

    .workflow-nodee[data-type="email"] {
        border-color: #03a9f4; /* Blue */
        background: #e3f2fd;   /* Light blue background */
    }

    .workflow-nodee[data-type="action"] {
        border-color: #4caf50; /* Green */
        background: #e8f5e9;   /* Light green background */
    }

    .workflow-nodee[data-type="decision"] {
        
        width: 100px;
        height: 100px;
        border-color: #ffeb3b; /* Yellow */
        background: #fffde7;   /* Light yellow background */
        border-radius: 50%;
    }

    .workflow-nodee[data-type="condition"] {
        width: 120px;
        height: 50px;
        border-color: #9c27b0; /* Purple */
        background: #f3e5f5;   /* Light purple background */
        border-radius: 8px;
    }
    
    /* node endpoints*/
    /*.jtk-endpoint{

    }

    .jtk-endpoint .jtk-endpoint-left{

    }

    .jtk-endpoint .jtk-endpoint-right{

    }

    .jtk-endpoint .jtk-endpoint-top{

    }

    .jtk-endpoint .jtk-endpoint-bottom{

    }*/

    /* Connector lines */
    .jsPlumb_connector {
        stroke-width: 2px;
        stroke: #4caf50; /* Green connector line */
        fill: none;
    }

    .select2-container .select2-selection--multiple {
        min-height: 40px; /* Adjust the height */
        overflow-y: auto;
    }


    #CampaignEventPanel{
        left: 523px;
        top: 85px;
        /* width: 500px; */
        /* height: 280px; */
        margin: auto;
    }

    #CampaignEventPanelGroups{
        width: 500px;
        height: 280px;
    }

    .EventGroupList{
        width: 200px;
    }

    

</style>

<div>
    <div id="campaign-builder" class="builder campaign-builder live builder-active" style="width: 100%; height: 600px; border: 1px solid #ccc;">
        
        <div class="btns-builder">
            <button type="button" class="btn btn-primary btn-apply-builder" onclick="Mautic.saveCampaignFromBuilder();">Save</button>
            <button type="button" class="btn btn-primary btn-close-campaign-builder" onclick="Mautic.closeCampaignBuilder();">Close Builder</button>
        </div>
        <div id="builder-errors" class="alert alert-danger" role="alert" style="display: none;">test</div>

        <div id="CampaignEventPanel" class="hide">
            <!-- Event panel groups -->
            <div id="CampaignEventPanelGroups" class="groups-enabled-3 hide">
                <div class="row">
                    <div class="mr-0 ml-0 pl-xs pr-xs campaign-group-container col-md-4" id="DecisionGroupSelector">
                        <div class="panel panel-success mb-0">
                            <div class="panel-heading">
                                <div class="col-xs-8 col-sm-10 np">
                                    <h3 class="panel-title">Decision</h3>
                                </div>
                                <div class="col-xs-4 col-sm-2 pl-0 pr-0 pt-10 pb-10 text-right">
                                    <i class="hidden-xs fa fa-random fa-lg"></i>
                                    <button class="decisionSlctBtn visible-xs pull-right btn btn-sm btn-default btn-nospin text-success" data-type="Decision" onClick="selectEvent(event,'Decision');">
                                        Select
                                    </button>
                                </div>
                            </div>
                            <div class="panel-body">
                                A decision is made when a contact decides to take action or not (e.g. opened an email).
                            </div>
                            <div class="hidden-xs panel-footer text-center">
                                <button class="decisionSlctBtn btn btn-lg btn-default btn-nospin text-success" data-type="Decision" onClick="selectEvent(event,'Decision');">
                                    Select
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="mr-0 ml-0 pl-xs pr-xs campaign-group-container col-md-4" id="ActionGroupSelector">
                        <div class="panel panel-primary mb-0">
                            <div class="panel-heading">
                                <div class="col-xs-8 col-sm-10 np">
                                    <h3 class="panel-title">Action</h3>
                                </div>
                                <div class="col-xs-4 col-sm-2 pl-0 pr-0 pt-10 pb-10 text-right">
                                    <i class="hidden-xs fa fa-bullseye fa-lg"></i>
                                    <button class="actionSlctBtn visible-xs pull-right btn btn-sm btn-default btn-nospin text-primary" data-type="Action" onClick="selectEvent(event,'Action');">
                                        Select
                                    </button>
                                </div>
                            </div>
                            <div class="panel-body">
                                An action is something executed by Mautic (e.g. send an email).
                            </div>
                            <div class="hidden-xs panel-footer text-center">
                                <button class="actionSlctBtn btn btn-lg btn-default btn-nospin text-primary" data-type="Action" onClick="selectEvent(event,'Action');">
                                    Select
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="mr-0 ml-0 pl-xs pr-xs campaign-group-container col-md-4" id="ConditionGroupSelector">
                        <div class="panel panel-danger mb-0">
                            <div class="panel-heading">
                                <div class="col-xs-8 col-sm-10 np">
                                    <h3 class="panel-title">Condition</h3>
                                </div>
                                <div class="col-xs-4 col-sm-2 pl-0 pr-0 pt-10 pb-10 text-right">
                                    <i class="hidden-xs fa fa-filter fa-lg"></i>
                                    <button class="conditionSlctBtn visible-xs pull-right btn btn-sm btn-default btn-nospin text-danger" data-type="Condition" onClick="selectEvent(event,'Condition');">
                                        Select
                                    </button>
                                </div>
                            </div>
                            <div class="panel-body">A condition is based on known profile field values or submitted form data.</div>
                            <div class="hidden-xs panel-footer text-center">
                                <button class="conditionSlctBtn btn btn-lg btn-default btn-nospin" data-type="Condition" onClick="selectEvent(event,'Condition');">
                                    Select
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="mr-0 ml-0 pl-xs pr-xs campaign-group-container col-md-12">
                        <div id="CampaignPasteContainer" class="panel hide">
                            <div id="CampaignPasteDescription" class="panel-body">
                                <div><b>Insert cloned event here</b></div>
                                <div><span class="text-muted">Name: </span><span data-campaign-event-clone="sourceEventName"></span></div>
                                <div><span class="text-muted">From: </span><span data-campaign-event-clone="sourceCampaignName"></span></div>

                            </div>
                            <div class="panel-footer">
                                <a id="EventInsertButton" data-toggle="ajax" data-target="CampaignEvent_" data-ignore-formexit="true" data-method="POST" data-hide-loadingbar="true" href="/s/campaigns/events/insert?campaignId=mautic_312a76bbb3c6d0553fb080987a6e787182db510d&amp;anchor=leadsource&amp;anchorEventType=source" class="btn btn-lg btn-default">
                                    Insert
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- event panel list -->
            <div id="CampaignEventPanelLists" class="hide">

                <!-- Campaign Source List -->
                <div id="SourceGroupList" class="EventGroupList eventList hide">
                    <h4 class="mb-xs">
                        <span>Contact Sources</span>
                    </h4>

                    <select id="SourceList" class="campaign-event-selector" style="display: none;" onChange="selectCampaignSource(event);">
                        <option value=""></option>
                        <option id="campaignLeadSource_lists" class="option_campaignLeadSource_lists" data-href="/s/campaigns/sources/new/mautic_2c5b105523f135723e5fa80b41511b682b4c42c5?sourceType=lists" data-target="#CampaignEventModal" title="Contacts that are members of the selected segments will be automatically added to this campaign." value="lists">
                            Contact segments
                        </option>
                        <option id="campaignLeadSource_forms" class="option_campaignLeadSource_forms" data-href="/s/campaigns/sources/new/mautic_2c5b105523f135723e5fa80b41511b682b4c42c5?sourceType=forms" data-target="#CampaignEventModal" title="Contacts created from submissions for the selected forms will be automatically added to this campaign." value="forms">
                            Campaign forms
                        </option>
                    </select>
                </div>

                <!-- Action List -->
                <div id="ActionGroupList" class="EventGroupList eventList hide">
                    <h4 class="mb-xs">
                        <span>Actions</span>
                        <button class="pull-right btn btn-xs btn-nospin btn-primary">
                            <i class="fa fa-fw ri-corner-right-up-line"></i>
                        </button>
                    </h4>
                    
                    <select id="ActionList" class="campaign-event-selector" style="display: none;" data-eventType="action" onChange="selectDecision(event);">
                        <option value=""></option>
                        <?php
                        foreach($actions as $action){
                            $tmpActId = $action["id"];
                            $tmpActEvnt = $action["event"];
                            $tmpActEvntVal = $action["value"];
                            $tmpActTitle = $action["title"];
                            $tmpActDesc = $action["description"];
                            $tmpOpt = '<option id="campaignEvent_'.$tmpActEvnt.'" class="option_campaignEvent_'.$tmpActEvnt.'" title="'.$tmpActDesc.'" value="'.$tmpActEvntVal.'">'.$tmpActTitle.'</option>';

                            echo $tmpOpt;
                        }
                        ?>
                    </select>
                </div>

                <!-- Decision List -->
                <div id="DecisionGroupList" class="EventGroupList eventList hide">
                    <h4 class="mb-xs">
                        <span>Decisions</span>
                        <button class="pull-right btn btn-xs btn-nospin btn-success">
                            <i class="fa fa-fw ri-corner-right-up-line"></i>
                        </button>
                    </h4>
                    <select id="DecisionList" class="campaign-event-selector" style="display: none;" data-eventType="decision" onChange="selectDecision(event);">
                        <option value=""></option>
                        <?php
                        foreach($decisions as $decision){
                            $tmpDecsId = $decision["id"];
                            $tmpDecsEvnt = $decision["event"];
                            $tmpDecsEvntVal = $decision["value"];
                            $tmpDecsTitle = $decision["title"];
                            $tmpDecsDesc = $decision["description"];
                            $tmpOpt = '<option id="campaignEvent_'.$tmpDecsEvnt.'" class="option_campaignEvent_'.$tmpActEvnt.'" title="'.$tmpDecsDesc.'" value="'.$tmpDecsEvntVal.'">'.$tmpDecsTitle.'</option>';

                            echo $tmpOpt;
                        }
                        ?>
                    </select>
                </div>
                
                <!-- Condition List -->
                <div id="ConditionGroupList" class="EventGroupList eventList hide">
                    <h4 class="mb-xs">
                        <span>Conditions</span>
                        <button class="pull-right btn btn-xs btn-nospin btn-danger">
                            <i class="fa fa-fw ri-corner-right-up-line"></i>
                        </button>
                    </h4>
                    <select id="ConditionList" class="campaign-event-selector" style="display: none;" data-eventType="condition" onChange="selectDecision(event);">
                        <option value=""></option>
                        
                        <?php
                        foreach($conditions as $condition){
                            $tmpCondId = $condition["id"];
                            $tmpCondEvnt = $condition["event"];
                            $tmpCondEvntVal = $condition["value"];
                            $tmpCondTitle = $condition["title"];
                            $tmpCondDesc = $condition["description"];
                            $tmpOpt = '<option id="campaignEvent_'.$tmpDecsEvnt.'" class="option_campaignEvent_'.$tmpCondEvnt.'" title="'.$tmpCondDesc.'" value="'.$tmpCondEvntVal.'">'.$tmpCondTitle.'</option>';

                            echo $tmpOpt;
                        }
                        ?>
                    </select>
                </div>

            </div>

        </div>
        <div class="builder-content" style="overflow: auto;">
            <div id="CampaignCanvas">
                <!-- Dynamic campaign nodes will be added here -->
                <div id="CampaignEvent_newsource" class="text-center list-campaign-source list-campaign-leadsource" style="left: 545px; top: 50px;">
                    <div class="campaign-event-content">
                        <div>
                            <span class="campaign-event-name ellipsis">
                                <i class="mr-sm ri-team-line"></i> Add a contact source...
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- modal box -->
<!-- Campaign Source Modal Form-->
<div class="modal fade in" id="campaignSourceModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title" id="contactModalLabel">Contact Source</h3>
          <h6 class="text-muted">Contacts that are members of the selected segments will be automatically added to this campaign.</h6>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label id="contactSegmentsLable" for="contactSegments" class="form-label">Contact segments *</label>
              <select id="contactSegments" multiple="multiple" class="form-select" style="width: 100%;">
                <?php
                foreach($segments as $segment){
                    $tmpSegId = $segment["id"];
                    $tmpSegName = $segment["name"];
                    $tmpSegCont = $segment["contacts"];
                    
                    $tmpOpt = '<option id="campaignSegment_'.$tmpSegId.'" title="'.$tmpSegName.'('.$tmpSegCont.')'.'" value="'.$tmpSegId.'">'.$tmpSegName.'('.$tmpSegCont.')'.'</option>';

                    echo $tmpOpt;
                }
                ?>
              </select>
              <div id="contactSourceErrMsg" class="hide">A value is required.</div>
            </div>
            
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" onClick="addSource('contactSegments');">+ Add</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick="closeModal('cancel','campaignSourceModal');">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Events Modal -->
  <div class="modal fade in" id="campaignEventModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
   <div class="modal-dialog">
      <div class="modal-content">
         <div class="modal-body ">
            <div class="loading-placeholder">
               Loading...                
            </div>
            <div id="event-modal-body-content" class="modal-body-content">
            
            </div>
         </div>
         <div class="modal-footer">
            <div class="modal-form-buttons">
                <button type="button" class="btn btn-default btn-save btn-copy" onclick="saveevent();">
                <i class="ri-add-line "></i>Add
                </button>
                <button type="button" class="btn btn-default btn-cancel btn-copy" onclick="cancelevent();" data-bs-dismiss="modal">
                <i class="ri-close-line "></i>Cancel
                </button>
            </div>
         </div>
      </div>
   </div>
</div>



<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>


<script>
    var CSRFTOKEN = "{{ csrf_token() }}";
    const SERVICEURL = '<?php echo url('/'); ?>';
    var instance;
    var WORKFLOW = {};
    var CAMPAIGN_ID = '<?php echo $campaignId;?>';
    
    window.onload = function () {

        $('.campaign-event-selector').chosen({
            width: "100%",
            no_results_text: "No results match"
        });

        // Initialize the Select2 plugin
        $('#contactSegments').select2({
            placeholder: "Select contact segments",
            allowClear: true,
            width: '100%',  // Makes it responsive
            dropdownParent: $('#campaignSourceModal') // Ensures dropdown is within the modal
        });

        // Initialize jsPlumb instance
        instance = jsPlumb.getInstance({
            //container: document.getElementById("campaign-builder"),
            container: document.getElementById("CampaignCanvas"),
        });

        document.body.addEventListener('click', function(event) {
            // Call your custom function
            //closeCampaignEventPanel();
        });

        // Prevent modal from closing on backdrop click
        const modalElement = document.getElementById('campaignEventModal');
        modalElement.addEventListener('click', function (event) {
            if (event.target === modalElement) {
                event.stopPropagation();
            }
        });
        
        /*
        // Create nodes for client, email, and decision actions
        createNode("client", "Client", "client", 100, 50);
        createNode("email1", "Email 1", "email", 300, 50);
        createNode("open1", "Client Open Mail 1", "action", 300, 150);
        createNode("email2client", "Email 2 Client", "email", 500, 150);

        // Add Decision node
        createNode("decision1", "Decision 1", "decision", 700, 100);

        createNode("dev", "Dev", "client", 100, 250);
        createNode("emailDev1", "Email Dev 1", "email", 300, 250);
        createNode("openDev1", "Dev Open Mail 1", "action", 300, 350);
        createNode("email2Dev", "Email 2 Dev", "email", 500, 350);

        // Add Condition node
        createNode("condition1", "Condition 1", "condition", 700, 250);

        // Create connections (Add your connection logic)
        instance.connect({ source: "client", target: "email1" });
        instance.connect({ source: "email1", target: "open1" });
        instance.connect({ source: "open1", target: "email2client" });
        instance.connect({ source: "dev", target: "emailDev1" });
        instance.connect({ source: "emailDev1", target: "openDev1" });
        instance.connect({ source: "openDev1", target: "email2Dev" });
        instance.connect({ source: "email2client", target: "decision1" });
        instance.connect({ source: "email2Dev", target: "condition1" });
        */

        //on page load step-1
        createAddSourceNode();
        
        //temporary comment for the development purpose
        //createContactSourceNode();

        
    }

    // Helper to create a node
    function createNode(propJson, x, y) {
        
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

        //add circles/buttons/endpoints
        
        if(type == 'source'){
            
            const endpointLeft = createNodeEndpoints(type,'left');
            const endpointRight = createNodeEndpoints(type,'right');
            const endpointBottomCenter = createNodeEndpoints(type,'bottom-center');

            node.appendChild(endpointLeft);
            node.appendChild(endpointRight);
            node.appendChild(endpointBottomCenter);

        }else if(type == 'decision'){
            
            const endpointTopCenter = createNodeEndpoints(type,'top-center');
            const endpointBottomLeft = createNodeEndpoints(type,'bottom-left');
            const endpointBottomRight = createNodeEndpoints(type,'bottom-right');
            
            node.appendChild(endpointTopCenter);
            node.appendChild(endpointBottomLeft);
            node.appendChild(endpointBottomRight);

        }else if(type == 'action'){
            
            const endpointTopCenter = createNodeEndpoints(type,'top-center');
            const endpointBottomCenter = createNodeEndpoints(type,'bottom-center');

            node.appendChild(endpointTopCenter);
            node.appendChild(endpointBottomCenter);

        }else if(type == 'condition'){
            
            const endpointTopCenter = createNodeEndpoints(type,'top-center');
            const endpointBottomLeft = createNodeEndpoints(type,'bottom-left');
            const endpointBottomRight = createNodeEndpoints(type,'bottom-right');
            
            node.appendChild(endpointTopCenter);
            node.appendChild(endpointBottomLeft);
            node.appendChild(endpointBottomRight);
            
        }
        
        document.getElementById("campaign-builder").appendChild(node);

        // Make the node draggable and connectable
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

    }
    
    function createNodeEndpoints(nodeType,endpointType){
        //nodeType,endpointType
        //source left right bottom-center
        //decision top-center bottom-left bottom-right
        //action top-center bottom-center
        //condition top-center bottom-left bottom-right
        
        if(nodeType == 'source'){

            if(endpointType == 'left'){
                const endpointLeft = document.createElement("div");
                endpointLeft.style.position = "absolute";
                endpointLeft.style.width = "20px";
                endpointLeft.style.height = "20px";
                endpointLeft.style.left = "-11px";
                endpointLeft.style.top = "12px";
                endpointLeft.className = "jtk-endpoint jtk-endpoint-left jtk-endpoint-anchor-leadsourceleft CampaignEvent_lists jtk-draggable jtk-droppable";
                endpointLeft.innerHTML = `
                <svg style="position:absolute;left: 0px;top: 0px;" width="20" height="20" pointer-events="all" position="absolute" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#d5d4d4" stroke="none" style=""></circle><text x="50%" y="50%" text-anchor="middle" stroke-width="2px" stroke="#ffffff" dy=".3em">+</text></svg>`;
                
                // Add class on mouseover
                endpointLeft.addEventListener('mouseover', function() {
                    endpointLeft.classList.add('jtk-hover');
                    endpointLeft.classList.add('jtk-clickable_anchor');
                        
                });

                // Remove class on mouseout
                endpointLeft.addEventListener('mouseout', function() {
                    endpointLeft.classList.remove('jtk-hover');
                    endpointLeft.classList.remove('jtk-clickable_anchor');
                });

                // You can also use mouseenter and mouseleave if you want
                // to avoid bubbling (mousein/mouseout can bubble)
                endpointLeft.addEventListener('mouseenter', function() {
                    endpointLeft.classList.add('jtk-hover');
                    endpointLeft.classList.add('jtk-clickable_anchor');
                });

                endpointLeft.addEventListener('mouseleave', function() {
                    endpointLeft.classList.remove('jtk-hover');
                    endpointLeft.classList.remove('jtk-clickable_anchor');
                });

                return endpointLeft;
            }
            
            if(endpointType == 'right'){
                const endpointRight = document.createElement("div");
                endpointRight.style.position = "absolute";
                endpointRight.style.width = "20px";
                endpointRight.style.height = "20px";
                endpointRight.style.left = "190px";
                endpointRight.style.top = "12px";

                endpointRight.className = "jtk-endpoint jtk-endpoint-right jtk-endpoint-anchor-leadsourceright CampaignEvent_lists jtk-draggable jtk-droppable";
                endpointRight.innerHTML = `
                <svg style="position:absolute;left: 0px;top: 0px;" width="20" height="20" pointer-events="all" position="absolute" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#d5d4d4" stroke="none" style=""></circle><text x="50%" y="50%" text-anchor="middle" stroke-width="2px" stroke="#ffffff" dy=".3em">+</text></svg>`;

                // Add class on mouseover
                endpointRight.addEventListener('mouseover', function() {
                    endpointRight.classList.add('jtk-hover');
                    endpointRight.classList.add('jtk-clickable_anchor');
                        
                });

                // Remove class on mouseout
                endpointRight.addEventListener('mouseout', function() {
                    endpointRight.classList.remove('jtk-hover');
                    endpointRight.classList.remove('jtk-clickable_anchor');
                });

                // You can also use mouseenter and mouseleave if you want
                // to avoid bubbling (mousein/mouseout can bubble)
                endpointRight.addEventListener('mouseenter', function() {
                    endpointRight.classList.add('jtk-hover');
                    endpointRight.classList.add('jtk-clickable_anchor');
                });

                endpointRight.addEventListener('mouseleave', function() {
                    endpointRight.classList.remove('jtk-hover');
                    endpointRight.classList.remove('jtk-clickable_anchor');
                });

                return endpointRight;
            }

            if(endpointType == 'bottom-center'){
                const endpointBottom = document.createElement("div");
                endpointBottom.style.position = "absolute";
                endpointBottom.style.width = "20px";
                endpointBottom.style.height = "20px";
                endpointBottom.style.left = "90px";
                endpointBottom.style.top = "32px";

                endpointBottom.className = "jtk-endpoint jtk-endpoint-bottom jtk-endpoint-anchor-leadsource CampaignEvent_lists jtk-draggable jtk-droppable";
                endpointBottom.innerHTML = `
                <svg style="position:absolute;left: 0px;top: 0px;" width="20" height="20" pointer-events="all" position="absolute" version="1.1" xmlns="http://www.w3.org/2000/svg" data-anchor="leadsource" onClick="{campaignEventPanel(event);}"><circle cx="10" cy="10" r="10" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#d5d4d4" stroke="none" style=""></circle><text x="50%" y="50%" text-anchor="middle" stroke-width="2px" stroke="#ffffff" dy=".3em">+</text></svg>`;

                // Add class on mouseover
                endpointBottom.addEventListener('mouseover', function() {
                    endpointBottom.classList.add('jtk-hover');
                    endpointBottom.classList.add('jtk-clickable_anchor');
                        
                });

                // Remove class on mouseout
                endpointBottom.addEventListener('mouseout', function() {
                    endpointBottom.classList.remove('jtk-hover');
                    endpointBottom.classList.remove('jtk-clickable_anchor');
                });

                // You can also use mouseenter and mouseleave if you want
                // to avoid bubbling (mousein/mouseout can bubble)
                endpointBottom.addEventListener('mouseenter', function() {
                    endpointBottom.classList.add('jtk-hover');
                    endpointBottom.classList.add('jtk-clickable_anchor');
                });

                endpointBottom.addEventListener('mouseleave', function() {
                    endpointBottom.classList.remove('jtk-hover');
                    endpointBottom.classList.remove('jtk-clickable_anchor');
                });

                return endpointBottom;
            }

        }else if(nodeType == 'decision'){
            //decision top-center bottom-left bottom-right
            if(endpointType == 'top-center'){
                const endpointTop = document.createElement("div");
                endpointTop.style.position = "absolute";
                endpointTop.style.width = "20px";
                endpointTop.style.height = "20px";
                endpointTop.style.left = "90px";
                endpointTop.style.top = "-11px";
                
                endpointTop.className = "jtk-endpoint jtk-endpoint-top jtk-endpoint-anchor-leadsource CampaignEvent_lists jtk-draggable jtk-droppable";
                endpointTop.innerHTML = `
                <svg style="position:absolute;left: 0px;top: 0px;" width="20" height="20" pointer-events="all" position="absolute" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#d5d4d4" stroke="none" style=""></circle><text x="50%" y="50%" text-anchor="middle" stroke-width="2px" stroke="#ffffff" dy=".3em">+</text></svg>`;

                // Add class on mouseover
                endpointTop.addEventListener('mouseover', function() {
                    endpointTop.classList.add('jtk-hover');
                    endpointTop.classList.add('jtk-clickable_anchor');
                    
                });

                // Remove class on mouseout
                endpointTop.addEventListener('mouseout', function() {
                    endpointTop.classList.remove('jtk-hover');
                    endpointTop.classList.remove('jtk-clickable_anchor');
                });

                // You can also use mouseenter and mouseleave if you want
                // to avoid bubbling (mousein/mouseout can bubble)
                endpointTop.addEventListener('mouseenter', function() {
                    endpointTop.classList.add('jtk-hover');
                    endpointTop.classList.add('jtk-clickable_anchor');
                });

                endpointTop.addEventListener('mouseleave', function() {
                    endpointTop.classList.remove('jtk-hover');
                    endpointTop.classList.remove('jtk-clickable_anchor');
                });

                return endpointTop;
            }
            
            if(endpointType == 'bottom-left'){
                
                const endpointTop = document.createElement("div");
                endpointTop.style.position = "absolute";
                endpointTop.style.width = "20px";
                endpointTop.style.height = "20px";
                endpointTop.style.left = "25px";
                endpointTop.style.top = "32px";
                
                endpointTop.className = "jtk-endpoint jtk-endpoint-anchor-yes jtk-endpoint-anchor-leadsourcedd CampaignEvent_listsdd jtk-draggable jtk-droppable";
                endpointTop.innerHTML = `
                <svg style="position:absolute;left: 0px;top: 0px;" width="20" height="20" pointer-events="all" position="absolute" version="1.1" xmlns="http://www.w3.org/2000/svg" data-anchor="yes" onClick="{campaignEventPanel(event);}"><circle cx="10" cy="10" r="10" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#d5d4d4" stroke="none" style=""></circle><text x="50%" y="50%" text-anchor="middle" stroke-width="2px" stroke="#ffffff" dy=".3em">+</text></svg>`;

                // Add class on mouseover
                endpointTop.addEventListener('mouseover', function() {
                    endpointTop.classList.add('jtk-hover');
                    endpointTop.classList.add('jtk-clickable_anchor');
                    
                });

                // Remove class on mouseout
                endpointTop.addEventListener('mouseout', function() {
                    endpointTop.classList.remove('jtk-hover');
                    endpointTop.classList.remove('jtk-clickable_anchor');
                });

                // You can also use mouseenter and mouseleave if you want
                // to avoid bubbling (mousein/mouseout can bubble)
                endpointTop.addEventListener('mouseenter', function() {
                    endpointTop.classList.add('jtk-hover');
                    endpointTop.classList.add('jtk-clickable_anchor');
                });

                endpointTop.addEventListener('mouseleave', function() {
                    endpointTop.classList.remove('jtk-hover');
                    endpointTop.classList.remove('jtk-clickable_anchor');
                });

                return endpointTop;
            }

            if(endpointType == 'bottom-right'){
                
                const endpointTop = document.createElement("div");
                endpointTop.style.position = "absolute";
                endpointTop.style.width = "20px";
                endpointTop.style.height = "20px";
                endpointTop.style.left = "155px";
                endpointTop.style.top = "32px";
                
                endpointTop.className = "jtk-endpoint jtk-endpoint-anchor-no jtk-endpoint-anchor-leadsourcedd CampaignEvent_listsdd jtk-draggable jtk-droppable";
                endpointTop.innerHTML = `
                <svg style="position:absolute;left: 0px;top: 0px;" width="20" height="20" pointer-events="all" position="absolute" version="1.1" xmlns="http://www.w3.org/2000/svg" data-anchor="no" onClick="{campaignEventPanel(event);}"><circle cx="10" cy="10" r="10" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#d5d4d4" stroke="none" style=""></circle><text x="50%" y="50%" text-anchor="middle" stroke-width="2px" stroke="#ffffff" dy=".3em">+</text></svg>`;

                // Add class on mouseover
                endpointTop.addEventListener('mouseover', function() {
                    endpointTop.classList.add('jtk-hover');
                    endpointTop.classList.add('jtk-clickable_anchor');
                    
                });

                // Remove class on mouseout
                endpointTop.addEventListener('mouseout', function() {
                    endpointTop.classList.remove('jtk-hover');
                    endpointTop.classList.remove('jtk-clickable_anchor');
                });

                // You can also use mouseenter and mouseleave if you want
                // to avoid bubbling (mousein/mouseout can bubble)
                endpointTop.addEventListener('mouseenter', function() {
                    endpointTop.classList.add('jtk-hover');
                    endpointTop.classList.add('jtk-clickable_anchor');
                });

                endpointTop.addEventListener('mouseleave', function() {
                    endpointTop.classList.remove('jtk-hover');
                    endpointTop.classList.remove('jtk-clickable_anchor');
                });

                return endpointTop;
            }

        }else if(nodeType == 'action'){
            //action top-center bottom-center
            if(endpointType == 'top-center'){
                const endpointTop = document.createElement("div");
                endpointTop.style.position = "absolute";
                endpointTop.style.width = "20px";
                endpointTop.style.height = "20px";
                endpointTop.style.left = "90px";
                endpointTop.style.top = "-11px";
                
                endpointTop.className = "jtk-endpoint jtk-endpoint-top jtk-endpoint-anchor-top jtk-endpoint-anchor-leadsourcedd CampaignEvent_listsdd jtk-draggable jtk-droppable";
                endpointTop.innerHTML = `
                <svg style="position:absolute;left: 0px;top: 0px;" width="20" height="20" pointer-events="all" position="absolute" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#d5d4d4" stroke="none" style=""></circle><text x="50%" y="50%" text-anchor="middle" stroke-width="2px" stroke="#ffffff" dy=".3em">+</text></svg>`;

                // Add class on mouseover
                endpointTop.addEventListener('mouseover', function() {
                    endpointTop.classList.add('jtk-hover');
                    endpointTop.classList.add('jtk-clickable_anchor');
                    
                });

                // Remove class on mouseout
                endpointTop.addEventListener('mouseout', function() {
                    endpointTop.classList.remove('jtk-hover');
                    endpointTop.classList.remove('jtk-clickable_anchor');
                });

                // You can also use mouseenter and mouseleave if you want
                // to avoid bubbling (mousein/mouseout can bubble)
                endpointTop.addEventListener('mouseenter', function() {
                    endpointTop.classList.add('jtk-hover');
                    endpointTop.classList.add('jtk-clickable_anchor');
                });

                endpointTop.addEventListener('mouseleave', function() {
                    endpointTop.classList.remove('jtk-hover');
                    endpointTop.classList.remove('jtk-clickable_anchor');
                });

                return endpointTop;
            }

            if(endpointType == 'bottom-center'){
                const endpointBottom = document.createElement("div");
                endpointBottom.style.position = "absolute";
                endpointBottom.style.width = "20px";
                endpointBottom.style.height = "20px";
                endpointBottom.style.left = "90px";
                endpointBottom.style.top = "32px";

                endpointBottom.className = "jtk-endpoint jtk-endpoint-bottom jtk-endpoint-anchor-bottom jtk-endpoint-anchor-leadsourcedd CampaignEvent_listsdd jtk-draggable jtk-droppable";
                endpointBottom.innerHTML = `
                <svg style="position:absolute;left: 0px;top: 0px;" width="20" height="20" pointer-events="all" position="absolute" version="1.1" xmlns="http://www.w3.org/2000/svg" data-anchor="bottom" onClick="{campaignEventPanel(event);}"><circle cx="10" cy="10" r="10" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#d5d4d4" stroke="none" style=""></circle><text x="50%" y="50%" text-anchor="middle" stroke-width="2px" stroke="#ffffff" dy=".3em">+</text></svg>`;

                // Add class on mouseover
                endpointBottom.addEventListener('mouseover', function() {
                    endpointBottom.classList.add('jtk-hover');
                    endpointBottom.classList.add('jtk-clickable_anchor');
                        
                });

                // Remove class on mouseout
                endpointBottom.addEventListener('mouseout', function() {
                    endpointBottom.classList.remove('jtk-hover');
                    endpointBottom.classList.remove('jtk-clickable_anchor');
                });

                // You can also use mouseenter and mouseleave if you want
                // to avoid bubbling (mousein/mouseout can bubble)
                endpointBottom.addEventListener('mouseenter', function() {
                    endpointBottom.classList.add('jtk-hover');
                    endpointBottom.classList.add('jtk-clickable_anchor');
                });

                endpointBottom.addEventListener('mouseleave', function() {
                    endpointBottom.classList.remove('jtk-hover');
                    endpointBottom.classList.remove('jtk-clickable_anchor');
                });

                return endpointBottom;
            }

        }else if(nodeType == 'condition'){
            //condition top-center bottom-left bottom-right
            if(endpointType == 'top-center'){
                const endpointTop = document.createElement("div");
                endpointTop.style.position = "absolute";
                endpointTop.style.width = "20px";
                endpointTop.style.height = "20px";
                endpointTop.style.left = "90px";
                endpointTop.style.top = "-11px";
                
                endpointTop.className = "jtk-endpoint jtk-endpoint-top jtk-endpoint-anchor-top jtk-endpoint-anchor-leadsourcedd CampaignEvent_listsdd jtk-draggable jtk-droppable";
                endpointTop.innerHTML = `
                <svg style="position:absolute;left: 0px;top: 0px;" width="20" height="20" pointer-events="all" position="absolute" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#d5d4d4" stroke="none" style=""></circle><text x="50%" y="50%" text-anchor="middle" stroke-width="2px" stroke="#ffffff" dy=".3em">+</text></svg>`;

                // Add class on mouseover
                endpointTop.addEventListener('mouseover', function() {
                    endpointTop.classList.add('jtk-hover');
                    endpointTop.classList.add('jtk-clickable_anchor');
                    
                });

                // Remove class on mouseout
                endpointTop.addEventListener('mouseout', function() {
                    endpointTop.classList.remove('jtk-hover');
                    endpointTop.classList.remove('jtk-clickable_anchor');
                });

                // You can also use mouseenter and mouseleave if you want
                // to avoid bubbling (mousein/mouseout can bubble)
                endpointTop.addEventListener('mouseenter', function() {
                    endpointTop.classList.add('jtk-hover');
                    endpointTop.classList.add('jtk-clickable_anchor');
                });

                endpointTop.addEventListener('mouseleave', function() {
                    endpointTop.classList.remove('jtk-hover');
                    endpointTop.classList.remove('jtk-clickable_anchor');
                });

                return endpointTop;
            }

            if(endpointType == 'bottom-left'){
                
                const endpointTop = document.createElement("div");
                endpointTop.style.position = "absolute";
                endpointTop.style.width = "20px";
                endpointTop.style.height = "20px";
                endpointTop.style.left = "25px";
                endpointTop.style.top = "32px";
                
                endpointTop.className = "jtk-endpoint jtk-endpoint-anchor-yes jtk-endpoint-anchor-leadsourcedd CampaignEvent_listsdd jtk-draggable jtk-droppable";
                endpointTop.innerHTML = `
                <svg style="position:absolute;left: 0px;top: 0px;" width="20" height="20" pointer-events="all" position="absolute" version="1.1" xmlns="http://www.w3.org/2000/svg" data-anchor="yes" onClick="{campaignEventPanel(event);}"><circle cx="10" cy="10" r="10" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#d5d4d4" stroke="none" style=""></circle><text x="50%" y="50%" text-anchor="middle" stroke-width="2px" stroke="#ffffff" dy=".3em">+</text></svg>`;

                // Add class on mouseover
                endpointTop.addEventListener('mouseover', function() {
                    endpointTop.classList.add('jtk-hover');
                    endpointTop.classList.add('jtk-clickable_anchor');
                    
                });

                // Remove class on mouseout
                endpointTop.addEventListener('mouseout', function() {
                    endpointTop.classList.remove('jtk-hover');
                    endpointTop.classList.remove('jtk-clickable_anchor');
                });

                // You can also use mouseenter and mouseleave if you want
                // to avoid bubbling (mousein/mouseout can bubble)
                endpointTop.addEventListener('mouseenter', function() {
                    endpointTop.classList.add('jtk-hover');
                    endpointTop.classList.add('jtk-clickable_anchor');
                });

                endpointTop.addEventListener('mouseleave', function() {
                    endpointTop.classList.remove('jtk-hover');
                    endpointTop.classList.remove('jtk-clickable_anchor');
                });

                return endpointTop;
            }

            if(endpointType == 'bottom-right'){
                
                const endpointTop = document.createElement("div");
                endpointTop.style.position = "absolute";
                endpointTop.style.width = "20px";
                endpointTop.style.height = "20px";
                endpointTop.style.left = "155px";
                endpointTop.style.top = "32px";
                
                endpointTop.className = "jtk-endpoint jtk-endpoint-anchor-no jtk-endpoint-anchor-leadsourcedd CampaignEvent_listsdd jtk-draggable jtk-droppable";
                endpointTop.innerHTML = `
                <svg style="position:absolute;left: 0px;top: 0px;" width="20" height="20" pointer-events="all" position="absolute" version="1.1" xmlns="http://www.w3.org/2000/svg" data-anchor="no" onClick="{campaignEventPanel(event);}"><circle cx="10" cy="10" r="10" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#d5d4d4" stroke="none" style=""></circle><text x="50%" y="50%" text-anchor="middle" stroke-width="2px" stroke="#ffffff" dy=".3em">+</text></svg>`;

                // Add class on mouseover
                endpointTop.addEventListener('mouseover', function() {
                    endpointTop.classList.add('jtk-hover');
                    endpointTop.classList.add('jtk-clickable_anchor');
                    
                });

                // Remove class on mouseout
                endpointTop.addEventListener('mouseout', function() {
                    endpointTop.classList.remove('jtk-hover');
                    endpointTop.classList.remove('jtk-clickable_anchor');
                });

                // You can also use mouseenter and mouseleave if you want
                // to avoid bubbling (mousein/mouseout can bubble)
                endpointTop.addEventListener('mouseenter', function() {
                    endpointTop.classList.add('jtk-hover');
                    endpointTop.classList.add('jtk-clickable_anchor');
                });

                endpointTop.addEventListener('mouseleave', function() {
                    endpointTop.classList.remove('jtk-hover');
                    endpointTop.classList.remove('jtk-clickable_anchor');
                });

                return endpointTop;
            }
        }
        
    }

    function createAddSourceNode(){
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
        
    }

    function selectCampaignSource(event){
        
        const sourceType = event.target.value;
        const optionVal = event.target.selectedOptions[0].value;
        const optionDataHref = event.target.selectedOptions[0].dataset.href;
        const optionDataTarget = event.target.selectedOptions[0].dataset.target;

        //console.log(sourceVal +'--'+ optionVal +'--'+ optionDataHref +'--'+ optionDataTarget);

        openSourceModal(sourceType);
    }

    function openSourceModal(sourceType){
        const CampaignEventPanelElm = document.getElementById("CampaignEventPanel");
        CampaignEventPanelElm.classList.add("hide");
        
        document.getElementById("CampaignEventPanelLists").classList.add("hide");
        document.getElementById("SourceGroupList").classList.add("hide");

        //show modal
        const campaignSourceModal = new bootstrap.Modal(document.getElementById('campaignSourceModal'));
        campaignSourceModal.show();
        
    }

    function closeModal(action,modalId){
        
        //campaignSourceModal   
        //console.log("modalId:" + modalId);     
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
    }

    function createContactSourceNode(){
        //demo function
        // create campaign/contact source
        
        var nodeType = 'source';
        var nodeId = 'CampaignEvent_lists'; //'CampaignEvent_new-'+generateSecureUniqueId();
        var nodeContent = 'Add a contact source';
        var dataConnected = '';
        
        const propJson = {
            "type":nodeType,
            "id":nodeId,
            "parentNodeId":"",
            "parentNodeType":"",
            "content":nodeContent,
            "dataConnected":dataConnected
        };

        const x = 545;
        const y = 50;
        createNode(propJson, x, y);

    }
    
    function saveWorkflow() {
        // Save workflow function
        const nodes = Array.from(document.querySelectorAll(".workflow-node")).map((node) => ({
            id: node.id,
            content: node.innerHTML,
            position: {
                left: node.style.left,
                top: node.style.top,
            },
        }));

        const connections = instance.getAllConnections().map((connection) => ({
            source: connection.sourceId,
            target: connection.targetId,
        }));

        const workflow = { nodes, connections };

        // Send the workflow data to your backend via AJAX
        fetch("/save-workflow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(workflow),
        })
        .then((response) => response.json())
        .then((data) => console.log("Workflow saved:", data))
        .catch((error) => console.error("Error saving workflow:", error));
    }

    function campaignEventPanel(node){

        //CampaignEventPanel CampaignEventPanelGroups SourceGroupList

        console.log('node:', node); // Log the node object for debugging

        // Use `node.target` to start traversing the DOM
        const svgElement = node.target.closest("svg"); // Find the closest SVG element
        if (!svgElement) {
            console.error("SVG element not found.");
            return;
        }

        // Find the parent `jtk-endpoint` element
        const endpointElement = svgElement.closest(".jtk-endpoint");
        if (!endpointElement) {
            console.error("Endpoint element not found.");
            return;
        }

        // Find the parent `.workflow-node` element
        const parentNode = endpointElement.closest(".workflow-node");
        if (!parentNode) {
            console.error("Workflow node element not found.");
            return;
        }

        // Log the parent node for debugging
        console.log('Parent node:', parentNode);
        const parentId = parentNode.id;
        const parentLeftStr = parentNode.style.left;
        const parentTopStr = parentNode.style.top;
        //const parentLeft = parseInt(parentLeftStr);
        //const parentTop = parseInt(parentTopStr);
        const parentLeft = parseInt(parentLeftStr) - 150;
        const parentTop = parseInt(parentTopStr) + 60;
        
        // hide all eventList
        const eventListElements = document.querySelectorAll('.eventList');
        eventListElements.forEach(element => {
            element.classList.add("hide");                
        });

        const CampaignEventPanelElm = document.getElementById("CampaignEventPanel");
        CampaignEventPanelElm.classList.remove('hide');
        //CampaignEventPanelElm.style.left = parentLeft + "" + "px";
        CampaignEventPanelElm.style.top = parentTop + "" + "px";
        //CampaignEventPanelElm.style.width = "500px";
        //CampaignEventPanelElm.style.height = "280px";

        const anchor = svgElement.getAttribute("data-anchor");

        const CampaignEventPanelGroups = document.getElementById("CampaignEventPanelGroups");
        CampaignEventPanelGroups.classList.remove('hide');

        const decisionSlctBtn = document.querySelectorAll('.decisionSlctBtn');
        decisionSlctBtn.forEach(element => {
            element.setAttribute("data-parentNodeId",parentId);
            element.setAttribute("data-anchor",anchor);
        });

        const actionSlctBtn = document.querySelectorAll('.actionSlctBtn');
        actionSlctBtn.forEach(element => {
            element.setAttribute("data-parentNodeId",parentId); 
            element.setAttribute("data-anchor",anchor);
        });

        const conditionSlctBtn = document.querySelectorAll('.conditionSlctBtn');
        conditionSlctBtn.forEach(element => {
            element.setAttribute("data-parentNodeId",parentId);
            element.setAttribute("data-anchor",anchor);
        });
        
        //CampaignEventPanel CampaignEventPanelGroups SourceGroupList

        //console.log(node.parent(".workflow-node"));

        //node.id = "CampaignEventPanel";
        //node.className = "workflow-node";
        //node.setAttribute("data-type", type);
        //node.innerHTML = content;
        //node.style.position = "absolute";
        //node.style.left = `${x}px`;
        //node.style.top = `${y}px`;

        }

        function closeCampaignEventPanel(){
            //reset and close event panel
            const CampaignEventPanelElm = document.getElementById("CampaignEventPanel");
            CampaignEventPanelElm.classList.add('hide');

            const CampaignEventPanelGroups = document.getElementById("CampaignEventPanelGroups");
            CampaignEventPanelGroups.classList.add('hide');

            //remove parentNodeId
            const decisionSlctBtn = document.querySelectorAll('.decisionSlctBtn');
            decisionSlctBtn.forEach(element => {
                element.removeAttribute("data-parentNodeId");
            });

            const actionSlctBtn = document.querySelectorAll('.actionSlctBtn');
            actionSlctBtn.forEach(element => {
                element.removeAttribute("data-parentNodeId");
            });

            const conditionSlctBtn = document.querySelectorAll('.conditionSlctBtn');
            conditionSlctBtn.forEach(element => {
                element.removeAttribute("data-parentNodeId");
            });

            //hide CampaignEventPanelLists
            const CampaignEventPanelListsElm = document.getElementById("CampaignEventPanelLists");
            CampaignEventPanelListsElm.classList.add('hide');

            const SourceGroupListElm = document.getElementById("SourceGroupList");
            SourceGroupListElm.classList.add('hide');
            //SourceList
            
            const ActionGroupListElm = document.getElementById("ActionGroupList");
            ActionGroupListElm.classList.add('hide');
            //ActionList

            const DecisionGroupListElm = document.getElementById("DecisionGroupList");
            DecisionGroupListElm.classList.add('hide');
            //DecisionList

            const ConditionGroupListElm = document.getElementById("ConditionGroupList");
            ConditionGroupList.classList.add('hide');
            //ConditionList

            const campaignEventSelector = document.querySelectorAll('.campaign-event-selector');
            campaignEventSelector.forEach(element => {
                element.removeAttribute("data-parentNodeId");
            });
        }

        function selectEvent(event,type){
            
            const anchor = event.target.dataset.anchor;
            const parentnodeid = event.target.dataset.parentnodeid;
            const parentNode = document.getElementById(parentnodeid);
            var parentX = parentNode.style.left;
            var parentY = parentNode.style.top;

            type = type.toLowerCase();
            
            const CampaignEventPanelGroups = document.getElementById("CampaignEventPanelGroups");
            CampaignEventPanelGroups.classList.add('hide');

            const CampaignEventPanelLists = document.getElementById("CampaignEventPanelLists");
            CampaignEventPanelLists.classList.remove('hide');
                
            const CampaignEventPanelElm = document.getElementById("CampaignEventPanel");
            CampaignEventPanelElm.classList.remove('hide');

            const EventGroupList = document.getElementsByClassName("EventGroupList");
            
            // hide all eventList
            const eventListElements = document.querySelectorAll('.eventList');
            eventListElements.forEach(element => {
                element.classList.add("hide");                
            });


            if(type == 'source'){
                
                const SourceGroupList = document.getElementById("SourceGroupList");
                SourceGroupList.classList.remove('hide');

            }else if(type == 'decision'){
                
                const DecisionGroupList = document.getElementById("DecisionGroupList");
                DecisionGroupList.classList.remove('hide');

                document.getElementById("DecisionList").setAttribute("data-parentNodeId",parentnodeid);
                document.getElementById("DecisionList").setAttribute("data-anchor",anchor);

            }else if(type == 'action'){
                
                const ActionGroupList = document.getElementById("ActionGroupList");
                ActionGroupList.classList.remove('hide');
                
                document.getElementById("ActionList").setAttribute("data-parentNodeId",parentnodeid);
                document.getElementById("ActionList").setAttribute("data-anchor",anchor);
                
            }else if(type == 'condition'){
                
                const ConditionGroupList = document.getElementById("ConditionGroupList");
                ConditionGroupList.classList.remove('hide');

                document.getElementById("ConditionList").setAttribute("data-parentNodeId",parentnodeid);
                document.getElementById("ConditionList").setAttribute("data-anchor",anchor);

            }else{
                //reset all elements
                const CampaignEventPanelLists = document.getElementById("CampaignEventPanelLists");
                CampaignEventPanelLists.classList.add('hide');
                
                const CampaignEventPanelElm = document.getElementById("CampaignEventPanel");
                CampaignEventPanelElm.classList.add('hide');
            }

        }

        function closeEventListModal(targetElmId, targetElmParentId){
            
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
            
        }

        function selectDecision(event){
            
            //select from pick list
            //get form html
            //open Decision form
            //.
            //.
            //.
            //#campaignEventModal .loading-placeholder #event-modal-body-content
            console.log('event');
            console.log(event);
            
            $("#campaignEventModal .loading-placeholder").removeClass("hide");
            const campaignEventModal = new bootstrap.Modal($('#campaignEventModal'));
            campaignEventModal.show();

            var eventVal = event.target.value;
            var eventType = event.target.dataset.eventtype;
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
           
            var url = 'newevent';
            var postJson = {"_token":CSRFTOKEN, "campaignId":campaignId, "type":type,"eventType":eventType,"anchor":anchor,"anchorEventType":anchorEventType,"parentEventId":parentEventId};
            httpRequest(url, postJson, function(resp){
                
                //#campaignEventModal .loading-placeholder #event-modal-body-content
               
                //campaignEventModal.show(); 
                
                if(resp.C == 100){
                    var htmlStr = resp.R.htmlStr;
                    var tempEventId = resp.R.tempEventId;
                    $("#campaignEventModal .loading-placeholder").addClass("hide");
                    $("#campaignEventModal #event-modal-body-content").html(htmlStr);

                    setTimeout(function(){
                        //basic required values
                        //$("#campaignevent_form")
                        $("#campaignevent_form #campaignevent_anchor").val(anchor); //leadsource
                        $("#campaignevent_form #campaignevent_type").val(type); //page.devicehit
                        $("#campaignevent_form #campaignevent_eventType").val(eventType); //decision
                        $("#campaignevent_form #campaignevent_anchorEventType").val(anchorEventType); //source

                        $("#campaignevent_form #campaignevent_parentEventId").val(parentEventId);
                        $("#campaignevent_form #campaignevent_eventOrder").val(eventOrder);
                        $("#campaignevent_form #campaignevent_campaignId").val(campaignId); //campaignId
                        $("#campaignevent_form #campaignevent_eventId").val(tempEventId);
                        $("#campaignevent_form #campaignevent__token").val(""); //token
                        
                        $('#campaignevent_form #campaignevent_properties_device_type')
                        .add('#campaignevent_form #campaignevent_properties_device_brand')
                        .add('#campaignevent_form #campaignevent_properties_device_os')
                        .select2({
                            placeholder: "Choose one or more",
                            allowClear: true,
                            width: '100%',  // Makes it responsive
                            // dropdownParent: $('#campaignSourceModal') // Ensures dropdown is within the modal
                        });

                    }, 200);
                    

                }
            
            });

            var targetElmId = event.target.id;
            var targetElmParentId =event.target.parentNode.id;
            closeEventListModal(targetElmId, targetElmParentId);

            //on form submit/Add button
            return false;
            
        }

        function campaignToggleTimeframes(event){
            console.log("campaignToggleTimeframes");
            console.log(event);
        }

        function addSource(srcElmId){
            //campaignId
            // add campaign-source to source-node
            //contactSegments

            //console.log(srcElmId); // Log the actual srcElmId
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
            srcSlctOptArr.forEach(function(v, i) {
                var tmpOptVal = v.value; // Directly use v (the current option)
                var tmpOptTxt = v.text;
                selectedSegments[i] = tmpOptVal;
                selectedSegmentsTxt[i] = tmpOptTxt;
            });


            if (selectedSegments.length == 0){
                $("#contactSourceErrMsg").removeClass("hide");
                $("#contactSourceErrMsg").addClass("requiredTxt");
                $("#contactSegmentsLable").addClass("requiredTxt");
                $("#campaignSourceModal .select2-selection.select2-selection--multiple").addClass("required");
                return false;
            }else{

                $("#contactSourceErrMsg").addClass("hide");
                $("#contactSourceErrMsg").removeClass("requiredTxt");
                $("#contactSegmentsLable").removeClass("requiredTxt");
                $("#campaignSourceModal .select2-selection.select2-selection--multiple").removeClass("required");

                // If there are selected segments, join them into a string
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
            
        }

        function validateEvent(eventType, type){
            //eventType //decision/condition/action
            //type //dropdown val
            
            var eventName = document.getElementById("campaignevent_name").value;

            if(eventType == "decision"){
                
                if(type == "page.devicehit"){
                    //event properties
                    var deviceType = document.getElementById("campaignevent_properties_device_type").value;

                    var deviceBrand = document.getElementById("campaignevent_properties_device_brand").value;

                    var deviceOS = document.getElementById("campaignevent_properties_device_os").value;

                    if(!isRealVal(eventName)){
                        return false;
                    }else if(!isRealVal(deviceType)){
                        return false;
                    }else if(!isRealVal(deviceBrand)){
                        return false;
                    }else if(!isRealVal(deviceOS)){
                        return false;
                    }else{
                        return true;
                    }
                    
                }else if(type == "asset.download"){
                    //event properties
                    var limitToAssets = document.getElementById("campaignevent_properties_assets").value;

                    if(!isRealVal(eventName)){
                        return false;
                    }else if(!isRealVal(limitToAssets)){
                        return false;
                    }else{
                        return true;
                    }

                }else if(type == "dwc.decision"){
                    //event properties
                    var slotName = document.getElementById("campaignevent_properties_dwc_slot_name").value;
                    var defaultContent = document.getElementById("campaignevent_properties_dynamicContent").value;
                    
                    if(!isRealVal(eventName)){
                        return false;
                    }else if(!isRealVal(slotName)){
                        return false;
                    }else if(!isRealVal(defaultContent)){
                        return false;
                    }else{
                        return true;
                    }
                }else if(type == "form.submit"){
                    //event properties
                    var forms = document.getElementById("campaignevent_properties_forms").value;
                    
                    if(!isRealVal(forms)){
                        return false;
                    }else{
                        return true;
                    }
                }else if(type == "page.pagehit"){
                    //event properties
                    var pages = document.getElementById("campaignevent_properties_pages").value;
                    var url = document.getElementById("campaignevent_properties_url").value;
                    var referer = document.getElementById("campaignevent_properties_referer").value;
                    
                    if(!isRealVal(pages)){
                        return false;
                    }else if(!isRealVal(url)){
                        return false;
                    }else if(!isRealVal(referer)){
                        return false;
                    }else{
                        return true;
                    }
                }
            
            }else if(eventType == "condition"){

            }else if(eventType == "action"){

            }
        }
        
        function saveevent(){
            //validate and save event properties to db
            //campaignevent_name
            //campaignevent_properties

            //Mandatory Inputs
            var nameInput = document.getElementById("campaignevent_name").value;
            var anchorInput = document.getElementById("campaignevent_anchor").value;
            var typeInput = document.getElementById("campaignevent_type").value;
            var eventTypeInput = document.getElementById("campaignevent_eventType").value;
            var anchorEventTypeInput = document.getElementById("campaignevent_anchorEventType").value;
            var eventIdInput = document.getElementById("campaignevent_eventId").value;
            var eventOrderInput = document.getElementById("campaignevent_eventOrder").value;
            var parentEventIdInput = document.getElementById("campaignevent_parentEventId").value;
            var campaignIdInput = document.getElementById("campaignevent_campaignId").value;
            

            
            if(eventType == "decision"){
                
                if(type == "page.devicehit"){
                    //event properties
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
                        return true;
                    }
                    
                }else if(type == "asset.download"){
                    //event properties
                    var limitToAssets = document.getElementById("campaignevent_properties_assets").value;

                    if(!isRealVal(eventName)){
                        var err = 1;
                        var msg = "Event name is required.";
                        showToastMsg(err, msg);
                        return false;
                    }else if(!isRealVal(limitToAssets)){
                        var err = 1;
                        var msg = "Assets limit is required.";
                        showToastMsg(err, msg);
                        return false;
                    }else{
                        return true;
                    }

                }else if(type == "dwc.decision"){
                    //event properties
                    var slotName = document.getElementById("campaignevent_properties_dwc_slot_name").value;
                    var defaultContent = document.getElementById("campaignevent_properties_dynamicContent").value;
                    
                    if(!isRealVal(eventName)){
                        var err = 1;
                        var msg = "Event name is required.";
                        showToastMsg(err, msg);
                        return false;
                    }else if(!isRealVal(slotName)){
                        var err = 1;
                        var msg = "Slot name is required.";
                        showToastMsg(err, msg);
                        return false;
                    }else if(!isRealVal(defaultContent)){
                        var err = 1;
                        var msg = "Default Content is required.";
                        showToastMsg(err, msg);
                        return false;
                    }else{
                        return true;
                    }
                }else if(type == "form.submit"){
                    //event properties
                    var forms = document.getElementById("campaignevent_properties_forms").value;
                    
                    if(!isRealVal(eventName)){
                        var err = 1;
                        var msg = "Event name is required.";
                        showToastMsg(err, msg);
                        return false;
                    }else if(!isRealVal(forms)){
                        var err = 1;
                        var msg = "Form limit is required.";
                        showToastMsg(err, msg);
                        return false;
                    }else{
                        return true;
                    }
                }else if(type == "page.pagehit"){
                    //event properties
                    var pages = document.getElementById("campaignevent_properties_pages").value;
                    var url = document.getElementById("campaignevent_properties_url").value;
                    var referer = document.getElementById("campaignevent_properties_referer").value;
                    
                    if(!isRealVal(eventName)){
                        var err = 1;
                        var msg = "Event name is required.";
                        showToastMsg(err, msg);
                        return false;
                    }else if(!isRealVal(pages)){
                        var err = 1;
                        var msg = "Pages are required.";
                        showToastMsg(err, msg);
                        return false;
                    }else if(!isRealVal(url)){
                        var err = 1;
                        var msg = "Url is required.";
                        showToastMsg(err, msg);
                        return false;
                    }else if(!isRealVal(referer)){
                        var err = 1;
                        var msg = "Referer is required.";
                        showToastMsg(err, msg);
                        return false;
                    }else{
                        return true;
                    }
                }
            
            }else if(eventType == "condition"){
                //event properties

            }else if(eventType == "action"){
                //event properties
                if(type == "lead.adddnc"){

                    var deviceType = document.getElementById("campaignevent_properties_device_type").value;

                    var deviceBrand = document.getElementById("campaignevent_properties_device_brand").value;

                    var deviceOS = document.getElementById("campaignevent_properties_device_os").value;

                    if(!isRealVal(eventName)){
                        var err = 1;
                        var msg = "Event name is required.";
                        showToastMsg(err, msg);
                        return false;
                    }

                }else if(type == "lead.leadscorecontactscompanies"){

                }else if(type == "lead.addtocompany"){

                }else if(type == "lead.changepoints"){

                }else if(type == "campaign.addremovelead"){

                }else if(type == "stage.change"){

                }else if(type == "lead.deletecontact"){

                }else if(type == "campaign.jump_to_event"){

                }else if(type == "lead.changelist"){

                }else if(type == "lead.changetags"){

                }else if(type == "plugin.leadpush"){

                }else if(type == "lead.removednc"){

                }else if(type == "campaign.sendwebhook"){

                }else if(type == "email.send"){

                }else if(type == "email.send.to.user"){

                }else if(type == "message.send"){

                }else if(type == "lead.updatelead"){

                }else if(type == "lead.updatecompany"){

                }else if(type == "lead.changeowner"){

                }
                
                
                                
            }
            
            //validateEvent(eventTypeInput, typeInput);
            return false;


           /*
           if(!isRealVal(nameInput)){
                var err = 1;
                var msg = 'Please enter the event name';
                showToastMsg(err, msg);
                return false;
            }else if(!isRealVal(anchorInput) || !isRealVal(typeInput) || !isRealVal(eventTypeInput) || !isRealVal(anchorEventTypeInput) || !isRealVal(eventIdInput) || !isRealVal(eventOrderInput) || !isRealVal(parentEventIdInput) || !isRealVal(campaignIdInput)){
                //validate hidden inputs
                var err = 1;
                var msg = 'Please enter the event name';
                showToastMsg(err, msg);
                console.log("empty value for hidden inputs");
                return false;
            }else{
                
            }


            return false;
            */
            // Serialize the form data
            var formData = $('#campaignevent_form').serialize();

            var url = 'savenewevent';
            var postJson = {"_token":CSRFTOKEN, "eventData":formData};
            httpRequest(url, postJson, function(resp){
                
                if(resp.C == 100){
                    //close and reset event form modal
                    const action = "add";
                    const modalId = "campaignEventModal";
                    closeModal(action,modalId);

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
                    
                    
                    createNode(propJson, x, y);
                }
            
            });
        }
        
        function cancelevent(){
            //close and reset event form modal
            const action = "cancel";
            const modalId = "campaignEventModal";
            closeModal(action,modalId);
        }

        function generateSecureUniqueId() {
           //return 'id-' + Date.now() + '-' + crypto.getRandomValues(new Uint32Array(1))[0];
           return Date.now() +''+ crypto.getRandomValues(new Uint32Array(1))[0];
        }

        /*
        
        var campaign_id = '';
        var parent_id = '';
        var name = '';
        var description = '';
        var type = '';
        var event_type = '';
        var event_order = '';
        var properties = '';
        var deleted = '';
        var trigger_date = '';
        var trigger_interval = '';
        var trigger_interval_unit = '';
        var trigger_hour = '';
        var trigger_restricted_start_hour = '';
        var trigger_restricted_stop_hour = '';
        var trigger_restricted_dow = '';
        var trigger_mode = '';
        var decision_path = '';
        var temp_id = '';
        var channel = '';
        var channel_id = '';
        var failed_count = '';
        
        var url = 'savenewevent';
        var postJson = {
            //id:
            campaign_id: campaign_id,
            parent_id: parent_id,
            name: name,
            description: description,
            type: type,
            event_type: event_type,
            event_order: event_order,
            properties: properties,
            deleted: deleted,
            trigger_date: trigger_date,
            trigger_interval: trigger_interval,
            trigger_interval_unit: trigger_interval_unit,
            trigger_hour: trigger_hour,
            trigger_restricted_start_hour: trigger_restricted_start_hour,
            trigger_restricted_stop_hour: trigger_restricted_stop_hour,
            trigger_restricted_dow: trigger_restricted_dow,
            trigger_mode: trigger_mode,
            decision_path: decision_path,
            temp_id: temp_id,
            channel: channel,
            channel_id: channel_id,
            failed_count: failed_count
        };
        
        httpRequest(url, postJson, function(resp){

        })*/
</script>
