import React, { useState } from 'react';

const NodeEndpoints = ({ nodeType, endpointType }) => {
    const [hovered, setHovered] = useState(false);

    const endpointStyles = {
        position: "absolute",
        width: "20px",
        height: "20px",
    };

    const svgStyles = {
        position: "absolute",
        left: "0px",
        top: "0px",
    };

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    const campaignEventPanel = (event) => {
        // Placeholder function. Add your logic here
        console.log('Campaign Event Panel triggered');
    };

    const renderEndpoint = () => {
        let positionStyles = {};
        let svgContent = null; // Default value for SVG content

        let className = "jtk-endpoint jtk-endpoint-anchor jtk-draggable jtk-droppable";

        if (nodeType === 'source') {
            svgContent = (
                <svg
                    style={svgStyles}
                    width="20"
                    height="20"
                    pointerEvents="all"
                >
                    <circle cx="10" cy="10" r="10" fill="#d5d4d4" stroke="none" />
                    <text x="50%" y="50%" textAnchor="middle" strokeWidth="2px" stroke="#ffffff" dy=".3em">+</text>
                </svg>
            );

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
                    break;
                default:
                    return null;
            }
        } else if (nodeType === 'decision' || nodeType === 'condition') {
            switch (endpointType) {
                case 'top-center':
                    positionStyles = { ...endpointStyles, left: "90px", top: "-11px" };
                    className += " jtk-endpoint-top";
                    break;
                case 'bottom-left':
                    positionStyles = { ...endpointStyles, left: "25px", top: "32px" };
                    className += " jtk-endpoint-anchor-yes";
                    break;
                case 'bottom-right':
                    positionStyles = { ...endpointStyles, left: "155px", top: "32px" };
                    className += " jtk-endpoint-anchor-no";
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
                    data-anchor="yes"
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
                    data-anchor="yes"
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
