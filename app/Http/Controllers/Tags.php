<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use App\Models\tags_model;
use App\Models\tags_contacts_model;

class Tags extends Controller
{
    var $ERRORS = [];

    //https://drive.google.com/drive/folders/1RkH1kz9Kk9YguSxEk2tL1ih5cyLAiKzDSYFwCDx5RXA?usp=sharing
    var $USERID = 0;
    function __construct(){
        parent::__construct();    
        $this->ERRORS = config("errormessage");
        $this->USERID = $this->getSession('userId');
    }

    function tags(Request $request) {
        if ($this->USERID > 0) {
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');
    
            if ($isAdmin > 0) {
                $tagsObj = tags_model::where("created_by_company", $userCompany)->paginate(10);
            } else {
                $tagsObj = tags_model::where("created_by", $this->USERID)->paginate(10);
            }
    
            // Fetch contact counts for each tag in one query to avoid N+1 problem
            $tagIds = $tagsObj->pluck('id')->toArray();
            $contactCounts = tags_contacts_model::whereIn('tag_id', $tagIds)
                ->selectRaw('tag_id, count(*) as contacts')
                ->groupBy('tag_id')
                ->pluck('contacts', 'tag_id')
                ->toArray();
    
            // Prepare the tags data with formatted date and contact counts
            foreach ($tagsObj as &$rw) {
                $rw->date_added = date("F d, Y", strtotime($rw->date_added)); // format date
                $rw->contacts = $contactCounts[$rw->id] ?? 0; // add contact count for the tag
            }
    
            // Prepare the response data
            $data = [
                "tags" => $tagsObj,
                "tagsUrl" => url('tags')
            ];
    
            return Inertia::render('Tags', [
                'pageTitle'  => 'Tags',
                'csrfToken' => $csrfToken,
                'params' => $data
            ]);
    
        } else {
            // redirect to signin
            return Redirect::to(url('signin'));
        }
    }

    
    function tags2(Request $request){

        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            if ($isAdmin > 0) {
                $tagsObj = tags_model::where("created_by_company", $userCompany)->paginate(10)->toArray();
            } else {
                $tagsObj = tags_model::where("created_by", $this->USERID)->paginate(10)->toArray();
            }
            
            if(!empty($tagsObj["data"])){

                $tagsIds = array();

                foreach($tagsObj["data"] as &$rw){
                    $tagsIds[] = $rw;
                    $rw["date_added"] = date("F d, Y", strtotime($rw["date_added"]));
                }

                foreach($tagsObj["data"] as &$rww){
                    // Count contacts for each segment
                    $count = tags_contacts_model::where("tag_id", $rww["id"])->count();
        
                    $rww["contacts"] = $count;
                }
            }

            $data = array();
            $data["tags"] = $tagsObj;
            $data["tagsUrl"] = url('tags');
            return Inertia::render('Tags', [
                'pageTitle'  => 'Tags',
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
        
            //$contactFilters = config("filters.contactFilters");
            $data = array();
            //$data["contactFilters"] = json_encode($contactFilters);
            $data["tagsUrl"] = url('tags');
            
            return Inertia::render('NewTag', [
                'pageTitle'  => 'New Tag',
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
            $description = $unserializeFormData["description"];
            

            // Define the validation rules
            $rules = [
                'name' => 'required|string|min:2|max:50'
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

            }else{

                $tagObj = new tags_model();
                //$tagObj->id
                $tagObj->tag = $name;
                $tagObj->description = $description;
                $tagObj->date_added = $today;
                $tagObj->created_by = $this->USERID;
                $tagObj->created_by_user = $fullName;
                $tagObj->created_by_company = $userCompany;
                $tagObj->date_modified = $today;
                $tagObj->modified_by = $this->USERID;
                $tagObj->modified_by_user = $fullName;

                $tagObj->save();
                //$tagObj->id;
                
                $response = [
                    'C' => 100,
                    'M' => $this->ERRORS[115],
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
    
    function tag($id){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');
             //tags_contacts_model
            if ($isAdmin > 0) {
                $tagObj = tags_model::where("created_by_company", $userCompany)->where("id", $id)->first();
            } else {
                $tagObj = tags_model::where("created_by", $this->USERID)->where("id", $id)->first();
            }

            if($tagObj){
                
                $data["tagsUrl"] = url('tags');
                $data["tag"] = $tagObj;
                
                return Inertia::render('EditTag', [
                    'pageTitle'  => 'Edit Tag',
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

            $id = strtolower($unserializeFormData["tagId"]);
            $name = strtolower($unserializeFormData["name"]);
            $description = $unserializeFormData["description"];

            // Define the validation rules
            $rules = [
                'name' => 'required|string|min:2|max:50'
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

                
            }else{
                
                $updateData = array(
                    "tag" => $name,
                    "description" => $description,
                    "date_modified" => $today,
                    "modified_by" => $this->USERID,
                    "modified_by_user" => $fullName
                );

                tags_model::where("created_by_company",$userCompany)->where("id",$id)->update($updateData);

                $response = [
                    'C' => 100,
                    'M' => $this->ERRORS[117],
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
             
            tags_model::where("created_by_company", $userCompany)->where("id", $id)->delete();
            tags_contacts_model::where("tag_id", $id)->delete();
            
            $response = [
                'C' => 100,
                'M' => $this->ERRORS[116],
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