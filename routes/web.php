<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Campaign;
use App\Http\Controllers\Register;
use App\Http\Controllers\Dashboard;
use App\Http\Controllers\Contacts;
use App\Http\Controllers\Segments;
use App\Http\Controllers\Whatsapp;
use App\Http\Controllers\Emailsbuilder;
use App\Http\Controllers\EmailReplies;
use App\Http\Controllers\Newsletters;
use App\Http\Controllers\Tags;
use App\Http\Controllers\Widgets;
use App\Http\Controllers\Settings;
use App\Http\Controllers\RoachWebsites;

use App\Http\Controllers\Media;
use App\Http\Controllers\BrevoWebhookController;

use App\Http\Controllers\LeadTrackingController;

use App\Http\Controllers\Test;

/*Route::get('/', function () {
    return view('welcome');
});*/

Route::prefix('api')->name('api.')->group(function () {

    //webform widget
    Route::get('/contactform', [LeadTrackingController::class, 'contactform']);
    Route::post('/contactformsubmit', [LeadTrackingController::class, 'handlecontactform']);

    //webhook widget
    Route::post('/webhook', [LeadTrackingController::class, 'handlewebhook']);


    //popup widget
    Route::get('/check-domain', function (Request $request) {
        $partner = \App\Models\widgets_model::where('widgetKey', $request->key)->first();
    
        $isValid = 0;
        if($partner && $partner->website === $request->domain){
            $isValid = 1; //$partner && $partner->website === $request->domain;    
        }
        
    
        return response()->json([
            'isValid' => $isValid,
            'active' => $partner->active,
            'verified' => $partner->validate,
            'requiredInputs' => $partner->parameters,
            'widgetType' => $partner->type,
            'widgetHeading' => $partner->widgetHeading
        ]);
    });

    Route::post('/track', [LeadTrackingController::class, 'track']);
    Route::post('/verify-domain', [LeadTrackingController::class, 'verify']);
});

//Test Routes for Campaign Builder
Route::get('/campaignbuilderidx',[Campaign::class, 'index']);
Route::get('/campaignbuilder',[Campaign::class, 'campaignBuilder']);
//Test Routes for Campaign Builder

Route::get('/campaigns',[Campaign::class, 'campaigns']);
//Route::get('/campaign/edit/{id}',[Campaign::class, 'campaign']);

Route::get('/campaign/edit/{id}',[Campaign::class, 'new']);
Route::get('/campaign/view/{id}',[Campaign::class, 'view']);

Route::get('/campaigns/new',[Campaign::class, 'new']);
Route::post('/campaign/save',[Campaign::class, 'save']);
Route::post('/campaign/delete',[Campaign::class, 'delete']);
Route::post('/newevent',[Campaign::class, 'getEventHtml']);
Route::post('/savenewevent',[Campaign::class, 'saveEvent']);
Route::post('/deleteevent',[Campaign::class, 'deleteEvent']);

Route::post('/addcampaignsegment',[Campaign::class, 'addCampaignSegment']);
//Events Data-List Segments, Tags eg.
Route::post('/campaigns/getEventDropdownSegmentsList',[Campaign::class, 'getEventDropdownSegmentsList']);
Route::post('/campaigns/getEventDropdownTagsList',[Campaign::class, 'getEventDropdownTagsList']);
Route::post('/campaigns/getEventDropdownEmailsList',[Campaign::class, 'getEventDropdownEmailsList']);
Route::post('/campaigns/getEventCampaignList',[Campaign::class, 'getEventCampaignList']);


Route::get('/',[Register::class,'signin_get']);
Route::get('/signin',[Register::class,'signin_get']);
Route::post('/signin',[Register::class,'signin_post']);
Route::get('/signup',[Register::class,'signup_get']);
Route::post('/signup',[Register::class,'signup_post']);
Route::get('/signout',[Register::class,'signout']);


Route::get('/dashboard',[Dashboard::class,'dashboard']);

