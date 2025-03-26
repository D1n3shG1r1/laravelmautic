<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
class Media extends Controller
{
    var $ERRORS = [];
    var $USERID = 0;
    function __construct(){
        parent::__construct();    
        $this->ERRORS = config("errormessage");
        $this->USERID = $this->getSession('userId');
    }

    function save(Request $request){
        $userId = $this->USERID;
        $userCompany = $this->getSession('companyId');
        $isAdmin = $this->getSession('isAdmin');
        
        // Validate the uploaded file
        /*$request->validate([
            'asset' => 'required|file|mimes:jpeg,png,jpg|max:2048',
        ]);*/

        // Create a user-specific directory (e.g., user-assets/{user_id})
        $directory = 'user-assets/' . $userCompany . '/' . $userId;

        // Store the file in the user's directory
        $path = $request->file('asset')->store($directory, 'public');

        //Storage::url($path)

    }
}
