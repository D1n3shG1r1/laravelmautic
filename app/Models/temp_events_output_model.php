<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class temp_events_output_model extends Model
{
    /*
    event triggered on the basis of decision/condition matched/not-macthed contacts
    */
    //use HasFactory;
    protected $table = "temp_events_output";
    public $timestamps = false; // Disable automatic timestamps
}
