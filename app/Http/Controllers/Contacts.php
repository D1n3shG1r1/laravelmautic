<?php
/* just for ref
$this->setSession('userId',$userId);
$this->setSession('roleId',$roleId);
$this->setSession('companyId',$companyId);
$this->setSession('userEmail',$userEmail);
$this->setSession('firstName',$firstName);
$this->setSession('lastName',$lastName);
*/
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

use App\Models\contacts_model;
use App\Models\role_model;
class Contacts extends Controller
{
    var $ERRORS = [];
    var $USERID = 0;
    function __construct(){
        parent::__construct();    
        $this->ERRORS = config("errormessage");
        $this->USERID = $this->getSession('userId');
    }

    function contacts(Request $request){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            if ($isAdmin > 0) {
                $contactsObj = contacts_model::where("created_by_company", $userCompany)->paginate(10)->toArray();
            } else {
                $contactsObj = contacts_model::where("created_by", $this->USERID)->paginate(10)->toArray();
            }
            
            $data = array();
            $data["contacts"] = $contactsObj;

            return Inertia::render('Contacts', [
                'pageTitle'  => 'Contacts',
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
            
            return Inertia::render('NewContact', [
                'pageTitle'  => 'New Contact',
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
            $userCompany = $this->getSession('companyId');
            $firstName = $this->getSession('firstName');
            $lastName = $this->getSession('lastName');
            $fullName = $firstName." ".$lastName; 
            $today = date("Y-m-d");

            $title = $request->input("title");
            $firstname = $request->input("firstname");
            $lastname = $request->input("lastname");
            $email = $request->input("email");
            $address1 = $request->input("address1");
            $address2 = $request->input("address2");
            $city = $request->input("city");
            $state = $request->input("state");
            $zip = $request->input("zipcode");
            $country = $request->input("country");
            $mobile = $request->input("mobile");

            // Define the validation rules
            $rules = [
                'title' => 'required|string|min:2|max:50',
                'firstname' => 'required|string|min:2|max:50',
                'lastname' => 'required|string|min:2|max:50',
                'email' => 'required|email|unique:users,email',
                'address1' => 'nullable|string|min:2|max:50',
                'address2' => 'nullable|string|min:2|max:50',
                'city' => 'nullable|string|min:2|max:50',
                'state' => 'nullable|string|min:2|max:50',
                'zip' => 'nullable|string|min:2|max:50',
                'country' => 'nullable|string|min:2|max:50',
                'mobile' => 'nullable|string|min:10|max:15',
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

                //check if contact email is already associated
                
                $rowObj = contacts_model::where("email",$email)->first();
                if($rowObj){
                    //conatct email is already associated with us
                    $response = [
                        'C' => 101,
                        'M' => $this->ERRORS[101],
                        'R' => [],
                    ];
                }else{

                    $contactObj = new contacts_model();
                    $contactObj->title = $title;
                    $contactObj->firstname = $firstname;
                    $contactObj->lastname = $lastname;
                    $contactObj->email = $email;
                    $contactObj->address1 = $address1;
                    $contactObj->address2 = $address2;
                    $contactObj->city = $city;
                    $contactObj->state = $state;
                    $contactObj->zipcode = $zip;
                    $contactObj->country = $country;
                    $contactObj->mobile = $mobile;
                    $contactObj->is_published = 1;
                    $contactObj->date_added = $today;
                    $contactObj->created_by = $this->USERID;
                    $contactObj->created_by_user = $fullName; 
                    $contactObj->created_by_company = $userCompany;
                    $contactObj->points = 0;
                    $contactObj->save();
                    $conatctId = $contactObj->id;

                    $response = [
                        'C' => 100,
                        'M' => $this->ERRORS[105],
                        'R' => [],
                    ];
                }
                    
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

    function contact($id){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');
             //tags_contacts_model
            if ($isAdmin > 0) {
                $contactObj = contacts_model::where("created_by_company", $userCompany)->where("id", $id)->first();
            } else {
                $contactObj = contacts_model::where("created_by", $this->USERID)->where("id", $id)->first();
            }

            if($contactObj){
                
                $data["contactsUrl"] = url('contacts');
                $data["contact"] = $contactObj;
                
                //echo "<pre>"; print_r($data); die;

                return Inertia::render('EditContact', [
                    'pageTitle'  => 'Edit Contact',
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

    }
    
    function delete(Request $request){

    }
}
