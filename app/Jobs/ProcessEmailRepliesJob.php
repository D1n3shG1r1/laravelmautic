<?php
namespace App\Jobs;

//use App\Models\campaign_emails_queue_model;
//use App\Models\newsletter_emails_queue_model;
use App\Models\email_replies_model;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessEmailRepliesJob implements ShouldQueue
{
    use Queueable;

    public $INBOX;

    /**
     * Create a new job instance.
     *
     * @param  array  $INBOX
     * @return void
     */
    public function __construct(array $inbox)
    {
        $this->INBOX = $inbox;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        
        $host = $this->INBOX["host"];
        $port = $this->INBOX["port"];
        $encryption = $this->INBOX["encryption"];
        $username = $this->INBOX["username"];
        $password = $this->INBOX["password"];

        Log::info("JOB STARTED: Processing email replies for : host:$host user:$username:$password");


        /* Establish a IMAP connection */
		$conn = imap_open($host, $username, $password)
        or Log::info("unable to connect host:$host user:$username:$password: " . imap_last_error());

        $headers = imap_headers($conn);


        $since = date("d M Y", strtotime("-2 days"));
        //$search = imap_search($conn, 'SINCE "'.$since.' 00:00:00 -0700 (PDT)"', SE_UID);
        $search = imap_search($conn, 'SINCE "'.$since.' 00:00:00"');

        $totalEmailCount = imap_num_msg($conn);

        if(!empty($search)){

            $firstId = min($search);
            $lastId = max($search);

            $inboundArr = array();
            $mails = array();
            $totalEmailCount = imap_num_msg($conn);
            $c = 0;
            //for($i = $totalEmailCount; $i > 0; $i--){

            for($i = $lastId; $i >= $firstId; $i--){

                $tmpId = db_randnumber();

                $emailFetchOverview = imap_fetch_overview($conn, $i);
                $emailFetchHeader = imap_fetchheader($conn, $i);
                $emailData = imap_headerinfo($conn, $i);
                $threadData = imap_thread($conn, $i);
                $body = imap_body($conn, $i);
                $fetchstructure = imap_fetchstructure($conn, $i);
                $fetchBody = imap_fetchbody($conn, $i,"1"); //1-2
                $bodyStrct = imap_bodystruct($conn, $i, "1"); //1-2

                $tmpMsgOffset = $i;
                $tmpDate = $emailData->date;
                $tmpSubject = $emailData->subject;
                $tmpMsgId = $emailData->message_id;
                $tmpRef = "";

                if(property_exists($emailData, "references")){
                    $tmpRef = $emailData->references;
                }

                $tmpinReplyTo = "";
                if(property_exists($emailData, "in_reply_to")){
                    $tmpinReplyTo = $emailData->in_reply_to;
                }

                $tmpMsgno = $emailData->Msgno;
                $toObj = $emailData->to;
                $fromObj = $emailData->from;


                if(property_exists($emailData, "reply_to")){
                    $replyToObj = $emailData->reply_to;
                }else{
                    $replyToObj = $emailData->from;
                }


                $tmpFromObj = array();
                $tmpToObj = array();
                $tmpReplyToObj = array();

                foreach($toObj as $toRw){

                    $tmpToName = "";
                    if(property_exists($toRw, "personal")){
                        $tmpToName = $toRw->personal;
                    }

                    $tmpToMailbox = $toRw->mailbox;
                    $tmpToHost = $toRw->host;
                    $tmpToEmail = $tmpToMailbox."@".$tmpToHost;

                    $tmpToObj[] = array(
                        "name" => $tmpToName,
                        "email" => $tmpToEmail
                    );

                }

                foreach($fromObj as $fromRw){

                    $tmpFromName = "";
                    if(property_exists($fromRw, "personal")){
                        $tmpFromName = $fromRw->personal;
                    }

                    $tmpFromMailbox = $fromRw->mailbox;
                    $tmpFromHost = $fromRw->host;
                    $tmpFromEmail = $tmpFromMailbox."@".$tmpFromHost;

                    $tmpFromObj[] = array(
                        "name" => $tmpFromName,
                        "email" => $tmpFromEmail
                    );

                }


                //need to resolve in outlook
                foreach($replyToObj as $replyToRw){

                    $tmpReplyToName = "";
                    if(property_exists($replyToRw, "personal")){
                        $tmpReplyToName = $replyToRw->personal;
                    }

                    $tmpReplyToMailbox = $replyToRw->mailbox;
                    $tmpReplyToHost = $replyToRw->host;
                    $tmpReplyToEmail = $tmpReplyToMailbox."@".$tmpReplyToHost;

                    $tmpReplyToObj[] = array(
                        "name" => $tmpReplyToName,
                        "email" => $tmpReplyToEmail
                    );

                }


                $mails[] = $i;

                // Check for attachments
                $structure = $fetchstructure;
                $attachments = array();
                $finalMessage = "";

                //-- check for main message
                //echo "Main SubType:".$structure->ifsubtype."&".$structure->subtype."<br>";
                $tmpContentArr = array("ALTERNATIVE", "PLAIN", "HTML");
                $tmpMainFtchBdy = '';
                if(in_array($structure->subtype, $tmpContentArr)){
                    $tmpMainFtchBdy = imap_fetchbody($conn, $i, "2");
                }/*else{
                    $tmpMainFtchBdy = imap_fetchbody($conn, $i, "1");
                }*/
                
                if($tmpMainFtchBdy != ''){
                    // 3 = BASE64 encoding
                    if($structure->encoding == 3)
                    {
                        $tmpMainFtchBdy = base64_decode($tmpMainFtchBdy);
                    }
                    // 4 = QUOTED-PRINTABLE encoding
                    elseif($structure->encoding == 4)
                    {
                        $tmpMainFtchBdy = quoted_printable_decode($tmpMainFtchBdy);
                    }
                    // 1 = 8Bit
                    elseif($structure->encoding == 1)
                    {
                        $tmpMainFtchBdy = imap_8bit($tmpMainFtchBdy);
                    }

                    else{
                        $tmpMainFtchBdy = imap_qprint($tmpMainFtchBdy);
                    }
                }
               //echo "tmpMainFtchBdy:".$structure->encoding."<br>".$tmpMainFtchBdy."<br>";

                // fetch content of Parts object            
                if(isset($structure->parts) && count($structure->parts))
                {   

                    for($j = 0; $j < count($structure->parts); $j++)
                    {
                        //echo "SubType:".$structure->parts[$j]->ifsubtype."&".$structure->parts[$j]->subtype."<br>";
                        $tmpContentArr = array("ALTERNATIVE", "PLAIN", "HTML");

                        if($structure->parts[$j]->ifsubtype && in_array($structure->parts[$j]->subtype, $tmpContentArr) && !$structure->parts[$j]->ifdparameters){
                            //need to resolve in outlook coming blank
                            //$tmpFtchBdy = imap_fetchbody($conn, $i, $j+1);
                            //echo "j:".$j."<br>";
                            $tmpFtchBdy = imap_fetchbody($conn, $i, "1.2");

                            // 3 = BASE64 encoding
                            if($structure->parts[$j]->encoding == 3)
                            {
                                $tmpFtchBdy = base64_decode($tmpFtchBdy);
                            }
                            // 4 = QUOTED-PRINTABLE encoding
                            elseif($structure->parts[$j]->encoding == 4)
                            {
                                $tmpFtchBdy = quoted_printable_decode($tmpFtchBdy);
                            }
                            // 1 = 8Bit
                            elseif($structure->parts[$j]->encoding == 1)
                            {
                                $tmpFtchBdy = imap_8bit($tmpFtchBdy);
                            }

                            else{
                                $tmpFtchBdy = imap_qprint($tmpFtchBdy);
                            }

                            //echo "<br>tmpFtchBdy: ".$structure->parts[$j]->encoding."<br>";
                            //echo $tmpFtchBdy;
                            //echo "<br>";
                            /*$tmpFtchBdy = strip_tags($tmpFtchBdy);
                            $tmpFtchBdyParts = explode(">", $tmpFtchBdy);
                            $finalMessage = $tmpFtchBdyParts[0];
                            */
                            //$tmpMainFtchBdy
                            //echo 'tmpFtchBdy:'.trim($tmpFtchBdy)."mmm<br>";
                            if(trim($tmpFtchBdy) == ''){
                                $tmpFtchBdy = $tmpMainFtchBdy;
                            }
                            $finalMessage = $tmpFtchBdy;
                                                        
                        }

                    }
                }


                // if there is any attachment found...
                if(isset($structure->parts) && count($structure->parts))
                {
                    for($j = 0; $j < count($structure->parts); $j++)
                    {
                        $attachments[$j] = array(
                            'is_attachment' => false,
                            'filename' => '',
                            'name' => '',
                            'attachment' => ''
                        );

                        if($structure->parts[$j]->ifdparameters)
                        {
                            foreach($structure->parts[$j]->dparameters as $object)
                            {
                                if(strtolower($object->attribute) == 'filename')
                                {
                                    $attachments[$j]['is_attachment'] = true;
                                    $attachments[$j]['filename'] = $object->value;
                                }
                            }
                        }

                        if($structure->parts[$j]->ifparameters)
                        {
                            foreach($structure->parts[$j]->parameters as $object)
                            {
                                if(strtolower($object->attribute) == 'name')
                                {
                                    $attachments[$j]['is_attachment'] = true;
                                    $attachments[$j]['name'] = $object->value;
                                }
                            }
                        }

                        if($attachments[$j]['is_attachment'])
                        {
                            $attachments[$j]['attachment'] = imap_fetchbody($conn, $i, $j+1);

                            // 3 = BASE64 encoding
                            if($structure->parts[$j]->encoding == 3)
                            {
                                $attachments[$j]['attachment'] = base64_decode($attachments[$j]['attachment']);
                            }
                            // 4 = QUOTED-PRINTABLE encoding
                            elseif($structure->parts[$j]->encoding == 4)
                            {
                                $attachments[$j]['attachment'] = quoted_printable_decode($attachments[$j]['attachment']);
                            }
                        }
                    }
                }


                // Check if the messageId already exists in the database
                $existingEmail = email_replies_model::where('messageId', $tmpMsgId)->first();

                // If the email already exists, skip it
                if ($existingEmail) {
                    continue;  // Skip saving this email if it's already in the database
                }
                
                $inboundArr[$c] = array(
                    "id" => $tmpId,
                    "date" => date("Y-m-d H:i:s", strtotime($tmpDate)),
                    "subject" => $tmpSubject,
                    "emailFrom" => json_encode($tmpFromObj),
                    "emailTo" => json_encode($tmpToObj),
                    "replyTo" => json_encode($tmpReplyToObj),
                    "message" => $finalMessage, //$tmpMessage,
                    "attachments" => '', //json_encode($attachmentsPaths),
                    "messageId" => $tmpMsgId,
                    "references" => $tmpRef,
                    "inReplyTo" => $tmpinReplyTo,
                    "messageNumber" => $tmpMsgno,
                    "messageOffset" => $tmpMsgOffset,
                    "created_at" => date("Y-m-d H:i:s")

                );

                //die;
                //print_r($attachments);
                //die;
                $c++;
            }
            $this->saveInbox($inboundArr);
        }else{
            echo "no emails";
            Log::info("NO replies found for: host:$host user:$username:$password");
        }
        /* imap connection is closed */
		imap_close($conn);
    }

    function saveInbox($inboundArr){ 
        //save data to db
        $newRows = array();

        foreach($inboundArr as $inboundRw){

            $inbound = new email_replies_model(); //inbound model obj

            $inbound->id = $inboundRw["id"];
            $inbound->date = $inboundRw["date"];
            $inbound->subject = $inboundRw["subject"];
            $inbound->emailTo = $inboundRw["emailTo"];
            $inbound->emailFrom = $inboundRw["emailFrom"];
            $inbound->replyTo = $inboundRw["replyTo"];
            $inbound->message = $inboundRw["message"];
            $inbound->attachments = $inboundRw["attachments"];
            $inbound->messageId = $inboundRw["messageId"];
            $inbound->references = $inboundRw["references"];
            $inbound->inReplyTo = $inboundRw["inReplyTo"];
            $inbound->messageNumber = $inboundRw["messageNumber"];
            $inbound->messageOffset = $inboundRw["messageOffset"];
            $inbound->created_at = $inboundRw["created_at"];
            $inbound->updated_at = $inboundRw["created_at"];
           
            $newRows[] = $inbound->attributesToArray();
        }

        if(!empty($newRows)){
            $host = $this->INBOX["HOST"];
            $username = $this->INBOX["USERNAME"];
            $password = $this->INBOX["PASSWORD"];
            
            email_replies_model::insert($newRows);
            Log::info("Replies saved for: host:$host user:$username:$password");
        }

    }
}