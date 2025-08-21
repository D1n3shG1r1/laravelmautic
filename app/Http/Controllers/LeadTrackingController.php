<?php
// handle inputs from widget
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\contacts_model;
use App\Models\widgets_model;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class LeadTrackingController extends Controller
{
    //==== handle request from popup widget
    public function track(Request $request)
    {
        $fname = $request->input("fname");
        $lname = $request->input("lname");
        $email = $request->input("email");
        $phone = $request->input("phone");
        $company = $request->input("company");
        $country = $request->input("country");
        $reason = $request->input("reason");
        $message = $request->input("message");
        $key = $request->input("key");
        $page_url = $request->input("page_url");
        $referrer = $request->input("referrer");
        

        // Extract origin host
        $origin = parse_url($request->headers->get('origin'), PHP_URL_HOST)
            ?? parse_url($request->headers->get('referer'), PHP_URL_HOST);

        $partner = widgets_model::where('widgetKey', $key)->first();

        if (!$partner || !$origin || stripos($origin, $partner->website) === false) {
            return response()->json(['error' => 'Unauthorized domain'], 403);
        }

        $today = date("Y-m-d H:i:s");
        
        $contactObj = new contacts_model();
        $contactObj->title = '';
        $contactObj->firstname = $fname;
        $contactObj->lastname = $lname;
        $contactObj->email = $email;
        $contactObj->address1 = '';
        $contactObj->address2 = '';
        $contactObj->city = '';
        $contactObj->state = '';
        $contactObj->zipcode = '';
        $contactObj->country = $country;
        $contactObj->mobile = $phone ;
        $contactObj->company = $company;
        $contactObj->is_published = 1;
        $contactObj->date_added = $today;
        $contactObj->created_by = $partner->created_by;
        $contactObj->created_by_user = $partner->created_by_user; 
        $contactObj->created_by_company = $partner->created_by_company;
        $contactObj->points = 0;
        $contactObj->source = 'widget';
        $contactObj->sourceRef = $partner->id; //widget id
        $contactObj->reasonToContact = $reason;
        $saved = $contactObj->save();
        $conatctId = $contactObj->id;

        return response()->json(['message' => 'Lead captured'], 200);
    }

    public function verify(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string',
            'domain'     => 'required|string',
        ]);
        
        $partner = widgets_model::where('widgetKey', $validated['key'])->first();

        if (!$partner) {
            return response()->json(['error' => 'Partner not found'], 404);
        }

        $partner->validate = 1; //validate or verified
        $partner->save();

        return response()->json(['message' => 'Domain verified']);
    }


    //==== handle request from webhook widget

    function handlewebhook(Request $request){

        $validator = Validator::make($request->all(), [
            'fname' => 'nullable|string|max:191',
            'lname' => 'nullable|string|max:191',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:191',
            'company' => 'nullable|string|max:191',
            'country' => 'nullable|string|max:191',
            'reason' => 'nullable|string|max:255',
            'message' => 'nullable|string|max:1000',
            /*'event' => 'nullable|string|max:100',
            'referrer' => 'nullable|url',*/
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
    
        $validated = $validator->validated();
    
        Log::info('Webhook received', $validated);

        $fname = $request->input("fname");
        $lname = $request->input("lname");
        $email = $request->input("email");
        $phone = $request->input("phone");
        $company = $request->input("company");
        $country = $request->input("country");
        $reason = $request->input("reason");
        $message = $request->input("message");
        $key = $request->input("key");
        $page_url = $request->input("page_url");
        $referrer = $request->input("referrer");


        // Extract origin host
        $origin = parse_url($request->headers->get('origin'), PHP_URL_HOST)
            ?? parse_url($request->headers->get('referer'), PHP_URL_HOST);

        $partner = widgets_model::where('widgetKey', $key)->first();

        if (!$partner || !$origin || stripos($origin, $partner->website) === false) {
            return response()->json(['error' => 'Unauthorized domain'], 403);
        }
        
        //save to db
        $today = date("Y-m-d H:i:s");
        
        $contactObj = new contacts_model();
        $contactObj->title = '';
        $contactObj->firstname = $fname;
        $contactObj->lastname = $lname;
        $contactObj->email = $email;
        $contactObj->address1 = '';
        $contactObj->address2 = '';
        $contactObj->city = '';
        $contactObj->state = '';
        $contactObj->zipcode = '';
        $contactObj->country = $country;
        $contactObj->mobile = $phone ;
        $contactObj->company = $company;
        $contactObj->is_published = 1;
        $contactObj->date_added = $today;
        $contactObj->created_by = $partner->created_by;
        $contactObj->created_by_user = $partner->created_by_user; 
        $contactObj->created_by_company = $partner->created_by_company;
        $contactObj->points = 0;
        $contactObj->source = 'widget';
        $contactObj->sourceRef = $partner->id; //widget id
        $contactObj->reasonToContact = $reason;
        $saved = $contactObj->save();
        $conatctId = $contactObj->id;


        return response()->json([
            'success' => true,
            'message' => 'Webhook received successfully',
            'data' => $validated
        ]);
    }

    //==== handle request from form widget

    function contactform(Request $request){
        $widgetKey = $request->input("key");

        if($widgetKey){
            $widgetRw = widgets_model::where('widgetKey', $widgetKey)->where('active', 1)->first();

            if($widgetRw){
                $widgetAttribute = [
                    "widgetId" => $widgetRw->id,
                    "widgetKey" => $widgetRw->widgetKey,
                    "active" => $widgetRw->active,
                    "widgetParameters" => $widgetRw->parameters,
                    "widgetType" => $widgetRw->type,
                    "widgetHeading" => $widgetRw->widgetHeading
                ];
                
                $data = [
                    "pageTitle" => $widgetRw->widgetHeading,
                    "widgetAttribute" => $widgetAttribute,
                ];
                
                return view('contactForm', $data);

            }else{
                //access denied
                die('Access denied.');
            }
        }else{
            //access denied
            die('Invalid link.');
        }
        
    }

    function handlecontactform(Request $request){
        
        /*
        dd($request);
        die();
        "fname" => "dd"
        "lname" => "kk"
        "email" => "dd@example.com"
        "company" => "cc"
        "country" => "ct"
        "key" => "0296b59745aff24e"
        */

        $fname = $request->input("fname");
        $lname = $request->input("lname");
        $email = $request->input("email");
        
        $phone = $request->input("mobilenumber");
        if(!$phone){
            $phone = '';
        }

        $company = $request->input("company");
        if(!$company){
            $company = '';
        }

        $country = $request->input("country");
        if(!$country){
            $country = '';
        }

        $reason = $request->input("reason");
        if(!$reason){
            $reason = '';
        }

        $message = $request->input("message");
        if(!$message){
            $message = '';
        }

        $key = $request->input("key");
        

        /*
        // Validate if needed
        $validated = $request->validate([
            'fname' => 'nullable|string|max:255',
            'lname' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'mobilenumber' => 'nullable|string',
            'company' => 'nullable|string',
            'country' => 'nullable|string',
            'reason' => 'nullable|string',
            'message' => 'nullable|string',
        ]);
        */

        $partner = widgets_model::where('widgetKey', $key)->where('active', 1)->first();
        if($partner){
            //save to db
            $today = date("Y-m-d H:i:s");
            
            $contactObj = new contacts_model();
            $contactObj->title = '';
            $contactObj->firstname = $fname;
            $contactObj->lastname = $lname;
            $contactObj->email = $email;
            $contactObj->address1 = '';
            $contactObj->address2 = '';
            $contactObj->city = '';
            $contactObj->state = '';
            $contactObj->zipcode = '';
            $contactObj->country = $country;
            $contactObj->mobile = $phone ;
            $contactObj->company = $company;
            $contactObj->is_published = 1;
            $contactObj->date_added = $today;
            $contactObj->created_by = $partner->created_by;
            $contactObj->created_by_user = $partner->created_by_user; 
            $contactObj->created_by_company = $partner->created_by_company;
            $contactObj->points = 0;
            $contactObj->source = 'widget';
            $contactObj->sourceRef = $partner->id; //widget id
            $contactObj->reasonToContact = $reason;
            $saved = $contactObj->save();
            $conatctId = $contactObj->id;

            return response()->json([
                'code' => 100,
                'message' => 'Form submitted successfully!'
            ]);
        }else{
            return response()->json([
                'code' => 101,
                'message' => 'Invalid link'
            ]);
        }
    }

}