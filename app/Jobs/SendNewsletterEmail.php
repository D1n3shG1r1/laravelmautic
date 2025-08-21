<?php

namespace App\Jobs;

use App\Models\newsletter_emails_queue_model;
use App\Models\emailsbuilder_model;
use App\Models\settings_model;

use App\Mail\CampaignEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SendNewsletterEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $queueId;
    public $emailId;

    public function __construct($param)
    {
        $this->queueId = $param["id"];
        $this->emailId = $param["emailId"];
    }

    public function handle()
    {

        Log::info("JOB STARTED: Campaign Email CampaignID: {$this->emailId}, QueueID: {$this->queueId}");
        
        $emailRow = newsletter_emails_queue_model::where("id", $this->queueId)
        ->where("emailId", $this->emailId)
        ->first();
        
        if(!$emailRow){
            Log::warning("Email queue not found for EmailID: {$this->emailId}, QueueID: {$this->queueId}") ;
            return;
        }

        
        $emailId = $emailRow->emailId; //email tempate id
        $toEmail = $emailRow->contactEmail;
        $toName = $emailRow->contactName;
        $subject = $emailRow->subject;
        $message = $emailRow->html;
        $filename = $emailRow->attachment;
        $userCompany = $emailRow->companyId;
        $attachmentJson = ''; // default: no attachment
        
        if (isset($filename) && trim($filename) !== '') {
            $directory = "company-assets/{$userCompany}/emails/{$emailId}/attachments/";
            $filePath = $directory . $filename;
            
            $fullPath = storage_path("app/public/{$filePath}");
            
            
            if (Storage::disk('public')->exists($filePath)){
                
                $fileContent = Storage::disk('public')->get($filePath);

                if (strlen($fileContent) > 0) {
                    $base64 = base64_encode($fileContent);
                    Log::info("Base64 encoded content: " . substr($base64, 0, 100)); // Log the first 100 chars for debugging

                    $base64 = base64_encode($fileContent);
                
                    //Log::warning("File base64: " . $base64);

                    //Build the JSON part for attachment
                    $attachmentArray = [
                        [
                            'name' => $filename,
                            'content' => $base64
                        ]
                    ];

                    //Convert to JSON without escaping slashes/quotes unnecessarily
                    $attachmentJson = ', "attachment": ' . json_encode($attachmentArray);
                    
                } else {
                    Log::warning("File content is empty for: " . $fileContent);
                    
                }


            }else{
                Log::warning("File not found: " . $filePath);
            }
        }

        $message = str_replace("{unsubscribe_text} | {webview_text}\n","",$message);

        // Further escape single quotes for the shell
        $escapedMessage = str_replace("'", "\"", $message);
        // Escape the message for JSON encoding (double quotes handled automatically)
        $escapedMessage = json_encode($escapedMessage);
        

        //get smpt credentials or brevo key by $emailId
        
        $templateRow = emailsbuilder_model::select("id", "created_by_company")
        ->where("id", $emailId)
        ->first();

        if($templateRow){
            $templateId = $templateRow->id;
            $companyId = $templateRow->created_by_company; //common in every model
        
            $settings = settings_model::select("smtp","usescipsmtp")
            ->where("created_by_company", $companyId)
            ->first();
        
            if($settings){

                $smtp = json_decode($settings["smtp"], true);
                $usescipsmtp = $settings["usescipsmtp"];

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


                $smtp = config('brevo.smtp');
                if($senderName == "" || $senderName == null){
                    $senderName = $smtp["sendername"];
                }
                
                if($senderEmail == "" || $senderEmail == null){
                    $senderEmail = $smtp["senderEmail"];
                }

                if($replyToName == "" || $replyToName == null){
                    $replyToName = $smtp["replyToName"];
                }

                if($replyToEmail == "" || $replyToEmail == null){
                    $replyToEmail = $smtp["replyToEmail"];
                }
                
                // we are using brevo api to send email instead of smtp
                // if email is sent through api then we are able to track email events by brevo
                
                
                // Prepare the cURL command
                $cmd = "curl --location 'https://api.brevo.com/v3/smtp/email' \
                --header 'accept: application/json' \
                --header 'api-key: $apikey' \
                --header 'content-type: application/json' \
                --data-raw '{
                    \"sender\": {
                    \"name\": \"$senderName\",
                    \"email\": \"$senderEmail\"
                    },
                    \"replyTo\": {
                    \"name\": \"$replyToName\",
                    \"email\": \"$replyToEmail\"
                    },
                    \"to\": [{
                    \"email\": \"$toEmail\",
                    \"name\": \"$toName\"
                    }],
                    \"subject\": \"$subject\",
                    \"htmlContent\": $escapedMessage
                    $attachmentJson
                }'";

                // Debug output to see the generated curl command
                //echo "Generated cURL command: $cmd\n";

                // Execute the cURL command
                exec($cmd, $out);

                // Output the result for debugging
                if(!empty($out)){
                    
                    $response = json_decode($out[0]);
                    if(property_exists($response, 'code') && ($response->code == 'bad_request' || $response->code == 'unauthorized')){ 
                        //echo 'code:'.$response->code.', message:'.$response->message;
                        Log::warning("Brevo error: code:{$response->code}', message:{$response->message} for EmailID: {$this->emailId}, QueueID: {$this->queueId}") ;
                        
                    }else{

                        //update brevo messageId/transactionId
                        $messageId = $response->messageId;
                        $updateData = array(
                            "emailSent" => 1,
                            "brevoTransactionId" => $messageId,
                            "date_modified" => date("Y-m-d H:i:s")
                        );
                        
                        newsletter_emails_queue_model::where("id", $this->queueId)
                        ->where("emailId", $this->emailId)
                        ->update($updateData);

                        
                        //update campaign event triggred to 1
                        $emailObj = emailsbuilder_model::select("sent_count")->where("id", $this->emailId)
                        ->first();

                        $updateData = array(
                            "sent_count" => $emailObj->sent_count + 1,
                            "date_modified" => date("Y-m-d H:i:s")
                        );

                        emailsbuilder_model::where("id", $this->emailId)
                        ->update($updateData);

                    }
                }


                /* fetch from db for dynamic smtp
                $mailSettings = MailSetting::first(); // or match to a campaign
                
                MAIL_MAILER=smtp
                MAIL_HOST=smtp-relay.brevo.com
                MAIL_PORT=587
                MAIL_USERNAME=your_brevo_api_key
                MAIL_PASSWORD=your_brevo_api_key
                MAIL_ENCRYPTION=tls
                MAIL_FROM_ADDRESS=your_verified_sender@domain.com
                MAIL_FROM_NAME="Your Brand"

                config([
                    'mail.mailers.dynamic' => [
                        'transport' => 'smtp',
                        'host' => $mailSettings->host,
                        'port' => $mailSettings->port,
                        'encryption' => $mailSettings->encryption,
                        'username' => $mailSettings->username,
                        'password' => $mailSettings->password,
                    ],
                    'mail.from.address' => $mailSettings->from_address,
                    'mail.from.name' => $mailSettings->from_name,
                ]);
                */
                //Mail::to($this->user['email'])->send(new CampaignEmail($this->user));
                
            }else{
                //log settings row not found
                Log::warning("SMPT settings not found for EmailID: {$this->emailId}, QueueID: {$this->queueId}") ;
            }


        }else{
            Log::warning("Email-Template not found for EmailID: {$this->emailId}, QueueID: {$this->queueId}") ;
        }
        
    }
}
