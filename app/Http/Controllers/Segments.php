<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

use App\Models\contacts_model;
use App\Models\segments_model;
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
        dd(csrf_token());
    }

    function new(Request $request){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
        
            $contactFilters = config("filters.contactFilters");
            $data = array();
            $data["contactFilters"] = json_encode($contactFilters);
            
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

            $name = $unserializeFormData["name"];
            $alias = $unserializeFormData["alias"];
            $publicname = $unserializeFormData["publicname"];
            $description = $unserializeFormData["description"];
            
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
                'M' => $this->ERRORS[105],
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
