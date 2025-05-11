<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;

use App\Models\campaigns_model;
use App\Models\contacts_model;
use App\Models\segments_model;
use App\Models\tags_model;
use App\Models\role_model;

use Facade\FlareClient\View;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;


class Dashboard extends Controller
{
    var $ERRORS = [];
    var $USERID = 0;
    function __construct(){
        parent::__construct();    
        $this->ERRORS = config("errormessage");
        $this->USERID = $this->getSession('userId');
    }

    function dashboard(Request $request){

        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            $contactsCount = 0;
            $segmentsCount = 0;
            $campaignsCount = 0;
            $tagsCount = 0;

            if ($isAdmin > 0) {
                
                $contactsCount = contacts_model::where("created_by_company", $userCompany)->count();
                $segmentsCount = segments_model::where("created_by_company", $userCompany)->count();

                $campaignsCount = campaigns_model::where("created_by_company", $userCompany)->count();
                $tagsCount = tags_model::where("created_by_company", $userCompany)->count();

            } else {

                $contactsCount = contacts_model::where("created_by", $this->USERID)->count();
                $segmentsCount = segments_model::where("created_by", $this->USERID)->count();
                $campaignsCount = campaigns_model::where("created_by", $this->USERID)->count();
                $tagsCount = tags_model::where("created_by", $this->USERID)->count();
            }
            
            $data = array();
            $data["contactsCount"] = $contactsCount;
            $data["segmentsCount"] = $segmentsCount;
            $data["campaignsCount"] = $campaignsCount;
            $data["tagsCount"] = $tagsCount;
            
            return Inertia::render('Dashboard', [
                'PageTitle'  => 'Dashboard',
                'csrfToken' => $csrfToken,
                'Params' => $data
            ]);
            
        }else{
            //redirect to signin
            return Redirect::to(url('signin'));
        }

    }
}
