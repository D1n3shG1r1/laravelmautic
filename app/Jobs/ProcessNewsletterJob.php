<?php

/*
Ok report
get today's active/published newsletter emails
get email's segments and send newsletters
*/

namespace App\Jobs;
use App\Models\contacts_model;
use App\Models\segments_model;
use App\Models\segment_contacts_model;
use App\Models\emailsbuilder_model;
use App\Models\email_segments_model;
use App\Models\newsletter_emails_queue_model;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessNewsletterJob implements ShouldQueue
{
    use Queueable;

    public $EMAILID; //$CAMPAIGNID

    /**
     * Create a new job instance.
     *
     * @param  int  $EMAILID
     * @return void
     */
    public function __construct(int $emailId)
    {
        $this->EMAILID = $emailId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        
        Log::info("JOB STARTED: Processing email ID: {$this->EMAILID}");

        // Fetch the segment based on segmentId
        $today = date("Y-m-d");
        $currentDateTime =  date("Y-m-d H:i:s");
        $published = 1; 
        $deleted = null;
        
        /*$campaign = emailsbuilder_model::where("id", $this->EMAILID)
        ->where("publish_up", $today)
        ->where("is_published", $published)
        ->first();*/

        $newsletterEmail = emailsbuilder_model::where("id", $this->EMAILID)->first();
        
        // If the email does not exist, skip this job
        if (!$newsletterEmail) {
            Log::warning("Email not found or not published today: {$this->EMAILID}");
            return;
        }

        //get campaign segments
        $emailSegmentsObj = email_segments_model::where("email_id", $this->EMAILID)->get();

        Log::info("Segments found: " . $emailSegmentsObj->count());

        if(!$emailSegmentsObj){
            Log::warning("Segments not found for the newsletter-email: {$this->EMAILID}");
            return;
        }

        $segmentIds = array();
        foreach($emailSegmentsObj as $emailSegmentRw){
            $tmpEmailId = $emailSegmentRw->email_id;
            $tmpEmailSgmntId = $emailSegmentRw->segment_id;
            $segmentIds[] = $tmpEmailSgmntId;
        }

        //get segment contacts
        //segment_id contact_id
        $segmentContactsObj = segment_contacts_model::whereIn("segment_id", $segmentIds)->get();
        
        Log::info("SegmentContacts found: " . count($segmentContactsObj));

        if(!$segmentContactsObj){
            Log::warning("Segment-Contacts not found for the newsletter-email: {$this->EMAILID}");
            return;
        }

        //get contact details id name email

        $contactIds = array();
        foreach($segmentContactsObj as $segmentContactRw){
            $tmpSgmntId = $segmentContactRw->segment_id;
            $tmpCntId = $segmentContactRw->contact_id;
            $contactIds[] = $tmpCntId;
        }

        $contactsObj = contacts_model::whereIn("id", $contactIds)->get();

        Log::info("Contacts found: " . count($contactIds));

        if(!$contactsObj){
            Log::warning("Contacts not found for the newsletter-email: {$this->EMAILID}");
            return;
        }


        //get main-contacts list
        $processContactsList = array();
        if(!empty($contactsObj)){

            foreach($contactsObj as $contactRw){
                $cntId = $contactRw->id;
                $processContactsList[] = $cntId;
            }

        }
        
        if(!empty($processContactsList)){

            $processContactsObj = contacts_model::whereIn("id", $processContactsList)->get();
            if($processContactsObj){
                $processContactsObj = $processContactsObj->toArray();
            }else{
                $processContactsObj = array();
            }
        }
        //eleminate the contacts where email is already sent
        
        $emailSentContactsObj = newsletter_emails_queue_model::select("contactId")
        ->where("emailId", $this->EMAILID)
        ->where("emailSent", 1)
        ->get();
        
        $prevSentContIds = array();

        if($emailSentContactsObj && !empty($emailSentContactsObj)){
            foreach($emailSentContactsObj as $emailSentContRw){
                $prevSentContIds[] = $emailSentContRw->contactId;
            }
        }
        
        if(!empty($prevSentContIds)){
            foreach($processContactsObj as $k=>$proContRw){
                $elmCntId = $proContRw["id"];
                if(in_array($elmCntId, $prevSentContIds)){
                    unset($processContactsObj[$k]);
                }
            }
        }
        
        if(!empty($processContactsObj)){
           
            //make an email queue for each contact in campaign

            //get subject and html
            $subject = $newsletterEmail->subject;
            $custom_html = $newsletterEmail->custom_html;

            // create batch rows
            $sendEmailContacts = array();
            $batchRows = array();
            
            foreach($processContactsObj as $contactRw){
                $cntId = $contactRw["id"];
                $cntFNm = $contactRw["firstname"];
                $cntLNm = $contactRw["lastname"];
                $cntEml = $contactRw["email"];

                $sendEmailContacts[] = $cntId;
                
                $batchRows[] = array(
                    //'id'
                    'emailId' => $this->EMAILID,
                    'segmentId' => 0,
                    'eventId' => 0,
                    'contactId' => $cntId,
                    'contactName' => ucwords($cntFNm.' '.$cntLNm),
                    'contactEmail' => $cntEml,
                    'subject' => $subject,
                    'html' => $custom_html,
                    'emailSent' => 0,
                    'emailBrevoEvents' => '',
                    'brevoTransactionId' => '',
                    'date_added' => $today,
                    'date_modified' => $today
                );
            }

            if(!empty($batchRows)){
                //send email queue
                $insert = newsletter_emails_queue_model::insert($batchRows);
            
                Log::warning("{$insert} Email is queued for the newsletter-email: {$this->EMAILID}");
                
                return $insert;
            }
            
        }
    }
}