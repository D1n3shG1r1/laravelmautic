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

    function tags(Request $request){

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
                    $rw["date_added"] = date("F d, Y");
                }

                foreach($tagsObj["data"] as &$rww){
                    // Count contacts for each segment
                    $count = tags_contacts_model::where("tag_id", $rww["id"])->count();
        
                    $rww["contacts"] = $count;
                }
            }

            //echo "tagsObj:<pre>"; print_r($tagsObj); die;
            
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

    }
    
    function tag(Request $request){

    }
    
    function update(Request $request){

    }
    
    function delete(Request $request){

    }
}