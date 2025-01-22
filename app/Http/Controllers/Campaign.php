<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
use App\Models\campaigns_model;
use App\Models\campaign_segments_model;
use App\Models\campaign_events_model;
use App\Models\contacts_model;
use App\Models\segments_model;
use App\Models\segment_contacts_model;
use Facade\FlareClient\View;
use Inertia\Inertia;

//Manoj Nakra
//https://us02web.zoom.us/j/8672294022?pwd=RVJxZnA3RktPT1Y3Kzk5bTFoSDFoQT09
/*
will use this when work with inertia-react
return Inertia::render('Admin/Users',
    [
        'PageTitle'  => 'Subscribers',
        'csrfToken' => csrf_token(),
        'Users' => $users
    ]
);
*/
class Campaign extends Controller
{
    //
    
    function campaignBuilder(Request $request){
        
        $segments = array(
            array("id" => 1, "name" => "segment-1", "contacts" => 2),
            array("id" => 2, "name" => "segment-2", "contacts" => 4),
            array("id" => 3, "name" => "segment-3", "contacts" => 6),
            array("id" => 4, "name" => "segment-4", "contacts" => 2),
            array("id" => 5, "name" => "segment-5", "contacts" => 8)
        );

        $decisions = array(
            
            array("id" => 1, "event" => "pagedevicehit", "value" => "page.devicehit", "title" => "Device visit", "description" => "Trigger device  on a page/url hit."),

            array("id" => 2, "event" => "assetdownload", "value" => "asset.download", "title" => "Downloads asset", "description" => "Trigger actions upon downloading an asset."),

            array("id" => 3, "event" => "dwcdecision", "value" => "dwc.decision", "title" => "Request dynamic content", "description" => "This is the top level for a dynamic content request."),

            array("id" => 4, "event" => "formsubmit", "value" => "form.submit", "title" => "Submits form", "description" => "Trigger actions when a contact submits a form."),

            array("id" => 4, "event" => "pagepagehit", "value" => "page.pagehit", "title" => "Visits a page", "description" => "Trigger actions on a page/url hit.")
            
        );
        
        $actions = array(
            array("id" => 1, "event" => "leadadddnc", "value" => "lead.adddnc", "title" => "Add Do Not Contact", "description" => "Add DoNotContact flag to the contact"),

            array("id" => 2, "event" => "leadscorecontactscompanies", "value" => "lead.leadscorecontactscompanies", "title" => "Add to company's score", "description" => "This action will add the specified value to the company's existing score"),
            
            array("id" => 3, "event" => "leadaddtocompany", "value" => "lead.addtocompany", "title" => "Add to company action", "description" => "This action will add contacts to the selected company"),
            
            array("id" => 4, "event" => "leadchangepoints", "value" => "lead.changepoints", "title" => "Adjust contact points", "description" => "Add contact to specific campaigns and/or remove from specific campaigns when the event is triggered."),
            
            array("id" => 5, "event" => "campaignaddremovelead", "value" => "campaign.addremovelead", "title" => "Change campaigns", "description" => "Add contact to specific campaigns and/or remove from specific campaigns when the event is triggered."),
            
            array("id" => 6, "event" => "stagechange", "value" => "stage.change", "title" => "Change contact's stage", "description" => "Choose a stage to change a contact to."),
            
            array("id" => 7, "event" => "leaddeletecontact", "value" => "lead.deletecontact", "title" => "Delete contact", "description" => "<span class='text-danger'>Permanently deletes the contact as well as all associated statistical data. <strong>Warning: this is irreversible!</strong></span>"),
            
            array("id" => 8, "event" => "campaignjump_to_event", "value" => "campaign.jump_to_event", "title" => "Jump to Event", "description" => "Jump to the chosen event within the campaign flow."),
            
            array("id" => 9, "event" => "leadchangelist", "value" =>"lead.changelist", "title" => "Modify contact's segments", "description" => "Add contact to or remove contact from segment(s)"),
            
            array("id" => 10, "event" => "leadchangetags", "value" =>"lead.changetags", "title" => "Modify contact's tags", "description" => "Add tag to or remove tag from contact"),
            
            array("id" => 11, "event" => "pluginleadpush", "value" =>"plugin.leadpush", "title" => "Push contact to integration", "description" => "Push a contact to the selected integration."),
            
            array("id" => 12, "event" => "leadremovednc", "value" =>"lead.removednc", "title" => "Remove Do Not Contact", "description" => "Remove Do Not Contact flag from contact."),
            
            array("id" => 13, "event" => "campaignsendwebhook", "value" =>"campaign.sendwebhook", "title" => "Send a webhook", "description" => "Send a webhook (only for experienced users)."),
            
            array("id" => 14, "event" => "emailsend", "value" =>"email.send", "title" => "Send email", "description" => "Send the selected email to the contact."),
            
            array("id" => 15, "event" => "emailsendtouser", "value" =>"email.send.to.user", "title" => "Send email to user", "description" => "Send email to user, owner or other email addresses"),
            
            array("id" => 16, "event" => "messagesend", "value" =>"message.send", "title" => "Send marketing message", "description" => "Send a message through the configured channels within the marketing message selected."),
            
            array("id" => 17, "event" => "leadupdatelead", "value" =>"lead.updatelead", "title" => "Update contact", "description" => "Update the current contact's fields with the defined values from this action"),
            
            array("id" => 18, "event" => "leadupdatecompany", "value" =>"lead.updatecompany", "title" => "Update contact's primary company", "description" => "Update the contact's primary company fields with the defined values from this action"),
            
            array("id" => 19, "event" => "leadchangeowner", "value" =>"lead.changeowner", "title" => "Update contact owner", "description" => "This action will update contact owner as part of a campaign")
            
        );
        
        $conditions = array(
            array("id" => 1, "event" => "leadcampaigns", "value" => "lead.campaigns", "title" => "Contact campaigns", "description" => "Condition based on a contact campaigns."),

            array("id" => 2, "event" => "leaddevice", "value" => "lead.device", "title" => "Contact device", "description" => "Condition based on a contact device."),

            array("id" => 3, "event" => "leadfield_value", "value" => "lead.field_value", "title" => "Contact field value", "description" => "Condition based on a contact field value."),

            array("id" => 4, "event" => "leadowner", "value" => "lead.owner", "title" => "Contact owner", "description" => "Condition based on a contact owner."),

            array("id" => 5, "event" => "leadpoints", "value" => "lead.points", "title" => "Contact points", "description" => "Condition based on contact score"),

            array("id" => 6, "event" => "leadsegments", "value" => "lead.segments", "title" => "Contact segments", "description" => "Condition based on a contact segments."),

            array("id" => 7, "event" => "leadstages", "value" => "lead.stages", "title" => "Contact stages", "description" => "Condition that the contact belongs to at least one of the selected stages."),

            array("id" => 8, "event" => "leadtags", "value" => "lead.tags", "title" => "Contact tags", "description" => "Condition based on a contact tags."),

            array("id" => 9, "event" => "formfield_value", "value" => "form.field_value", "title" => "Form field value", "description" => "Trigger actions when a submitted form field value suits the defined condition."),

            array("id" => 10, "event" => "notificationhasactive", "value" => "notification.has.active", "title" => "Has active notification", "description" => "Condition check If contact has active notification."),

            array("id" => 11, "event" => "emailvalidateaddress", "value" => "email.validate.address", "title" => "Has valid email address", "description" => "Attempt to validate contact's email address. This may not be 100% accurate."),

            array("id" => 12, "event" => "leaddnc", "value" => "lead.dnc", "title" => "Marked as DNC", "description" => "Condition checks if the contact has the Do Not Contact flag."),

            array("id" => 13, "event" => "leadpageHit", "value" => "lead.pageHit", "title" => "Visited page", "description" => "Condition based on all the pages the contact has visited in the past")
        );

        $data = array(
            "campaignId" => 1,
            "segments" => $segments,
            "decisions" => $decisions,
            "actions" => $actions,
            "conditions" => $conditions
        );
        
        //echo "<pre>"; print_r($data); die;
        return Inertia::render('Campaignbuilder', [
            'message' => 'Welcome to Inertia.js with React!',
        ]);
        //return View("campaignbuilder",$data);
    }

