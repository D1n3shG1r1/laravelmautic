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
use App\Models\tags_model;
use App\Models\tags_contacts_model;
use App\Models\segment_contacts_model;
use App\Models\role_model;
use Illuminate\Support\Facades\DB;
class Contacts extends Controller
{
    var $ERRORS = [];
    var $USERID = 0;
    function __construct(){
        parent::__construct();    
        $this->ERRORS = config("errormessage");
        $this->USERID = $this->getSession('userId');
    }

    function contacts(Request $request) {
        if ($this->USERID <= 0) {
            return Redirect::to(url('signin'));
        }
    
        $csrfToken = csrf_token();
        $userCompany = $this->getSession('companyId');
        $isAdmin = $this->getSession('isAdmin');
    
        // Build base query
        $query = contacts_model::select("id", "title", "firstname", "lastname", "email", "date_added", "created_by_user");
    
        // Apply user/company filter
        if ($isAdmin > 0) {
            $query->where("created_by_company", $userCompany);
        } else {
            $query->where("created_by", $this->USERID);
        }
        $query->orderBy("date_added","desc");

        // Paginate contacts
        $contactsPaginator = $query->paginate(10);
        $contacts = $contactsPaginator->items();
        $contactIds = array_column($contacts, 'id');
    
        // Fetch tags for contacts using a single JOIN query
        $tags = DB::table('tags_contacts')
            ->join('tags', 'tags.id', '=', 'tags_contacts.tag_id')
            ->whereIn('tags_contacts.contact_id', $contactIds)
            ->select('tags_contacts.contact_id', 'tags.id as tag_id', 'tags.tag')
            ->get()
            ->groupBy('contact_id');
    
        // Format contact data
        foreach ($contacts as &$contact) {
            $contact->date_added = date('M d, y', strtotime($contact->date_added));
            $contact->tags = $tags[$contact->id] ?? [];
        }
    
        // Replace paginator items with formatted ones
        $contactsPaginator->setCollection(collect($contacts));
    
        $data = [
            "contactsUrl" => url('contacts'),
            "contacts" => $contactsPaginator,
        ];
    
        return Inertia::render('Contacts', [
            'pageTitle' => 'Contacts',
            'csrfToken' => $csrfToken,
            'params' => $data,
        ]);
    }

