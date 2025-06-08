<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class scrap_sitemap_data extends Model
{
    use HasFactory;
    protected $table = "scrap_sitemap_datas";
    protected $primaryKey = "id";
    public $incrementing = false;
    public $timestamps = false;
}
