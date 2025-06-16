<?php
/*
Ok Report
*/

namespace App\Console\Commands;

//use App\Jobs\ProcessCampaignJob;
use App\Jobs\ProcessNewsletterJob;
//use App\Models\campaigns_model;
use App\Models\emailsbuilder_model;
use Illuminate\Console\Command;

class ProcessNewsletter extends Command
{
    protected $signature = 'process:newsletters';
    protected $description = 'Fetch the active newsletters and trigger them';

    public function handle()
    {
        // Fetch all campaigns in smaller batches to prevent memory issues
        $today = date("Y-m-d");
        $published = 1;

        $emailsCount = emailsbuilder_model::where("publish_up", "<=", $today)
        ->where("publish_down", ">=", $today)
        ->where("is_published", $published)
        ->count();

        $this->info("Found {$emailsCount} newsletter emails for today.");

        if ($emailsCount === 0) {
            $this->warn("No newsletter emails matched today's date and published status.");
        }
        
        emailsbuilder_model::where("publish_up", "<=", $today)
        ->where("publish_down", ">=", $today)
        ->where("is_published", $published)
        ->chunk(100, function ($newsletterEmails) {
            //dd($newsletterEmails);
            //print_r($newsletterEmails); die;
            foreach ($newsletterEmails as $newsletterEmail) {
                // Dispatch a job for each campaign to process its events
               $result = ProcessNewsletterJob::dispatch($newsletterEmail->id);
               
            }
        });

        $this->info('Jobs dispatched to process newsletter emails.');
    }

}
