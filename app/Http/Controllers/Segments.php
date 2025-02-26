<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

use App\Models\contacts_model;
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
        
    }

    function new(Request $request){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
        
            $data = array();
            
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
        
    }
}
