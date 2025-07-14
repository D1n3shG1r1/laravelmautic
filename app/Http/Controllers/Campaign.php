<?php
/* just for ref
$this->setSession('userId',$userId);
$this->setSession('roleId',$roleId);
$this->setSession('companyId',$companyId);
$this->setSession('userEmail',$userEmail);
$this->setSession('firstName',$firstName);
$this->setSession('lastName',$lastName);
*/
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
use App\Models\tags_model;
use App\Models\tags_contacts_model;
use App\Models\emailsbuilder_model;
use App\Models\campaign_actions_report_model;
use App\Models\campaign_check_emails_event_model;
use App\Models\temp_events_output_model;
use App\Models\campaign_emails_queue_model;

use App\Models\role_model;
use Facade\FlareClient\View;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;


//Manoj Nakra
//https://us02web.zoom.us/j/8672294022?pwd=RVJxZnA3RktPT1Y3Kzk5bTFoSDFoQT09

//Smriti Misra
//https://zoom.us/j/9215939587?pwd=cXhwTnVLVTJXbFpIY0NqWnIwZWMvQT09

class Campaign extends Controller
{
    
    var $ERRORS = [];
    var $USERID = 0;
    function __construct(){
        parent::__construct();    
        $this->ERRORS = config("errormessage");
        $this->USERID = $this->getSession('userId');
    }
    