    function new(Request $request){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            if ($isAdmin > 0) {
                $tags = tags_model::select("id","tag")->where("created_by_company", $userCompany)->get();
            } else {
                $tags = tags_model::select("id","tag")->where("created_by", $this->USERID)->get();
            }
            
            $data = array();
            $data["contactsUrl"] = url('contacts');
            $data["tags"] = $tags;
            
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
            $today = date("Y-m-d H:i:s");

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
            $company = $request->input("company");
            $tags = $request->input("tags");
            

            // Define the validation rules
            $rules = [
                'title' => 'required|string|min:2|max:50',
                'firstname' => 'required|string|min:2|max:50',
                'lastname' => 'required|string|min:2|max:50',
                'email' => 'required|email|unique:contacts,email',
                'address1' => 'nullable|string|min:2|max:50',
                'address2' => 'nullable|string|min:2|max:50',
                'city' => 'nullable|string|min:2|max:50',
                'state' => 'nullable|string|min:2|max:50',
                'zip' => 'nullable|string|min:2|max:50',
                'country' => 'nullable|string|min:2|max:50',
                'mobile' => 'nullable|string|min:10|max:15',
                'company' => 'nullable|string|min:2|max:50',
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
                    $contactObj->company = $company;
                    $contactObj->is_published = 1;
                    $contactObj->date_added = $today;
                    $contactObj->created_by = $this->USERID;
                    $contactObj->created_by_user = $fullName; 
                    $contactObj->created_by_company = $userCompany;
                    $contactObj->points = 0;
                    $saved = $contactObj->save();
                    $conatctId = $contactObj->id;
                    
                    if($saved){
                        if(!empty($tags)){
                                
                            // Separate numeric IDs and text tags
                            $existingTags = array_filter($tags, 'is_numeric'); // IDs that are already in the database
                            $newTags = array_filter($tags, function($value) { return !is_numeric($value); }); // New tags
                            
                            // Save new tags in the database
                            $newTagIds = [];
                            
                            foreach ($newTags as $newTag) {
                                // Check if the tag already exists in DB (optional: if you want to avoid duplicates)
                                
                                /*if($isAdmin == 1){
                                    // Admin tags are created under 'created_by_company' with a company ID
                                    $tag = tags_model::where("created_by_company", $userCompany)
                                    ->firstOrCreate(['tag' => $newTag]);
                                }else{
                                    // Non-admin tags are created under 'created_by' with a user ID
                                    $tag = tags_model::where("created_by", $this->USERID)
                                    ->firstOrCreate(['tag' => $newTag]);
                                }*/
                                
                                $tagObj = new tags_model();
                                //$tagObj->id
                                $tagObj->tag = strtolower($newTag);
                                $tagObj->description = strtolower($newTag);
                                $tagObj->date_added = $today;
                                $tagObj->created_by = $this->USERID;
                                $tagObj->created_by_user = $fullName;
                                $tagObj->created_by_company = $userCompany;
                                $tagObj->date_modified = $today;
                                $tagObj->modified_by = $this->USERID;
                                $tagObj->modified_by_user = $fullName;
                                $tagObj->save();
                                //$tagObj->id;
                                // Collect the newly created or existing tag IDs
                                $newTagIds[] = $tagObj->id;
                                
                            }

                            // Now we merge the existing tags and newly created tags IDs
                            $finalTags = array_merge($existingTags, $newTagIds);

                            $batchRows = [];
                            foreach($finalTags as $finalTag){
                                $batchRows[] = [  
                                    "tag_id" => $finalTag,
                                    "contact_id" => $conatctId,
                                ];
                            }

                            $tagsSaved = tags_contacts_model::insert($batchRows);

                            
                        }
                    }

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

    function importcontacts(Request $request){

        if($this->USERID > 0){
            $userCompany = $this->getSession('companyId');
            $firstName = $this->getSession('firstName');
            $lastName = $this->getSession('lastName');
            $fullName = $firstName." ".$lastName; 
            $today = date("Y-m-d H:i:s");

            $importData = $request->input("importData");
            
            if(!empty($importData)){
                //check if email is already exist
                $emailsArr = [];
                foreach($importData as $importRw){
                    $emailsArr[] = $importRw["Email"];
                }

                //get records by email
                $existingContactsObj = contacts_model::select("email")->whereIn("emails",$emailsArr)->get();

                dd($existingContactsObj);
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
            
            if ($isAdmin > 0) {
                $contactObj = contacts_model::where("created_by_company", $userCompany)->where("id", $id)->first();
            } else {
                $contactObj = contacts_model::where("created_by", $this->USERID)->where("id", $id)->first();
            }

            if ($isAdmin > 0) {
                $tags = tags_model::select("id","tag")->where("created_by_company", $userCompany)->get();
            } else {
                $tags = tags_model::select("id","tag")->where("created_by", $this->USERID)->get();
            }

            if($contactObj){
                $contactTags = array();
                $contactTagsObj = tags_contacts_model::select("tag_id")->where("contact_id", $id)->get();
                if($contactTagsObj){
                    foreach($contactTagsObj as $contactTag){
                        $contactTags[] = $contactTag["tag_id"];
                    }
                }

                $data["contactsUrl"] = url('contacts');
                $data["contact"] = $contactObj;
                $data["tags"] = $tags;
                $data["contactTags"] = $contactTags;
                
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
        if($this->USERID > 0){
            
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');
            $firstName = $this->getSession('firstName');
            $lastName = $this->getSession('lastName');
            $fullName = $firstName." ".$lastName; 
            $today = date("Y-m-d H:i:s");

            $id = $request->input("id");
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
            $company = $request->input("company");
            $tags = $request->input("tags");

            // Define the validation rules
            $rules = [
                'title' => 'required|string|min:2|max:50',
                'firstname' => 'required|string|min:2|max:50',
                'lastname' => 'required|string|min:2|max:50',
                'email' => 'required|email|unique:contacts,email,'.$id,
                'address1' => 'nullable|string|min:2|max:50',
                'address2' => 'nullable|string|min:2|max:50',
                'city' => 'nullable|string|min:2|max:50',
                'state' => 'nullable|string|min:2|max:50',
                'zip' => 'nullable|string|min:2|max:50',
                'country' => 'nullable|string|min:2|max:50',
                'mobile' => 'nullable|string|min:10|max:15',
                'company' => 'nullable|string|min:2|max:50',
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

                $updateData = array(
                    "title" => $title,
                    "firstname" => $firstname,
                    "lastname" => $lastname,
                    "email" => $email,
                    "address1" => $address1,
                    "address2" => $address2,
                    "city" => $city,
                    "state" => $state,
                    "zipcode" => $zip,
                    "country" => $country,
                    "mobile" => $mobile,
                    "company" => $company,
                    "date_modified" => $today,
                    "modified_by" => $this->USERID,
                    "modified_by_user" => $fullName
                );

                
                contacts_model::where("created_by_company",$userCompany)->where("id",$id)->update($updateData);

                // delete old entries and insert new one
                $deleted = tags_contacts_model:: where("contact_id", $id)->delete();
                if(!empty($tags)){
                    
                    // Separate numeric IDs and text tags
                    $existingTags = array_filter($tags, 'is_numeric'); // IDs that are already in the database
                    $newTags = array_filter($tags, function($value) { return !is_numeric($value); }); // New tags
                    
                    // Save new tags in the database
                    $newTagIds = [];
                    
                    foreach ($newTags as $newTag) {
                        // Check if the tag already exists in DB (optional: if you want to avoid duplicates)
                          
                        /*if($isAdmin == 1){
                            // Admin tags are created under 'created_by_company' with a company ID
                            $tag = tags_model::where("created_by_company", $userCompany)
                            ->firstOrCreate(['tag' => $newTag]);
                        }else{
                            // Non-admin tags are created under 'created_by' with a user ID
                            $tag = tags_model::where("created_by", $this->USERID)
                            ->firstOrCreate(['tag' => $newTag]);
                        }*/
                        
                        $tagObj = new tags_model();
                        //$tagObj->id
                        $tagObj->tag = strtolower($newTag);
                        $tagObj->description = strtolower($newTag);
                        $tagObj->date_added = $today;
                        $tagObj->created_by = $this->USERID;
                        $tagObj->created_by_user = $fullName;
                        $tagObj->created_by_company = $userCompany;
                        $tagObj->date_modified = $today;
                        $tagObj->modified_by = $this->USERID;
                        $tagObj->modified_by_user = $fullName;
                        $tagObj->save();
                        //$tagObj->id;
                        // Collect the newly created or existing tag IDs
                        $newTagIds[] = $tagObj->id;
                        
                    }

                    // Now we merge the existing tags and newly created tags IDs
                    $finalTags = array_merge($existingTags, $newTagIds);

                    $batchRows = [];
                    foreach($finalTags as $finalTag){
                        $batchRows[] = [  
                            "tag_id" => $finalTag,
                            "contact_id" => $id,
                        ];
                    }

                    $tagsSaved = tags_contacts_model::insert($batchRows);

                }else{
                    $finalTags = [];
                }


                $response = [
                    'C' => 100,
                    'M' => $this->ERRORS[118],
                    'R' => [],
                ];
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
    
    function delete(Request $request){
        
        if($this->USERID > 0){
        
            $id = $request->input("id");
        
            //delete contact-tag        
            tags_contacts_model::where("contact_id", $id)->delete();
            
            //delete contact-segment
            segment_contacts_model::where("contact_id", $id)->delete();

            //delete contact
            $deleted = contacts_model::where("id", $id)->delete();

            if($deleted){
                $response = [
                    'C' => 100,
                    'M' => $this->ERRORS[121],
                    'R' => [],
                ];
            }else{
                $response = [
                    'C' => 101,
                    'M' => $this->ERRORS[122],
                    'R' => [],
                ];
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

}
