<?php
/*
Ok report
get today's active/published campaigns
get campaign's segments and events to update/delete records or send emails
*/

namespace App\Jobs;

use App\Models\contacts_model;
use App\Models\segments_model;
use App\Models\segment_contacts_model;
use App\Models\tags_model;
use App\Models\tags_contacts_model;
use App\Models\campaigns_model;
use App\Models\campaign_events_model;
use App\Models\campaign_segments_model;
use App\Models\emailsbuilder_model;
use App\Models\campaign_emails_queue_model;
use App\Models\campaign_check_emails_event_model;
use App\Models\campaign_actions_report_model;
use App\Models\temp_events_output_model;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class ProcessCampaignJob implements ShouldQueue
{
    use Queueable;

    public $CAMPAIGNID;

    /**
     * Create a new job instance.
     *
     * @param  int  $CAMPAIGNID
     * @return void
     */
    public function __construct(int $campaignId)
    {
        $this->CAMPAIGNID = $campaignId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        
        Log::info("JOB STARTED: Processing campaign ID: {$this->CAMPAIGNID}");
        
        // Fetch the segment based on segmentId
        $today = date("Y-m-d");
        $currentDateTime =  date("Y-m-d H:i:s");
        $published = 1; 
        $deleted = null;
        $campaign = campaigns_model::where("id", $this->CAMPAIGNID)
        ->where("publish_up", $today)
        ->where("is_published", $published)
        ->first();
        
        // If the segment does not exist, skip this job
        if (!$campaign) {
            Log::warning("Campaign not found or not published today: {$this->CAMPAIGNID}");
            return;
        }

        $campaignID = $campaign->id;
        $isPublished = $campaign->is_published;
        $publishUp = $campaign->publish_up;

        //get campaign events
        $campaignEventsObj = campaign_events_model::where("campaignId", $campaignID)
        ->where("triggered", 0)
        ->orderBy("eventOrder", "asc")
        ->get();

        Log::info("Events found: " . $campaignEventsObj->count());

        if(!$campaignEventsObj){
            Log::warning("Events not found for the campaign: {$this->CAMPAIGNID}");
            return;
        }

        //get campaign segments
        $campaignSegmentsObj = campaign_segments_model::where("campaign_id", $campaignID)->get();

        Log::info("Segments found: " . $campaignSegmentsObj->count());

        if(!$campaignSegmentsObj){
            Log::warning("Segments not found for the campaign: {$this->CAMPAIGNID}");
            return;
        }

        $segmentIds = array();
        foreach($campaignSegmentsObj as $campaignSegmentRw){
            $tmpCampId = $campaignSegmentRw->campaign_id;
            $tmpCampSgmntId = $campaignSegmentRw->segment_id;
            $segmentIds[] = $tmpCampSgmntId;
        }

        //get segment contacts
        //segment_id contact_id
        $segmentContactsObj = segment_contacts_model::whereIn("segment_id", $segmentIds)->get();
        
        Log::info("SegmentContacts found: " . count($segmentContactsObj));

        if(!$segmentContactsObj){
            Log::warning("Segment-Contacts not found for the campaign: {$this->CAMPAIGNID}");
            return;
        }

        //get contact details id name email

        $contactIds = array();
        foreach($segmentContactsObj as $segmentContactRw){
            $tmpSgmntId = $segmentContactRw->segment_id;
            $tmpCntId = $segmentContactRw->contact_id;
            $contactIds[] = $tmpCntId;
        }

        $contactsObj = contacts_model::whereIn("id", $contactIds)->get();

        Log::info("Contacts found: " . count($contactIds));

        if(!$contactsObj){
            Log::warning("Contacts not found for the campaign: {$this->CAMPAIGNID}");
            return;
        }

        //
        /*foreach($contactsObj as $contactRw){
            //$contactRw->id
            //$contactRw->firstname
            //$contactRw->lastname
            //$contactRw->email
        }*/

        // trigger event
        foreach($campaignEventsObj as $campaignEventRw){
            $eventId = $campaignEventRw->id;
            $eventCampId = $campaignEventRw->campaignId;
            $eventParentId = $campaignEventRw->parentId;
            $eventName = $campaignEventRw->name;
            $eventType = $campaignEventRw->type; //action-type/decision-type/condition-type
            $eventEventType = $campaignEventRw->eventType; //action/decision/condition
            $eventOrder = $campaignEventRw->eventOrder;
            $eventProperties = $campaignEventRw->properties;
            $eventTriggered = $campaignEventRw->triggered; //0/1
            $eventDecisionPath = $campaignEventRw->decision_path; //yes/no

            $eventProperties = json_decode($eventProperties, true);

            
            $parentTriggred = 0;
            if($eventParentId > 0){
                // check for if the parent event is triggered or not
                
                $parentEventObj = campaign_events_model::select("triggered")
                ->where("campaignId", $campaignID)
                ->where("id", $eventParentId)
                ->first();
                
                if($parentEventObj && $parentEventObj->triggered == 1){
                    $parentTriggred = 1;
                }

            }
            
            if(($eventParentId > 0 && $parentTriggred > 0) || ($eventParentId == 0 && $parentTriggred == 0)){
                // trigger current event
                //== new logic



                //==========Dinesh
                //email.click, email.open, email.reply (decisions)
                //email.send (action)
                /*
                actions
                lead.deletecontact lead.changelist lead.changetags email.send lead.updatelead campaign.addremovelead
                
                decisions
                email.click email.open email.reply
                
                conditions
                lead.field_value lead.segments lead.tags
                */
                
                if($eventEventType == "action"){

                    if($eventType == "email.send"){
                        //send-email event
                        //make an email queue for each contact in campaign

                        //get subject and html
                        $emailTemplateId = $eventProperties["email"][0];
                        
                        $templateObj = emailsbuilder_model::select("subject","custom_html")->where("id", $emailTemplateId)->first();
                        $subject = $templateObj->subject;
                        $custom_html = $templateObj->custom_html;

                        // create batch rows
                        $batchRows = array();
                        foreach($contactsObj as $contactRw){
                            $cntId = $contactRw->id;
                            $cntFNm = $contactRw->firstname;
                            $cntLNm = $contactRw->lastname;
                            $cntEml = $contactRw->email;

                            $batchRows[] = array(
                                //'id'
                                'campaignId' => $eventCampId,
                                'segmentId' => 0,
                                'eventId' => $eventId,
                                'contactId' => $cntId,
                                'contactName' => ucwords($cntFNm.' '.$cntLNm),
                                'contactEmail' => $cntEml,
                                'subject' => $subject,
                                'html' => $custom_html,
                                'emailSent' => 0,
                                'emailBrevoEvents' => '',
                                'brevoTransactionId' => '',
                                'date_added' => date("Y-m-d H:i:s"),
                                'date_modified' => date("Y-m-d H:i:s")
                            );
                        
                        }

                        $insert = campaign_emails_queue_model::insert($batchRows);
                        
                        Log::warning("{$insert} Email is queued for the campaign: {$this->CAMPAIGNID}");

                        return $insert;

                    }elseif($eventType == "lead.deletecontact"){
                        //delete contact
                        


                    }elseif($eventType == "lead.changelist"){
                        //add/remove contact to/from specific segment
                    }elseif($eventType == "lead.changetags"){
                        //add/remove contact tags
                    }elseif($eventType == "lead.updatelead"){
                        //modify contact event
                    }elseif($eventType == "campaign.addremovelead"){
                        //add/remove contact to/from specific campaign
                    }
                    
                }elseif($eventEventType == "condition"){
                    
                    if($eventType == "lead.field_value"){
                        //delete contact
                    }elseif($eventType == "lead.segments"){
                        //add/remove contact to/from specific segment
                    }elseif($eventType == "lead.tags"){
                        //add/remove contact tags
                    }

                }elseif($eventEventType == "decision"){
                    /*if($eventDecisionPath == 'yes'){

                    }elseif($eventDecisionPath == 'no'){

                    }*/  
                    
                    $emailRelatedType = 0;
                    if($eventType == "email.click"){
                        //if email click
                        //make an entry in campaignCheckEmailsEvent
                        $emailRelatedType = 1;
                    }elseif($eventType == "email.open"){
                        //if email open
                        //make an entry in campaignCheckEmailsEvent
                        $emailRelatedType = 1;
                    }elseif($eventType == "email.reply"){
                        //if email reply
                        //make an entry in campaignCheckEmailsEvent
                        $emailRelatedType = 1;
                    }

                    if($emailRelatedType == 1){
                        //get parent-event where type=email.send eventType=action
                        if($eventParentId > 0){
                            $currentEvtPrntId = $eventParentId;
                            $eventFind = 0;
                            do {
                            
                            //check if parent-event where type=email.send eventType=action
                            $parentEventObj2 = campaign_events_model::select("id", "parentId", "campaignId", "type", "eventType")
                            ->where("campaignId", $campaignID)
                            ->where("id", $currentEvtPrntId)
                            ->first();
                              
                            if($parentEventObj2){
                                $tmpEvtId = $parentEventObj2->id;
                                $tmpPrntId = $parentEventObj2->parentId;
                                $tmpCmpId = $parentEventObj2->campaignId;
                                $tmpTyp = $parentEventObj2->type;
                                $tmpEvntTyp = $parentEventObj2->eventType;
                                
                                if($tmpTyp == "email.send" && $tmpEvntTyp == "action"){
                                    if($eventFind == 0){
                                        $eventFind = 1;
                                        
                                        /* Think on alternate logic
                                        //make an entry in campaignCheckEmailsEvent
                                        $cmpChkEmlEvntObj = new campaign_check_emails_event_model();
                                        $cmpChkEmlEvntObj->campaignId = $tmpCmpId;
                                        $cmpChkEmlEvntObj->eventId = $eventId;
                                        $cmpChkEmlEvntObj->parentEventId = $tmpPrntId;
                                        $cmpChkEmlEvntObj->triggered = 0;
                                        //$cmpChkEmlEvntObj->trigger_date = null;
                                        $cmpChkEmlEvntObj->date_added = $currentDateTime;
                                        $cmpChkEmlEvntObj->date_modified = $currentDateTime;

                                        $cmpChkEmlEvntObj->save();
                                        */
                                         
                                        $sentEmailObj = campaign_emails_queue_model::where("eventId",$tmpPrntId)
                                        ->where("campaignId", $tmpCmpId)
                                        ->where("emailSent", 1)
                                        ->first();

                                        if($sentEmailObj){
                                            
                                    $EO_campaignId = $sentEmailObj->campaignId;
                                    $EO_segmentId = $sentEmailObj->segmentId;
                                    $EO_eventId = $sentEmailObj->eventId;
                                    $EO_contactId = $sentEmailObj->contactId;
                                    $EO_contactName = $sentEmailObj->contactName;
                                    $EO_contactEmail = $sentEmailObj->contactEmail;
                                    $EO_subject = $sentEmailObj->subject;
                                    $EO_html = $sentEmailObj->html;
                                    $EO_emailSent = $sentEmailObj->emailSent;
                                    $EO_emailBrevoEvents = $sentEmailObj->emailBrevoEvents;
                                    $EO_brevoTransactionId =  $sentEmailObj->brevoTransactionId;
                                    $EO_date_added = $sentEmailObj->date_added;
                                    $EO_date_modified = $sentEmailObj->date_modified;
                                        
                                
                                            //to be Continue for 5may2025
                                            //get and update brevo email status
                                            /*$EO_brevoTransactionId
                                            curl --request GET \
                                            --url 'https://api.brevo.com/v3/smtp/statistics/events?limit=2500&offset=0&messageId=%3C202505031206.36443988330%40smtp-relay.mailin.fr%3E&sort=desc' \
                                            --header 'accept: application/json' \
                                            --header 'api-key: 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'*/
                                            
                                            $apikey = config('brevo.apikey');
                                            $messageId = $EO_brevoTransactionId;
                                            $messageId = urlencode($messageId);
                                            // Prepare the cURL command
                                            $cmd = "curl --request GET \
                                            --url 'https://api.brevo.com/v3/smtp/statistics/events?limit=2500&offset=0&messageId=$messageId&sort=desc' \
                                            --header 'accept: application/json' \
                                            --header 'api-key: $apikey'";

                                            // Execute the cURL command
                                            exec($cmd, $out);

                                            // Output the result for debugging
                                            if(!empty($out)){
                                                /* possible events
                                                1. request
                                                2. click
                                                3. deferred
                                                4. delivered
                                                5. soft_bounce
                                                6. hard_bounce
                                                7. spam
                                                8. unique_opened
                                                9. opened
                                                10. invalid_email
                                                11. blocked
                                                12. error
                                                13. unsubscribed
                                                14. proxy_open
                                                15. unique_proxy_open
                                                */    
                                                

                                                $smtpEventsObj = json_decode($out[0]);
                                                $emailEventsArr = $smtpEventsObj->events;

                                                $statusList = array();
                                                foreach($emailEventsArr as $tmpEvntStsRw){
                                                  
                                                    if($tmpEvntStsRw->event == 'opened'){
                                                        $statusList[] = $tmpEvntStsRw->event;
                                                        $statusList[] = "email.open";
                                                    }

                                                    if($tmpEvntStsRw->event == 'click'){
                                                        $statusList[] = $tmpEvntStsRw->event;
                                                        $statusList[] = "email.click";
                                                    }
                                                    

                                                }

                                                
                                                //update campaign event triggred to 1
                                                $updateData = array(
                                                    "triggered" => 1,
                                                    "triggered_on" => date("Y-m-d H:i:s")
                                                );

                                                campaign_events_model::where("id", $eventId)
                                                ->where("campaignId", $eventCampId)
                                                ->update($updateData);

                                                //trigger child events where decisionpath yes/no
                                                if(in_array($eventType, $statusList)){
                                                    //perform yes action

                                                    //lead.deletecontact


                                                    //trigger yes
                                                    $row = campaign_events_model::where("parentId", $eventId)
                                                    ->where("campaignId", $eventCampId)
                                                    ->where("decision_path", "yes")
                                                    ->first();

                                                    if ($row) {
                                                        $row->triggered = 1;
                                                        $row->triggered_on = date("Y-m-d H:i:s");
                                                        $row->save();

                                                        $lastUpdatedId = $row->id;
                                                    }

                                                }else{
                                                    //perform no action
                                                    
                                                    //trigger no
                                                    /*$updateData = array(
                                                        "triggered" => 1,
                                                        "triggered_on" => date("Y-m-d H:i:s")
                                                    );
    
                                                    campaign_events_model::where("parentId", $eventId)
                                                    ->where("campaignId", $eventCampId)
                                                    ->where("decision_path","no")
                                                    ->update($updateData);
                                                    */

                                                    $row = campaign_events_model::where("parentId", $eventId)
                                                    ->where("campaignId", $eventCampId)
                                                    ->where("decision_path", "no")
                                                    ->first();

                                                    if ($row) {
                                                        $row->triggered = 1;
                                                        $row->triggered_on = date("Y-m-d H:i:s");
                                                        $row->save();

                                                        $lastUpdatedId = $row->id;
                                                    }
                                                }

                                            }


                                        }
                                    }
                                    
                                }else{
                                    //move to parent's parent-event
                                    $currentEvtPrntId = $tmpPrntId;
                                }
                            }
    
                            } while ($eventFind == 1);
                        }    

                        
                    }
                }
            }else{
                //log parent event is not triggered yet
                Log::warning("event's {$eventId} parent event is not triggered for the campaign: {$this->CAMPAIGNID}");
            }
        }

    }

    function triggerEventOperations($actionEventData){
        
        $today = $actionEventData["today"];
        $campaignId = $actionEventData["campaignId"];
        $eventId = $actionEventData["eventId"];
        $parentId = $actionEventData["parentId"];
        $eventType = $actionEventData["eventType"];
        $event = $actionEventData["event"];
        $eventProperties = $actionEventData["eventProperties"];
        $decisionPath = $actionEventData["decisionPath"];
        $contactsObj = $actionEventData["contactsObj"];

        
        //trigger actions for all contacts available in selected segments
        
        //============ Action
        if($eventType == "action"){
            
            if($event == "email.send"){
                //send-email event
                //make an email queue for each contact in campaign

                //get subject and html
                $emailTemplateId = $eventProperties["email"][0];
                
                $templateObj = emailsbuilder_model::select("subject","custom_html")->where("id", $emailTemplateId)->first();
                $subject = $templateObj->subject;
                $custom_html = $templateObj->custom_html;

                // create batch rows
                $sendEmailContacts = array();
                $batchRows = array();
                $reportBatchRows = array();

                foreach($contactsObj as $contactRw){
                    $cntId = $contactRw->id;
                    $cntFNm = $contactRw->firstname;
                    $cntLNm = $contactRw->lastname;
                    $cntEml = $contactRw->email;

                    $sendEmailContacts[] = $cntId;

                    $batchRows[] = array(
                        //'id'
                        'campaignId' => $campaignId,
                        'segmentId' => 0,
                        'eventId' => $eventId,
                        'contactId' => $cntId,
                        'contactName' => ucwords($cntFNm.' '.$cntLNm),
                        'contactEmail' => $cntEml,
                        'subject' => $subject,
                        'html' => $custom_html,
                        'emailSent' => 0,
                        'emailBrevoEvents' => '',
                        'brevoTransactionId' => '',
                        'date_added' => $today,
                        'date_modified' => $today
                    );
                
                    //batch rows for `campaign_actions_report_model`
                    $reportBatchRows[] = array(
                        "campaign_id" => $campaignId,
                        "event_id" => $eventId,
                        "event_type" => $eventType,
                        "event" => $event,
                        "properties" => json_encode($eventProperties),
                        "decision_path" => 'yes', //$decisionPath, //for email.send event assume `yes`
                        "contact_id" => $cntId,
                        "handled" => 1, //1 if contact falls in Yes, if contact falls in No and will process later on next attempt
                        "date_added" => $today,
                        "date_modified" => $today
                    );
                }

                //send email queue
                $insert = campaign_emails_queue_model::insert($batchRows);
                
                Log::warning("{$insert} Email is queued for the campaign: {$campaignId}");


                //last action triggered
                $tmpEvtOutPut = new temp_events_output_model();
                //$tmpEvtOutPut->id
                $tmpEvtOutPut->campaign_id = $campaignId;  
                $tmpEvtOutPut->event_id = $eventId;
                $tmpEvtOutPut->event_type = $eventType;
                $tmpEvtOutPut->type = $event;
                $tmpEvtOutPut->yes = json_encode($sendEmailContacts);
                $tmpEvtOutPut->no = ''; 
                $tmpEvtOutPut->date_added = $today;
                $tmpEvtOutPut->date_modified = $today;
                $tmpEvtOutPutId = $tmpEvtOutPut->save();

                //keep data for action reports
                //make entry to keep affected contacts
                $reportBatchInsert = campaign_actions_report_model::insert($reportBatchRows);

                Log::warning("{$reportBatchInsert} report row inserted for campaign: {$campaignId}");

                //update this event triggered to 1 by `SendCampaignEmail` job
                
                return $insert;

            }elseif($eventType == "lead.deletecontact"){
                //delete contact
                $reportBatchRows = array();
                $deleteContactIds = array();
                foreach($contactsObj as $contactRw){
                    $cntId = $contactRw->id;
                    $deleteContactIds[] = $cntId;

                    //batch rows for `campaign_actions_report_model`
                    $reportBatchRows[] = array(
                        "campaign_id" => $campaignId,
                        "event_id" => $eventId,
                        "event_type" => $eventType,
                        "event" => $event,
                        "properties" => json_encode($eventProperties),
                        "decision_path" => 'yes', //$decisionPath, //for lead.deletecontact event assume `yes`
                        "contact_id" => $cntId,
                        "handled" => 1, //1 if contact falls in Yes, if contact falls in No and will process later on next attempt
                        "date_added" => $today,
                        "date_modified" => $today
                    );
                }

                if(!empty($deleteContactIds)){
                    //delete contact from segments
                    segment_contacts_model::whereIn("contact_id", $deleteContactIds)->delete();

                    //delete contact from tags
                    tags_contacts_model::whereIn("contact_id", $deleteContactIds)->delete();

                    //delete contacts
                    contacts_model::whereIn("id", $deleteContactIds)->delete();


                    //update event triggered
                    $updateEventTriggerData = array(
                        "triggered" => 1,
                        "triggered_on" => $today
                    );

                    campaign_events_model::where("id", $eventId)
                    ->where("campaignId", $campaignId)
                    ->update($updateEventTriggerData);
                    

                    //last action triggered
                    $tmpEvtOutPut = new temp_events_output_model();
                    //$tmpEvtOutPut->id
                    $tmpEvtOutPut->campaign_id = $campaignId;  
                    $tmpEvtOutPut->event_id = $eventId;
                    $tmpEvtOutPut->event_type = $eventType;
                    $tmpEvtOutPut->type = $event;
                    $tmpEvtOutPut->yes = json_encode($deleteContactIds);
                    $tmpEvtOutPut->no = ''; 
                    $tmpEvtOutPut->date_added = $today;
                    $tmpEvtOutPut->date_modified = $today;
                    $tmpEvtOutPutId = $tmpEvtOutPut->save();

                    //keep data for action reports
                    //make entry to keep affected contacts
                    $reportBatchInsert = campaign_actions_report_model::insert($reportBatchRows);

                    Log::warning("{$reportBatchInsert} report row inserted for campaign: {$campaignId}");

                }


            }elseif($eventType == "lead.changelist"){
                //add/remove contact to/from specific segment
                
                $addToSegmentIds = $eventProperties["addToLists"];
                $removeFromSegmentIds = $eventProperties["removeFromLists"];

                $addRemoveContactIds = array();
                $reportBatchRows = array();
                foreach($contactsObj as $contactRw){
                    $cntId = $contactRw->id;
                    $addRemoveContactIds[] = $cntId;

                    //batch rows for `campaign_actions_report_model`
                    $reportBatchRows[] = array(
                        "campaign_id" => $campaignId,
                        "event_id" => $eventId,
                        "event_type" => $eventType,
                        "event" => $event,
                        "properties" => json_encode($eventProperties),
                        "decision_path" => 'yes', //$decisionPath, //for lead.changelist event assume `yes`
                        "contact_id" => $cntId,
                        "handled" => 1, //1 if contact falls in Yes, if contact falls in No and will process later on next attempt
                        "date_added" => $today,
                        "date_modified" => $today
                    );
                }

                if(!empty($addToSegmentIds)){
                    //add contacts to segments
                    $batchAddRows = array();
                    
                    if(!empty($addRemoveContactIds)){

                        foreach($addToSegmentIds as $addSegId){
                            
                            foreach($addRemoveContactIds as $addContId){
                            
                                $batchAddRows[] = array(
                                    "segment_id" => $addSegId,
                                    "contact_id" => $addContId,
                                    "date_added" => $today, 
                                    "manually_removed" => 0,
                                    "manually_added" => 0
                                );

                            }

                        }
                    }

                    if(!empty($batchAddRows)){
                        $saved = segment_contacts_model::insert($batchAddRows);
                    }

                }
                
                if(!empty($removeFromSegmentIds)){
                    //remove contacts from segments
                    $batchRemoveRows = array();
                    if(!empty($addRemoveContactIds)){

                        foreach($removeFromSegmentIds as $rmvSegId){
                            
                            foreach($addRemoveContactIds as $rmvContId){
                            
                                $batchRemoveRows[] = array(
                                    "segment_id" => $rmvSegId,
                                    "contact_id" => $rmvContId
                                );
                            }

                        }
                    }

                    if(!empty($batchRemoveRows)){
                        
                        $affectedContacts = array();
                        
                        foreach ($batchRemoveRows as $removeRow) {
                            
                            $affectedContacts[] = $removeRow['contact_id'];

                            segment_contacts_model::where('segment_id', $removeRow['segment_id'])
                            ->where('contact_id', $removeRow['contact_id'])
                            ->delete();
                        }
                        
                    }

                }

                //update event triggered
                $updateEventTriggerData = array(
                    "triggered" => 1,
                    "triggered_on" => $today
                );

                campaign_events_model::where("id", $eventId)
                ->where("campaignId", $campaignId)
                ->update($updateEventTriggerData);
                

                //last action triggered
                $tmpEvtOutPut = new temp_events_output_model();
                //$tmpEvtOutPut->id
                $tmpEvtOutPut->campaign_id = $campaignId;  
                $tmpEvtOutPut->event_id = $eventId;
                $tmpEvtOutPut->event_type = $eventType;
                $tmpEvtOutPut->type = $event;
                $tmpEvtOutPut->yes = json_encode($addRemoveContactIds);
                $tmpEvtOutPut->no = ''; 
                $tmpEvtOutPut->date_added = $today;
                $tmpEvtOutPut->date_modified = $today;
                $tmpEvtOutPutId = $tmpEvtOutPut->save();

                //keep data for action reports
                //make entry to keep affected contacts
                $reportBatchInsert = campaign_actions_report_model::insert($reportBatchRows);

                Log::warning("{$reportBatchInsert} report row inserted for campaign: {$campaignId}");

            }elseif($eventType == "lead.changetags"){
                //add/remove contact tags

                $addToTagsIds = $eventProperties["add_tags"];
                $removeFromTagsIds = $eventProperties["remove_tags"];

                $addRemoveContactIds = array();
                $reportBatchRows = array();
                foreach($contactsObj as $contactRw){
                    $cntId = $contactRw->id;
                    $addRemoveContactIds[] = $cntId;

                    //batch rows for `campaign_actions_report_model`
                    $reportBatchRows[] = array(
                        "campaign_id" => $campaignId,
                        "event_id" => $eventId,
                        "event_type" => $eventType,
                        "event" => $event,
                        "properties" => json_encode($eventProperties),
                        "decision_path" => 'yes', //$decisionPath, //for lead.changetags event assume `yes`
                        "contact_id" => $cntId,
                        "handled" => 1, //1 if contact falls in Yes, if contact falls in No and will process later on next attempt
                        "date_added" => $today,
                        "date_modified" => $today
                    );
                }

                if(!empty($addToTagsIds)){
                    //add contacts to tags
                    $batchAddRows = array();
                    if(!empty($addRemoveContactIds)){

                        foreach($addToTagsIds as $addTagId){
                            
                            foreach($addRemoveContactIds as $addContId){
                            
                                $batchAddRows[] = array(
                                    "tag_id" => $addTagId,
                                    "contact_id" => $addContId,
                                );
                            }

                            
                        }
                    }

                    if(!empty($batchAddRows)){
                        $saved = segment_contacts_model::insert($batchAddRows);
                    }

                }
                
                if(!empty($removeFromTagsIds)){
                    //remove contacts from tags
                    $batchRemoveRows = array();
                    if(!empty($addRemoveContactIds)){

                        foreach($removeFromTagsIds as $rmvTagId){
                            
                            foreach($addRemoveContactIds as $rmvContId){
                            
                                $batchRemoveRows[] = array(
                                    "tag_id" => $rmvTagId,
                                    "contact_id" => $rmvContId
                                );
                            }

                        }
                    }

                    if(!empty($batchRemoveRows)){
                        
                        $affectedContacts = array();
                        
                        foreach ($batchRemoveRows as $removeRow) {
                            
                            $affectedContacts[] = $removeRow['contact_id'];

                            segment_contacts_model::where('segment_id', $removeRow['segment_id'])
                            ->where('contact_id', $removeRow['contact_id'])
                            ->delete();
                        }
                        
                    }

                }

                //update event triggered
                $updateEventTriggerData = array(
                    "triggered" => 1,
                    "triggered_on" => $today
                );

                campaign_events_model::where("id", $eventId)
                ->where("campaignId", $campaignId)
                ->update($updateEventTriggerData);
                

                //last action triggered
                $tmpEvtOutPut = new temp_events_output_model();
                //$tmpEvtOutPut->id
                $tmpEvtOutPut->campaign_id = $campaignId;  
                $tmpEvtOutPut->event_id = $eventId;
                $tmpEvtOutPut->event_type = $eventType;
                $tmpEvtOutPut->type = $event;
                $tmpEvtOutPut->yes = json_encode($addRemoveContactIds);
                $tmpEvtOutPut->no = ''; 
                $tmpEvtOutPut->date_added = $today;
                $tmpEvtOutPut->date_modified = $today;
                $tmpEvtOutPutId = $tmpEvtOutPut->save();

                //keep data for action reports
                //make entry to keep affected contacts
                $reportBatchInsert = campaign_actions_report_model::insert($reportBatchRows);

                Log::warning("{$reportBatchInsert} report row inserted for campaign: {$campaignId}");

            }elseif($eventType == "lead.updatelead"){
                //contact modify event
                $modifyContactIds = array();
                $reportBatchRows = array();
                foreach($contactsObj as $contactRw){
                    $cntId = $contactRw->id;
                    $modifyContactIds[] = $cntId;

                    //batch rows for `campaign_actions_report_model`
                    $reportBatchRows[] = array(
                        "campaign_id" => $campaignId,
                        "event_id" => $eventId,
                        "event_type" => $eventType,
                        "event" => $event,
                        "properties" => json_encode($eventProperties),
                        "decision_path" => 'yes', //$decisionPath, //for lead.updatelead event assume `yes`
                        "contact_id" => $cntId,
                        "handled" => 1, //1 if contact falls in Yes, if contact falls in No and will process later on next attempt
                        "date_added" => $today,
                        "date_modified" => $today
                    );
                }

                if(!empty($modifyContactIds)){
                    //$removeFromTagsIds = $eventProperties["remove_tags"];
                    $contactUpdateData = array(
                        "title" => $eventProperties["title"],
                        "firstname" => $eventProperties["remove_tags"],
                        "lastname" => $eventProperties["remove_tags"],
                        "email" => $eventProperties["remove_tags"],
                        "mobile" => $eventProperties["remove_tags"],
                        "address1" => $eventProperties["remove_tags"],
                        "address2" => $eventProperties["remove_tags"],
                        "city" => $eventProperties["remove_tags"],
                        "state" => $eventProperties["remove_tags"],
                        "zip" => $eventProperties["remove_tags"],
                        "country" => $eventProperties["remove_tags"],
                        "date_modified" => $today,
                    );

                    contacts_model::whereIn("id", $modifyContactIds)->update($contactUpdateData);


                    //update event triggered
                    $updateEventTriggerData = array(
                        "triggered" => 1,
                        "triggered_on" => $today
                    );

                    campaign_events_model::where("id", $eventId)
                    ->where("campaignId", $campaignId)
                    ->update($updateEventTriggerData);
                    

                    //last action triggered
                    $tmpEvtOutPut = new temp_events_output_model();
                    //$tmpEvtOutPut->id
                    $tmpEvtOutPut->campaign_id = $campaignId;  
                    $tmpEvtOutPut->event_id = $eventId;
                    $tmpEvtOutPut->event_type = $eventType;
                    $tmpEvtOutPut->type = $event;
                    $tmpEvtOutPut->yes = json_encode($modifyContactIds);
                    $tmpEvtOutPut->no = ''; 
                    $tmpEvtOutPut->date_added = $today;
                    $tmpEvtOutPut->date_modified = $today;
                    $tmpEvtOutPutId = $tmpEvtOutPut->save();

                    //keep data for action reports
                    //make entry to keep affected contacts
                    $reportBatchInsert = campaign_actions_report_model::insert($reportBatchRows);

                    Log::warning("{$reportBatchInsert} report row inserted for campaign: {$campaignId}");
                }
            }
            
        }

        //============ Decision
        if($eventType == "decision"){
            if(($event == 'email.click' || $event == 'email.open') && $parentId > 0){


                //ensure if parent-event is triggered
                $parentEventObj = campaign_events_model::where("id",$parentId)->first();

                if($parentEventObj){
                    $isParentTriggered = $parentEventObj->triggered;
                    $parentEventType = $parentEventObj->eventType;
                    $parentType = $parentEventObj->type;
                    
                    if($isParentTriggered > 0){
                        if($parentEventType == 'action' && $parentType == 'email.send'){
                            //ensure if parent event-type is 'action' and event is 'email.send'

                            //get the list of contacts and brevo-message-id from 'campaign_emails_queue_model' to whom the email is sent
                            
                            //ommit the contacts who already opened/clicked the email
                            $ommitContacts = array();

                            //contacts with matched/unmatched decisions
                            $yesContacts = array();
                            $noContacts = array();

                            $reportBatchRows = array(); 
                            
                            /*$query = campaign_emails_queue_model::where("eventId", $parentId)
                            ->where("campaignId", $campaignId)
                            ->where("emailSent", 1);*/
                            $query = campaign_emails_queue_model::where("eventId", $parentId)
                            ->where("campaignId", $campaignId);
                            
                            if (!empty($ommitContacts)) {
                                $query->whereNotIn("contactId", $ommitContacts);
                            }

                            $sentEmailObj = $query->get();

                            if($sentEmailObj){

                                foreach($sentEmailObj as $sentEmailRw){
                                    
                                    //check sent email brevo-events for each contact in the campaign/segment

                                    $EO_queueId = $sentEmailRw->id;
                                    $EO_campaignId = $sentEmailRw->campaignId;
                                    $EO_eventId = $sentEmailRw->eventId;
                                    $EO_contactId = $sentEmailRw->contactId;
                                    $EO_emailSent = $sentEmailRw->emailSent;
                                    $EO_brevoTransactionId = $sentEmailRw->brevoTransactionId;

                                    if($EO_emailSent == 1){
                                        
                                        //check email status for sent emails

                                        $apikey = config('brevo.apikey');
                                        $messageId = $EO_brevoTransactionId;
                                        $messageId = urlencode($messageId);

                                        // Prepare the cURL command
                                        $cmd = "curl --request GET \
                                        --url 'https://api.brevo.com/v3/smtp/statistics/events?limit=2500&offset=0&messageId=$messageId&sort=desc' \
                                        --header 'accept: application/json' \
                                        --header 'api-key: $apikey'";

                                        // Execute the cURL command
                                        exec($cmd, $out);

                                        // Output the result for debugging
                                        if(!empty($out)){

                                            $response = json_decode($out[0]);

                                            if(property_exists($response, 'code') && ($response->code == 'bad_request' || $response->code == 'unauthorized')){ 
                                                //echo 'code:'.$response->code.', message:'.$response->message;
                                                Log::warning("Brevo error: code:{$response->code}', message:{$response->message} for CampaignID: {$EO_campaignId}, QueueID: {$EO_queueId} while tracking brevo email events") ;
                                                
                                            }else{
                                                /* possible events
                                                1. request (sent)
                                                2. click
                                                3. deferred
                                                4. delivered
                                                5. soft_bounce
                                                6. hard_bounce
                                                7. spam
                                                8. unique_opened
                                                9. opened
                                                10. invalid_email
                                                11. blocked
                                                12. error
                                                13. unsubscribed
                                                14. proxy_open
                                                15. unique_proxy_open
                                                */

                                                $smtpEventsObj = json_decode($out[0]);
                                                
                                                if($smtpEventsObj && !empty($smtpEventsObj)){
                                                    
                                                    $emailEventsArr = $smtpEventsObj->events;

                                                    $statusList = array();
                                                    foreach($emailEventsArr as $tmpEvntStsRw){
                                                        $statusList[] = $tmpEvntStsRw->event;
                                                        if($tmpEvntStsRw->event == 'opened'){
                                                            $statusList[] = "email.open";
                                                        }

                                                        if($tmpEvntStsRw->event == 'click'){
                                                            $statusList[] = "email.click";
                                                        }
                                                        
                                                    }

                                                    if(in_array($event, $statusList)){
                                                        //if required event exists in statusList then add contact to condition-matched 'yesContacts' array
                                                        $yesContacts[] = $EO_contactId;

                                                        //batch rows for `campaign_actions_report_model`
                                                        $reportBatchRows[] = array(
                                                            "campaign_id" => $campaignId,
                                                            "event_id" => $eventId,
                                                            "event_type" => $eventType,
                                                            "event" => $event,
                                                            "properties" => json_encode($eventProperties),
                                                            "decision_path" => 'yes',
                                                            "contact_id" => $EO_contactId,
                                                            "handled" => 1, //1 if contact falls in Yes, if contact falls in No and will process later on next attempt
                                                            "date_added" => $today,
                                                            "date_modified" => $today
                                                        );

                                                    }else{
                                                        //if required event does not exists in statusList then add contact to condition-unmatched 'noContacts' array
                                                        $noContacts[] = $EO_contactId;

                                                        //batch rows for `campaign_actions_report_model`
                                                        $reportBatchRows[] = array(
                                                            "campaign_id" => $campaignId,
                                                            "event_id" => $eventId,
                                                            "event_type" => $eventType,
                                                            "event" => $event,
                                                            "properties" => json_encode($eventProperties),
                                                            "decision_path" => 'no',
                                                            "contact_id" => $EO_contactId,
                                                            "handled" => 0, //1 if contact falls in Yes, if contact falls in No and will process later on next attempt
                                                            "date_added" => $today,
                                                            "date_modified" => $today
                                                        );
                                                    }
                                                }
                                                
                                            }

                                        }else{
                                            //curl error
                                        }
                                    
                                    }else{
                                        //if email is not sent then we assume email is not opened/clicked add contact to condition-unmatched 'noContacts' array

                                        $noContacts[] = $EO_contactId;

                                        
                                        //batch rows for `campaign_actions_report_model`
                                        $reportBatchRows[] = array(
                                            "campaign_id" => $campaignId,
                                            "event_id" => $eventId,
                                            "event_type" => $eventType,
                                            "event" => $event,
                                            "properties" => json_encode($eventProperties),
                                            "decision_path" => 'no',
                                            "contact_id" => $EO_contactId,
                                            "handled" => 0, //1 if contact falls in Yes, if contact falls in No and will process later on next attempt
                                            "date_added" => $today,
                                            "date_modified" => $today
                                        );
                                    }
                                    

                                }

                            }else{
                                //no email is sent to any contact
                                $noContacts = array();
                                foreach($contactsObj as $contactRw){
                                    $cntId = $contactRw->id;
                                    $noContacts[] = $cntId;
                                }
                            }


                            //update event triggered
                            $updateEventTriggerData = array(
                                "triggered" => 1,
                                "triggered_on" => $today
                            );

                            campaign_events_model::where("id", $eventId)
                            ->where("campaignId", $campaignId)
                            ->update($updateEventTriggerData);

                            //last action triggered
                            $tmpEvtOutPut = new temp_events_output_model();
                            //$tmpEvtOutPut->id
                            $tmpEvtOutPut->campaign_id = $campaignId;  
                            $tmpEvtOutPut->event_id = $eventId;
                            $tmpEvtOutPut->event_type = $eventType;
                            $tmpEvtOutPut->type = $event;
                            $tmpEvtOutPut->yes = json_encode($yesContacts);
                            $tmpEvtOutPut->no = json_encode($noContacts);
                            $tmpEvtOutPut->date_added = $today;
                            $tmpEvtOutPut->date_modified = $today;
                            $tmpEvtOutPutId = $tmpEvtOutPut->save();

                            //keep data for action reports
                            //make entry to keep affected contacts
                            $reportBatchInsert = campaign_actions_report_model::insert($reportBatchRows);

                            Log::warning("{$reportBatchInsert} report row inserted for campaign: {$campaignId}");

                        }
                    }else{
                        //parent event not triggered yet
                    }
                }else{
                    //parent event not found
                }

            }
            


            if($event != 'email.click' && $event != 'email.open'){
               
                //decision event-type is other than 'email.click' and 'email.open'
                //you can handle with your own way

               if($parentId > 0){
                    //has parent event

                    if($parentEventType == 'action' && $parentType != 'email.send'){
                        //if parent `eventType` is equals to 'action' and parent `type` is not equals to `email.send` or any other option-value assumed for send-email

                        

                    }

               }else{
                    //dont have parent event
               }
            
            }
        }

        if($eventType == "condition"){
            
        }

        
    }

//============ maybe no need of this
    function handleActionEventOperations($actionEventData){
        
        $today = $actionEventData["today"];
        $campaignId = $actionEventData["campaignId"];
        $eventId = $actionEventData["eventId"];
        $eventType = $actionEventData["eventType"];
        $event = $actionEventData["event"];
        $eventProperties = $actionEventData["eventProperties"];
        $decisionPath = $actionEventData["decisionPath"];
        $contactsObj = $actionEventData["contactsObj"];

        //self parent
        //trigger actions for all contacts available in selected segments
        
        if($event == "email.send"){
            //send-email event
            //make an email queue for each contact in campaign

            //get subject and html
            $emailTemplateId = $eventProperties["email"][0];
            
            $templateObj = emailsbuilder_model::select("subject","custom_html")->where("id", $emailTemplateId)->first();
            $subject = $templateObj->subject;
            $custom_html = $templateObj->custom_html;

            // create batch rows
            $sendEmailContacts = array();
            $batchRows = array();
            foreach($contactsObj as $contactRw){
                $cntId = $contactRw->id;
                $cntFNm = $contactRw->firstname;
                $cntLNm = $contactRw->lastname;
                $cntEml = $contactRw->email;

                $sendEmailContacts[] = $cntId;

                $batchRows[] = array(
                    //'id'
                    'campaignId' => $campaignId,
                    'segmentId' => 0,
                    'eventId' => $eventId,
                    'contactId' => $cntId,
                    'contactName' => ucwords($cntFNm.' '.$cntLNm),
                    'contactEmail' => $cntEml,
                    'subject' => $subject,
                    'html' => $custom_html,
                    'emailSent' => 0,
                    'emailBrevoEvents' => '',
                    'brevoTransactionId' => '',
                    'date_added' => $today,
                    'date_modified' => $today
                );
            
            }

            $insert = campaign_emails_queue_model::insert($batchRows);
            
            Log::warning("{$insert} Email is queued for the campaign: {$this->CAMPAIGNID}");

            //keep data for action reports
            //make entry to keep affected contacts
            //$reportData["id"] = '';
            $reportData["campaign_id"] = $campaignId;
            $reportData["event_id"] = $eventId;
            $reportData["event_type"] = $eventType;
            $reportData["event"] = $event;
            $reportData["properties"] = json_encode($eventProperties);
            $reportData["decision_path"] = $decisionPath;
            $reportData["affected_contacts"] = json_encode($sendEmailContacts);
            $reportData["date_added"] = $today;
            $this->addToReports($reportData);

            return $insert;

        }elseif($eventType == "lead.deletecontact"){
            //delete contact
            $deleteContactIds = array();
            foreach($contactsObj as $contactRw){
                $cntId = $contactRw->id;
                $deleteContactIds[] = $cntId;
            }

            if(!empty($deleteContactIds)){
                //delete contact from segments
                segment_contacts_model::whereIn("contact_id", $deleteContactIds);

                //delete contact from tags
                tags_contacts_model::whereIn("contact_id", $deleteContactIds);

                //delete contacts
                contacts_model::whereIn("id", $deleteContactIds);

                //make entry to keep affected contacts
                //$reportData["id"] = '';
                $reportData["campaign_id"] = $campaignId;
                $reportData["event_id"] = $eventId;
                $reportData["event_type"] = $eventType;
                $reportData["event"] = $event;
                $reportData["properties"] = json_encode($eventProperties);
                $reportData["decision_path"] = $decisionPath;
                $reportData["affected_contacts"] = json_encode($deleteContactIds);
                $reportData["date_added"] = $today;
                $this->addToReports($reportData);

            }


        }elseif($eventType == "lead.changelist"){
            //add/remove contact to/from specific segment
            
            $addToSegmentIds = $eventProperties["addToLists"];
            $removeFromSegmentIds = $eventProperties["removeFromLists"];

            $addRemoveContactIds = array();
            foreach($contactsObj as $contactRw){
                $cntId = $contactRw->id;
                $addRemoveContactIds[] = $cntId;
            }

            if(!empty($addToSegmentIds)){
                //add contacts to segments
                $batchAddRows = array();
                if(!empty($addRemoveContactIds)){

                    foreach($addToSegmentIds as $addSegId){
                        
                        foreach($addRemoveContactIds as $addContId){
                        
                            $batchAddRows[] = array(
                                "segment_id" => $addSegId,
                                "contact_id" => $addContId,
                                "date_added" => $today, 
                                "manually_removed" => 0,
                                "manually_added" => 0
                            );
                        }

                        
                    }
                }

                if(!empty($batchAddRows)){
                    $saved = segment_contacts_model::insert($batchAddRows);
                }

            }
            
            if(!empty($removeFromSegmentIds)){
                //remove contacts from segments
                $batchRemoveRows = array();
                if(!empty($addRemoveContactIds)){

                    foreach($removeFromSegmentIds as $rmvSegId){
                        
                        foreach($addRemoveContactIds as $rmvContId){
                        
                            $batchRemoveRows[] = array(
                                "segment_id" => $rmvSegId,
                                "contact_id" => $rmvContId
                            );
                        }

                    }
                }

                if(!empty($batchRemoveRows)){
                    
                    $affectedContacts = array();
                    
                    foreach ($batchRemoveRows as $removeRow) {
                        
                        $affectedContacts[] = $removeRow['contact_id'];

                        segment_contacts_model::where('segment_id', $removeRow['segment_id'])
                        ->where('contact_id', $removeRow['contact_id'])
                        ->delete();
                    }
                    
                }

            }

            //make entry to keep affected contacts
            //$reportData["id"] = '';
            $reportData["campaign_id"] = $campaignId;
            $reportData["event_id"] = $eventId;
            $reportData["event_type"] = $eventType;
            $reportData["event"] = $event;
            $reportData["properties"] = json_encode($eventProperties);
            $reportData["decision_path"] = $decisionPath;
            $reportData["affected_contacts"] = json_encode($addRemoveContactIds);
            $reportData["date_added"] = $today;
            $this->addToReports($reportData);

        }elseif($eventType == "lead.changetags"){
            //add/remove contact tags

            $addToTagsIds = $eventProperties["add_tags"];
            $removeFromTagsIds = $eventProperties["remove_tags"];

            $addRemoveContactIds = array();
            foreach($contactsObj as $contactRw){
                $cntId = $contactRw->id;
                $addRemoveContactIds[] = $cntId;
            }

            if(!empty($addToTagsIds)){
                //add contacts to tags
                $batchAddRows = array();
                if(!empty($addRemoveContactIds)){

                    foreach($addToTagsIds as $addTagId){
                        
                        foreach($addRemoveContactIds as $addContId){
                        
                            $batchAddRows[] = array(
                                "tag_id" => $addTagId,
                                "contact_id" => $addContId,
                            );
                        }

                        
                    }
                }

                if(!empty($batchAddRows)){
                    $saved = segment_contacts_model::insert($batchAddRows);
                }

            }
            
            if(!empty($removeFromTagsIds)){
                //remove contacts from tags
                $batchRemoveRows = array();
                if(!empty($addRemoveContactIds)){

                    foreach($removeFromTagsIds as $rmvTagId){
                        
                        foreach($addRemoveContactIds as $rmvContId){
                        
                            $batchRemoveRows[] = array(
                                "tag_id" => $rmvTagId,
                                "contact_id" => $rmvContId
                            );
                        }

                    }
                }

                if(!empty($batchRemoveRows)){
                    
                    $affectedContacts = array();
                    
                    foreach ($batchRemoveRows as $removeRow) {
                        
                        $affectedContacts[] = $removeRow['contact_id'];

                        segment_contacts_model::where('segment_id', $removeRow['segment_id'])
                        ->where('contact_id', $removeRow['contact_id'])
                        ->delete();
                    }
                    
                }

            }

            //make entry to keep affected contacts
            //$reportData["id"] = '';
            $reportData["campaign_id"] = $campaignId;
            $reportData["event_id"] = $eventId;
            $reportData["event_type"] = $eventType;
            $reportData["event"] = $event;
            $reportData["properties"] = json_encode($eventProperties);
            $reportData["decision_path"] = $decisionPath;
            $reportData["affected_contacts"] = json_encode($addRemoveContactIds);
            $reportData["date_added"] = $today;
            $this->addToReports($reportData);

        }elseif($eventType == "lead.updatelead"){
            //contact modify event
            $modifyContactIds = array();
            foreach($contactsObj as $contactRw){
                $cntId = $contactRw->id;
                $modifyContactIds[] = $cntId;
            }

            if(!empty($modifyContactIds)){
                //$removeFromTagsIds = $eventProperties["remove_tags"];
                $contactUpdateData = array(
                    "title" => $eventProperties["title"],
                    "firstname" => $eventProperties["remove_tags"],
                    "lastname" => $eventProperties["remove_tags"],
                    "email" => $eventProperties["remove_tags"],
                    "mobile" => $eventProperties["remove_tags"],
                    "address1" => $eventProperties["remove_tags"],
                    "address2" => $eventProperties["remove_tags"],
                    "city" => $eventProperties["remove_tags"],
                    "state" => $eventProperties["remove_tags"],
                    "zip" => $eventProperties["remove_tags"],
                    "country" => $eventProperties["remove_tags"],
                    "date_modified" => $today,
                );

                contacts_model::whereIn("id", $modifyContactIds)->update($contactUpdateData);


                //make entry to keep affected contacts
                //$reportData["id"] = '';
                $reportData["campaign_id"] = $campaignId;
                $reportData["event_id"] = $eventId;
                $reportData["event_type"] = $eventType;
                $reportData["event"] = $event;
                $reportData["properties"] = json_encode($eventProperties);
                $reportData["decision_path"] = $decisionPath;
                $reportData["affected_contacts"] = json_encode($modifyContactIds);
                $reportData["date_added"] = $today;
                $this->addToReports($reportData);
            }
        }


        
    }

    function handleYesNoOperations(){
        //handle Yes/No operations for decision or action
        $today = date("Y-m-d H:i:s");
        $campaignId = 1;
        
        $contactsObj = array();

        $prntEventId = 2;
        $prntEventType = 'decision'; //decision //action //condition
        $prntEvent = 'email.click';
        $prnteventProperties = '';
        
        
        $eventId = 3;
        $eventType = 'action'; //decision //action //condition
        $event = 'send.email'; //add/remove/update tags/campaigns/segments/contacts
        $decisionPath = 'yes'; //yes/no
        $eventProperties = '';

        //email.click email.open email.reply (decision)
        //lead.field_value lead.segments lead.tags (codition)

        
        if($eventType == 'action' && $prntEventId == 0){

            //if action is parent
            //trigger actions for all contacts available in selected segments
            
            $actionEventData = array();
            $actionEventData["today"] = $today;
            $actionEventData["campaignId"] = $campaignId;
            $actionEventData["eventId"] = $eventId;
            $actionEventData["eventType"] = $eventType;
            $actionEventData["event"] = $event;
            $actionEventData["eventProperties"] = $eventProperties;
            $actionEventData["decisionPath"] = $decisionPath;
            $actionEventData["contactsObj"] = $contactsObj;
            $this->handleActionEventOperations($actionEventData);

        }

        if($eventType == 'action' && $prntEventId > 0){
            //if event type is 'action'
            //if action has parent

            if($prntEventType == 'action'){
                //if parent event type 'action'
            }

            if($prntEventType == 'decision'){
                //if parent event type 'decision'
                //perform action
                
                if($prntEvent == 'email.click' || $prntEvent == 'email.open'){
                    //Track brevo event
                    //email.click email.open email.reply

                    $sentEmailObj = campaign_emails_queue_model::where("eventId",$prntEventId)
                    ->where("campaignId", $campaignId)
                    ->where("emailSent", 1)
                    ->first();    

                    if($sentEmailObj){
                                            
                        $EO_campaignId = $sentEmailObj->campaignId;
                        $EO_segmentId = $sentEmailObj->segmentId;
                        $EO_eventId = $sentEmailObj->eventId;
                        $EO_contactId = $sentEmailObj->contactId;
                        $EO_contactName = $sentEmailObj->contactName;
                        $EO_contactEmail = $sentEmailObj->contactEmail;
                        $EO_subject = $sentEmailObj->subject;
                        $EO_html = $sentEmailObj->html;
                        $EO_emailSent = $sentEmailObj->emailSent;
                        $EO_emailBrevoEvents = $sentEmailObj->emailBrevoEvents;
                        $EO_brevoTransactionId =  $sentEmailObj->brevoTransactionId;
                        $EO_date_added = $sentEmailObj->date_added;
                        $EO_date_modified = $sentEmailObj->date_modified;
                    
                        $apikey = config('brevo.apikey');
                        $messageId = $EO_brevoTransactionId;
                        $messageId = urlencode($messageId);
                        // Prepare the cURL command
                        $cmd = "curl --request GET \
                        --url 'https://api.brevo.com/v3/smtp/statistics/events?limit=2500&offset=0&messageId=$messageId&sort=desc' \
                        --header 'accept: application/json' \
                        --header 'api-key: $apikey'";

                        // Execute the cURL command
                        exec($cmd, $out);

                        // Output the result for debugging
                        if(!empty($out)){
                            /* possible events
                            1. request
                            2. click
                            3. deferred
                            4. delivered
                            5. soft_bounce
                            6. hard_bounce
                            7. spam
                            8. unique_opened
                            9. opened
                            10. invalid_email
                            11. blocked
                            12. error
                            13. unsubscribed
                            14. proxy_open
                            15. unique_proxy_open
                            */    
                            

                            $smtpEventsObj = json_decode($out[0]);
                            $emailEventsArr = $smtpEventsObj->events;

                            $statusList = array();
                            foreach($emailEventsArr as $tmpEvntStsRw){
                                
                                $statusList[] = $tmpEvntStsRw->event;
                                
                                if($tmpEvntStsRw->event == 'opened'){
                                    $statusList[] = "email.open";
                                }
                                
                                if($tmpEvntStsRw->event == 'click'){
                                    $statusList[] = "email.click";
                                }
                                
                            }

                            
                            //update campaign event triggred to 1
                            $updateData = array(
                                "triggered" => 1,
                                "triggered_on" => date("Y-m-d H:i:s")
                            );

                            campaign_events_model::where("id", $prntEventId)
                            ->where("campaignId", $campaignId)
                            ->update($updateData);

                            //trigger child events where decisionpath yes/no
                            if(in_array($eventType, $statusList)){
                                //perform yes-part actions

                                $actionEventData = array();
                                $actionEventData["today"] = $today;
                                $actionEventData["campaignId"] = $campaignId;
                                $actionEventData["eventId"] = $eventId;
                                $actionEventData["eventType"] = $eventType;
                                $actionEventData["event"] = $event;
                                $actionEventData["eventProperties"] = $eventProperties;
                                $actionEventData["decisionPath"] = $decisionPath;
                                $actionEventData["contactsObj"] = $contactsObj;
                                $this->handleActionEventOperations($actionEventData);


                                //trigger yes-part
                                $row = campaign_events_model::where("parentId", $prntEventId)
                                ->where("campaignId", $campaignId)
                                ->where("decision_path", "yes")
                                ->first();

                                if ($row) {
                                    $row->triggered = 1;
                                    $row->triggered_on = date("Y-m-d H:i:s");
                                    $row->save();

                                    $lastUpdatedId = $row->id;
                                }

                            }else{
                                //perform no-part actions
                                
                                //trigger no-part
                                $row = campaign_events_model::where("parentId", $prntEventId)
                                ->where("campaignId", $campaignId)
                                ->where("decision_path", "no")
                                ->first();

                                if ($row) {
                                    $row->triggered = 1;
                                    $row->triggered_on = date("Y-m-d H:i:s");
                                    $row->save();

                                    $lastUpdatedId = $row->id;
                                }
                            }

                        }
                    }
                }

                

                

            }

            if($prntEventType == 'condition'){
                //if parent event type 'condition'
            }
        }


        //handle yes/no for Decisions and Conditions
        if($eventType == 'decision'){
            //if event type is 'decision'
            
        }

        if($eventType == 'condition'){
            //if event type is 'condition'
            
        }

    }

    
    function addToReports($data){
        //affected contacts by campaign run
        //campaign_actions_report_model
        $reportObj = new campaign_actions_report_model();
        
        //$reportObj->id
        $reportObj->campaign_id = $data["campaign_id"];
        $reportObj->event_id = $data["event_id"];
        $reportObj->event_type = $data["event_type"];
        $reportObj->event = $data["event"];
        $reportObj->properties = $data["properties"];
        $reportObj->decision_path = $data["decision_path"];
        $reportObj->affected_contacts = $data["affected_contacts"];
        $reportObj->date_added = $data["date_added"];
        $reportObj->save();

    }
}