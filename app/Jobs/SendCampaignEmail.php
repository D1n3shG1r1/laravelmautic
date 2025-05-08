<?php

namespace App\Jobs;

use App\Models\campaign_emails_queue_model;
use App\Models\campaign_events_model;

use App\Mail\CampaignEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SendCampaignEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $queueId;
    public $campaignId;

    public function __construct($param)
    {
        $this->queueId = $param["id"];
        $this->campaignId = $param["campaignId"];
    }

    public function handle()
    {

        Log::info("JOB STARTED: Campaign Email CampaignID: {$this->campaignId}, QueueID: {$this->queueId}");
        
        $emailRow = campaign_emails_queue_model::where("id", $this->queueId)
        ->where("campaignId", $this->campaignId)
        ->first();
        
        if(!$emailRow){
            Log::warning("Email queue not found for CampaignID: {$this->campaignId}, QueueID: {$this->queueId}") ;
            return;
        }

        /*
        $emailRow->id
        $emailRow->campaignId
        $emailRow->segmentId
        $emailRow->eventId
        $emailRow->contactId
        $emailRow->contactName
        $emailRow->contactEmail
        $emailRow->subject
        $emailRow->html
        $emailRow->emailSent
        $emailRow->emailBrevoEvents
        $emailRow->brevoTransactionId
        $emailRow->date_added
        $emailRow->date_modified
        */

        // we are using brevo api to send email instead of smtp
        // if email is sent through api then we are able to track email events by brevo
        
        $apikey = config('brevo.apikey');
        $smtp = config('brevo.smtp');
        $senderName = $smtp["sendername"];
        $senderEmail = $smtp["senderemail"];
        $replyToName = $smtp["replytoname"];
        $replyToEmail = $smtp["replytoemail"];

        $toEmail = $emailRow->contactEmail;
        $toName = $emailRow->contactName;
        $subject = $emailRow->subject;
        $message = $emailRow->html;
        $message = str_replace("{unsubscribe_text} | {webview_text}\n","",$message);

        // Further escape single quotes for the shell
        $escapedMessage = str_replace("'", "\"", $message);
        // Escape the message for JSON encoding (double quotes handled automatically)
        $escapedMessage = json_encode($escapedMessage);
        

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
                Log::warning("Brevo error: code:{$response->code}', message:{$response->message} for CampaignID: {$this->campaignId}, QueueID: {$this->queueId}") ;
                
            }else{

                //update brevo messageId/transactionId
                $messageId = $response->messageId;
                $updateData = array(
                    "emailSent" => 1,
                    "brevoTransactionId" => $messageId,
                    "date_modified" => date("Y-m-d H:i:s")
                );
                
                campaign_emails_queue_model::where("id", $this->queueId)
                ->where("campaignId", $this->campaignId)
                ->update($updateData);

                
                //update campaign event triggred to 1
                $updateData = array(
                    "triggered" => 1,
                    "triggered_on" => date("Y-m-d H:i:s")
                );

                campaign_events_model::where("id", $emailRow->eventId)
                ->where("campaignId", $emailRow->campaignId)
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
    }
}
