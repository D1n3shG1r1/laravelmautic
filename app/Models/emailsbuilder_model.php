<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class emailsbuilder_model extends Model
{
    use HasFactory;
    protected $table = "emails";
    public $timestamps = false; // Disable automatic timestamps
    //protected $primaryKey = 'id';
    //public $incrementing = false;
    //public $timestamps = false;
}