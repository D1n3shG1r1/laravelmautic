<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use App\Models\emailsbuilder_model;

//use App\Models\contacts_model;
//use App\Models\segments_model;
//use App\Models\segment_contacts_model;
//use App\Models\role_model;

class Emailsbuilder extends Controller
{
    var $ERRORS = [];
    var $USERID = 0;
    function __construct(){
        parent::__construct();    
        $this->ERRORS = config("errormessage");
        $this->USERID = $this->getSession('userId');
    }

    function Emails(Request $request){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            if ($isAdmin > 0) {
                $emailsObj = emailsbuilder_model::where("created_by_company", $userCompany)->paginate(10)->toArray();
            } else {
                $emailsObj = emailsbuilder_model::where("created_by", $this->USERID)->paginate(10)->toArray();
            }
            
            if(!empty($emailsObj["data"])){

                $segmentIds = array();

                foreach($emailsObj["data"] as &$rw){
                    $segmentIds[] = $rw;
                    $rw["date_added"] = date("F d, Y");
                }

                foreach($emailsObj["data"] as &$rww){
                    // Count contacts for each segment
                    $count = emailsbuilder_model::where("segment_id", $rww["id"])->count();
        
                    $rww["contacts"] = $count;
                }
            }

            //echo "segmentsObj:<pre>"; print_r($segmentsObj); die;
            
            $data = array();
            $data["emails"] = $emailsObj;
            $data["emailsUrl"] = url('emails');
            return Inertia::render('Emails', [
                'pageTitle'  => 'Emails',
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
        
            $data = array();
            $data["emailsUrl"] = url('emails');
            
            return Inertia::render('NewEmail', [
                'pageTitle'  => 'New Email',
                'csrfToken' => $csrfToken,
                'params' => $data
            ]);

        }else{
            //redirect to signin
            return Redirect::to(url('signin'));
        }
    }

    function edit(Request $request){

    }

    function save(Request $request){

    }

    function update(Request $request){

    }

    function delete(Request $request){

    }
}