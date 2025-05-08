import React from 'react';

/*Decision Event Form */
import Email_click from './DecisionEventForms/Email_click';
import Email_open from './DecisionEventForms/Email_open';
import Email_reply from './DecisionEventForms/Email_reply';
/*
import Page_devicehit from './DecisionEventForms/Page_devicehit';
import Asset_download from './DecisionEventForms/Asset_download';
import Dwc_decision from './DecisionEventForms/Dwc_decision';
import Page_pagehit from './DecisionEventForms/Page_pagehit';
import Form_submit from './DecisionEventForms/Form_submit';
*/


/*Action Event Form */
import Lead_deletecontact from './ActionEventForms/Lead_deletecontact';
import Lead_changelist from './ActionEventForms/Lead_changelist';
import Lead_changetags from './ActionEventForms/Lead_changetags';
import Email_send from './ActionEventForms/Email_send';
import Lead_updatelead from './ActionEventForms/Lead_updatelead';
import Campaign_addremovelead from './ActionEventForms/Campaign_addremovelead';
/*
import Lead_adddnc from './ActionEventForms/Lead_adddnc';
import Lead_leadscorecontactscompanies from './ActionEventForms/Lead_leadscorecontactscompanies';
import Lead_addtocompany from './ActionEventForms/Lead_addtocompany';
import Lead_changepoints from './ActionEventForms/Lead_changepoints';
import Stage_change from './ActionEventForms/Stage_change';
import Campaign_jump_to_event from './ActionEventForms/Campaign_jump_to_event';
import Plugin_leadpush from './ActionEventForms/Plugin_leadpush';
import Lead_removednc from './ActionEventForms/Lead_removednc';
import Campaign_sendwebhook from './ActionEventForms/Campaign_sendwebhook';
import Email_send_to_user from './ActionEventForms/Email_send_to_user';
import Message_send from './ActionEventForms/Message_send';
import Lead_updatecompany from './ActionEventForms/Lead_updatecompany';
import Lead_changeowner from './ActionEventForms/Lead_changeowner';
*/


/*Condition Event Form */
import Lead_field_value from './ConditionEventForms/Lead_field_value';
import Lead_segments from './ConditionEventForms/Lead_segments';
import Lead_tags from './ConditionEventForms/Lead_tags';


const DecisionEventHtml = ({ eventVal, inputData}) => {
  // Function to get dynamic modal content based on eventVal
  //inputData.type;
  const eventType = inputData.eventType;

  const getModalContent = () => {
    if(eventType == "action"){
      switch (eventVal) {
        case 'lead.adddnc':
          return <Lead_adddnc inputData={inputData}/>
        case 'lead.leadscorecontactscompanies':
          return <Lead_leadscorecontactscompanies inputData={inputData}/>
        case 'lead.addtocompany':
          return <Lead_addtocompany inputData={inputData}/>
        case 'lead.changepoints':
          return <Lead_changepoints inputData={inputData}/>
        case 'campaign.addremovelead':
          return <Campaign_addremovelead inputData={inputData}/>
        case 'stage.change':
          return <Stage_change inputData={inputData}/>
        case 'lead.deletecontact':
          return <Lead_deletecontact inputData={inputData}/>
        case 'campaign.jump_to_event':
          return <Campaign_jump_to_event inputData={inputData}/>
        case 'lead.changelist':
          return <Lead_changelist inputData={inputData}/>
        case 'lead.changetags':
          return <Lead_changetags inputData={inputData}/>
        case 'plugin.leadpush':
          return <Plugin_leadpush inputData={inputData}/>
        case 'lead.removednc':
          return <Lead_removednc inputData={inputData}/>
        case 'campaign.sendwebhook':
          return <Campaign_sendwebhook inputData={inputData}/>
        case 'email.send':
          return <Email_send inputData={inputData}/>
        case 'email.send.to.user':
          return <Email_send_to_user inputData={inputData}/>
        case 'message.send':
          return <Message_send inputData={inputData}/>
        case 'lead.updatelead':
          return <Lead_updatelead inputData={inputData}/>
        case 'lead.updatecompany':
          return <Lead_updatecompany inputData={inputData}/>
        case 'lead.changeowner':
          return <Lead_changeowner inputData={inputData}/>
        default:
          return <p>No content available for the selected value.</p>;
      }
    }else if(eventType == "decision"){
      switch (eventVal) {
          
        case 'email.click':
          return <Email_click inputData={inputData}/>
        case 'email.open':
          return <Email_open inputData={inputData}/>
        case 'email.reply':
          return <Email_reply inputData={inputData}/>
        /*case 'page.devicehit':
          return <Page_devicehit inputData={inputData}/>
        case 'asset.download':
          return <Asset_download inputData={inputData}/>
        case 'dwc.decision':
          return <Dwc_decision inputData={inputData}/>
        case 'page.pagehit':
          return <Page_pagehit inputData={inputData}/>
        case 'form.submit':
          return <Form_submit inputData={inputData}/>*/
        default:
          return <p>No content available for the selected value.</p>;
      }
    }else if(eventType == "condition"){
      switch (eventVal) {
        case 'lead.field_value':
          return <Lead_field_value inputData={inputData}/>
        case 'lead.segments':
          return <Lead_segments inputData={inputData}/>
          case 'lead.tags':
          return <Lead_tags inputData={inputData}/>
        default:
          return <p>No content available for the selected value.</p>;
      }
    }else{
      return <p>No content available for the selected value.</p>;
    }
    
  };

  return getModalContent()
};

export default DecisionEventHtml;
