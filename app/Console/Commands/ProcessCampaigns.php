<?php
/*
Ok Report
*/

namespace App\Console\Commands;

use App\Jobs\ProcessCampaignJob;
use App\Models\campaigns_model;
use Illuminate\Console\Command;

class ProcessCampaigns extends Command
{
    protected $signature = 'process:campaigns';
    protected $description = 'Fetch the active campaigns and trigger their related events';

    public function handle()
    {
        // Fetch all campaigns in smaller batches to prevent memory issues
        $today = date("Y-m-d");
        $published = 1; 

        $campaignsCount = campaigns_model::where("publish_up", "<=", $today)
        ->where("publish_down", ">=", $today)
        ->where("is_published", $published)
        ->count();

    $this->info("Found {$campaignsCount} campaigns for today.");

    if ($campaignsCount === 0) {
        $this->warn("No campaigns matched today's date and published status.");
    }
        
        campaigns_model::where("publish_up", "<=", $today)
        ->where("publish_down", ">=", $today)
        ->where("is_published", $published)
        ->chunk(100, function ($campaigns) {
            //dd($campaigns);
            //print_r($campaigns); die;
            foreach ($campaigns as $campaign) {
                // Dispatch a job for each campaign to process its events
               $result = ProcessCampaignJob::dispatch($campaign->id);
               
            }
        });

        $this->info('Jobs dispatched to process campaign events.');
    }

}
