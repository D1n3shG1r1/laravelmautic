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

        $campaign = campaigns_model::where("id", $this->CAMPAIGNID)->first();
        
        // If the segment does not exist, skip this job
        if (!$campaign) {
            Log::warning("Campaign not found or not published today: {$this->CAMPAIGNID}");
            return;
        }

        $campaignID = $campaign->id;
        $isPublished = $campaign->is_published;
        $publishUp = $campaign->publish_up;

        //get campaign events
        /*$campaignEventsObj = campaign_events_model::where("campaignId", $campaignID)
        ->where("triggered", 0)
        ->orderBy("eventOrder", "asc")
        ->get();*/
        $campaignEventsObj = campaign_events_model::where("campaignId", $campaignID)
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
            $eventType = $campaignEventRw->type; //send.email/email.open etc.
            $eventEventType = $campaignEventRw->eventType; //action/decision/condition
            $eventOrder = $campaignEventRw->eventOrder;
            $eventProperties = $campaignEventRw->properties;
            $eventTriggered = $campaignEventRw->triggered; //0/1
            $eventDecisionPath = $campaignEventRw->decision_path; //yes/no
            $eventTriggerCount = $campaignEventRw->trigger_count; 

            $eventProperties = json_decode($eventProperties, true);

            $actionEventData = array();
            $actionEventData["today"] = $currentDateTime;
            $actionEventData["campaignId"] = $eventCampId;
            $actionEventData["eventId"] = $eventId;
            $actionEventData["parentId"] = $eventParentId;
            $actionEventData["eventType"] = $eventEventType;
            $actionEventData["event"] = $eventType;
            $actionEventData["eventProperties"] = $eventProperties;
            $actionEventData["decisionPath"] = $eventDecisionPath;
            $actionEventData["trigger_count"] = $eventTriggerCount;
            $actionEventData["contactsObj"] = $contactsObj;

            //handle event operations
            $this->triggerEventOperations($actionEventData);
        
        }

    }

    function triggerEventOperations($actionEventData){
        
        //"trigger_count" => $triggerCount,
        $today = $actionEventData["today"];
        $campaignId = $actionEventData["campaignId"];
        $eventId = $actionEventData["eventId"];
        $parentId = $actionEventData["parentId"];
        $eventType = $actionEventData["eventType"];
        $event = $actionEventData["event"];
        $eventProperties = $actionEventData["eventProperties"];
        $decisionPath = $actionEventData["decisionPath"];
        $triggerPrevCount = $actionEventData["trigger_count"]; //previous count
        $contactsObj = $actionEventData["contactsObj"];
        
        $triggerCount = $triggerPrevCount + 1;

        $processContactsList = array();
        $parentEventType = '';
        $parentType = '';
        if($parentId > 0){
            //has parent

            //check if parent is triggered
            $parentEventObj = campaign_events_model::where("id",$parentId)->first();

            if($parentEventObj){
                $isParentTriggered = $parentEventObj->triggered;
                $parentEventType = $parentEventObj->eventType;
                $parentType = $parentEventObj->type;
                
                if($isParentTriggered > 0){
                    //check parent event-type action/condition/decision

                    if($parentEventType == 'action'){
                        //case-1 if parent-event-type is action
                        //get yes contacts of parent-event from campaign_actions_report_model

                       $parentContactsObj = campaign_actions_report_model::select("contact_id")
                        ->where("event_id",$parentId)
                        ->where("decision_path","yes")
                        ->get();

                        if($parentContactsObj && !empty($parentContactsObj)){
                            foreach($parentContactsObj as $parentContactRw){
                                $processContactsList[] = $parentContactRw->contact_id;
                            }
                        }
                        
                    }

                    if($parentEventType == 'decision' || $parentEventType == 'condition'){
                        //case-2 if parent-event-type is condition or decision
                        
                        if($triggerPrevCount > 0){
                            
                            //when the event is triggered again
                            //get the contacts of parent event from temp_events_output_model where `no` is not empty or null
                            //`no` is not empty or null means in previous try contact was not met the condition
                            //like if someone opens or clicked the email after 1or2days so that contact should be handled in next try
                            
                            $parentContactsObj = temp_events_output_model::select("no")
                            ->where("event_id", $parentId)
                            ->where("campaign_id", $campaignId)
                            ->first();

                            if($parentContactsObj && !empty($parentContactsObj)){
                                $processContactsList = json_decode($parentContactsObj->no, true);
                            }

                        }else{
                            
                            //when the event is triggered 1st time
                            //check current event decision-path
                            if($decisionPath == 'yes'){
                                /*
                                //get yes contacts of parent-event from campaign_actions_report_model

                                $parentContactsObj = campaign_actions_report_model::select("contact_id")
                                ->where("event_id",$parentId)
                                ->where("decision_path","yes")
                                ->get();

                                if($parentContactsObj && !empty($parentContactsObj)){
                                    foreach($parentContactsObj as $parentContactRw){
                                        $processContactsList[] = $parentContactRw->contact_id;
                                    }
                                }
                                */
                                
                                //get yes contacts of parent-event from temp_events_output_model
                                $parentContactsObj = temp_events_output_model::select("yes")
                                ->where("event_id", $parentId)
                                ->where("campaign_id", $campaignId)
                                ->first();

                                if($parentContactsObj && !empty($parentContactsObj)){
                                    $processContactsList = json_decode($parentContactsObj->yes, true);
                                }

                            }
                            
                            if($decisionPath == 'no'){
                                /*
                                //get no contacts of parent-event from campaign_actions_report_model

                                $parentContactsObj = campaign_actions_report_model::select("contact_id")
                                ->where("event_id",$parentId)
                                ->where("decision_path","no")
                                ->get();

                                if($parentContactsObj && !empty($parentContactsObj)){
                                    foreach($parentContactsObj as $parentContactRw){
                                        $processContactsList[] = $parentContactRw->contact_id;
                                    }
                                }
                                */

                                //get no contacts of parent-event from temp_events_output_model
                                $parentContactsObj = temp_events_output_model::select("no")
                                ->where("event_id", $parentId)
                                ->where("campaign_id", $campaignId)
                                ->first();

                                if($parentContactsObj && !empty($parentContactsObj)){
                                    $processContactsList = json_decode($parentContactsObj->no, true);
                                }

                            }
                        }

                    }

                }else{
                    //parent is not triggered yet
                    //halt the process
                    //parent event not triggered yet
                    Log::warning("parent event is not triggered for event: {$eventId} campaign: {$campaignId}");
                    return;

                }
            }else{
                //parent event not found
                Log::warning("parent event is not found for event: {$eventId} campaign: {$campaignId}");
                return;
            }

        }else{
            //has not any parent
            
            if($triggerPrevCount > 0){
                //when the event is triggered again
                //get the contacts of parent event from temp_events_output_model where `no` is not empty or null
                //`no` is not empty or null means in previous try contact was not met the condition
                //like if someone opens or clicked the email after 1or2days so that contact should be handled in next try

                //get no contacts of event from temp_events_output_model
                $parentContactsObj = temp_events_output_model::select("yes")
                ->where("event_id", $eventId)
                ->where("campaign_id", $campaignId)
                ->first();

                if($parentContactsObj && !empty($parentContactsObj)){
                    $processContactsList = json_decode($parentContactsObj->no, true);
                }

            }else{
                //get main-contacts list
                if(!empty($contactsObj)){

                    foreach($contactsObj as $contactRw){
                        $cntId = $contactRw->id;
                        $processContactsList[] = $cntId;
                    }
    
                }
            }
            
        }
        
        //trigger the event based on above $processContactsList object
        if(!empty($processContactsList)){
            //trigger logic

            $processContactsObj = contacts_model::whereIn("id", $processContactsList)->get();
            if($processContactsObj){
                $processContactsObj = $processContactsObj->toArray();
            }else{
                $processContactsObj = array();
            }
            

            //============ Action
            if($eventType == "action"){
                
                if($event == "email.send"){
                    //send-email event

                    //eleminate the contacts where email is already sent
                       
                    $emailSentContactsObj = campaign_emails_queue_model::select("contactId")
                    ->where("campaignId", $campaignId)
                    ->where("eventId", $eventId)
                    ->where("emailSent", 1)
                    ->get();
                    
                    $prevSentContIds = array();

                    if($emailSentContactsObj && !empty($emailSentContactsObj)){
                        foreach($emailSentContactsObj as $emailSentContRw){
                            $prevSentContIds[] = $emailSentContRw->contactId;
                        }
                    }
                    
                    if(!empty($prevSentContIds)){
                        foreach($processContactsObj as $k=>$proContRw){
                            $elmCntId = $proContRw["id"];
                            if(in_array($elmCntId, $prevSentContIds)){
                                unset($processContactsObj[$k]);
                            }
                        }
                    }
                    
                    if(!empty($processContactsObj)){
                       
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
                        $reportBatchUpdateRows = array();

                        foreach($processContactsObj as $contactRw){
                            $cntId = $contactRw["id"];
                            $cntFNm = $contactRw["firstname"];
                            $cntLNm = $contactRw["lastname"];
                            $cntEml = $contactRw["email"];

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
                            if($triggerPrevCount > 0){
                                //batch update
                                // Update campaign_actions_report_model
                                $reportUpdateData = [
                                    'handled' => 1,
                                    'decision_path' => 'yes',
                                    'date_modified' => $today,
                                ];

                                campaign_actions_report_model::where('event_id', $eventId)
                                ->where('contact_id', $cntId)
                                ->update($reportUpdateData);

                            }else{
                                //batch insert
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
                            
                        }

                        //send email queue
                        $insert = campaign_emails_queue_model::insert($batchRows);
                        
                        Log::warning("{$insert} Email is queued for the campaign: {$campaignId}");


                        //last action triggered
                        if($triggerPrevCount > 0){
                            //update record for current event
                            $tmpUpdtData = array(
                                "yes" => json_encode($sendEmailContacts),
                                "no" => json_encode(array()), //empty json
                                "date_modified" => $today
                            );
                            temp_events_output_model::where("campaign_id", $campaignId)
                            ->where("event_id", $eventId)
                            ->update($tmpUpdtData);
                            
                        }else{
                            //insert record
                            $tmpEvtOutPut = new temp_events_output_model();
                            //$tmpEvtOutPut->id
                            $tmpEvtOutPut->campaign_id = $campaignId;  
                            $tmpEvtOutPut->event_id = $eventId;
                            $tmpEvtOutPut->event_type = $eventType;
                            $tmpEvtOutPut->type = $event;
                            $tmpEvtOutPut->yes = json_encode($sendEmailContacts);
                            $tmpEvtOutPut->no = json_encode(array()); //empty json
                            $tmpEvtOutPut->date_added = $today;
                            $tmpEvtOutPut->date_modified = $today;
                            $tmpEvtOutPutId = $tmpEvtOutPut->save();
                        
                            //keep data for action reports
                            //make entry to keep affected contacts
                            $reportBatchInsert = campaign_actions_report_model::insert($reportBatchRows);

                            Log::warning("{$reportBatchInsert} report row inserted for campaign: {$campaignId}");
                        }

                        //update this event triggered to 1 by `SendCampaignEmail` job
                        
                        return $insert;
                    }
                    

                }
                
                if($event == "lead.deletecontact"){
                    //delete contact
                    $reportBatchRows = array();
                    $reportBatchUpdateRows = array();
                    $deleteContactIds = array();
                    foreach($processContactsObj as $contactRw){
                        $cntId = $contactRw["id"];
                        $deleteContactIds[] = $cntId;


                        //batch rows for `campaign_actions_report_model`
                        if($triggerPrevCount > 0){
                            //batch update
                            // Update campaign_actions_report_model
                            $reportUpdateData = [
                                'handled' => 1,
                                'decision_path' => 'yes',
                                'date_modified' => $today,
                            ];

                            campaign_actions_report_model::where('event_id', $eventId)
                            ->where('contact_id', $cntId)
                            ->update($reportUpdateData);

                        }else{
                            //batch insert
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
                            "trigger_count" => $triggerCount,
                            "triggered_on" => $today
                        );

                        campaign_events_model::where("id", $eventId)
                        ->where("campaignId", $campaignId)
                        ->update($updateEventTriggerData);
                        

                        //last action triggered
                        if($triggerPrevCount > 0){
                            //update record for current event
                            $tmpUpdtData = array(
                                "yes" => json_encode($deleteContactIds),
                                "no" => json_encode(array()), //empty json,
                                "date_modified" => $today
                            );
                            temp_events_output_model::where("campaign_id", $campaignId)
                            ->where("event_id", $eventId)
                            ->update($tmpUpdtData);
                            
                        }else{
                            //insert record
                            $tmpEvtOutPut = new temp_events_output_model();
                            //$tmpEvtOutPut->id
                            $tmpEvtOutPut->campaign_id = $campaignId;  
                            $tmpEvtOutPut->event_id = $eventId;
                            $tmpEvtOutPut->event_type = $eventType;
                            $tmpEvtOutPut->type = $event;
                            $tmpEvtOutPut->yes = json_encode($deleteContactIds);
                            $tmpEvtOutPut->no = json_encode(array()); //empty json
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
                
                if($event == "lead.changelist"){
                    //add/remove contact to/from specific segment
                    
                    $addToSegmentIds = $eventProperties["addToLists"];
                    $removeFromSegmentIds = $eventProperties["removeFromLists"];

                    $addRemoveContactIds = array();
                    $reportBatchRows = array();
                    $reportBatchUpdateRows = array();
                    foreach($processContactsObj as $contactRw){
                        $cntId = $contactRw["id"];
                        $addRemoveContactIds[] = $cntId;

                        //batch rows for `campaign_actions_report_model`
                        if($triggerPrevCount > 0){
                            //batch update
                            // Update campaign_actions_report_model
                            $reportUpdateData = [
                                'handled' => 1,
                                'decision_path' => 'yes',
                                'date_modified' => $today,
                            ];

                            campaign_actions_report_model::where('event_id', $eventId)
                            ->where('contact_id', $cntId)
                            ->update($reportUpdateData);

                        }else{
                            //batch insert
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
                        "trigger_count" => $triggerCount,
                        "triggered_on" => $today
                    );

                    campaign_events_model::where("id", $eventId)
                    ->where("campaignId", $campaignId)
                    ->update($updateEventTriggerData);
                    

                    //last action triggered
                    if($triggerPrevCount > 0){
                        //update record for current event
                        $tmpUpdtData = array(
                            "yes" => json_encode($addRemoveContactIds),
                            "no" => json_encode(array()), //empty json
                            "date_modified" => $today
                        );
                        temp_events_output_model::where("campaign_id", $campaignId)
                        ->where("event_id", $eventId)
                        ->update($tmpUpdtData);
                        
                    }else{
                        $tmpEvtOutPut = new temp_events_output_model();
                        //$tmpEvtOutPut->id
                        $tmpEvtOutPut->campaign_id = $campaignId;  
                        $tmpEvtOutPut->event_id = $eventId;
                        $tmpEvtOutPut->event_type = $eventType;
                        $tmpEvtOutPut->type = $event;
                        $tmpEvtOutPut->yes = json_encode($addRemoveContactIds);
                        $tmpEvtOutPut->no = json_encode(array()); //empty json
                        $tmpEvtOutPut->date_added = $today;
                        $tmpEvtOutPut->date_modified = $today;
                        $tmpEvtOutPutId = $tmpEvtOutPut->save();
                    }

                    //keep data for action reports
                    //make entry to keep affected contacts
                    $reportBatchInsert = campaign_actions_report_model::insert($reportBatchRows);

                    Log::warning("{$reportBatchInsert} report row inserted for campaign: {$campaignId}");

                }
                
                if($event == "lead.changetags"){
                    //add/remove contact tags
                    if(array_key_exists("add_tags", $eventProperties)){
                        $addToTagsIds = $eventProperties["add_tags"];
                    }else{
                        $addToTagsIds = array();
                    }
                    
                    if(array_key_exists("remove_tags", $eventProperties)){
                        $removeFromTagsIds = $eventProperties["remove_tags"];
                    }else{
                        $removeFromTagsIds = array();
                    }


                    $addRemoveContactIds = array();
                    $reportBatchUpdateRows = array();
                    $reportBatchRows = array();
                    foreach($processContactsObj as $contactRw){
                        $cntId = $contactRw["id"];
                        $addRemoveContactIds[] = $cntId;

                        //batch rows for `campaign_actions_report_model`
                        if($triggerPrevCount > 0){
                            //batch update
                            // Update campaign_actions_report_model
                            $reportUpdateData = [
                                'handled' => 1,
                                'decision_path' => 'yes',
                                'date_modified' => $today,
                            ];

                            campaign_actions_report_model::where('event_id', $eventId)
                            ->where('contact_id', $cntId)
                            ->update($reportUpdateData);

                        }else{
                            //batch insert
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
                            $saved = tags_contacts_model::insert($batchAddRows);
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

                                tags_contacts_model::where('tag_id', $removeRow['tag_id'])
                                ->where('contact_id', $removeRow['contact_id'])
                                ->delete();
                            }
                            
                        }

                    }

                    //update event triggered
                    $updateEventTriggerData = array(
                        "triggered" => 1,
                        "trigger_count" => $triggerCount,
                        "triggered_on" => $today
                    );

                    campaign_events_model::where("id", $eventId)
                    ->where("campaignId", $campaignId)
                    ->update($updateEventTriggerData);
                    

                    //last action triggered
                    if($triggerPrevCount > 0){
                        //update record for current event
                        $tmpUpdtData = array(
                            "yes" => json_encode($addRemoveContactIds),
                            "no" => json_encode(array()), //empty json
                            "date_modified" => $today
                        );
                        temp_events_output_model::where("campaign_id", $campaignId)
                        ->where("event_id", $eventId)
                        ->update($tmpUpdtData);
                        
                    }else{
                        $tmpEvtOutPut = new temp_events_output_model();
                        //$tmpEvtOutPut->id
                        $tmpEvtOutPut->campaign_id = $campaignId;  
                        $tmpEvtOutPut->event_id = $eventId;
                        $tmpEvtOutPut->event_type = $eventType;
                        $tmpEvtOutPut->type = $event;
                        $tmpEvtOutPut->yes = json_encode($addRemoveContactIds);
                        $tmpEvtOutPut->no = json_encode(array()); //empty json; 
                        $tmpEvtOutPut->date_added = $today;
                        $tmpEvtOutPut->date_modified = $today;
                        $tmpEvtOutPutId = $tmpEvtOutPut->save();
                    
                        //keep data for action reports
                        //make entry to keep affected contacts
                        $reportBatchInsert = campaign_actions_report_model::insert($reportBatchRows);
                        
                        Log::warning("{$reportBatchInsert} report row inserted for campaign: {$campaignId}");
                    }
                    

                }
                
                if($event == "lead.updatelead"){
                    //contact modify event
                    $modifyContactIds = array();
                    $reportBatchRows = array();
                    $reportBatchUpdateRows = array();
                    foreach($processContactsObj as $contactRw){
                        $cntId = $contactRw["id"];
                        $modifyContactIds[] = $cntId;

                        //batch rows for `campaign_actions_report_model`
                        if($triggerPrevCount > 0){
                            //batch update
                            // Update campaign_actions_report_model
                            $reportUpdateData = [
                                'handled' => 1,
                                'decision_path' => 'yes',
                                'date_modified' => $today,
                            ];

                            campaign_actions_report_model::where('event_id', $eventId)
                            ->where('contact_id', $cntId)
                            ->update($reportUpdateData);

                        }else{
                            //batch insert
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
                    }

                    if(!empty($modifyContactIds)){
                        //$removeFromTagsIds = $eventProperties["remove_tags"];
                        $contactUpdateData = array();
                        foreach($eventProperties as $k => $v){
                            if(trim($v) != '' && trim($v) != null){
                                $contactUpdateData[$k] = trim($v);
                            }
                        }

                        $contactUpdateData["date_modified"] = $today;
                        
                        /*$contactUpdateData = array(
                            "title" => $eventProperties["title"],
                            "firstname" => $eventProperties["firstname"],
                            "lastname" => $eventProperties["lastname"],
                            "email" => $eventProperties["email"],
                            "mobile" => $eventProperties["mobile"],
                            "address1" => $eventProperties["address1"],
                            "address2" => $eventProperties["address2"],
                            "city" => $eventProperties["city"],
                            "state" => $eventProperties["state"],
                            "zip" => $eventProperties["zip"],
                            "country" => $eventProperties["country"],
                            "date_modified" => $today,
                        );*/

                        contacts_model::whereIn("id", $modifyContactIds)->update($contactUpdateData);


                        //update event triggered
                        $updateEventTriggerData = array(
                            "triggered" => 1,
                            "trigger_count" => $triggerCount,
                            "triggered_on" => $today
                        );

                        campaign_events_model::where("id", $eventId)
                        ->where("campaignId", $campaignId)
                        ->update($updateEventTriggerData);
                        

                        //last action triggered
                        if($triggerPrevCount > 0){
                            //update record for current event
                            $tmpUpdtData = array(
                                "yes" => json_encode($modifyContactIds),
                                "no" => json_encode(array()), //empty json
                                "date_modified" => $today
                            );
                            temp_events_output_model::where("campaign_id", $campaignId)
                            ->where("event_id", $eventId)
                            ->update($tmpUpdtData);
                            
                        }else{
                            $tmpEvtOutPut = new temp_events_output_model();
                            //$tmpEvtOutPut->id
                            $tmpEvtOutPut->campaign_id = $campaignId;  
                            $tmpEvtOutPut->event_id = $eventId;
                            $tmpEvtOutPut->event_type = $eventType;
                            $tmpEvtOutPut->type = $event;
                            $tmpEvtOutPut->yes = json_encode($modifyContactIds);
                            $tmpEvtOutPut->no = json_encode(array()); //empty json 
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
                
            }

            //============ Decision
            if($eventType == "decision"){
                
                if(($event == 'email.click' || $event == 'email.open')){
                    //if event is 'email.click' or 'email.open'
                    
                    if($parentEventType == 'action' && $parentType == 'email.send'){
                        
                        //ensure if parent event-type is 'action' and event is 'email.send'

                        //get the list of contacts and brevo-message-id from 'campaign_emails_queue_model' to whom the email is sent
                        
                        //ommit the contacts who already opened/clicked the email
                        $ommitContacts = array();

                        //contacts with matched/unmatched decisions
                        $yesContacts = array();
                        $noContacts = array();

                        $reportBatchRows = array(); 
                        $reportBatchUpdateRows = array();

                        $query = campaign_emails_queue_model::where("eventId", $parentId)
                        ->where("campaignId", $campaignId)
                        ->where("emailSent", 1);
                        /*$query = campaign_emails_queue_model::where("eventId", $parentId)
                        ->where("campaignId", $campaignId);
                        */
                        
                        if (!empty($ommitContacts)) {
                            $query->whereNotIn("contactId", $ommitContacts);
                        }

                        $sentEmailObj = $query->get();
                        
                        //dd($sentEmailObj);

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
                                    $out = array();
                                    exec($cmd, $out);

                                    // Output the result for debugging
                                    if(!empty($out)){

                                        $response = json_decode($out[0]);

                                        if(property_exists($response, 'code') && ($response->code == 'bad_request' || $response->code == 'unauthorized')){ 
                                            
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

                                            $smtpEventsJson = $out[0];
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
                                                    if($triggerPrevCount > 0){
                                                        //batch update
                                                        // Update campaign_actions_report_model
                                                        $reportUpdateData = [
                                                            'handled' => 1,
                                                            'decision_path' => 'yes',
                                                            'date_modified' => $today,
                                                        ];

                                                        campaign_actions_report_model::where('event_id', $eventId)
                                                        ->where('contact_id', $EO_contactId)
                                                        ->update($reportUpdateData);
                            
                                                    }else{
                                                        //batch insert
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
                                                    }
                                                }else{
                                                    //if required event does not exists in statusList then add contact to condition-unmatched 'noContacts' array
                                                    $noContacts[] = $EO_contactId;

                                                    if($triggerPrevCount > 0){
                                                        //batch update
                                                        // Update campaign_actions_report_model
                                                        $reportUpdateData = [
                                                            'handled' => 0,
                                                            'decision_path' => 'no',
                                                            'date_modified' => $today,
                                                        ];

                                                        campaign_actions_report_model::where('event_id', $eventId)
                                                        ->where('contact_id', $EO_contactId)
                                                        ->update($reportUpdateData);
                            
                                                    }else{
                                                        //batch insert
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

                                                //update email brevo-events to `campaign_emails_queue_model`
                                                campaign_emails_queue_model::where("id", $EO_queueId)
                                                ->where("brevoTransactionId", $EO_brevoTransactionId)
                                                ->update(array("emailBrevoEvents" => $smtpEventsJson,"date_modified" => $today));
                        
                                            }
                                            
                                        }

                                    }else{
                                        //curl error
                                        Log::warning("curl error {$cmd} for event: {$eventId} campaign: {$campaignId}");
                                    }
                                
                                }else{
                                    //if email is not sent then we assume email is not opened/clicked add contact to condition-unmatched 'noContacts' array

                                    $noContacts[] = $EO_contactId;

                                    
                                    //batch rows for `campaign_actions_report_model`
                                    if($triggerPrevCount > 0){
                                        //batch update
                                        // Update campaign_actions_report_model
                                        $reportUpdateData = [
                                            'handled' => 0,
                                            'decision_path' => 'no',
                                            'date_modified' => $today,
                                        ];

                                        campaign_actions_report_model::where('event_id', $eventId)
                                        ->where('contact_id', $EO_contactId)
                                        ->update($reportUpdateData);
            
                                    }else{
                                        //batch insert
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
                            //no email is sent to any contact
                            $noContacts = array();
                            foreach($processContactsObj as $contactRw){
                                $cntId = $contactRw["id"];
                                $noContacts[] = $cntId;
                            }
                        }


                        //update event triggered
                        $updateEventTriggerData = array(
                            "triggered" => 1,
                            "trigger_count" => $triggerCount,
                            "triggered_on" => $today
                        );

                        campaign_events_model::where("id", $eventId)
                        ->where("campaignId", $campaignId)
                        ->update($updateEventTriggerData);

                        //last action triggered
                        if($triggerPrevCount > 0){
                            //update record for current event
                            $tmpUpdtData = array(
                                "yes" => json_encode($yesContacts),
                                "no" => json_encode($noContacts),
                                "date_modified" => $today
                            );
                            temp_events_output_model::where("campaign_id", $campaignId)
                            ->where("event_id", $eventId)
                            ->update($tmpUpdtData);
                            
                        }else{
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
                    }
                }
            }

            //============ Condition
            if($eventType == "condition"){
                if($event == 'lead.field_value'){
                    //{"field":["tags"],"operator":"=","value":"tag1"}

                    $checkValueContacts = array();
                    $reportBatchRows = array(); 
                    $reportBatchUpdateRows = array();
                    //contacts with matched/unmatched conditions
                    $yesContacts = array();
                    $noContacts = array();
                    
                    foreach($processContactsObj as $contactRw){
                        $cntId = $contactRw["id"];
                        $checkValueContacts[] = $cntId;
                    }
                    $tmpCheckValueContacts = $checkValueContacts;
                    
                    $contactField = $eventProperties["field"][0];
                    $contactOperator = $eventProperties["operator"];
                    $contactValue = $eventProperties["value"];

                    $operators = array("=", "!=", "gt", "gte", "lt", "lte", "empty","!empty", "like", "!like", "regexp", "!regexp", "startsWith", "endsWith", "contains");

                    $supportedOperators = [
                        '=', '!=', 'gt', 'gte', 'lt', 'lte',
                        'empty', '!empty',
                        'like', '!like',
                        'regexp', '!regexp',
                        'startsWith', 'endsWith', 'contains'
                    ];
                    
                    $stopQuery = 0;
                    if (!in_array($contactOperator, $supportedOperators)) {
                        // Stop execution if unsupported operator
                        $stopQuery = 1;
                        Log::warning("Unsupported operator: {$contactOperator} for event: {$eventId} campaign: {$campaignId}");
                    }
                    
                    if($stopQuery == 0){
                        // Begin building query only if operator is supported
                        $query = contacts_model::whereIn("id", $checkValueContacts);
                        
                        switch ($contactOperator) {
                            case '=':
                                $query->whereRaw("LOWER($contactField) = ?", [strtolower($contactValue)]);
                                break;
                            case '!=':
                                $query->whereRaw("LOWER($contactField) != ?", [strtolower($contactValue)]);
                                break;
                            case 'gt':
                                $query->whereRaw("LOWER($contactField) > ?", [strtolower($contactValue)]);
                                break;
                            case 'gte':
                                $query->whereRaw("LOWER($contactField) >= ?", [strtolower($contactValue)]);
                                break;
                            case 'lt':
                                $query->whereRaw("LOWER($contactField) < ?", [strtolower($contactValue)]);
                                break;
                            case 'lte':
                                $query->whereRaw("LOWER($contactField) <= ?", [strtolower($contactValue)]);
                                break;
                            case 'empty':
                                $query->where(function ($q) use ($contactField) {
                                    $q->whereNull($contactField)->orWhere($contactField, '');
                                });
                                break;
                            case '!empty':
                                $query->where(function ($q) use ($contactField) {
                                    $q->whereNotNull($contactField)->where($contactField, '!=', '');
                                });
                                break;
                            case 'like':
                            case 'contains':
                                $query->whereRaw("LOWER($contactField) LIKE ?", ['%' . strtolower($contactValue) . '%']);
                                break;
                            case '!like':
                                $query->whereRaw("LOWER($contactField) NOT LIKE ?", ['%' . strtolower($contactValue) . '%']);
                                break;
                            case 'regexp':
                                $query->whereRaw("LOWER($contactField) REGEXP ?", [strtolower($contactValue)]);
                                break;
                            case '!regexp':
                                $query->whereRaw("LOWER($contactField) NOT REGEXP ?", [strtolower($contactValue)]);
                                break;
                            case 'startsWith':
                                $query->whereRaw("LOWER($contactField) LIKE ?", [strtolower($contactValue) . '%']);
                                break;
                            case 'endsWith':
                                $query->whereRaw("LOWER($contactField) LIKE ?", ['%' . strtolower($contactValue)]);
                                break;
                        }
                        
                        // Final result
                        $resContactsObj = $query->get();
                        if($resContactsObj && !empty($resContactsObj)){
                            foreach($resContactsObj as $resContactsRw){
                                $resTmpContactId = $resContactsRw->id;

                                if(in_array($resTmpContactId, $tmpCheckValueContacts)){
                                    //if contact matches the condition then

                                    //if required segment is assigned to the contact then add contact to condition-matched 'yesContacts' array and remove matched-contact from `tmpCheckValueContacts`

                                    $yesContacts[] = $resTmpContactId;

                                    //remove matched entry from mainarray
                                    $key = array_search($resTmpContactId, $tmpCheckValueContacts);
                                    if ($key !== false) {

                                        //remove matched entry from array
                                        unset($tmpCheckValueContacts[$key]);
                                        // Reindex array if needed
                                        $tmpCheckValueContacts = array_values($tmpCheckValueContacts);
                                    }


                                    //batch rows for `campaign_actions_report_model`
                                    if($triggerPrevCount > 0){
                                        //batch update
                                        // Update campaign_actions_report_model
                                        $reportUpdateData = [
                                            'handled' => 1,
                                            'decision_path' => 'yes',
                                            'date_modified' => $today,
                                        ];

                                        campaign_actions_report_model::where('event_id', $eventId)
                                        ->where('contact_id', $resTmpContactId)
                                        ->update($reportUpdateData);
            
                                    }else{
                                        //batch insert
                                        $reportBatchRows[] = array(
                                            "campaign_id" => $campaignId,
                                            "event_id" => $eventId,
                                            "event_type" => $eventType,
                                            "event" => $event,
                                            "properties" => json_encode($eventProperties),
                                            "decision_path" => 'yes',
                                            "contact_id" => $resTmpContactId,
                                            "handled" => 1, //1 if contact falls in Yes, if contact falls in No and will process later on next attempt
                                            "date_added" => $today,
                                            "date_modified" => $today
                                        );
                                    }
                                                    
                                }else{
                                    //result contact-id not exists in  $checkSegmentContacts 
                                    $noContacts[] = $resTmpContactId;
                                }

                            }

                            //put all unmatched contacts to `noContacts` array
                            $noContacts = array_merge($noContacts, $tmpCheckValueContacts);
                            if(!empty($noContacts)){
                                foreach($noContacts as $noContact){

                                    //batch rows for `campaign_actions_report_model`
                                    if($triggerPrevCount > 0){
                                        //batch update
                                        // Update campaign_actions_report_model
                                        $reportUpdateData = [
                                            'handled' => 0,
                                            'decision_path' => 'no',
                                            'date_modified' => $today,
                                        ];

                                        campaign_actions_report_model::where('event_id', $eventId)
                                        ->where('contact_id', $noContact)
                                        ->update($reportUpdateData);
            
                                    }else{
                                        //batch insert
                                        $reportBatchRows[] = array(
                                            "campaign_id" => $campaignId,
                                            "event_id" => $eventId,
                                            "event_type" => $eventType,
                                            "event" => $event,
                                            "properties" => json_encode($eventProperties),
                                            "decision_path" => 'no',
                                            "contact_id" => $noContact,
                                            "handled" => 0, //1 if contact falls in Yes, if contact falls in No and will process later on next attempt
                                            "date_added" => $today,
                                            "date_modified" => $today
                                        );
                                    }
                                }
                            }
                        }
                        
                        //update event triggered
                        $updateEventTriggerData = array(
                            "triggered" => 1,
                            "trigger_count" => $triggerCount,
                            "triggered_on" => $today
                        );

                        campaign_events_model::where("id", $eventId)
                        ->where("campaignId", $campaignId)
                        ->update($updateEventTriggerData);

                        //last action triggered
                        if($triggerPrevCount > 0){
                            //update record for current event
                            $tmpUpdtData = array(
                                "yes" => json_encode($yesContacts),
                                "no" => json_encode($noContacts),
                                "date_modified" => $today
                            );
                            temp_events_output_model::where("campaign_id", $campaignId)
                            ->where("event_id", $eventId)
                            ->update($tmpUpdtData);
                            
                        }else{
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

                    }
                    
                }
    
                if($event == 'lead.segments'){
                    //{"segments":["1"]}
                    $containSegments = $eventProperties["segments"];

                    $checkSegmentContacts = array();
                    $reportBatchRows = array(); 
                    $reportBatchUpdateRows = array();
                    //contacts with matched/unmatched conditions
                    $yesContacts = array();
                    $noContacts = array();
                    
                    foreach($processContactsObj as $contactRw){
                        $cntId = $contactRw["id"];
                        $checkSegmentContacts[] = $cntId;
                    }

                    $tmpCheckSegmentContacts = $checkSegmentContacts;

                    if(!empty($containSegments)){
                        $resSegmentsObj = segment_contacts_model::whereIn("segment_id",$containSegments)
                        ->whereIn("contact_id",$checkSegmentContacts)
                        ->get();

                        if($resSegmentsObj && !empty($resSegmentsObj)){
                            foreach($resSegmentsObj as $resSegmentsRw){
                                $resTmpSegmentId = $resSegmentsRw->segment_id;
                                $resTmpContactId = $resSegmentsRw->contact_id;

                                if(in_array($resTmpContactId, $tmpCheckSegmentContacts)){
                                    //if contact matches the condition then

                                    //if required segment is assigned to the contact then add contact to condition-matched 'yesContacts' array and remove matched-contact from `tmpCheckSegmentContacts`

                                    $yesContacts[] = $resTmpContactId;

                                    //remove matched entry from mainarray
                                    $key = array_search($resTmpContactId, $tmpCheckSegmentContacts);
                                    if ($key !== false) {

                                        //remove matched entry from array
                                        unset($tmpCheckSegmentContacts[$key]);
                                        // Reindex array if needed
                                        $tmpCheckSegmentContacts = array_values($tmpCheckSegmentContacts);
                                    }


                                    //batch rows for `campaign_actions_report_model`
                                    if($triggerPrevCount > 0){
                                        //batch update
                                        // Update campaign_actions_report_model
                                        $reportUpdateData = [
                                            'handled' => 1,
                                            'decision_path' => 'yes',
                                            'date_modified' => $today,
                                        ];

                                        campaign_actions_report_model::where('event_id', $eventId)
                                        ->where('contact_id', $resTmpContactId)
                                        ->update($reportUpdateData);
            
                                    }else{
                                        //batch insert
                                        $reportBatchRows[] = array(
                                            "campaign_id" => $campaignId,
                                            "event_id" => $eventId,
                                            "event_type" => $eventType,
                                            "event" => $event,
                                            "properties" => json_encode($eventProperties),
                                            "decision_path" => 'yes',
                                            "contact_id" => $resTmpContactId,
                                            "handled" => 1, //1 if contact falls in Yes, if contact falls in No and will process later on next attempt
                                            "date_added" => $today,
                                            "date_modified" => $today
                                        );
                                    }
                                                    
                                }else{
                                    //result contact-id not exists in  $checkSegmentContacts 
                                    $noContacts[] = $resTmpContactId;
                                }

                            }

                            //put all unmatched contacts to `noContacts` array
                            $noContacts = array_merge($noContacts, $tmpCheckSegmentContacts);
                            if(!empty($noContacts)){
                                foreach($noContacts as $noContact){
                                    
                                    //batch rows for `campaign_actions_report_model`
                                    if($triggerPrevCount > 0){
                                        //batch update
                                        // Update campaign_actions_report_model
                                        $reportUpdateData = [
                                            'handled' => 0,
                                            'decision_path' => 'no',
                                            'date_modified' => $today,
                                        ];

                                        campaign_actions_report_model::where('event_id', $eventId)
                                        ->where('contact_id', $noContact)
                                        ->update($reportUpdateData);
            
                                    }else{
                                        //batch insert
                                        $reportBatchRows[] = array(
                                            "campaign_id" => $campaignId,
                                            "event_id" => $eventId,
                                            "event_type" => $eventType,
                                            "event" => $event,
                                            "properties" => json_encode($eventProperties),
                                            "decision_path" => 'no',
                                            "contact_id" => $noContact,
                                            "handled" => 0, //1 if contact falls in Yes, if contact falls in No and will process later on next attempt
                                            "date_added" => $today,
                                            "date_modified" => $today
                                        );
                                    }
                                }
                            }
                        }
                    
                        //update event triggered
                        $updateEventTriggerData = array(
                            "triggered" => 1,
                            "trigger_count" => $triggerCount,
                            "triggered_on" => $today
                        );

                        campaign_events_model::where("id", $eventId)
                        ->where("campaignId", $campaignId)
                        ->update($updateEventTriggerData);

                        //last action triggered
                        if($triggerPrevCount > 0){
                            //update record for current event
                            $tmpUpdtData = array(
                                "yes" => json_encode($yesContacts),
                                "no" => json_encode($noContacts),
                                "date_modified" => $today
                            );
                            temp_events_output_model::where("campaign_id", $campaignId)
                            ->where("event_id", $eventId)
                            ->update($tmpUpdtData);
                            
                        }else{
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
                        //empty $eventProperties["segments"]
                        Log::warning("eventProperties['segments'] are empty for event: {$eventId} campaign: {$campaignId}");
                    }

                }
    
                if($event == 'lead.tags'){
                    //{"tags":["1","2"]}
                    $containTags = $eventProperties["tags"];
                    
                    $checkTagContacts = array();
                    $reportBatchRows = array(); 
                    $reportBatchUpdateRows = array();
                    //contacts with matched/unmatched conditions
                    $yesContacts = array();
                    $noContacts = array();
                    
                    foreach($processContactsObj as $contactRw){
                        $cntId = $contactRw["id"];
                        $checkTagContacts[] = $cntId;
                    }

                    $tmpCheckTagContacts = $checkTagContacts;

                    if(!empty($containTags)){
                        $resTagsObj = tags_contacts_model::whereIn("tag_id",$containTags)
                        ->whereIn("contact_id",$checkTagContacts)
                        ->get();

                        if($resTagsObj && !empty($resTagsObj)){
                            foreach($resTagsObj as $resTagsRw){
                                $resTmpTagId = $resTagsRw->tag_id;
                                $resTmpContactId = $resTagsRw->contact_id;

                                if(in_array($resTmpContactId, $tmpCheckTagContacts)){
                                    //if contact matches the condition then

                                    //if required tag is assigned to the contact then add contact to condition-matched 'yesContacts' array and remove matched-contact from `tmpCheckTagContacts`

                                    $yesContacts[] = $resTmpContactId;

                                    //remove matched entry from mainarray
                                    $key = array_search($resTmpContactId, $tmpCheckTagContacts);
                                    if ($key !== false) {

                                        //remove matched entry from array
                                        unset($tmpCheckTagContacts[$key]);
                                        // Reindex array if needed
                                        $tmpCheckTagContacts = array_values($tmpCheckTagContacts);
                                    }


                                    //batch rows for `campaign_actions_report_model`
                                    if($triggerPrevCount > 0){
                                        //batch update
                                        // Update campaign_actions_report_model
                                        $reportUpdateData = [
                                            'handled' => 1,
                                            'decision_path' => 'yes',
                                            'date_modified' => $today,
                                        ];

                                        campaign_actions_report_model::where('event_id', $eventId)
                                        ->where('contact_id', $resTmpContactId)
                                        ->update($reportUpdateData);
            
                                    }else{
                                        //batch insert
                                        $reportBatchRows[] = array(
                                            "campaign_id" => $campaignId,
                                            "event_id" => $eventId,
                                            "event_type" => $eventType,
                                            "event" => $event,
                                            "properties" => json_encode($eventProperties),
                                            "decision_path" => 'yes',
                                            "contact_id" => $resTmpContactId,
                                            "handled" => 1, //1 if contact falls in Yes, if contact falls in No and will process later on next attempt
                                            "date_added" => $today,
                                            "date_modified" => $today
                                        );
                                    }
                                                    
                                }else{
                                    //result contact-id not exists in  $checkTagContacts 
                                    $noContacts[] = $resTmpContactId;
                                }

                            }

                            //put all unmatched contacts to `noContacts` array
                            $noContacts = array_merge($noContacts, $tmpCheckTagContacts);
                            if(!empty($noContacts)){
                                foreach($noContacts as $noContact){
                                    //batch rows for `campaign_actions_report_model`
                                    if($triggerPrevCount > 0){
                                        
                                        // Update campaign_actions_report_model
                                        $reportUpdateData = [
                                            'handled' => 0,
                                            'decision_path' => 'no',
                                            'date_modified' => $today,
                                        ];

                                        campaign_actions_report_model::where('event_id', $eventId)
                                        ->where('contact_id', $noContact)
                                        ->update($reportUpdateData);

            
                                    }else{
                                        //batch insert
                                        $reportBatchRows[] = array(
                                            "campaign_id" => $campaignId,
                                            "event_id" => $eventId,
                                            "event_type" => $eventType,
                                            "event" => $event,
                                            "properties" => json_encode($eventProperties),
                                            "decision_path" => 'no',
                                            "contact_id" => $noContact,
                                            "handled" => 0, //1 if contact falls in Yes, if contact falls in No and will process later on next attempt
                                            "date_added" => $today,
                                            "date_modified" => $today
                                        );
                                    }
                                }
                            }
                        }
                    
                        //update event triggered
                        $updateEventTriggerData = array(
                            "triggered" => 1,
                            "trigger_count" => $triggerCount,
                            "triggered_on" => $today
                        );

                        campaign_events_model::where("id", $eventId)
                        ->where("campaignId", $campaignId)
                        ->update($updateEventTriggerData);

                        //last action triggered
                        if($triggerPrevCount > 0){
                            //update record for current event
                            $tmpUpdtData = array(
                                "yes" => json_encode($yesContacts),
                                "no" => json_encode($noContacts),
                                "date_modified" => $today
                            );
                            temp_events_output_model::where("campaign_id", $campaignId)
                            ->where("event_id", $eventId)
                            ->update($tmpUpdtData);
                        
                        }else{
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
                        //empty $eventProperties["tags"]
                        Log::warning("eventProperties['tags'] are empty for event: {$eventId} campaign: {$campaignId}");
                    }

                }
            }

        }else{
            //empty contacts list
            Log::warning("empty contacts list for event: {$eventId} campaign: {$campaignId}");
        }

    }

//============ no need of code below
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