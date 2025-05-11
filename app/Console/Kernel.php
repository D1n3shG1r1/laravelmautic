<?php

namespace App\Console;

use App\Console\Commands\ProcessSegmentContacts;
use App\Console\Commands\ProcessCampaigns;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        ProcessSegmentContacts::class,  // Register the command
        ProcessCampaigns::class,
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
        //## 1
        // $schedule->command('process:segment-contacts')->daily();

        //## 2
        //$schedule->command('process:campaigns')->daily();

        //## 3
        //$schedule->command('process:send-campaign-emails')->daily();

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
