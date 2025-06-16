<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

use App\Models\settings_model;
use App\Models\role_model;
use App\Traits\SmtpConfigTrait;

class Settings extends Controller
{
    use SmtpConfigTrait;
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

            $settings = settings_model::where("created_by_company", $userCompany)->first();
            
            $smtp = array(
                "fromname"=>"",
                "fromemailaddress"=>"",
                "replytoaddress"=>"",
                "emailreturnpath"=>"",
                "dsnscheme"=>"",
                "dsnhost"=>"",
                "dsnport"=>"",
                "dsnpath"=>"",
                "dsnuser"=>"",
                "dsnpassword"=>"",
                "brevoapikey" => ""
            );
            
            if($settings){
                $smtp = json_decode($settings["smtp"], true);
            }

            $mailerDsn = $smtp["dsnscheme"].'://'. $smtp["dsnuser"] . ':' . $smtp["dsnpassword"] .'@'. $smtp["dsnhost"] . ':'. $smtp["dsnport"];

            $data = array();
            $data["smtp"] = $smtp;
            $data["usescipsmtp"] = $settings["usescipsmtp"];
            $data["mailerDsn"] = $mailerDsn;

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

    function updateEmaildsn(Request $request){
        if($this->USERID > 0){
            
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $firstName = $this->getSession('firstName');
            $lastName = $this->getSession('lastName');
            $fullName = $firstName." ".$lastName; 
            $today = date("Y-m-d");

            $fromname = $request->input('fromname');
            $fromemailaddress = $request->input('fromemailaddress');
            $replytoaddress = $request->input('replytoaddress');
            /*
            $emailreturnpath = $request->input('emailreturnpath');
            $dsnscheme = $request->input('dsnscheme');
            $dsnhost = $request->input('dsnhost');
            $dsnport = $request->input('dsnport');
            $dsnpath = $request->input('dsnpath');
            $dsnuser = $request->input('dsnuser');
            $dsnpassword = $request->input('dsnpassword');
            */
            $brevoapikey = $request->input('brevoapikey');
            $toggleValue = $request->input('toggleValue');
            
            $updateData = array();
            $updateData["smtp"] = json_encode(
                array(
                    "fromname" => $fromname,
                    "fromemailaddress" => $fromemailaddress,
                    "replytoaddress" => $replytoaddress,
                    "emailreturnpath" => "",//$emailreturnpath,
                    "dsnscheme" => "",//$dsnscheme,
                    "dsnhost" => "",//$dsnhost,
                    "dsnport" => "",//$dsnport,
                    "dsnpath" => "",//$dsnpath,
                    "dsnuser" => "",//$dsnuser,
                    "dsnpassword" => "",//$dsnpassword,
                    "brevoapikey" => $brevoapikey
                )
            );

            $updateData["usescipsmtp"] = $toggleValue;
            
            //settings_model::where("id")
            $updated = settings_model::where("created_by_company", $userCompany)->update($updateData);
            
            $response = [
                'C' => 100,
                'M' => $this->ERRORS[112],
                'R' => ["updated"=>$updated],
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

    function sendTestEmail(Request $request){
        if($this->USERID > 0){

            $csrfToken = csrf_token();

            $userCompany = $this->getSession('companyId');
            $companyName = "";
            $companyLogo = "";
            $firstName = $this->getSession('firstName');
            $lastName = $this->getSession('lastName');
            $fullName = $firstName." ".$lastName; 
            $userEmail = $this->getSession('userEmail');
            $today = date("Y-m-d");

            //get dsn
            $settings = settings_model::where("created_by_company", $userCompany)->first();
            
            $smtp = array(
                "fromname"=>"",
                "fromemailaddress"=>"",
                "replytoaddress"=>"",
                "emailreturnpath"=>"",
                "dsnscheme"=>"",
                "dsnhost"=>"",
                "dsnport"=>"",
                "dsnpath"=>"",
                "dsnuser"=>"",
                "dsnpassword"=>"",
                "brevoapikey"=>""
            );
            
            $usescipsmtp = 1;
            if($settings){
                $smtp = json_decode($settings["smtp"], true);
                $usescipsmtp = $settings["usescipsmtp"];
            }

            $emptyField = '';
            foreach ($smtp as $key => $value) {
                // Skip validation for 'dsnpath'
                if ($key == "dsnpath") {
                    continue;
                }
            
                // Check if the value is empty or blank
                if (empty($value) || trim($value) === '') {
                    $emptyField = $key;
                }
            }

            /*if($emptyField){*/
                //----
                if($usescipsmtp == 1){
                    //scip smtp
                    $apikey = config('brevo.apikey');
                    $smtp = config('brevo.smtp');
                    $senderName = $smtp["sendername"];
                    $senderEmail = $smtp["senderemail"];
                    $replyToName = $smtp["replytoname"];
                    $replyToEmail = $smtp["replytoemail"];
                }else{
                    //own smtp
                    $apikey = $smtp["brevoapikey"];
                    $senderName = $smtp["fromname"];
                    $senderEmail = $smtp["fromemailaddress"];
                    $replyToName = $smtp["fromname"];

                    if(!$smtp["replytoaddress"] || $smtp["replytoaddress"] == ''){
                        $replyToEmail = $smtp["fromemailaddress"];
                    }else{
                        $replyToEmail = $smtp["replytoaddress"];
                    }
                    
                }
                 
               
                $subject = "Test email";
                
                // Render the Blade template to a string
                $templateBlade = "emails.testEmail";
                $htmlContent = view($templateBlade, [
                    'userName' => $fullName,
                    'companyLogo' => $companyLogo,
                    'companyName' => $companyName,
                ])->render();

                $payload = [
                    "sender" => [
                        "name" => $senderName,
                        "email" => $senderEmail,
                    ],
                    "replyTo" => [
                        "name" => $replyToName,
                        "email" => $replyToEmail,
                    ],
                    "to" => [[
                        "email" => $userEmail,
                        "name" => $fullName,
                    ]],
                    "subject" => $subject,
                    "htmlContent" => $htmlContent,
                ];
                
                // Encode JSON safely
                $jsonPayload = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                
                // Escape quotes for shell
                $escapedJson = escapeshellarg($jsonPayload);
                
                // Build the command
                $cmd = "curl --location 'https://api.brevo.com/v3/smtp/email' \
                --header 'accept: application/json' \
                --header 'api-key: $apikey' \
                --header 'content-type: application/json' \
                --data $escapedJson";
                
                // Execute
                exec($cmd, $out);
                
                // Output the result for debugging
                if(!empty($out)){
                    
                    $result = json_decode($out[0], true);
                }else{
                    $result = [];
                }
                
                if(!empty($result)){
                    if(array_key_exists("code", $result)){
                        //api error
                        $code = $result["code"];
                        $message = $result["message"];
                        $response = [
                            'C' => 101,
                            'M' => ["error" => 1, "message" => $code.":".$message],
                            'R' => ['result' => $result],
                        ];
                    }else{
                        $response = [
                            'C' => 100,
                            'M' => $this->ERRORS[113],
                            'R' => ['result' => $result],
                        ];
                    }
                }else{
                    //empty respoinse could not connect to smtp
                    $response = [
                        'C' => 102,
                        'M' => $this->ERRORS[114],
                        'R' => [],
                    ];
                }
                
                //----
                /*
                //send test email
                $mailerDsn = $smtp["dsnscheme"].'://'. $smtp["dsnuser"] . ':' . $smtp["dsnpassword"] .'@'. $smtp["dsnhost"] . ':'. $smtp["dsnport"];


                //Send Email
                $subject = "Test email";
                $templateBlade = "emails.testEmail";
                
                $host = $smtp["dsnhost"];
                $port = $smtp["dsnport"];
                $username = $smtp["dsnuser"];
                $password = $smtp["dsnpassword"];
                $encryption = "";
                $from_email = $smtp["fromemailaddress"];
                $from_name = $smtp["fromname"];
                $replyTo_email = $smtp["replytoaddress"];
                $replyTo_name = $smtp["fromname"];

                $smtpDetails = array();
                $smtpDetails['host'] = $host;
                $smtpDetails['port'] = $port;
                $smtpDetails['username'] = $username;
                $smtpDetails['password'] = $password;
                $smtpDetails['encryption'] = $encryption;
                $smtpDetails['from_email'] = $from_email;
                $smtpDetails['from_name'] = $from_name;
                $smtpDetails['replyTo_email'] = $replyTo_email;
                $smtpDetails['replyTo_name'] = $replyTo_name;
            
                
                $recipient = ['name' => $fullName, 'email' => $userEmail];
                
                $bladeData = [
                    'userName' => $fullName,
                    'companyLogo' => $companyLogo,
                    'companyName' => $companyName,
                ];

                               
                $result = $this->MYSMTP($smtpDetails, $recipient, $subject, $templateBlade, $bladeData);
                
                
                
                $response = [
                    'C' => 100,
                    'M' => $this->ERRORS[113],
                    'R' => ['result' => $result],
                ];

            }else{
                //could not connect to smtp
                $response = [
                    'C' => 101,
                    'M' => $this->ERRORS[114],
                    'R' => [],
                ];
            }*/

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