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
        /*http://local.laravelmautic.com/segments?filterby=contacts&filters%5B0%5D%5Bglue%5D=and&filters%5B0%5D%5Boperator%5D=%3D&filters%5B0%5D%5Bproperties%5D%5Bfilter%5D=mr&filters%5B0%5D%5Bfield%5D=title&filters%5B0%5D%5Btype%5D=lookup&filters%5B0%5D%5Bobject%5D=contact&filters%5B1%5D%5Bglue%5D=or&filters%5B1%5D%5Boperator%5D=%3D&filters%5B1%5D%5Bproperties%5D%5Bfilter%5D=dinesh%40example.com&filters%5B1%5D%5Bfield%5D=email&filters%5B1%5D%5Btype%5D=email&filters%5B1%5D%5Bobject%5D=contact
        */
        //dd($request);
    
        // Ensure the user is authenticated and valid
        if ($this->USERID > 0) {
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            // Prepare filters for contacts
            $contactFilters = config("filters.contactFilters");
            //dd($contactFilters);

            // Check if 'filterby' is 'contacts' and filters are provided
            if ($request->input('filterby') == 'contacts' && !empty($request->input('filters'))) {
                // Get filters from the request
                $filters = $request->input('filters');
                $contactIdsArr = [];
                
                // Start the contacts query
                $contactsQuery = contacts_model::query();
                $contactsQuery->select('id');

                // Add conditions based on whether the user is an admin or not
                if ($isAdmin > 0) {
                    $contactsQuery->where("created_by_company", $userCompany);
                } else {
                    $contactsQuery->where("created_by", $this->USERID);
                }

                // Loop through each filter and apply the necessary conditions to the query
                foreach ($filters as $i => $filterRw) {
                    $glue = $filterRw['glue']; // 'and' or 'or'
                    $operatorVal = $filterRw['operator']; // '=', 'like', etc.
                    $filter = $filterRw['properties']['filter']; // Filter value
                    $field = $filterRw['field']; // Field name, e.g., 'email'

                    $operator = '';
                    
                    if($operatorVal == '='){
                        $operator = '=';
                    }else if($operatorVal == '!='){
                        $operator = '!=';
                    }else if($operatorVal == 'empty'){
                        $operator = '=';
                        $filter = '';
                    }else if($operatorVal == '!empty'){
                        $operator = '!=';
                        $filter = '';
                    }else if($operatorVal == 'like'){
                        $operator = 'LIKE';
                        $filter = "%$filter%";
                    }else if($operatorVal == '!like'){
                        $operator = 'NOT LIKE';
                        $filter = "%$filter%";
                    }else if($operatorVal == 'startsWith'){
                        $operator = 'LIKE';
                        $filter = "$filter%";
                    }else if($operatorVal == 'endsWith'){
                        $operator = 'LIKE';
                        $filter = "%$filter";
                    }else if($operatorVal == 'contains'){
                        $operator = 'LIKE';
                        $filter = "%$filter%";
                    }else if($operatorVal == 'in'){
                        $operator = 'IN' ;
                        $filter = "($filter)";
                    }else if($operatorVal == '!in'){
                        $operator = 'NOT IN' ;
                        $filter = "($filter)";
                    }else if($operatorVal == '>'){
                        $operator = '>' ;
                        $filter = $filter;
                    }else if($operatorVal == '>='){
                        $operator = '>=' ;
                        $filter = $filter;
                    }else if($operatorVal == '<'){
                        $operator = '<' ;
                        $filter = $filter;
                    }else if($operatorVal == '<='){
                        $operator = '<=' ;
                        $filter = $filter;
                    }

                    // Apply the first filter using `where`
                    if($operator != ''){
                        if ($i == 0) {
                            $contactsQuery->where($field, $operator, $filter);
                        } else {
                            // For subsequent filters, use 'orWhere' or 'where' based on 'glue'
                            if ($glue == 'or') {
                                $contactsQuery->orWhere($field, $operator, $filter);
                            } else {
                                $contactsQuery->where($field, $operator, $filter);
                            }
                        }
                    }else{
                        //invalid operator
                    }

                }
                
                // Paginate the contacts based on the filters
                $contacts = $contactsQuery->paginate(10);

                // If contacts are found, process them
                if ($contacts->isNotEmpty()) {
                    // Populate the contact IDs array
                    foreach ($contacts as $contact) {
                        $contactIdsArr[] = $contact->id;
                    }

                    // Get segment contacts based on the filtered contact IDs
                    $segmentContactsObj = segment_contacts_model::whereIn('contact_id', $contactIdsArr)->get();

                    // Initialize the segment IDs array
                    $segmentIds = [];

                    if ($segmentContactsObj->isNotEmpty()) {
                        // Populate segment IDs
                        foreach ($segmentContactsObj as $segmentContact) {
                            $segmentIds[] = $segmentContact->segment_id;
                        }

                        // Get the segments using pagination (10 per page)
                        $segmentsObj = segments_model::whereIn('id', $segmentIds)->paginate(10);

                        // Check if there are any segments
                        if ($segmentsObj->isNotEmpty()) {
                            // Count contacts for each segment and format the date
                            foreach ($segmentsObj as &$segment) {
                                
                                $count = segment_contacts_model::where("segment_id", $segment->id)->count();
                                $segment->contacts = $count;  // Add contacts count to each segment
                                $segment->date_added = date('d-m-Y', strtotime($segment->date_added));
                            }
                        }

                        // Prepare the data to send to the view
                        $data = [
                            "segments" => $segmentsObj,
                            "contactFilters" => json_encode($contactFilters),
                            "segmentsUrl" => url('segments')
                        ];

                        // Return the view
                        return Inertia::render('Segments', [
                            'pageTitle' => 'Segments',
                            'csrfToken' => $csrfToken,
                            'params' => $data
                        ]);
                    } else {
                        // No segment contacts found
                        $data = [
                            "segments" => [],
                            "contactFilters" => json_encode($contactFilters),
                            "segmentsUrl" => url('segments')
                        ];

                        // Return the view
                        return Inertia::render('Segments', [
                            'pageTitle' => 'Segments',
                            'csrfToken' => $csrfToken,
                            'params' => $data
                        ]);
                    }
                } else {
                    // No contacts found based on the filters
                    $data = [
                        "segments" => [],
                        "contactFilters" => json_encode($contactFilters),
                        "segmentsUrl" => url('segments')
                    ];

                    // Return the view
                    return Inertia::render('Segments', [
                        'pageTitle' => 'Segments',
                        'csrfToken' => $csrfToken,
                        'params' => $data
                    ]);
                }
            } else {
                // When no filters are applied, display segments for the user
                $segmentsObj = $isAdmin > 0
                    ? segments_model::where("created_by_company", $userCompany)->paginate(10)
                    : segments_model::where("created_by", $this->USERID)->paginate(10);

                
                // Check if there are any segments
                if ($segmentsObj->isNotEmpty()) {
                    // Count contacts for each segment and format the date
                   
                    foreach ($segmentsObj as &$segment) {
                        
                        $count = segment_contacts_model::where("segment_id", $segment->id)->count();
                        $segment->contacts = $count;  // Add contacts count to each segment
                        $segment->date_added = date('d-m-Y', strtotime($segment->date_added));
                    }
                }
                
                // Prepare the data to send to the view
                $data = [
                    "segments" => $segmentsObj,
                    "contactFilters" => json_encode($contactFilters),
                    "segmentsUrl" => url('segments')
                ];

                // Return the view
                return Inertia::render('Segments', [
                    'pageTitle' => 'Segments',
                    'csrfToken' => $csrfToken,
                    'params' => $data
                ]);
            }
        } else {
            // Redirect to signin if the user is not authenticated
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

                $segmentObj->date_added = date('d-m-Y', strtotime($segmentObj->date_added));

                if($segmentObj->date_modified){
                    $segmentObj->date_modified = date('d-m-Y', strtotime($segmentObj->date_modified));
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