    function getEventHtml(Request $request){
        
        /*
        http://local.mautic.com/s/campaigns/events/new?type=lead.adddnc&eventType=action&campaignId=mautic_e1d9a3f97a35ca1aa45cbca68abbe3ef5daa8e52&anchor=bottom&anchorEventType=action&_=1734674583452&mauticUserLastActive=10480&mauticLastNotificationId=
        */
        
        $type = $request->input('type');
        $eventType = $request->input('eventType');
        $campaignId = $request->input('campaignId');
        $anchor = $request->input('anchor');
        $anchorEventType = $request->input('anchorEventType');
        $parentEventId = $request->input('parentEventId');
        
        $tempEventId = time();
        
        $dataFilesPath = base_path('datafiles/'.$eventType.'/'.$type.'.txt');
        $htmlStr = file_get_contents($dataFilesPath);

        $postBackData = array();
        $postBackData["tempEventId"] = $tempEventId;
        $postBackData["htmlStr"] = $htmlStr;
        
        $response = array("C" => 100, "R" => $postBackData, "M" => "success");
        return response()->json($response); die;
        
    }

    function addCampaignSegment_d(Request $request){
        
        $campaignId = $request->input('campaignId');
        $segments = $request->input('segments');
        $segmentsArr = explode(",", $segments);
        
        //$campaignSegmentsObj = new campaign_segments_model();
        //$campaignSegmentsObj->campaignId
        //$campaignSegmentsObj->campaignId

        $batchArr = array();
        
        foreach($segmentsArr as $k => $segmentId){
            
            $batchArr[] = array(
                "campaign_id" => $campaignId,
                "segment_id" => $segmentId
            );
        }

        $insert = campaign_segments_model::insert($batchArr);

        $campaignId = $request->input('campaignId');
        $segments = $request->input('segments');
        $postBackData = array('campaignId' => $campaignId, 'segments' => $segments);
        
        if($insert){
            $postBackData['success'] = 1;
            $response = array("C" => 100, "R" => $postBackData, "M" => "success");
        }else{
            $postBackData['success'] = 0;
            $response = array("C" => 101, "R" => $postBackData, "M" => "error");
        }
        
        echo json_encode($response); die;
    }

