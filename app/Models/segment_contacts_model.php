<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class segment_contacts_model extends Model
{
    use HasFactory;

    protected $table = "segment_contacts";  // Table name
    
    // Disable timestamps since your table doesn't have created_at/updated_at
    public $timestamps = false;
    
    // Set 'segment_id' as the primary key
    protected $primaryKey = 'segment_id';  // 'segment_id' is the primary key
    
    // Disable auto-incrementing if 'segment_id' is not auto-incrementing
    public $incrementing = false;

    // Allow mass assignment for these attributes
    protected $fillable = [
        'contact_id',
        'segment_id',  // Primary key
        'date_added',
        'manually_removed',
        'manually_added',
    ];
}
