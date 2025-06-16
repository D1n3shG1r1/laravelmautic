<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class newsletter_emails_queue_model extends Model
{
    //use HasFactory;
    protected $table = "newsletterEmailsQueue";
    public $timestamps = false; // Disable automatic timestamps
}