    function addCampaignSegment(Request $request){

        $campaignId = $request->input('campaignId');
        $segmentsName = $request->input('segmentsName');
        $segments = $request->input('segments');
        $segmentsArr = explode(",", $segments);

        $batchRows = [];
        foreach ($segmentsArr as $segmentId) {
            $batchRows[] = [
                "campaign_id" => $campaignId,
                "segment_id" => $segmentId,
            ];
        }

        // delete old entries and insert new one
        $deleted = campaign_segments_model:: where("campaign_id", $campaignId)->delete();
        
        $saved = campaign_segments_model::insert($batchRows);
        /*
        // Use upsert instead of insert
        $upsert = campaign_segments_model::upsert(
            $batchRows, // Data to insert or update
            ['campaign_id', 'segment_id'], // Unique columns to check for duplicates
            ['campaign_id', 'segment_id'] // Columns to update (leave empty if no columns to update)
        );

        $upsert = 1;
        */

        $postBackData = array(
            'campaignId' => $campaignId,
            'segments' => $segments,
            'segmentsName' => $segmentsName,
            'success' => $saved ? 1 : 0
        );

        $response = array(
            "C" => $saved ? 100 : 101,
            "R" => $postBackData,
            "M" => $saved ? "success" : "error"
        );

        return response()->json($response); die;
    }

    function saveEvent(Request $request){
        /*
        id              //event id //primary key
        campaignId      //campaign Id
        parentId        //parent event id //null or id
        name            //event name
        description     //event description
        type            //lead.tags, email.send, email.open .... value of event dropdown
        eventType       //decision,action,condition
        eventOrder      //1,2,3,3,4,4,5,5,6,7...
        properties      //form json data
        deleted         //datetime //null
        trigger_date	//datetime //null
        trigger_interval//1,2,3,4,5... default 1
        trigger_interval_unit   //d,w,m //null
        trigger_hour    //time //null
        trigger_restricted_start_hour	//time //null
        trigger_restricted_stop_hour	//time	//null
        trigger_restricted_dow	//longtext //null (not sure what we save in this)
        trigger_mode //varchar(10) //null
        decision_path //varchar(191) //null //node(yes/no)
        temp_id //event temp-id varchar(191) //null
        channel //varchar(191) //null //email,sms etc..
        channel_id //int //null
        failed_count //int (0,1,2,3,4,5...) number of times event is failed
        */

        $eventData = $request->input("eventData");
        $postData = [];
        parse_str($eventData,$postData); //unserialize form data
        //echo '<pre>'; print_r($postData); die;
        $campaignevent = $postData["campaignevent"];
        
        
        $temp_id = $campaignevent["eventId"]; //temporary id
        $campaignId = $campaignevent["campaignId"];
        $eventOrder = $campaignevent["eventOrder"];
        $parentEventId = $campaignevent["parentEventId"];
        $name = $campaignevent["name"];
        $anchor = $campaignevent["anchor"];
        $properties = $campaignevent["properties"];
        $type = $campaignevent["type"];
        $eventType = $campaignevent["eventType"];
        $anchorEventType = $campaignevent["anchorEventType"];
        
        $draft = 1;
        //$campaignevent["_token"];

        $eventObj = new campaign_events_model();
        $eventObj->campaignId = $campaignId;
        $eventObj->parentId = $parentEventId;
        $eventObj->name = $name;
        $eventObj->description = $name; 
        $eventObj->type = $type;
        $eventObj->eventType = $eventType;
        $eventObj->eventOrder = $eventOrder;
        $eventObj->properties = json_encode($properties);
        $eventObj->decision_path = $anchor;
        $eventObj->temp_id = $temp_id;
        $eventObj->failed_count = 0;
        $eventObj->draft = $draft;

        $saved = $eventObj->save();
        $lastInsertId = $eventObj->id;

        $postBackData = array(
            'campaignId' => $campaignId,
            'eventId' => $lastInsertId,
            'eventData' => $postData,
            'success' => $saved ? 1 : 0
        );

        $response = array(
            "C" => $saved ? 100 : 101,
            "R" => $postBackData,
            "M" => $saved ? "success" : "error"
        );

        return response()->json($response); die;

    }

}
