import React from 'react';

const CreateNode = ({ propJson, x, y }) => {
  const {
    type,
    id,
    parentNodeType,
    parentNodeAnchor,
    parentNodeId,
    eventOrder,
    content,
    dataConnected,
  } = propJson;

  // Determine the class type based on the node type
  let classType = 'list-campaign-leadsource';
  if (type === 'decision') {
    classType = 'list-campaign-decision';
  } else if (type === 'action') {
    classType = 'list-campaign-action';
  } else if (type === 'condition') {
    classType = 'list-campaign-condition';
  }

  // Create the node's style and other attributes
  const nodeStyle = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
  };

  const nodeAttributes = {
    'data-type': type,
    'data-parent-type': parentNodeType,
    'data-parent-node': parentNodeId,
    'data-event-order': eventOrder,
  };

  // Create the necessary endpoint divs based on the type
  const renderEndpoints = () => {
    switch (type) {
      case 'source':
        return (
          <>
            <div id={`${id}_endpointBottomCenterHolder`} />
            <div id={`${id}_endpointLeftHolder`} />
            <div id={`${id}_endpointRightHolder`} />
          </>
        );
      case 'decision':
      case 'condition':
        return (
          <>
            <div id={`${id}_endpointTopCenterHolder`} />
            <div id={`${id}_endpointBottomLeftHolder`} />
            <div id={`${id}_endpointBottomRightHolder`} />
          </>
        );
      case 'action':
        return (
          <>
            <div id={`${id}_endpointTopCenterHolder`} />
            <div id={`${id}_endpointBottomCenterHolder`} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id={id}
      className={`workflow-node draggable list-campaign-source jtk-endpoint-anchor-leadsource CampaignEvent_lists jtk-managed jtk-endpoint-anchor-leadsourceleft jtk-endpoint-anchor-leadsourceright jtk-draggable ${classType}`}
      {...nodeAttributes}
      style={nodeStyle}
    >
      {content}
      {renderEndpoints()}
    </div>
  );
};

export default CreateNode;
