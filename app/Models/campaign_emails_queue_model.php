<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class campaign_emails_queue_model extends Model
{
    //use HasFactory;
    protected $table = "campaignEmailsQueue";
    public $timestamps = false; // Disable automatic timestamps
}