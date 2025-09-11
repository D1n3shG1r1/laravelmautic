<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use RoachPHP\Roach;

class RunLaravelDocsSpider extends Command
{
    protected $signature = 'spider:run-laravel-docs';
    protected $description = 'Run the LaravelDocsSpider using Roach';

    public function handle()
    {
        $this->info("Starting LaravelDocsSpider...");
        Roach::startSpider(\App\Spiders\LaravelDocsSpider::class);
        $this->info("Spider run complete.");
    }
}