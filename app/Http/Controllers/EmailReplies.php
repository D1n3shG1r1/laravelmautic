<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use App\Models\email_replies_model;
use App\Models\newsletter_emails_queue_model;
use App\Models\campaign_emails_queue_model;

use Illuminate\Support\Facades\DB;

class EmailReplies extends Controller
{
    var $ERRORS = [];
    var $USERID = 0;
    function __construct(){
        parent::__construct();    
        $this->ERRORS = config("errormessage");
        $this->USERID = $this->getSession('userId');
    }
    
    /**
 * Get email replies for a given email ID and type (list or template).
 */
    function getReplies(Request $request){
        
        if ($this->USERID <= 0) {
            return response()->json([
                'C' => 1004,
                'M' => $this->ERRORS[1004] ?? 'Session expired',
                'R' => [],
            ]);
        }

        $userCompany = $this->getSession('companyId');
        $firstName = $this->getSession('firstName');
        $lastName = $this->getSession('lastName');
        $fullName = trim($firstName . ' ' . $lastName);
        $today = date("Y-m-d");

        $emailId = $request->input('emailId');
        $emailType = $request->input('emailType');
        $page = max((int) $request->input('page', 1), 1);
        $pageSize = max((int) $request->input('pageSize', 10), 1);
        $offset = ($page - 1) * $pageSize;

        $response = [
            'C' => 0,
            'M' => '',
            'R' => [],
        ];

        // Determine the correct model based on emailType
        if ($emailType === 'list') {
            $model = newsletter_emails_queue_model::class;
        } elseif ($emailType === 'template') {
            $model = campaign_emails_queue_model::class;
        } else {
            return response()->json([
                'C' => 400,
                'M' => 'Invalid email type provided.',
                'R' => [],
            ]);
        }

        // Get brevo transaction IDs
        $emails = $model::select("brevoTransactionId")
            ->where("emailId", $emailId)
            ->where("emailSent", 1)
            ->get();

        if ($emails->isEmpty()) {
            return response()->json([
                'C' => 404,
                'M' => 'No emails found for the provided email ID.',
                'R' => [],
            ]);
        }

        $messageIds = $emails->pluck('brevoTransactionId')->toArray();

        // Get email replies
        $replies = email_replies_model::whereIn('references', $messageIds)
            ->orderBy('date', 'desc')
            ->offset($offset)
            ->limit($pageSize)
            ->get()
            ->toArray();

            if(!empty($replies)){
                foreach($replies as &$reply){
                    $reply["date"] = date('d-m-Y', strtotime($reply["date"]));
                }
            }

        $response['R'] = ['replies' => $replies];

        return response()->json($response);
    }

    
}
