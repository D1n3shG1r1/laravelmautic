<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tags_model extends Model
{
    use HasFactory;
    protected $table = "tags";
    public $timestamps = false; // Disable automatic timestamps
    //protected $primaryKey = 'id';
    //public $incrementing = false;
    //public $timestamps = false;
    // Define the fillable properties to allow mass assignment
    /*protected $fillable = [
        'tag', // Add 'tag' to the fillable array to allow mass assignment
        'description', // Example of other fields you may need
        'date_added',
        'created_by',
        'created_by_user',
        'created_by_company',
        'date_modified',
        'modified_by',
        'modified_by_user',
    ];*/
}