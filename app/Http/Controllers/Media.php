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
        
        if($this->USERID > 0){
        
            $userId = $this->USERID;
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            $base64Image = $request->input("base64");

            $fileId = db_randnumber();

            // Strip off the base64 prefix
            $imageData = explode(';base64,', $base64Image);
            $imageDataPart1 = $imageData[0];
            $imageDataPart1Arr = explode('/', $imageDataPart1);
            $fileExt = $imageDataPart1Arr[1];
            $imageData = $imageData[1];
            $imageName = $fileId.'.'.$fileExt; 
            // Decode the base64 string into an image
            $decodedImage = base64_decode($imageData);
            
            // Define the dynamic path for storing the image
            $directory = 'company-assets/' . $userCompany . '/images/emails/';

            // Ensure the directory structure exists on the public disk
            Storage::disk('public')->makeDirectory($directory);

            // Store the image in the public folder, making it publicly accessible
            Storage::disk('public')->put($directory . $imageName, $decodedImage);
            
            $path = $directory . $imageName;
            $storagePath = Storage::url($path);
            $imgUrl = url($storagePath);
            //echo 'imgUrl:' . $imgUrl;

            $response = [
                'C' => 100,
                'M' => '',
                'R' => ['imagepath' => $imgUrl],
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
