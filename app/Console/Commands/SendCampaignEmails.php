<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\campaign_emails_queue_model;
use App\Jobs\SendCampaignEmail;
/*
Run the command in terminal to test :
php artisan campaign:send-emails
php artisan queue:work
*/

class SendCampaignEmails extends Command
{
    protected $signature = 'process:send-campaign-emails';
    protected $description = 'Send campaign emails to all users';

    public function handle()
    {
        $this->info('Starting to dispatch campaign emails...');

        /*
        campaign_emails_queue_model::where("emailSent", 0)
        ->chunk(100, function ($emailQueue) {

            foreach ($emailQueue as $emailRw) {
                $data = [
                    'id' => $emailRw->id,
                    'campaignId' => $emailRw->campaignId
                ];
                
                SendCampaignEmail::dispatch($data);
            }
    
            $this->info('All emails dispatched to the queue.');
        });
        */

        $trigger_date = date("Y-m-d");

        campaign_emails_queue_model::where("emailSent", 0)
            ->where(function($query) use ($trigger_date) {
                $query->whereNull("triggerDate")
                    ->orWhere("triggerDate", $trigger_date);
            })
            ->chunk(100, function ($emailQueue) {

                foreach ($emailQueue as $emailRw) {
                    $data = [
                        'id' => $emailRw->id,
                        'campaignId' => $emailRw->campaignId
                    ];
                    
                    SendCampaignEmail::dispatch($data);
                }

                $this->info('All emails dispatched to the queue.');
            });

    }
}

