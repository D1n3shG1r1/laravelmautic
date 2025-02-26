<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

use App\Models\user_model;
use App\Models\role_model;
use App\Models\company_model;

class Register extends Controller
{
    var $ERRORS = [];
    function __construct(){
        parent::__construct();    
        $this->ERRORS = config("errormessage");
    }

    function Signup_get(Request $request){
        $csrfToken = csrf_token();
        $data = array(
            'signinUrl' => url('signin'),
        );

        return Inertia::render('Signup', [
            'pageTitle'  => 'Signup',
            'csrfToken' => $csrfToken,
            'params' => $data
        ]);
    }

    function Signup_post(Request $request){
        
        $firstName = strtolower($request->input("firstName"));
        $lastName = strtolower($request->input("lastName"));
        $company = strtolower($request->input("company"));
        $email = strtolower($request->input("email"));
        $password = $request->input("password");
        $confirmpassword = $request->input("password_confirmation ");
    
        // Define the validation rules
        $rules = [
            'firstName' => 'required|string|min:2|max:50',
            'lastName' => 'required|string|min:2|max:50',
            'company' => 'required|string|min:2|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|max:32|confirmed',
        ];

        // Create the validator instance
        $validator = Validator::make($request->all(), $rules);        
    
         // Check if validation fails
        if ($validator->fails()) {
            // Return a JSON response with errors
            $response = [
                'C' => 102,
                'M' => $this->ERRORS[102],
                'R' => $validator->errors(),
            ];
            
        }else{
            //check if email is already associated
            
            $rowObj = user_model::where("email",$email)->first();
            if($rowObj){
                //email is already associated with us
                $response = [
                    'C' => 101,
                    'M' => $this->ERRORS[101],
                    'R' => [],
                ];
            }else{

                $currentDateTime = date("Y-m-d H:i:s");
                $published = 1;
                $isAdmin = 1;
                $password = sha1($password);

                //save to user
                $userObj = new user_model();
                //$userObj->id
                $userObj->role_id = null;
                $userObj->company_id = null;
                $userObj->is_published = 1;
                $userObj->date_added = $currentDateTime;
                $userObj->created_by = null;
                $userObj->created_by_user = null;
                $userObj->date_modified = null;
                $userObj->modified_by = null;
                $userObj->modified_by_user = null;
                $userObj->checked_out = null;
                $userObj->checked_out_by = null;
                $userObj->checked_out_by_user = null;
                $userObj->username = $email; //save email as username
                $userObj->password = $password;
                $userObj->first_name = $firstName;
                $userObj->last_name = $lastName;
                $userObj->email = $email;
                $userObj->position = null;
                $userObj->timezone = null;
                $userObj->locale = null;
                $userObj->last_login = null;
                $userObj->last_active = null;
                $userObj->preferences = null;
                $userObj->signature = null;
            
                $save = $userObj->save();
                $userId = $userObj->id;
                if($save){
                    //save role
                    $roleObj = new role_model();
                    $roleObj->is_published = $published;
                    $roleObj->date_added = $currentDateTime;
                    $roleObj->created_by = null;
                    $roleObj->created_by_user = null;
                    $roleObj->date_modified = null;
                    $roleObj->modified_by = null;
                    $roleObj->modified_by_user = null;
                    $roleObj->checked_out = null;
                    $roleObj->checked_out_by = null;
                    $roleObj->checked_out_by_user = null;
                    $roleObj->name = "Administrator";
                    $roleObj->description = "Full system access";
                    $roleObj->is_admin = $isAdmin;
                    $roleObj->readable_permissions = "N";
                    $roleSave = $roleObj->save();
                    $roleId = $roleObj->id;
                
                    if($roleSave){
                        //save company
                        $companyObj = new company_model();
                        $companyObj->name = $company;
                        $companyObj->description = null;
                        $companyObj->website = null;
                        $companyObj->save();
                        $companyId = $companyObj->id;
                        
                        //update roll-id and company-id in users table
                        $updateData = array("role_id" => $roleId, "company_id" => $companyId);
                        user_model::where("id",$userId)->update($updateData);
                    }
                }
                
                $response = [
                    'C' => 100,
                    'M' => $this->ERRORS[100],
                    'R' => [],
                ];    
            }
        }
        
        return response()->json($response); die;
    }

    function Signin_get(Request $request){
        $csrfToken = csrf_token();
        $data = array(
            'dashboardUrl' => url('dashboard'),
        );

        return Inertia::render('Signin', [
            'pageTitle'  => 'Signin',
            'csrfToken' => $csrfToken,
            'params' => $data
        ]);
    }

    function Signin_post(Request $request){
        
        $email = $request->input("email");
        $password = $request->input("password");
        $password = sha1($password);

        $rowObj = user_model::select("id","role_id","company_id","email","first_name","last_name")->where("email",$email)->where("password",$password)->first();        
        if($rowObj){

            $user = $rowObj->toArray();
            $userId = $user["id"];
            $roleId = $user["role_id"];
            $companyId = $user["company_id"];
            $userEmail = $user["email"];
            $firstName = $user["first_name"];
            $lastName = $user["last_name"];
        
            //get user role
            $roleData = role_model::select("name", "is_admin")->where("id",$roleId)->first();
            $isAdmin = $roleData["is_admin"];
            $roleName = $roleData["name"];
            
            $this->setSession('userId',$userId);
            $this->setSession('roleId',$roleId);
            $this->setSession('isAdmin',$isAdmin);
            $this->setSession('roleName',$roleName);
            $this->setSession('companyId',$companyId);
            $this->setSession('userEmail',$userEmail);
            $this->setSession('firstName',$firstName);
            $this->setSession('lastName',$lastName);


            $response = [
                'C' => 100,
                'M' => $this->ERRORS[103],
                'R' => [],
            ];

        }else{
            $response = [
                'C' => 101,
                'M' => $this->ERRORS[104],
                'R' => [],
            ];
        }
        
        return response()->json($response); die;
    }
}
