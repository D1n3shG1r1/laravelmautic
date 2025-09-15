<?php

namespace App\Console;

use App\Console\Commands\ProcessSegmentContacts;
use App\Console\Commands\ProcessCampaigns;
use App\Console\Commands\RunLaravelDocsSpider;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    // Register the command
    protected $commands = [
        ProcessSegmentContacts::class,  // Register the command
        ProcessCampaigns::class,
        RunLaravelDocsSpider::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param \Illuminate\Console\Scheduling\Schedule $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        /*
        Don't Forget: Set Up Cron on Server
        For scheduled commands to run, your server must have this cron job set up (once):

        
        * * * * * php /path-to-your-project/artisan schedule:run >> /dev/null 2>&1
        
        This runs Laravel’s scheduler every minute, which then checks which scheduled commands should fire.
        
        */

        // You can schedule the command to run periodically if needed.
        //## 1 — Minute 0
        $schedule->command('process:segment-contacts')
        ->everyFifteenMinutes()
        ->withoutOverlapping();

        //## 2 — Minute 2
        $schedule->command('process:campaigns')
            ->cron('2-59/15 * * * *') // Start at minute 2, then every 15 min
            ->withoutOverlapping();

        //## 3 — Minute 4
        $schedule->command('process:send-campaign-emails')
            ->cron('4-59/15 * * * *')
            ->withoutOverlapping();

        //## 4 — Minute 6
        $schedule->command('process:newsletters')
            ->cron('6-59/15 * * * *')
            ->withoutOverlapping();

        //## 5 — Minute 8
        $schedule->command('process:send-newsletter-emails')
            ->cron('8-59/15 * * * *')
            ->withoutOverlapping();

        //## 6 — Minute 10
        $schedule->command('process:emailreplies')
            ->cron('10-59/15 * * * *')
            ->withoutOverlapping();

        //## 7 — Minute 12
        //$schedule->command('spider:run-laravel-docs')
        //    ->cron('12-59/15 * * * *')
        //    ->withoutOverlapping();
        
        // please run these commands in following sequence
        //## 1
        // $schedule->command('process:segment-contacts')->daily();

        //## 2
        //$schedule->command('process:campaigns')->daily();

        //## 3
        //$schedule->command('process:send-campaign-emails')->daily();

        //## 4
        //$schedule->command('process:newsletters')->daily();

        //## 5
        //$schedule->command('process:send-newsletter-emails')->daily();

        //## 6
        //$schedule->command('process:emailreplies')->daily();

        //## 7 for web-scraping by using roach-spider
        //$schedule->command('spider:run-laravel-docs')->daily();

        //run on terminal to test command
        //php artisan process:segment-contacts
        //php artisan process:campaigns
        //php artisan process:send-campaign-emails
        //php artisan process:newsletters
        //php artisan process:send-newsletter-emails
        //php artisan process:emailreplies
        //php artisan spider:run-laravel-docs

    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');
    }
}