    function campaigns(Request $request){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            if ($isAdmin > 0) {
                $campaignsObj = campaigns_model::where("created_by_company", $userCompany)->paginate(10)->toArray();
                
                if(!empty($campaignsObj["data"])){
                    foreach($campaignsObj["data"] as &$obj){
                        $obj["date_added"] = date('d-m-Y', strtotime($obj["date_added"]));
                    }
                }
            } else {
                $campaignsObj = campaigns_model::where("created_by", $this->USERID)->paginate(10)->toArray();

                if(!empty($campaignsObj["data"])){
                    foreach($campaignsObj["data"] as &$obj){
                        $obj["date_added"] = date('d-m-Y', strtotime($obj["date_added"]));
                    }
                }
            }
            
            $data = array();
            $data["campaignsUrl"] = url('contacts');
            $data["campaigns"] = $campaignsObj;
            
            //echo "data:<pre>"; print_r($data); die;

            return Inertia::render('Campaigns', [
                'pageTitle'  => 'Campaigns',
                'csrfToken' => $csrfToken,
                'params' => $data
            ]);

        }else{
            //redirect to signin
            return Redirect::to(url('signin'));
        }
    }

    function new(Request $request){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            if ($isAdmin > 0) {
                $segmentsObj = segments_model::select("id","name")->where("created_by_company", $userCompany)->get();
            } else {
                $segmentsObj = segments_model::select("id","name")->where("created_by", $this->USERID)->get();
            }
            
            if($segmentsObj){
                $segmentIdsArr = array();
                foreach($segmentsObj as $segment){
                    $segmentIdsArr[] =  $segment["id"];
                }

                $segmentContactsObj = segment_contacts_model::select('segment_id', 'contact_id')->whereIn('segment_id', $segmentIdsArr)->get();

                $segementContactArr = array();
                if($segmentContactsObj){
                    foreach($segmentContactsObj as $segmentContactRw){
                        $segementContactArr[$segmentContactRw["segment_id"]][] = $segmentContactRw["contact_id"]; 
                    }
                }

                foreach($segmentsObj as &$segmentRw){
                    //$segmentIdsArr[] =  $segment["id"];
                
                    if(!array_key_exists($segmentRw["id"], $segementContactArr)){
                        $contactsCount = 0;
                    }else{
                        $contactsCount = count($segementContactArr[$segmentRw["id"]]);
                    }
                    
                    $segmentRw['contacts'] = $contactsCount;
                }

                $segments = $segmentsObj;
            }else{
                $segments = array();
            }
            
            $decisions = config('campaignevents.decisions');
            $actions = config('campaignevents.actions');
            $conditions = config('campaignevents.conditions');  
    
            $data = array();
            $data["campaignsUrl"] = url('campaigns');
            $data["campaignId"] = db_randnumber() ; //temporary campainId
            $data["segments"] = $segments;
            $data["decisions"] = $decisions;
            $data["actions"] = $actions;
            $data["conditions"] = $conditions;

            return Inertia::render('NewCampaign', [
                'pageTitle'  => 'New Campaign',
                'csrfToken' => $csrfToken,
                'params' => $data
            ]);

        }else{
            //redirect to signin
            return Redirect::to(url('signin'));
        }
    }
    
    function save(Request $request){
        if($this->USERID > 0){
            
            $userCompany = $this->getSession('companyId');
            $firstName = $this->getSession('firstName');
            $lastName = $this->getSession('lastName');
            $fullName = $firstName." ".$lastName; 
            $today = date("Y-m-d");
            
            $tempId = $request->input("tempId");
            $name = $request->input("name");
            $description = $request->input("description");
            $active = $request->input("active");
            if($active){
                $active = 1;
            }else{
                $active = 0;
            }

            $activateat = $request->input("activateat");
            $deactivateat = $request->input("deactivateat");
            $sourceNodeStyle = $request->input("sourceNodeStyle");
            $nodeStyles = $request->input("nodeStyles");
            
            $campaignObj = new campaigns_model();
            
            $campaignObj->is_published = $active;
            $campaignObj->date_added = $today;  
            $campaignObj->created_by = $this->USERID;
            $campaignObj->created_by_user = $fullName;
            $campaignObj->created_by_company = $userCompany;
            $campaignObj->name = $name;
            $campaignObj->description = $description;
            $campaignObj->publish_up = $activateat;
            $campaignObj->publish_down = $deactivateat;
            $campaignObj->allow_restart = 0;
            $campaignObj->version = 1;
            $campaignObj->canvas_settings = $sourceNodeStyle;
            $campaignObj->save();
            $campaignId = $campaignObj->id;

            $postBackData = array(
                "tempId" => $tempId,
                "name" => $name,
                "description" => $description,
                "active" => $active,
                "activateat" => $activateat,
                "deactivateat" => $deactivateat
            );

            if($campaignId){
                //update campaignId in campaign-events
                campaign_events_model::where("campaignId", $tempId)->update(array("campaignId" => $campaignId, "draft" => 0));

                //update campaignId in campaign-segments
                campaign_segments_model::where("campaign_id", $tempId)->update(array("campaign_id" => $campaignId));

                //update event node xy-positions
                foreach($nodeStyles as $nodeStyle){
                    $eventId = $nodeStyle["eventId"];
                    $style = $nodeStyle["style"];
                
                    campaign_events_model::where("id", $eventId)
                    ->where("campaignId", $campaignId)->update(array("xy_positions" => $style));
                }

                $postBackData['success'] = 1;

                $response = array(
                    "C" => 100,
                    "R" => $postBackData,
                    "M" => $this->ERRORS[119]
                );

            }else{
                
                $postBackData['success'] = 0;

                $response = array(
                    "C" => 101,
                    "R" => $postBackData,
                    "M" => $this->ERRORS[120]
                );
            }

        }else{
            //session expired
            $response = [
                'C' => 1004,
                'M' => $this->ERRORS[1004],
                'R' => [],
            ];
        }
        
        return response()->json($response); die;
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
        
        if($this->USERID > 0){
            $eventData = $request->input("eventData");
            $postData = [];
            parse_str($eventData,$postData); //unserialize form data
            //echo '<pre>'; print_r($postData); die;
            $campaignevent = $postData["campaignevent"];
            $triggerMode = $campaignevent["triggerMode"]; //immediate//interval//date
            $triggerDate = $campaignevent["triggerDate"]; //06-07-2025 
            $triggerInterval = $campaignevent["triggerInterval"];// 1
            $triggerIntervalUnit = $campaignevent["triggerIntervalUnit"]; // i(minute), h(hour), d(days), m(month), y(year)
            
            $temp_id = $campaignevent["eventId"]; //temporary id
            $campaignId = $campaignevent["campaignId"];
            $eventOrder = $campaignevent["eventOrder"];
            $parentEventId = $campaignevent["parentEventId"];
            $name = $campaignevent["name"];
            $anchor = $campaignevent["anchor"];
            if(array_key_exists("properties", $campaignevent)){
                $properties = $campaignevent["properties"];
                $properties = json_encode($properties);
            }else{
                $properties = json_encode(array());
            }
            
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
            $eventObj->properties = $properties;
            $eventObj->decision_path = $anchor;
            $eventObj->temp_id = $temp_id;
            $eventObj->failed_count = 0;
            $eventObj->draft = $draft;

            if($triggerMode == "immediate"){
                $triggerDate = null;
            }else if($triggerMode == "interval"){
                if($triggerIntervalUnit == "d"){
                    $triggerDate = date('Y-m-d', strtotime("+$triggerInterval days"));
                }else if($triggerIntervalUnit == "m"){
                    $triggerDate = date('Y-m-d', strtotime("+$triggerInterval months"));
                }else if($triggerIntervalUnit == "y"){
                    $triggerDate = date('Y-m-d', strtotime("+$triggerInterval year"));
                }

            }else if($triggerMode == "date"){
                //triggerDate comes from form post
            }else{
                $triggerDate = null;
            }
            
            $eventObj->trigger_mode = $triggerMode;
            $eventObj->trigger_interval_unit = $triggerIntervalUnit;
            $eventObj->trigger_interval = $triggerInterval;
            $eventObj->trigger_date = $triggerDate;

            $saved = $eventObj->save();
            $lastInsertId = $eventObj->id;

            //get parent-event eventType and type
           /* if($parentEventId > 0){
                $parentObj = campaign_events_model::select("eventType","type")
                ->where("id", $parentEventId)
                ->first();
                
                $postData["campaignevent"]["parentEventType"] = $parentObj->eventType;
                $postData["campaignevent"]["parentEventTypeValue"] = $parentObj->type;
                
            }else{*/
                
                $postData["campaignevent"]["parentEventType"] = $eventType;
                $postData["campaignevent"]["parentEventTypeValue"] = $type;
            //}
            
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

        }else{
            //session expired
            $response = [
                'C' => 1004,
                'M' => $this->ERRORS[1004],
                'R' => [],
            ];
        }
        
        return response()->json($response); die;

    }

    function deleteevent(Request $request){
        if($this->USERID > 0){
            $eventId = $request->input("eventId");
            $deleted = campaign_events_model::where("id", $eventId)
            ->delete();

            
            $postBackData = array(
                'eventId' => $eventId,
                'success' => $deleted ? 1 : 0
            );

            $response = array(
                "C" => $deleted ? 100 : 101,
                "R" => $postBackData,
                "M" => $deleted ? "success" : "error"
            );
            
        }else{
            //session expired
            $response = [
                'C' => 1004,
                'M' => $this->ERRORS[1004],
                'R' => [],
            ];
        }
        
        return response()->json($response); die;
    }
    
    function getEventDropdownSegmentsList(Request $request){
        // get segments list for dropdown
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            if ($isAdmin > 0) {
                $segmentsObj = segments_model::select("id","name")->where("created_by_company", $userCompany)->get();
            } else {
                $segmentsObj = segments_model::select("id","name")->where("created_by", $this->USERID)->get();
            }
            
            if($segmentsObj){
                $segmentIdsArr = array();
                foreach($segmentsObj as $segment){
                    $segmentIdsArr[] =  $segment["id"];
                }

                $segmentContactsObj = segment_contacts_model::select('segment_id', 'contact_id')->whereIn('segment_id', $segmentIdsArr)->get();

                $segementContactArr = array();
                if($segmentContactsObj){
                    foreach($segmentContactsObj as $segmentContactRw){
                        $segementContactArr[$segmentContactRw["segment_id"]][] = $segmentContactRw["contact_id"]; 
                    }
                }

                foreach($segmentsObj as &$segmentRw){
                    //$segmentIdsArr[] =  $segment["id"];
                
                    if(!array_key_exists($segmentRw["id"], $segementContactArr)){
                        $contactsCount = 0;
                    }else{
                        $contactsCount = count($segementContactArr[$segmentRw["id"]]);
                    }
                    
                    $segmentRw['contacts'] = $contactsCount;
                }

                $segments = $segmentsObj;
            }else{
                $segments = array();
            }

            $response = [
                'C' => 100,
                'M' => 'success',
                'R' => $segments,
            ];

        }else{
            //session expired
            $response = [
                'C' => 1004,
                'M' => $this->ERRORS[1004],
                'R' => [],
            ];
        }
        
        return response()->json($response); die;
    }

    function getEventDropdownTagsList(Request $request){
        // get segments list for dropdown
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            if ($isAdmin > 0) {
                $tagsObj = tags_model::select("id","tag")->where("created_by_company", $userCompany)->get();
            } else {
                $tagsObj = tags_model::select("id","tag")->where("created_by", $this->USERID)->get();
            }
            
            if($tagsObj){
                $tags = $tagsObj;
            }else{
                $tags = array();
            }

            $response = [
                'C' => 100,
                'M' => 'success',
                'R' => $tags,
            ];

        }else{
            //session expired
            $response = [
                'C' => 1004,
                'M' => $this->ERRORS[1004],
                'R' => [],
            ];
        }
        
        return response()->json($response); die;
    }

    function getEventDropdownEmailsList(Request $request){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            if ($isAdmin > 0) {
                $emailsObj = emailsbuilder_model::select("id","name")->where("created_by_company", $userCompany)
                ->where("email_type","template")
                ->get();
            } else {
                $emailsObj = emailsbuilder_model::select("id","name")->where("created_by", $this->USERID)
                ->where("email_type","template")
                ->get();
            }

            if($emailsObj){
                $emails = $emailsObj;
            }else{
                $emails = array();
            }

            $response = [
                'C' => 100,
                'M' => 'success',
                'R' => $emails,
            ];

        }else{
            //session expired
            $response = [
                'C' => 1004,
                'M' => $this->ERRORS[1004],
                'R' => [],
            ];
        }
        
        return response()->json($response); die;    
    }

    function getEventCampaignList(Request $request){
        
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            if ($isAdmin > 0) {
                $campaignsObj = campaigns_model::select("id","name")->where("created_by_company", $userCompany)->get();
            } else {
                $campaignsObj = campaigns_model::select("id","name")->where("created_by", $this->USERID)->get();
            }

            if($campaignsObj){
                $campaigns = $campaignsObj;
            }else{
                $campaigns = array();
            }

            $response = [
                'C' => 100,
                'M' => 'success',
                'R' => $campaigns,
            ];

        }else{
            //session expired
            $response = [
                'C' => 1004,
                'M' => $this->ERRORS[1004],
                'R' => [],
            ];
        }
        
        return response()->json($response); die;  

    }

    function delete(Request $request){
        if($this->USERID > 0){
        
            $id = $request->input("id");
            
            //delete associated segments
            campaign_segments_model::where("campaign_id", $id)->delete();
            
            //delete associated events
            campaign_events_model::where("campaignId", $id)->delete();
            
            //delete associated action-reports
            campaign_actions_report_model::where("campaign_id", $id)->delete();
            
            //delete associated check-email-events
            campaign_check_emails_event_model::where("campaignId", $id)->delete();
            
            //delete associated event-outputs
            temp_events_output_model::where("campaign_id", $id)->delete();
            
            //delete associated email-queues
            campaign_emails_queue_model::where("campaignId", $id)->delete();

            $deleted = campaigns_model::where("id", $id)->delete();

            if($deleted){
                $response = [
                    'C' => 100,
                    'M' => $this->ERRORS[124],
                    'R' => [],
                ];
            }else{
                $response = [
                    'C' => 101,
                    'M' => $this->ERRORS[125],
                    'R' => [],
                ];
            }
        
        }else{
            //session expired
            $response = [
                'C' => 1004,
                'M' => $this->ERRORS[1004],
                'R' => [],
            ];
        }

        return response()->json($response); die;
    }

    function campaign($id){
        if($this->USERID > 0){
            $campaignId = $id;
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');
            
            if ($isAdmin > 0) {
                $campaignObj = campaigns_model::where("created_by_company", $userCompany)->where("id", $id)->first();
            } else {
                $campaignObj = campaigns_model::where("created_by", $this->USERID)->where("id", $id)->first();
            }

            if($campaignObj){

                //get campaign segments
                $segments = array();

                $data = array();
                $data["campaignsUrl"] = url('campaigns');
                $data["campaignId"] = db_randnumber() ; //temporary campainId
                $data["segments"] = $segments;

                $decisions = config('campaignevents.decisions');
                $actions = config('campaignevents.actions');
                $conditions = config('campaignevents.conditions');  
                $data["decisions"] = $decisions;
                $data["actions"] = $actions;
                $data["conditions"] = $conditions;

                //dd($data); die;
                return Inertia::render('NewCampaign', [
                    'pageTitle'  => 'New Campaign',
                    'csrfToken' => $csrfToken,
                    'params' => $data
                ]);
            }else{
                // Return a 404 response
                abort(404, 'Page not found');
            }


            /*
            if ($isAdmin > 0) {
                $tags = tags_model::select("id","tag")->where("created_by_company", $userCompany)->get();
            } else {
                $tags = tags_model::select("id","tag")->where("created_by", $this->USERID)->get();
            }

            if($contactObj){
                $contactTags = array();
                $contactTagsObj = tags_contacts_model::select("tag_id")->where("contact_id", $id)->get();
                if($contactTagsObj){
                    foreach($contactTagsObj as $contactTag){
                        $contactTags[] = $contactTag["tag_id"];
                    }
                }

                $data["contactsUrl"] = url('contacts');
                $data["contact"] = $contactObj;
                $data["tags"] = $tags;
                $data["contactTags"] = $contactTags;
                
                //echo "<pre>"; print_r($data); die;

                return Inertia::render('EditContact', [
                    'pageTitle'  => 'Edit Contact',
                    'csrfToken' => $csrfToken,
                    'params' => $data
                ]);

            }else{
                // Return a 404 response
                abort(404, 'Page not found');
            }*/
            
        }else{
            //redirect to signin
            return Redirect::to(url('signin'));
        }
    }

    function view($id){
        if($this->USERID > 0){
            $campaignId = $id;
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');
            
            if ($isAdmin > 0) {
                $campaignObj = campaigns_model::where("created_by_company", $userCompany)->where("id", $id)->first();
            } else {
                $campaignObj = campaigns_model::where("created_by", $this->USERID)->where("id", $id)->first();
            }

            if($campaignObj){

                //get campaign segments
                $campSegmentsObj = campaign_segments_model::where("campaign_id", $campaignId)->get();

                $segments = [];
                $segmentIds = [];
                $contacts = [];
                $contactIds = [];
                $contactCounts = 0;
                if($campSegmentsObj){
                    foreach($campSegmentsObj as $campSegment){
                        $segmentIds[] = $campSegment->segment_id;
                    }

                    if(!empty($segmentIds)){
                        //get segments
                        $segments = segments_model::whereIn("id", $segmentIds)->get();

                        //get segment's contacts count
                        $contactCounts = segment_contacts_model::whereIn("segment_id", $segmentIds)
                        ->count();


                        $contactIdsObj = segment_contacts_model::select("contact_id")->whereIn("segment_id", $segmentIds)
                        ->get();

                        
                        foreach($contactIdsObj as $contactIdRw){
                            $contactIds[] = $contactIdRw->contact_id;
                        }

                        $contacts = contacts_model::whereIn("id", $contactIds)->get();
                    }
                }
                //echo '$contactCounts:'.$contactCounts; die;

                //get campaign events
                $eventsObj = campaign_events_model::select("id", "campaignId", "parentId", "name", "description", "type", "eventType", "eventOrder", "xy_positions", "properties", "triggered", "triggered_on", "trigger_date", "decision_path", "channel", "channel_id", "trigger_count")
                ->where('campaignId', $campaignId)
                ->orderBy("eventOrder","asc")
                ->get();
                
                //get events triggered data
                $eventsReport = campaign_actions_report_model::where("campaign_id", $campaignId)->get();

                $decisions = array();
                $actions = array();
                $conditions = array();
                if($eventsObj){
                    
                    foreach($eventsObj as &$eventRwTmp){
                        $eventRwTmp->success = 0;
                        $eventRwTmp->failed = 0;
                        $eventRwTmp->completed = 0;
                        $eventRwTmp->pending = 0;

                        //get parent event details
                        if($eventRwTmp->parentId > 0){
                            foreach($eventsObj as $subEventRwTmp){
                                if($eventRwTmp->parentId == $subEventRwTmp->id){
                                    $eventRwTmp->parentEventType = $subEventRwTmp->eventType;
                                }
                            }
                            
                        }else{
                            $eventRwTmp->parentEventType = 'source';
                        }
                    }

                    foreach($eventsObj as $eventRw){
                        if($eventRw->eventType == 'decision'){
                            $decisions[] =  $eventRw;
                        }

                        if($eventRw->eventType == 'action'){
                            $actions[] = $eventRw;
                        }

                        if($eventRw->eventType == 'condition'){
                            $conditions[] = $eventRw;
                        }
                    }
                }

                /*// Calculate the percentages
                $yesPercentage = ($yesCount / $totalContacts) * 100;
                $noPercentage = ($noCount / $totalContacts) * 100;
                $failedPercentage = ($failedCount / $totalContacts) * 100;
                */

                if(!empty($decisions)){
                    foreach($decisions as &$decision){
                        $decEvntId = $decision->id;
                        $decCampId = $decision->campaignId;
                        
                        $success = $decision->success;
                        $failed = $decision->failed;
                        $completed = $decision->completed;
                        $pending = $decision->pending;

                        if($eventsReport){
                            foreach($eventsReport as $evntRprtD){
                                $evntRprtEvntID = $evntRprtD->event_id;
                                $evntRprtEvntCampID = $evntRprtD->campaign_id;
                                $evntRprtEvntHandled = $evntRprtD->handled;
                                $evntRprtEvntYesNo = $evntRprtD->decision_path; //yes/no
                                
                                if($decEvntId == $evntRprtEvntID && $decCampId == $evntRprtEvntCampID){
                                    
                                    if($evntRprtEvntHandled == 1 && $evntRprtEvntYesNo == 'yes'){
                                        $success = $success + 1;    
                                        $completed = $completed + 1;
                                    }

                                    if($evntRprtEvntHandled == 1 && $evntRprtEvntYesNo == 'no'){
                                        $pending = $pending + 1;
                                    }

                                    if($evntRprtEvntHandled == 0){
                                        $failed = $failed + 1;
                                    }

                                }

                            }
                        }

                        $decision->success = $success;
                        $decision->failed = $failed;
                        $decision->completed = $completed;
                        $decision->pending = $pending;
                    
                    }

                    //calculate success/failed %
                    foreach($decisions as &$decision2){
                        
                        $success = $decision2->success;
                        $failed = $decision2->failed;
                        $completed = $decision2->completed;
                        $pending = $decision2->pending;
                        $successPercent = 0;
                        $failedPercent = 0;
                        if($contactCounts > 0){
                            $successPercent = ($success/$contactCounts) * 100;
                            $failedPercent = ($failed/$contactCounts) * 100;
                        }

                        $decision2->successPercent = $successPercent;
                        $decision2->failedPercent = $failedPercent;
                    }
                }

                if(!empty($actions)){
                    foreach($actions as &$action){
                        $actEvntId = $action->id;
                        $actCampId = $action->campaignId;
                        
                        $success = $action->success;
                        $failed = $action->failed;
                        $completed = $action->completed;
                        $pending = $action->pending;

                        if($eventsReport){
                            foreach($eventsReport as $evntRprtA){
                                $evntRprtEvntID = $evntRprtA->event_id;
                                $evntRprtEvntCampID = $evntRprtA->campaign_id;
                                $evntRprtEvntHandled = $evntRprtA->handled;
                                $evntRprtEvntYesNo = $evntRprtA->decision_path; //yes/no
                                
                                if($actEvntId == $evntRprtEvntID && $actCampId == $evntRprtEvntCampID){
                                    
                                    if($evntRprtEvntHandled == 1 && $evntRprtEvntYesNo == 'yes'){
                                        $success = $success + 1;    
                                        $completed = $completed + 1;
                                    }

                                    if($evntRprtEvntHandled == 1 && $evntRprtEvntYesNo == 'no'){
                                        $pending = $pending + 1;
                                    }

                                    if($evntRprtEvntHandled == 0){
                                        $failed = $failed + 1;
                                    }

                                }

                            }
                        }
                        
                        $action->success = $success;
                        $action->failed = $failed;
                        $action->completed = $completed;
                        $action->pending = $pending;
                    }

                    //calculate success/failed %
                    foreach($actions as &$action2){
                        
                        $success = $action2->success;
                        $failed = $action2->failed;
                        $completed = $action2->completed;
                        $pending = $action2->pending;
                        $successPercent = 0;
                        $failedPercent = 0;
                        if($contactCounts > 0){
                            $successPercent = ($success/$contactCounts) * 100;
                            $failedPercent = ($failed/$contactCounts) * 100;
                        }

                        $action2->successPercent = $successPercent;
                        $action2->failedPercent = $failedPercent;
                    }
                }

                if(!empty($conditions)){
                    foreach($conditions as &$condition){
                        $actEvntId = $condition->id;
                        $actCampId = $condition->campaignId;
                        
                        $success = $condition->success;
                        $failed = $condition->failed;
                        $completed = $condition->completed;
                        $pending = $condition->pending;

                        if($eventsReport){
                            foreach($eventsReport as $evntRprtC){
                                $evntRprtEvntID = $evntRprtC->event_id;
                                $evntRprtEvntCampID = $evntRprtC->campaign_id;
                                $evntRprtEvntHandled = $evntRprtC->handled;
                                $evntRprtEvntYesNo = $evntRprtC->decision_path; //yes/no
                                
                                if($actEvntId == $evntRprtEvntID && $actCampId == $evntRprtEvntCampID){
                                    
                                    if($evntRprtEvntHandled == 1 && $evntRprtEvntYesNo == 'yes'){
                                        $success = $success + 1;    
                                        $completed = $completed + 1;
                                    }

                                    if($evntRprtEvntHandled == 1 && $evntRprtEvntYesNo == 'no'){
                                        $pending = $pending + 1;
                                    }

                                    if($evntRprtEvntHandled == 0){
                                        $failed = $failed + 1;
                                    }

                                }

                            }
                        }
                        
                        $condition->success = $success;
                        $condition->failed = $failed;
                        $condition->completed = $completed;
                        $condition->pending = $pending;
                    }

                    //calculate success/failed %
                    foreach($conditions as &$condition2){
                        
                        $success = $condition2->success;
                        $failed = $condition2->failed;
                        $completed = $condition2->completed;
                        $pending = $condition2->pending;
                        $successPercent = 0;
                        $failedPercent = 0;
                        if($contactCounts > 0){
                            $successPercent = ($success/$contactCounts) * 100;
                            $failedPercent = ($failed/$contactCounts) * 100;
                        }

                        $condition2->successPercent = $successPercent;
                        $condition2->failedPercent = $failedPercent;
                    }
                }
                
                $data = array();
                $data["campaignsUrl"] = url('campaigns');
                $data["campaignId"] = $campaignId;
                $data["campaign"] = $campaignObj;
                $data["segments"] = $segments;
                $data["contacts"] = $contacts;
                $data["events"] = $eventsObj;
                $data["decisions"] = $decisions;
                $data["actions"] = $actions;
                $data["conditions"] = $conditions;
                
                //echo "<pre>"; print_r($data); die;
                
                return Inertia::render('Campaign', [
                    'pageTitle'  => 'Campaign',
                    'csrfToken' => $csrfToken,
                    'params' => $data
                ]);
            }else{
                // Return a 404 response
                abort(404, 'Page not found');
            }

        }else{
            //redirect to signin
            return Redirect::to(url('signin'));
        }

    }
    // --- old code ok report
    function index(Request $request){
        
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

            array("id" => 5, "event" => "pagepagehit", "value" => "page.pagehit", "title" => "Visits a page", "description" => "Trigger actions on a page/url hit.")
            
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
            'PageTitle'  => 'Campaignbuilder',
            'csrfToken' => csrf_token(),
            'Params' => $data
        ]);
        //return View("campaignbuilder",$data);
    }

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
        /*return Inertia::render('Campaignbuilder', [
            'message' => 'Welcome to Inertia.js with React!',
        ]);*/
        return View("campaignbuilder",$data);
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

}
