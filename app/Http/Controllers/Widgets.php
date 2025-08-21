<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use App\Models\widgets_model;


class Widgets extends Controller
{
    var $ERRORS = [];

    
    var $USERID = 0;
    function __construct(){
        parent::__construct();    
        $this->ERRORS = config("errormessage");
        $this->USERID = $this->getSession('userId');
    }

    function widgets(Request $request) {
        if ($this->USERID > 0) {
           
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            /*
            id
            name
            website
            purpose
            active
            validate
            parametersRequired
            parameters
            created_by
            created_by_user
            created_by_company
            modified_by
            modified_by_user
            date_added
            date_modified
            */

            if ($isAdmin > 0) {
                $widgetsObj = widgets_model::where("created_by_company", $userCompany)
                ->orderBy("date_added", "desc")
                ->paginate(10);
            } else {
                $widgetsObj = widgets_model::where("created_by", $this->USERID)
                ->orderBy("date_added", "desc")
                ->paginate(10);
            }
    
            // Format contact data
            if(!empty($widgetsObj)){
                foreach ($widgetsObj as &$widget) {
                    $widget->date_added = date('d-m-Y', strtotime($widget->date_added));
                }
            }
            
            // Prepare the response data
            $data = [
                "widgets" => $widgetsObj,
                "widgetsUrl" => url('widgets')
            ];
            
            return Inertia::render('Widgets', [
                'pageTitle'  => 'Widgets',
                'csrfToken' => $csrfToken,
                'params' => $data
            ]);
    
        } else {
            // redirect to signin
            return Redirect::to(url('signin'));
        }
    }

    //create following functions and routing
    //widgets new view view edit delete
    
    function new(Request $request){
        if($this->USERID > 0){  
            $csrfToken = csrf_token();
        
            
            $data = array();
            $data["widgetsUrl"] = url('widgets');
            
            return Inertia::render('NewWidget', [
                'pageTitle'  => 'New Widget',
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

            
            //dd($request);
            /*
            widgetName widgetPurpose widgetWebsite widgetType widgetDescription widgetHeading active 
            checkedFields
                inputFirstName
                inputLastName
                inputEmail
                inputCompany
                inputMessage
            uncheckedFields
                inputPhone
                inputReason
                inputCountry
            */

            $userId = $this->USERID;
            $userCompany = $this->getSession('companyId');
            $firstName = $this->getSession('firstName');
            $lastName = $this->getSession('lastName');
            $fullName = $firstName." ".$lastName; 
            $today = date("Y-m-d H:i:s");
            
            $widgetName = $request->input("widgetName");
            $widgetPurpose = $request->input("widgetPurpose");
            $widgetWebsite = $request->input("widgetWebsite");
            
            $widgetType = $request->input("widgetType");
            if(!$widgetWebsite && $widgetType == 'webform'){
                $widgetWebsite = '';
            }

            $widgetDescription = $request->input("widgetDescription");
            if(!$widgetDescription){
                $widgetDescription = '';
            }
            $widgetHeading = $request->input("widgetHeading");
            $checkedFields = $request->input("checkedFields");
            $uncheckedFields = $request->input("uncheckedFields");
            $active = $request->input("active");

            $widgetKey = generateSecureAlphanumeric();

            if($widgetType == "popup"){
                //create code snippet for widget
                $widgetjs = url('widget.js');
                $codeSnippet = '<script>
                (function () {
                    var s = document.createElement("script");
                    s.src = "'.$widgetjs.'";
                    s.async = true;
                    s.onload = function () {
                    window.initAutomationWidget({ key: "'.$widgetKey.'" });
                    };
                    document.head.appendChild(s);
                })();
                </script>';
            }
            
            if($widgetType == "webhook"){
                $widgetjs = url('widget.js');
                $codeSnippet = '<!-- Define fields to collect -->
                <script>
                window.MySelectedInputs = '.json_encode($checkedFields).';
                window.MyWebhookExtras = {
                    type:"webhook"
                    page_url: window.location.href,
                    referrer: document.referrer,
                    key: "'.$widgetKey.'"
                };
                </script>
                <!-- Load the webhook widget -->
                <script src="'.$widgetjs.'" async=true></script>
                ';
            }
            

            //http://local.laravelmautic.com/api/contactform?key=0296b59745aff24e

            if($widgetType == "webform"){
                $codeSnippet = url("/api/contactform?key=".$widgetKey);
            }

            $widgetObj = new widgets_model();
            //$widgetObj->id = '';
            $widgetObj->widgetKey = $widgetKey;
            $widgetObj->name = $widgetName;
            $widgetObj->website = $widgetWebsite;
            $widgetObj->purpose = $widgetPurpose;
            $widgetObj->active = $active;
            $widgetObj->validate = 0;
            $widgetObj->parametersRequired = 1;
            $widgetObj->parameters = json_encode($checkedFields);
            $widgetObj->type = $widgetType;
            $widgetObj->description = $widgetDescription;
            $widgetObj->widgetHeading = $widgetHeading;
            $widgetObj->snippetCode = $codeSnippet;
            $widgetObj->created_by = $userId;
            $widgetObj->created_by_user = $fullName;
            $widgetObj->created_by_company = $userCompany;
            $widgetObj->modified_by = $userId; 
            $widgetObj->modified_by_user = $fullName;
            $widgetObj->date_added = $today;
            $widgetObj->date_modified = $today;
            $saved = $widgetObj->save();
            
            if($saved){

                $response = [
                    'C' => 100,
                    'M' => $this->ERRORS[137],
                    'R' => ["widgetKey" => $widgetKey, "codeSnippet" => $codeSnippet],
                ];
            }else{
                $response = [
                    'C' => 102,
                    'M' => $this->ERRORS[138],
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

    function edit($id){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');
             
            if ($isAdmin > 0) {
                $widgetObj = widgets_model::where("created_by_company", $userCompany)->where("id", $id)->first();
            } else {
                $widgetObj = widgets_model::where("created_by", $this->USERID)->where("id", $id)->first();
            }

            if($widgetObj){
                
                $data["widgetsUrl"] = url('widgets');
                $data["widget"] = $widgetObj;
                
                return Inertia::render('EditWidget', [
                    'pageTitle'  => 'Edit Widget',
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

            $id = $request->input("id");
            $name = $request->input("widgetName");
            $purpose = $request->input("widgetPurpose");
            $website = $request->input("widgetWebsite");
            $active = $request->input("active");

            $updateData = array(
                "name" => $name,
                "purpose" => $purpose,
                "website" => $website,
                "active" => $active,
                "date_modified" => $today,
                "modified_by" => $this->USERID,
                "modified_by_user" => $fullName
            );

            widgets_model::where("created_by_company",$userCompany)->where("id",$id)->update($updateData);

            $response = [
                'C' => 100,
                'M' => $this->ERRORS[139],
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