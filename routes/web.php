<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Campaign;
use App\Http\Controllers\Register;
use App\Http\Controllers\Dashboard;
use App\Http\Controllers\Contacts;
use App\Http\Controllers\Segments;
use App\Http\Controllers\Emailsbuilder;
use App\Http\Controllers\Test;

/*Route::get('/', function () {
    return view('welcome');
});*/

//Route::get('/',[Campaign::class, 'index']);
//Route::get('/campaignbuilder',[Campaign::class, 'campaignBuilder']);
Route::post('/newevent',[Campaign::class, 'getEventHtml']);
Route::post('/savenewevent',[Campaign::class, 'saveEvent']);
Route::post('/addcampaignsegment',[Campaign::class, 'addCampaignSegment']);

Route::get('/',[Register::class,'signin_get']);
Route::get('/signin',[Register::class,'signin_get']);
Route::post('/signin',[Register::class,'signin_post']);
Route::get('/signup',[Register::class,'signup_get']);
Route::post('/signup',[Register::class,'signup_post']);

Route::get('/dashboard',[Dashboard::class,'dashboard']);

Route::get('/contacts',[Contacts::class,'contacts']);
Route::get('/contacts/new',[Contacts::class,'new']);
Route::post('/contact/save',[Contacts::class,'save']);

Route::get('/segments',[Segments::class,'segments']);
Route::get('/segments/new',[Segments::class,'new']);
Route::post('/segment/save',[Segments::class,'save']);
Route::get('/segment/edit/{id}',[Segments::class,'segment']);
Route::post('/segment/update',[Segments::class,'update']);
Route::post('/segment/delete',[Segments::class,'delete']);


Route::get('/emails',[Emailsbuilder::class,'emails']);
Route::get('/emails/new',[Emailsbuilder::class,'new']);

//cron commands
Route::get('/processsegmentcontact',[Test::class,'processsegmentcontact']);
