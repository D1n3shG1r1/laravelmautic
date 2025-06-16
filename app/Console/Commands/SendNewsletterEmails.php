<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\newsletter_emails_queue_model;
use App\Jobs\SendNewsletterEmail;
/*
Run the command in terminal to test :
php artisan campaign:send-emails
php artisan queue:work
*/

class SendNewsletterEmails extends Command
{
    protected $signature = 'process:send-newsletter-emails';
    protected $description = 'Send newsletter emails to all users';

    public function handle()
    {
        $this->info('Starting to dispatch newsletter emails...');

        $emailRow = newsletter_emails_queue_model::where("emailSent", 0)
        ->first();


        newsletter_emails_queue_model::where("emailSent", 0)
        ->chunk(100, function ($emailQueue) {

            foreach ($emailQueue as $emailRw) {
                $data = [
                    'id' => $emailRw->id,
                    'emailId' => $emailRw->emailId
                ];
                
                SendNewsletterEmail::dispatch($data);
            }
    
            $this->info('All newsletter-emails dispatched to the queue.');
        });

    }
}

