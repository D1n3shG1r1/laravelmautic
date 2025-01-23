import React, { useState } from 'react';
import InputLabel from "@/Components/InputLabel";
import TextInput from '@/Components/TextInput';
//import Dropdown from '@/Components/Dropdown';
//import styles from "../../css/Modules/CampaignBuilder.module.css"; // Import styles from the CSS module


const CampaignBuilder = ({PageTitle,csrfToken,Params}) => {
    console.log(Params);
    const campaignId = Params.campaignId;
    const segments = Params.segments;
    const decisions = Params.decisions;
    const actions = Params.actions;
    const conditions = Params.conditions;

  return (
    <div>
      <div id="campaign-builder" className="builder campaign-builder live builder-active" style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}>
        
        <div className="btns-builder">
          <button type="button" className="btn btn-primary btn-apply-builder" onClick={() => Mautic.saveCampaignFromBuilder()}>Save</button>
          <button type="button" className="btn btn-primary btn-close-campaign-builder" onClick={() => Mautic.closeCampaignBuilder()}>Close Builder</button>
        </div>
        <div id="builder-errors" className="alert alert-danger" role="alert" style={{ display: 'none' }}>test</div>

        <div id="CampaignEventPanel" className="hide">
          <div id="CampaignEventPanelGroups" className="groups-enabled-3 hide">
            <div className="row">
              <div className="mr-0 ml-0 pl-xs pr-xs campaign-group-container col-md-4" id="DecisionGroupSelector">
                <div className="panel panel-success mb-0">
                  <div className="panel-heading">
                    <div className="col-xs-8 col-sm-10 np">
                      <h3 className="panel-title">Decision</h3>
                    </div>
                    <div className="col-xs-4 col-sm-2 pl-0 pr-0 pt-10 pb-10 text-right">
                      <i className="hidden-xs fa fa-random fa-lg"></i>
                      <button className="decisionSlctBtn visible-xs pull-right btn btn-sm btn-default btn-nospin text-success" data-type="Decision" onClick={() => selectEvent(event, 'Decision')}>Select</button>
                    </div>
                  </div>
                  <div className="panel-body">
                    A decision is made when a contact decides to take action or not (e.g. opened an email).
                  </div>
                  <div className="hidden-xs panel-footer text-center">
                    <button className="decisionSlctBtn btn btn-lg btn-default btn-nospin text-success" data-type="Decision" onClick={() => selectEvent(event, 'Decision')}>Select</button>
                  </div>
                </div>
              </div>
              <div className="mr-0 ml-0 pl-xs pr-xs campaign-group-container col-md-4" id="ActionGroupSelector">
                <div className="panel panel-primary mb-0">
                  <div className="panel-heading">
                    <div className="col-xs-8 col-sm-10 np">
                      <h3 className="panel-title">Action</h3>
                    </div>
                    <div className="col-xs-4 col-sm-2 pl-0 pr-0 pt-10 pb-10 text-right">
                      <i className="hidden-xs fa fa-bullseye fa-lg"></i>
                      <button className="actionSlctBtn visible-xs pull-right btn btn-sm btn-default btn-nospin text-primary" data-type="Action" onClick={() => selectEvent(event, 'Action')}>Select</button>
                    </div>
                  </div>
                  <div className="panel-body">
                    An action is something executed by Mautic (e.g. send an email).
                  </div>
                  <div className="hidden-xs panel-footer text-center">
                    <button className="actionSlctBtn btn btn-lg btn-default btn-nospin text-primary" data-type="Action" onClick={() => selectEvent(event, 'Action')}>Select</button>
                  </div>
                </div>
              </div>
              <div className="mr-0 ml-0 pl-xs pr-xs campaign-group-container col-md-4" id="ConditionGroupSelector">
                <div className="panel panel-danger mb-0">
                  <div className="panel-heading">
                    <div className="col-xs-8 col-sm-10 np">
                      <h3 className="panel-title">Condition</h3>
                    </div>
                    <div className="col-xs-4 col-sm-2 pl-0 pr-0 pt-10 pb-10 text-right">
                      <i className="hidden-xs fa fa-filter fa-lg"></i>
                      <button className="conditionSlctBtn visible-xs pull-right btn btn-sm btn-default btn-nospin text-danger" data-type="Condition" onClick={() => selectEvent(event, 'Condition')}>Select</button>
                    </div>
                  </div>
                  <div className="panel-body">
                    A condition is based on known profile field values or submitted form data.
                  </div>
                  <div className="hidden-xs panel-footer text-center">
                    <button className="conditionSlctBtn btn btn-lg btn-default btn-nospin" data-type="Condition" onClick={() => selectEvent(event, 'Condition')}>Select</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="mr-0 ml-0 pl-xs pr-xs campaign-group-container col-md-12">
                <div id="CampaignPasteContainer" className="panel hide">
                  <div id="CampaignPasteDescription" className="panel-body">
                    <div><b>Insert cloned event here</b></div>
                    <div><span className="text-muted">Name: </span><span data-campaign-event-clone="sourceEventName"></span></div>
                    <div><span className="text-muted">From: </span><span data-campaign-event-clone="sourceCampaignName"></span></div>
                  </div>
                  <div className="panel-footer">
                    <a id="EventInsertButton" data-toggle="ajax" data-target="CampaignEvent_" data-ignore-formexit="true" data-method="POST" data-hide-loadingbar="true" href="/s/campaigns/events/insert?campaignId=mautic_312a76bbb3c6d0553fb080987a6e787182db510d&anchor=leadsource&anchorEventType=source" className="btn btn-lg btn-default">Insert</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="CampaignEventPanelLists" className="hide">
            <div id="SourceGroupList" className="EventGroupList eventList hide">
              <h4 className="mb-xs">
                <span>Contact Sources</span>
              </h4>
              
              <select id="SourceList" className="campaign-event-selector" style={{ display: 'none' }} onChange={(e) => selectCampaignSource(e)}>
                <option value=""></option>
                <option id="campaignLeadSource_lists" className="option_campaignLeadSource_lists" data-href="/s/campaigns/sources/new/mautic_2c5b105523f135723e5fa80b41511b682b4c42c5?sourceType=lists" data-target="#CampaignEventModal" title="Contacts that are members of the selected segments will be automatically added to this campaign." value="lists">Contact segments</option>
                <option id="campaignLeadSource_forms" className="option_campaignLeadSource_forms" data-href="/s/campaigns/sources/new/mautic_2c5b105523f135723e5fa80b41511b682b4c42c5?sourceType=forms" data-target="#CampaignEventModal" title="Contacts created from submissions for the selected forms will be automatically added to this campaign." value="forms">Campaign forms</option>
              </select>
            </div>

            <div id="ActionGroupList" className="EventGroupList eventList hide">
              <h4 className="mb-xs">
                <span>Actions</span>
                <button className="pull-right btn btn-xs btn-nospin btn-primary">
                  <i className="fa fa-fw ri-corner-right-up-line"></i>
                </button>
              </h4>
              <select id="ActionList" className="campaign-event-selector" style={{ display: 'none' }} data-eventtype="action" onChange={(e) => selectDecision(e)}>
                <option value=""></option>
                {actions.map((action) => (
                    <option
                    key={`act_${action.id}`}
                    id={`campaignEvent_${action.event}`}
                    className={`option_campaignEvent_${action.event}`}
                    title={action.description}
                    value={action.value}
                    >
                    {action.title}
                    </option>
                ))}
                </select>

            </div>

            <div id="DecisionGroupList" className="EventGroupList eventList hide">
              <h4 className="mb-xs">
                <span>Decisions</span>
                <button className="pull-right btn btn-xs btn-nospin btn-success">
                  <i className="fa fa-fw ri-corner-right-up-line"></i>
                </button>
              </h4>
              <select id="DecisionList" className="campaign-event-selector" style={{ display: 'none' }} data-eventtype="decision" onChange={(e) => selectDecision(e)}>
                <option value=""></option>
                {decisions.map((decision) => (
                    <option
                    key={`desc_${decision.id}`}
                    id={`campaignEvent_${decision.event}`}
                    className={`option_campaignEvent_${decision.event}`}
                    title={decision.description}
                    value={decision.value}
                    >
                    {decision.title}
                    </option>
                ))}
              </select>
            </div>
            
            <div id="ConditionGroupList" className="EventGroupList eventList hide">
              <h4 className="mb-xs">
                <span>Conditions</span>
                <button className="pull-right btn btn-xs btn-nospin btn-danger">
                  <i className="fa fa-fw ri-corner-right-up-line"></i>
                </button>
              </h4>
              <select id="ConditionList" className="campaign-event-selector" style={{ display: 'none' }} data-eventtype="condition" onChange={(e) => selectDecision(e)}>
                <option value=""></option>
                {conditions.map((condition) => (
                    <option
                    key={`cond_${condition.id}`}
                    id={`campaignEvent_${condition.event}`}
                    className={`option_campaignEvent_${condition.event}`}
                    title={condition.description}
                    value={condition.value}
                    >
                    {condition.title}
                    </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        <div className="builder-content" style={{ overflow: 'auto' }}>
          <div id="CampaignCanvas">
            <div id="CampaignEvent_newsource" className="text-center list-campaign-source list-campaign-leadsource" style={{ left: '545px', top: '50px' }}>
              <div className="campaign-event-content">
                <div>
                  <span className="campaign-event-name ellipsis">
                    <i className="mr-sm ri-team-line"></i> Add a contact source...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="modal fade in" id="campaignSourceModal" tabIndex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title" id="contactModalLabel">Contact Source</h3>
              <h6 className="text-muted">Contacts that are members of the selected segments will be automatically added to this campaign.</h6>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="contactSegments" className="form-label">Contact segments *</label>
                  <select id="contactSegments" multiple="multiple" className="form-select" style={{ width: '100%' }}>
                  {segments.map((segment) => (
                    <option
                    key={`seg_${segment.id}`}
                    id={`campaignSegment_${segment.id}`}
                    title={`${segment.name}(${segment.contacts})`}
                    value={segment.id}>
                        {`${segment.name}(${segment.contacts})`}
                    </option>
                    ))}
                    </select>
                  <div id="contactSourceErrMsg" className="hide">A value is required.</div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => addSource('contactSegments')}>+ Add</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => closeModal('cancel', 'campaignSourceModal')}>Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade in" id="campaignEventModal" tabIndex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <div className="loading-placeholder">Loading...</div>
              <div id="event-modal-body-content" className="modal-body-content">

              </div>
            </div>
            <div className="modal-footer">
              <div className="modal-form-buttons">
                <button type="button" className="btn btn-default btn-save btn-copy" onClick={() => saveEvent()}> <i className="ri-add-line"></i> Add</button>
                <button type="button" className="btn btn-default btn-cancel btn-copy" onClick={() => cancelEvent()} data-bs-dismiss="modal"><i className="ri-close-line"></i> Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilder;

