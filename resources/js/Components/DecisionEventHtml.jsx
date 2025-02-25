import React from 'react';
import Page_devicehit from './DecisionEventForms/Page_devicehit';
import Page_pagehit from './DecisionEventForms/Page_pagehit';

const DecisionEventHtml = ({ eventVal, inputData}) => {
  // Function to get dynamic modal content based on eventVal
  const getModalContent = () => {
    switch (eventVal) {
      case 'page.devicehit':
        return <Page_devicehit inputData={inputData}/>
      case 'asset.download':
        return <p>This is the content for asset.download.</p>;
      case 'dwc.decision':
        return <p>This is the content for dwc.decision.</p>;
      case 'page.pagehit':
        return <Page_pagehit inputData={inputData}/>
      case 'form.submit':
        return <p>This is the content for form.submit.</p>;
      default:
        return <p>No content available for the selected value.</p>;
    }
  };

  return getModalContent()
};

export default DecisionEventHtml;
