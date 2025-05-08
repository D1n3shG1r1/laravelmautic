<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Campaign;
use App\Http\Controllers\Register;
use App\Http\Controllers\Dashboard;
use App\Http\Controllers\Contacts;
use App\Http\Controllers\Segments;
use App\Http\Controllers\Whatsapp;
use App\Http\Controllers\Emailsbuilder;
use App\Http\Controllers\Tags;
use App\Http\Controllers\Settings;

use App\Http\Controllers\Media;

use App\Http\Controllers\BrevoWebhookController;

use App\Http\Controllers\Test;

/*Route::get('/', function () {
    return view('welcome');
});*/

//Test Routes for Campaign Builder
Route::get('/campaignbuilderidx',[Campaign::class, 'index']);
Route::get('/campaignbuilder',[Campaign::class, 'campaignBuilder']);
//Test Routes for Campaign Builder

Route::get('/campaigns',[Campaign::class, 'campaigns']);
Route::get('/campaigns/new',[Campaign::class, 'new']);
Route::post('/campaign/save',[Campaign::class, 'save']);
Route::post('/newevent',[Campaign::class, 'getEventHtml']);
Route::post('/savenewevent',[Campaign::class, 'saveEvent']);
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

Route::get('/dashboard',[Dashboard::class,'dashboard']);

Route::get('/contacts',[Contacts::class,'contacts']);
Route::get('/contacts/new',[Contacts::class,'new']);
Route::post('/contact/save',[Contacts::class,'save']);
Route::get('/contact/edit/{id}',[Contacts::class,'contact']);
Route::post('/contact/update',[Contacts::class,'update']);
Route::post('/contact/delete',[Contacts::class,'delete']);

Route::get('/segments',[Segments::class,'segments']);
Route::get('/segments/new',[Segments::class,'new']);
Route::post('/segment/save',[Segments::class,'save']);
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

Route::get('/tags',[Tags::class,'tags']);
Route::get('/tags/new',[Tags::class,'new']);
Route::post('/tag/save',[Tags::class,'save']);
Route::get('/tag/edit/{id}',[Tags::class,'tag']);
Route::post('/tag/update',[Tags::class,'update']);
Route::post('/tag/delete',[Tags::class,'delete']);

Route::get('/settings',[Settings::class,'settings']);
Route::post('/emaildsn/update',[Settings::class,'updateEmaildsn']);
Route::post('/emaildsn/sendtestmail',[Settings::class,'sendTestEmail']);

Route::post('/media/save',[Media::class,'save']);


//brevo webhook
Route::post('/webhooks/brevo', [BrevoWebhookController::class, 'handle']);

//cron commands
Route::get('/processsegmentcontact',[Test::class,'processsegmentcontact']);
