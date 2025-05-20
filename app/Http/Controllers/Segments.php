<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

use App\Models\contacts_model;
use App\Models\segments_model;
use App\Models\segment_contacts_model;
use App\Models\campaign_segments_model;
use App\Models\campaigns_model;
use App\Models\role_model;

class Segments extends Controller
{
    var $ERRORS = [];
    var $USERID = 0;
    function __construct(){
        parent::__construct();    
        $this->ERRORS = config("errormessage");
        $this->USERID = $this->getSession('userId');
    }

    function segments(Request $request){
        
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            if ($isAdmin > 0) {
                $segmentsObj = segments_model::where("created_by_company", $userCompany)->paginate(10)->toArray();
            } else {
                $segmentsObj = segments_model::where("created_by", $this->USERID)->paginate(10)->toArray();
            }
            
            if(!empty($segmentsObj["data"])){

                $segmentIds = array();

                foreach($segmentsObj["data"] as &$rw){
                    $segmentIds[] = $rw;
                    $rw["date_added"] = date("F d, Y");
                }

                foreach($segmentsObj["data"] as &$rww){
                    // Count contacts for each segment
                    $count = segment_contacts_model::where("segment_id", $rww["id"])->count();
        
                    $rww["contacts"] = $count;
                }
            }

            //echo "segmentsObj:<pre>"; print_r($segmentsObj); die;
            
            $data = array();
            $data["segments"] = $segmentsObj;
            $data["segmentsUrl"] = url('segments');
            return Inertia::render('Segments', [
                'pageTitle'  => 'Segments',
                'csrfToken' => $csrfToken,
                'params' => $data
            ]);

        }else{
            //redirect to signin
            return Redirect::to(url('signin'));
        }

    }

    function segmentView($id){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            if ($isAdmin > 0) {
                $segmentObj = segments_model::where("created_by_company", $userCompany)->where("id", $id)->first();
            } else {
                $segmentObj = segments_model::where("created_by", $this->USERID)->where("id", $id)->first();
            }

            if($segmentObj){
                
                $contacts = array();
                
                $segmentContactsObj = segment_contacts_model::select("contact_id", "date_added")
                ->where("segment_id", $id)
                ->get();

                if($segmentContactsObj){
                    $contactIdsArr = array();
                    foreach($segmentContactsObj as $segmentContactrw){
                        $tmpContId = $segmentContactrw->contact_id;
                        $contactIdsArr[] = $tmpContId;
                    }

                    $contactsObj = contacts_model::select("id", "title", "firstname", "lastname", "email")
                    ->whereIn("id", $contactIdsArr)
                    ->get();
                    if($contactsObj){
                        $contacts = $contactsObj->toArray();
                    }
                }

                $segmentObj->date_added = date('M d, y', strtotime($segmentObj->date_added));

                if($segmentObj->date_modified){
                    $segmentObj->date_modified = date('M d, y', strtotime($segmentObj->date_modified));
                }else{
                    $segmentObj->date_modified = '';
                }

                if(!$segmentObj->modified_by_user){
                    $segmentObj->modified_by_user = '';
                }

                //get associated campaigns
                $segCampobj = campaign_segments_model::where("segment_id", $id)
                ->get();
                
                $campaigns = collect();

                if($segCampobj){
                    $campaignIdsArr = array();
                    foreach($segCampobj as $segCampRw){
                        $campaignIdsArr[] = $segCampRw->campaign_id;
                    }
                    
                    if(!empty($campaignIdsArr)){
                        $campaigns = campaigns_model::select("id", "name")
                        ->whereIn("id", $campaignIdsArr)
                        ->get();
                    }
                }

                $data = array();
                $data["segmentsUrl"] = url('segments');
                $data["contacts"] = $contacts;
                $data["segment"] = $segmentObj;
                $data["campaigns"] = $campaigns;

                //dd($data); 
                //id date_added created_by created_by_user date_modified modified_by_user name description

                return Inertia::render('ViewSegment', [
                    'pageTitle'  => 'View Segment',
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

    function segment($id){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            if ($isAdmin > 0) {
                $segmentObj = segments_model::where("created_by_company", $userCompany)->where("id", $id)->first();
            } else {
                $segmentObj = segments_model::where("created_by", $this->USERID)->where("id", $id)->first();
            }

            if($segmentObj){
                $segmentObj->filters = json_decode($segmentObj->filters, true);
                /*
                $segmentObj->date_added;
                $segmentObj->id;
                $segmentObj->name;
                $segmentObj->description;
                $segmentObj->alias;
                $segmentObj->public_name;
                $segmentObj->filters;
                */
                $contactFilters = config("filters.contactFilters");
                $data = array();
                $data["contactFilters"] = json_encode($contactFilters);
                $data["segmentsUrl"] = url('segments');
                $data["segement"] = $segmentObj;
                
                return Inertia::render('EditSegment', [
                    'pageTitle'  => 'Edit Segment',
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

    function new(Request $request){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
        
            $contactFilters = config("filters.contactFilters");
            $data = array();
            $data["contactFilters"] = json_encode($contactFilters);
            $data["segmentsUrl"] = url('segments');
            
            return Inertia::render('NewSegment', [
                'pageTitle'  => 'New Segment',
                'csrfToken' => $csrfToken,
                'params' => $data
            ]);
            
        }else{
            //redirect to signin
            return Redirect::to(url('signin'));
        }
    }

    function save(Request $request){
        //dd($request); die;

        if($this->USERID > 0){
            $userCompany = $this->getSession('companyId');
            $firstName = $this->getSession('firstName');
            $lastName = $this->getSession('lastName');
            $fullName = $firstName." ".$lastName; 
            $today = date("Y-m-d");

            $formData = $request->input("formData");
            
            $unserializeFormData = [];
            parse_str($formData,$unserializeFormData);

            $name = strtolower($unserializeFormData["name"]);
            $alias = $name;
            $publicname = $name;
            //$alias = strtolower($unserializeFormData["alias"]);
            //$publicname = strtolower($unserializeFormData["publicname"]);
            $objective = $unserializeFormData["objective"];
            $purpose = $unserializeFormData["purpose"];
            $description = $unserializeFormData["description"];
            $filters = $unserializeFormData["filters"];

            // Define the validation rules
            $rules = [
                'name' => 'required|string|min:2|max:50',
                'filters' => 'nullable|array',  // Ensure filters is an array if it's not null
                //'filters.*' => 'nullable|json', // If you need to validate each filter as JSON, use this
            ];

            // Create the validator instance
            $validator = Validator::make($unserializeFormData, $rules);

            // Check if validation fails
            if ($validator->fails()) {
                // Return a JSON response with errors
                $response = [
                    'C' => 102,
                    'M' => $this->ERRORS[102],
                    'R' => $validator->errors(),
                ];

                return response()->json($response);
            }
            else{
                // next logic
                if (array_key_exists("filters",$unserializeFormData)){
                    $filters = $unserializeFormData["filters"];    
    
                    $filters = json_encode($filters);
    
                }else{
                    $filters = "";
                }
    
                $segmentObj = new segments_model();
                //$segmentObj->id
                $segmentObj->is_published = 1;
                $segmentObj->date_added = $today;
                
                $segmentObj->created_by = $this->USERID;
                $segmentObj->created_by_user = $fullName; 
                $segmentObj->created_by_company = $userCompany;
    
                $segmentObj->name = $name;
                $segmentObj->purpose = $purpose;
                $segmentObj->objective = $objective;
                $segmentObj->description = $description;
                $segmentObj->alias = $alias;
                $segmentObj->public_name = $publicname;
                $segmentObj->filters = $filters;
                $segmentObj->is_global = 0;
                $segmentObj->is_preference_center = 0;
                $segmentObj->save();
                $segmentObj->id;
    
                //make a cron for check segments filters and add contacts to that segment
                $response = [
                    'C' => 100,
                    'M' => $this->ERRORS[106],
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

    function update(Request $request){
        if($this->USERID > 0){
            $userCompany = $this->getSession('companyId');
            $firstName = $this->getSession('firstName');
            $lastName = $this->getSession('lastName');
            $fullName = $firstName." ".$lastName; 
            $today = date("Y-m-d");
            
            $formData = $request->input("formData");
            
            $unserializeFormData = [];
            parse_str($formData,$unserializeFormData);

            $id = strtolower($unserializeFormData["segmentId"]);
            $name = strtolower($unserializeFormData["name"]);
            $alias = $name;
            $publicname = $name;
            //$alias = strtolower($unserializeFormData["alias"]);
            //$publicname = strtolower($unserializeFormData["publicname"]);
            $objective = $unserializeFormData["objective"];
            $purpose = $unserializeFormData["purpose"];
            $description = $unserializeFormData["description"];
            $filters = $unserializeFormData["filters"];

            // Define the validation rules
            $rules = [
                'name' => 'required|string|min:2|max:50',
                'filters' => 'nullable|array',  // Ensure filters is an array if it's not null
                //'filters.*' => 'nullable|json', // If you need to validate each filter as JSON, use this
            ];

            // Create the validator instance
            $validator = Validator::make($unserializeFormData, $rules);

            // Check if validation fails
            if ($validator->fails()) {
                // Return a JSON response with errors
                $response = [
                    'C' => 102,
                    'M' => $this->ERRORS[102],
                    'R' => $validator->errors(),
                ];

                return response()->json($response);
            }
            else{
                // next logic
                if (array_key_exists("filters",$unserializeFormData)){
                    $filters = $unserializeFormData["filters"];    
    
                    $filters = json_encode($filters);
    
                }else{
                    $filters = "";
                }
                
                $updateData = array(
                    "name" => $name,
                    "purpose" => $purpose,
                    "objective" => $objective,
                    "alias" => $alias,  
                    "public_name" => $publicname,
                    "description" => $description,
                    "filters" => $filters,
                    "date_modified" => $today,
                    "modified_by" => $this->USERID,
                    "modified_by_user" => $fullName
                );

                segments_model::where("created_by_company",$userCompany)->where("id",$id)->update($updateData);

                //make a cron for check segments filters and add contacts to that segment
                $response = [
                    'C' => 100,
                    'M' => $this->ERRORS[108],
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

    function delete(Request $request){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            $id = $request->input("id");

            //delete segment
            segments_model::where("created_by_company", $userCompany)->where("id", $id)->delete();
            
            //delete segement from associated contacts
            segment_contacts_model::where("segment_id", $id)->delete();
            
            //delete segement from associated campaigns
            campaign_segments_model::where("segment_id", $id)->delete();
            
            
            $response = [
                'C' => 100,
                'M' => $this->ERRORS[107],
                'R' => [],
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
}
