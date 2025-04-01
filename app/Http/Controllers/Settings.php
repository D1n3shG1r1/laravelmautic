<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

use App\Models\settings_model;
use App\Models\role_model;

class Settings extends Controller
{
    var $ERRORS = [];
    var $USERID = 0;
    function __construct(){
        parent::__construct();    
        $this->ERRORS = config("errormessage");
        $this->USERID = $this->getSession('userId');
    }

    function settings(Request $request){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            $data = array();
            
            return Inertia::render('Settings', [
                'pageTitle'  => 'Settings',
                'csrfToken' => $csrfToken,
                'params' => $data
            ]);
        }else{
            //redirect to signin
            return Redirect::to(url('signin'));
        }
    }
}