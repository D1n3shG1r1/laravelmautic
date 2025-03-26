<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use App\Models\emailsbuilder_model;

//use App\Models\contacts_model;
//use App\Models\segments_model;
//use App\Models\segment_contacts_model;
//use App\Models\role_model;

class Emailsbuilder extends Controller
{
    var $ERRORS = [];
    var $USERID = 0;
    function __construct(){
        parent::__construct();    
        $this->ERRORS = config("errormessage");
        $this->USERID = $this->getSession('userId');
    }

    function Emails(Request $request){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            if ($isAdmin > 0) {
                $emailsObj = emailsbuilder_model::where("created_by_company", $userCompany)->paginate(10)->toArray();
            } else {
                $emailsObj = emailsbuilder_model::where("created_by", $this->USERID)->paginate(10)->toArray();
            }
            
            if(!empty($emailsObj["data"])){

                $segmentIds = array();

                foreach($emailsObj["data"] as &$rw){
                    $segmentIds[] = $rw;
                    $rw["date_added"] = date("F d, Y");
                }

                foreach($emailsObj["data"] as &$rww){
                    // Count contacts for each segment
                    $count = emailsbuilder_model::where("segment_id", $rww["id"])->count();
        
                    $rww["contacts"] = $count;
                }
            }

            //echo "segmentsObj:<pre>"; print_r($segmentsObj); die;
            
            $data = array();
            $data["emails"] = $emailsObj;
            $data["emailsUrl"] = url('emails');
            return Inertia::render('Emails', [
                'pageTitle'  => 'Emails',
                'csrfToken' => $csrfToken,
                'params' => $data
            ]);

        }else{
            //redirect to signin
            return Redirect::to(url('signin'));
        }
    }

    function new(Request $request){

        if ($this->USERID > 0) {
            $csrfToken = csrf_token();

            $themesData = [];
            $themesNames = ["blank", "brienz", "confirm_me"];
            
            foreach ($themesNames as $themeName) {
                $templatePath = public_path('themes/'.$themeName . '/' . $themeName . '.html');
                
                if (file_exists($templatePath)) {
                    
                    $html = fileRead($templatePath);
                    
                    $thumbnailPath = url('themes/'.$themeName . '/thumbnail.png');
                
                    // Add theme data to the array
                    $themesData[] = [
                        'name' => str_replace('_', ' ', $themeName),
                        'id' => $themeName,
                        'html' => $html,
                        'css' => '',
                        'thumbnail' => $thumbnailPath,
                    ];
                }
            }
            
            $data = [];
            $data["emailsUrl"] = url('emails');
            $data["themes"] = $themesData;

            return Inertia::render('NewEmail', [
                'pageTitle' => 'New Email',
                'csrfToken' => $csrfToken,
                'params' => $data,
            ]);

        } else {
            // Redirect to the sign-in page if the user is not authenticated
            return Redirect::to(url('signin'));
        }
    }


    function edit(Request $request){

    }

    function save(Request $request){

        if($this->USERID > 0){
            
            $userCompany = $this->getSession('companyId');
            $firstName = $this->getSession('firstName');
            $lastName = $this->getSession('lastName');
            $fullName = $firstName." ".$lastName; 
            $today = date("Y-m-d");

            $emailType = $request->input('emailType');
            $templateName = $request->input('templateName');
            $html = $request->input('html');
            $css = $request->input('css');
            $subject = $request->input('subject');
            $internalname = $request->input('internalname');
            $activateat = $request->input('activateat');
            $deactivateat = $request->input('deactivateat');
            $fromname = $request->input('fromname');
            $fromaddress = $request->input('fromaddress');
            $replytoaddress = $request->input('replytoaddress');
            $bccaddress = $request->input('bccaddress');
            $attachments = $request->input('attachments');
            $plaintext = $request->input('plaintext');
            
            $html = str_replace('\"','"',$html);
            $html = str_replace('\n','',$html);

            $emailObj = new emailsbuilder_model();
            $emailObj->is_published = 1;
            $emailObj->date_added = $today;
            $emailObj->created_by = $this->USERID;
            $emailObj->created_by_user = $fullName;
            $emailObj->created_by_company = $userCompany;
            $emailObj->name = $internalname;
            $emailObj->description = $internalname."-".$subject;
            $emailObj->subject = $subject;
            $emailObj->from_address = $fromaddress;
            $emailObj->from_name = $fromname;
            $emailObj->reply_to_address = $replytoaddress;
            $emailObj->bcc_address = $bccaddress;
            $emailObj->use_owner_as_mailer = 0;
            $emailObj->template = $templateName;
            $emailObj->plain_text = $plaintext;
            $emailObj->custom_html = $html;
            $emailObj->email_type = $emailType;
            $emailObj->publish_up = $activateat;
            $emailObj->publish_down = $deactivateat;
            $emailObj->read_count = 0;
            $emailObj->sent_count = 0;
            $emailObj->variant_sent_count = 0;
            $emailObj->variant_read_count = 0;
            $emailObj->revision = 0;
            $emailObj->lang = 'en';
            $emailObj->headers = '{}';
            $emailObj->save();
            $emailId = $emailObj->id;

            $response = [
                'C' => 100,
                'M' => $this->ERRORS[109],
                'R' => [],
            ];
            
            /*
            id
            category_id
            translation_parent_id
            variant_parent_id
            unsubscribeform_id
            preference_center_id
            is_published
            date_added
            created_by
            created_by_user
            date_modified
            modified_by
            modified_by_user
            checked_out
            checked_out_by
            checked_out_by_user
            name
            description
            subject
            from_address
            from_name
            reply_to_address
            bcc_address
            use_owner_as_mailer
            template
            content
            utm_tags
            plain_text
            custom_html
            email_type
            publish_up
            publish_down
            read_count
            sent_count
            variant_sent_count
            variant_read_count
            revision
            lang
            variant_settings
            variant_start_date
            dynamic_content
            headers
            public_preview
            */
            


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

    function update(Request $request){
        //111
    }

    function delete(Request $request){
        //110
    }
}