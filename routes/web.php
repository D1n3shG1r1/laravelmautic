<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Campaign;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/campaignbuilder',[Campaign::class, 'campaignBuilder']);
Route::post('/newevent',[Campaign::class, 'getEventHtml']);
Route::post('/savenewevent',[Campaign::class, 'saveEvent']);
Route::post('/addcampaignsegment',[Campaign::class, 'addCampaignSegment']);



