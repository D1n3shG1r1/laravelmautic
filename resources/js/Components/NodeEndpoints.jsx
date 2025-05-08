import React, { useState } from 'react';

const NodeEndpoints = ({ nodeType, endpointType }) => {
    const [hovered, setHovered] = useState(false);

    const endpointStyles = {
        position: "absolute",
        width: "20px",
        height: "20px",
        cursor:"pointer",
    };

    const svgStyles = {
        position: "absolute",
        left: "0px",
        top: "0px",
    };

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    const campaignEventPanel = (node) => {
        // Placeholder function. Add your logic here
        console.log('Campaign Event Panel triggered');
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
    };

    const renderEndpoint = () => {
        let positionStyles = {};
        let svgContent = null; // Default value for SVG content

        let className = "jtk-endpoint jtk-endpoint-anchor jtk-draggable jtk-droppable";
        let onClickAct = null;
        let dataAnchor = null;

        if (nodeType === 'source') {
            switch (endpointType) {
                case 'left':
                    positionStyles = { ...endpointStyles, left: "-11px", top: "12px" };
                    className += " jtk-endpoint-left";
                    break;
                case 'right':
                    positionStyles = { ...endpointStyles, left: "190px", top: "12px" };
                    className += " jtk-endpoint-right";
                    break;
                case 'bottom-center':
                    positionStyles = { ...endpointStyles, left: "90px", top: "32px" };
                    className += " jtk-endpoint-bottom";
                    onClickAct=campaignEventPanel;
                    dataAnchor="leadsource";
                    break;
                default:
                    return null;
            }

            
            svgContent = (
                <svg
                    style={svgStyles}
                    width="20"
                    height="20"
                    pointerEvents="all"
                    onClick={onClickAct}
                    data-anchor={dataAnchor}
                >
                    <circle cx="10" cy="10" r="10" fill="#d5d4d4" stroke="none" />
                    <text x="50%" y="50%" textAnchor="middle" strokeWidth="2px" stroke="#ffffff" dy=".3em">+</text>
                </svg>
            );

        } else if (nodeType === 'decision' || nodeType === 'condition') {
            switch (endpointType) {
                case 'top-center':
                    positionStyles = { ...endpointStyles, left: "90px", top: "-11px" };
                    className += " jtk-endpoint-top";
                    break;
                case 'bottom-left':
                    positionStyles = { ...endpointStyles, left: "25px", top: "32px" };
                    className += " jtk-endpoint-anchor-yes";
                    dataAnchor="yes";
                    break;
                case 'bottom-right':
                    positionStyles = { ...endpointStyles, left: "155px", top: "32px" };
                    className += " jtk-endpoint-anchor-no";
                    dataAnchor="no";
                    break;
                default:
                    return null;
            }

            svgContent = (
                <svg
                    style={svgStyles}
                    width="20"
                    height="20"
                    pointerEvents="all"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    data-anchor={dataAnchor}
                    onClick={campaignEventPanel} // Correcting onClick handler
                >
                    <circle cx="10" cy="10" r="10" fill="#d5d4d4" stroke="none" />
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        strokeWidth="2px"
                        stroke="#ffffff"
                        dy=".3em"
                    >
                        +
                    </text>
                </svg>
            );
        } else if (nodeType === 'action') {
            switch (endpointType) {
                case 'top-center':
                    positionStyles = { ...endpointStyles, left: "90px", top: "-11px" };
                    className += " jtk-endpoint-top";
                    break;

                case 'bottom-center':
                    positionStyles = { ...endpointStyles, left: "90px", top: "32px" };
                    className += " jtk-endpoint-bottom";
                    dataAnchor="bottom";
                    break;
                default:
                    return null;
            }

            svgContent = (
                <svg
                    style={svgStyles}
                    width="20"
                    height="20"
                    pointerEvents="all"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    data-anchor={dataAnchor}
                    onClick={campaignEventPanel} // Correcting onClick handler
                >
                    <circle cx="10" cy="10" r="10" fill="#d5d4d4" stroke="none" />
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        strokeWidth="2px"
                        stroke="#ffffff"
                        dy=".3em"
                    >
                        +
                    </text>
                </svg>
            );
        }

        return (
            <div
                className={`${className} ${hovered ? 'jtk-hover jtk-clickable_anchor' : ''}`}
                style={positionStyles}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {svgContent}
            </div>
        );
    };

    return renderEndpoint();
};

export default NodeEndpoints;