Route::get('/contacts',[Contacts::class,'contacts']);
Route::get('/contacts/new',[Contacts::class,'new']);
Route::post('/contact/save',[Contacts::class,'save']);
Route::get('/contact/edit/{id}',[Contacts::class,'contact']);
Route::post('/contact/update',[Contacts::class,'update']);
Route::post('/contact/delete',[Contacts::class,'delete']);
Route::post('/contacts/import',[Contacts::class,'importcontacts']);

Route::get('/segments',[Segments::class,'segments']);
Route::get('/segments/new',[Segments::class,'new']);
Route::post('/segment/save',[Segments::class,'save']);
Route::get('segment/view/{id}',[Segments::class,'segmentView']);
Route::get('/segment/edit/{id}',[Segments::class,'segment']);
Route::post('/segment/update',[Segments::class,'update']);
Route::post('/segment/delete',[Segments::class,'delete']);

Route::get('/whatsapp',[Whatsapp::class,'whatsappmessages']);

Route::get('/emails',[Emailsbuilder::class,'emails']);
Route::get('/emails/new',[Emailsbuilder::class,'new']);
Route::post('/email/save',[Emailsbuilder::class,'save']);
Route::get('/email/edit/{id}',[Emailsbuilder::class,'email']);
Route::post('/email/update',[Emailsbuilder::class,'update']);
Route::post('/email/delete',[Emailsbuilder::class,'delete']);
Route::get('/email/view/{id}',[Emailsbuilder::class,'view']);
Route::post('/emailreplies',[EmailReplies::class,'getReplies']);
Route::post('/email/saveattachment',[Emailsbuilder::class,'saveattachment']);


Route::get('/news',[Newsletters::class,'getnews']);
Route::get('/news/newwebsite',[Newsletters::class,'new']);
Route::get('/news/edit/{id}',[Newsletters::class,'editnews']);
Route::post('/news/websitesave',[Newsletters::class,'save']);
Route::post('/news/websiteupdate',[Newsletters::class,'update']);
Route::post('/news/websitedelete',[Newsletters::class,'delete']);
Route::post('/newsletters/getnewswebsites',[Newsletters::class,'getnewswebsites']);
Route::post('/newsletters/createnewsletter',[Newsletters::class,'createnewsletter']);

Route::get('/scrapwebsites',[RoachWebsites::class,'websites']);
Route::get('/scrap/newwebsite',[RoachWebsites::class,'newwebsite']);
Route::post('/scrap/newwebsitesave',[RoachWebsites::class,'newwebsitesave']);
Route::get('/scrapwebsite/edit/{id}',[RoachWebsites::class,'editwebsite']); 
Route::post('/scrapwebsite/update',[RoachWebsites::class,'websiteupdate']);
Route::post('/scrapwebsite/websitedelete',[RoachWebsites::class,'delete']);

Route::get('/tags',[Tags::class,'tags']);
Route::get('/tags/new',[Tags::class,'new']);
Route::post('/tag/save',[Tags::class,'save']);
Route::get('/tag/edit/{id}',[Tags::class,'tag']);
Route::post('/tag/update',[Tags::class,'update']);
Route::post('/tag/delete',[Tags::class,'delete']);

Route::get('/widgets',[Widgets::class,'widgets']);
Route::get('/widgets/new',[Widgets::class,'new']);
Route::post('/widget/save',[Widgets::class,'save']);
Route::get('/widget/edit/{id}',[Widgets::class,'edit']);
Route::post('/widget/delete',[Widgets::class,'delete']);
Route::post('/widget/Update',[Widgets::class,'update']);

Route::get('/settings',[Settings::class,'settings']);
Route::post('/emaildsn/update',[Settings::class,'updateEmaildsn']);
Route::post('/emaildsn/sendtestmail',[Settings::class,'sendTestEmail']);
Route::post('/imap/update',[Settings::class,'updateImap']);
Route::get('/imap/testconnection',[Settings::class,'testimapConnection']);
Route::post('/imap/testconnection',[Settings::class,'testimapConnection']);


Route::post('/media/save',[Media::class,'save']);


//brevo webhook
Route::post('/webhooks/brevo', [BrevoWebhookController::class, 'handle']);

//cron commands
Route::get('/processsegmentcontact',[Test::class,'processsegmentcontact']);
