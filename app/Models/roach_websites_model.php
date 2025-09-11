<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class roach_websites_model extends Model
{
    use HasFactory;
    protected $table = "roach_websites";
    protected $primaryKey = "id";
    public $incrementing = false;
    public $timestamps = false;
}
