<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScrapedPage extends Model
{
    
    use HasFactory;
    protected $table = "scraped_pages";
    protected $primaryKey = "id";
    public $incrementing = false;
    public $timestamps = false;
    //protected $guarded = []; // or define specific fillable fields
}
