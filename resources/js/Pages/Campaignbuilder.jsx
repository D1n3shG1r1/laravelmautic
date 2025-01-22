import React, { useState } from 'react';
import styles from "../../css/Modules/CampaignBuilder.module.css"; // Import styles from the CSS module

const CampaignBuilder = () => {
    const [errorsVisible, setErrorsVisible] = useState(false);

    const saveCampaign = () => {
        // Replace with Mautic.saveCampaignFromBuilder() logic
        console.log('Saving campaign...');
    };

    const closeBuilder = () => {
        // Replace with Mautic.closeCampaignBuilder() logic
        console.log('Closing builder...');
    };

    const selectEvent = (event, type) => {
        // Replace with the selectEvent function logic
        console.log(`Selecting event: ${type}`);
    };

    return (
        <div id="campaign-builder" className={`${styles.builder} ${styles.campaignBuilder} ${styles.live} ${styles.builderActive}`} style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}>
            <div className={styles.btnsBuilder}>
                <button type="button" className={`${styles.btnPrimary} ${styles.btnApplyBuilder}`} onClick={saveCampaign}>
                    Save
                </button>
                <button type="button" className={`${styles.btnPrimary} ${styles.btnCloseCampaignBuilder}`} onClick={closeBuilder}>
                    Close Builder
                </button>
            </div>
            {errorsVisible && (
                <div id="builder-errors" className={styles.alertError} role="alert">
                    test
                </div>
            )}

            <div id="CampaignEventPanel" className={styles.hide}>
                <div id="CampaignEventPanelGroups" className={styles.groupsEnabled3}>
                    <div className="row">
                        <div className={`${styles.campaignGroupContainer} col-md-4`} id="DecisionGroupSelector">
                            <div className={`${styles.panel} ${styles.panelSuccess} ${styles.mb0}`}>
                                <div className={styles.panelHeading}>
                                    <div className="col-xs-8 col-sm-10 np">
                                        <h3 className={styles.panelTitle}>Decision</h3>
                                    </div>
                                    <div className="col-xs-4 col-sm-2 pl-0 pr-0 pt-10 pb-10 text-right">
                                        <i className={`${styles.hiddenXs} ${styles.fa} ${styles.faRandom} ${styles.faLg}`}></i>
                                        <button
                                            className={`${styles.decisionSlctBtn} ${styles.visibleXs} ${styles.pullRight} ${styles.btnSm} ${styles.btnDefault} ${styles.btnNospin} ${styles.textSuccess}`}
                                            data-type="Decision"
                                            onClick={(event) => selectEvent(event, 'Decision')}
                                        >
                                            Select
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.panelBody}>
                                    A decision is made when a contact decides to take action or not (e.g. opened an email).
                                </div>
                                <div className={`${styles.hiddenXs} ${styles.panelFooter} ${styles.textCenter}`}>
                                    <button
                                        className={`${styles.decisionSlctBtn} ${styles.btnLg} ${styles.btnDefault} ${styles.btnNospin} ${styles.textSuccess}`}
                                        data-type="Decision"
                                        onClick={(event) => selectEvent(event, 'Decision')}
                                    >
                                        Select
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.campaignGroupContainer} col-md-4`} id="ActionGroupSelector">
                            <div className={`${styles.panel} ${styles.panelPrimary} ${styles.mb0}`}>
                                <div className={styles.panelHeading}>
                                    <div className="col-xs-8 col-sm-10 np">
                                        <h3 className={styles.panelTitle}>Action</h3>
                                    </div>
                                    <div className="col-xs-4 col-sm-2 pl-0 pr-0 pt-10 pb-10 text-right">
                                        <i className={`${styles.hiddenXs} ${styles.fa} ${styles.faBullseye} ${styles.faLg}`}></i>
                                        <button
                                            className={`${styles.actionSlctBtn} ${styles.visibleXs} ${styles.pullRight} ${styles.btnSm} ${styles.btnDefault} ${styles.btnNospin} ${styles.textPrimary}`}
                                            data-type="Action"
                                            onClick={(event) => selectEvent(event, 'Action')}
                                        >
                                            Select
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.panelBody}>
                                    An action is something executed by Mautic (e.g. send an email).
                                </div>
                                <div className={`${styles.hiddenXs} ${styles.panelFooter} ${styles.textCenter}`}>
                                    <button
                                        className={`${styles.actionSlctBtn} ${styles.btnLg} ${styles.btnDefault} ${styles.btnNospin} ${styles.textPrimary}`}
                                        data-type="Action"
                                        onClick={(event) => selectEvent(event, 'Action')}
                                    >
                                        Select
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.campaignGroupContainer} col-md-4`} id="ConditionGroupSelector">
                            <div className={`${styles.panel} ${styles.panelDanger} ${styles.mb0}`}>
                                <div className={styles.panelHeading}>
                                    <div className="col-xs-8 col-sm-10 np">
                                        <h3 className={styles.panelTitle}>Condition</h3>
                                    </div>
                                    <div className="col-xs-4 col-sm-2 pl-0 pr-0 pt-10 pb-10 text-right">
                                        <i className={`${styles.hiddenXs} ${styles.fa} ${styles.faFilter} ${styles.faLg}`}></i>
                                        <button
                                            className={`${styles.conditionSlctBtn} ${styles.visibleXs} ${styles.pullRight} ${styles.btnSm} ${styles.btnDefault} ${styles.btnNospin} ${styles.textDanger}`}
                                            data-type="Condition"
                                            onClick={(event) => selectEvent(event, 'Condition')}
                                        >
                                            Select
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.panelBody}>
                                    A condition is based on known profile field values or submitted form data.
                                </div>
                                <div className={`${styles.hiddenXs} ${styles.panelFooter} ${styles.textCenter}`}>
                                    <button
                                        className={`${styles.conditionSlctBtn} ${styles.btnLg} ${styles.btnDefault} ${styles.btnNospin}`}
                                        data-type="Condition"
                                        onClick={(event) => selectEvent(event, 'Condition')}
                                    >
                                        Select
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className={`${styles.campaignGroupContainer} col-md-12`}>
                        <div id="CampaignPasteContainer" className={`${styles.panel} ${styles.hide}`}>
                            <div id="CampaignPasteDescription" className={styles.panelBody}>
                                <div><b>Insert cloned event here</b></div>
                                <div><span className="text-muted">Name: </span><span data-campaign-event-clone="sourceEventName"></span></div>
                                <div><span className="text-muted">From: </span><span data-campaign-event-clone="sourceCampaignName"></span></div>
                            </div>
                            <div className={styles.panelFooter}>
                                <a
                                    id="EventInsertButton"
                                    href="/s/campaigns/events/insert?campaignId=mautic_312a76bbb3c6d0553fb080987a6e787182db510d&amp;anchor=leadsource&amp;anchorEventType=source"
                                    className={`${styles.btnLg} ${styles.btnDefault}`}
                                >
                                    Insert
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.builderContent} style={{ overflow: 'auto' }}>
                <div id="CampaignCanvas">
                    <div
                        id="CampaignEvent_newsource"
                        className={`${styles.textCenter} ${styles.listCampaignSource} ${styles.listCampaignLeadSource}`}
                        style={{ left: '545px', top: '50px' }}
                    >
                        <div className={styles.campaignEventContent}>
                            <div>
                                <span className={styles.campaignEventName} className={styles.ellipsis}>
                                    <i className={`${styles.mrSm} ${styles.riTeamLine}`}></i> Add a contact source...
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignBuilder;
