<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

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
        
            $data = array(
                'count' => 10
            );

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
