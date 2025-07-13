<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class email_replies_model extends Model
{
    use HasFactory;
    protected $table = "emailReplies";
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;
}
