import React, { useState } from 'react';
import NodeEndpoints from '@/Components/NodeEndpoints';
const CreateNode = ({ propJson, x, y }) => {
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

export default CreateNode;