<?php
/*
Ok Report
*/

namespace App\Console\Commands;
use App\Jobs\ProcessEmailRepliesJob;
use Illuminate\Console\Command;
use App\Models\settings_model;

//php artisan process:emailreplies

class ProcessEmailReplies extends Command
{
    protected $signature = 'process:emailreplies';
    protected $description = 'Get and feed replies for emails sent through campaigns or newsletters';

    public function handle()
    {

        /*
        "GODADDY" => array("HOST" => "{imap.secureserver.net:993/imap/ssl}INBOX", "USERNAME" => "infodkg@dkgiri.in", "PASSWORD" => "D1n3shG1r1dkg"),

        "GMAIL" => array("HOST" => "{imap.gmail.com:993/imap/ssl}INBOX", "USERNAME" => "giridineshkumar85dkg@gmail.com", "PASSWORD" => "xblchgzblhbgcfbsdkg"),
        
        "OUTLOOK" => array("HOST" => "{outlook.office365.com:993/imap/ssl}INBOX", "USERNAME" => "giridineshkumar85dkg@outlook.com", "PASSWORD" => 'D1n3shG1r1dkg')
        */

        // Dispatch a job for each imap
        settings_model::select("imap")
        ->chunk(100, function ($imaps) {
            
            foreach ($imaps as $imap) {
                // Dispatch a job for each campaign to process its events
                $inboxCredentials = json_decode($imap["imap"], true);
                
                //$inboxCredentials = array("HOST" => "{imap.gmail.com:993/imap/ssl}INBOX", "USERNAME" => "giridineshkumar85dkg@gmail.com", "PASSWORD" => "xblchgzblhbgcfbsDKG");

                $host = $inboxCredentials["host"] ?? '';
                $port = $inboxCredentials["port"] ?? '';
                $encryption = $inboxCredentials["encryption"] ?? '';
                $username = $inboxCredentials["username"] ?? '';
                $password = $inboxCredentials["password"] ?? '';
            
                if (empty($host) || empty($port) || empty($encryption) || empty($username) || empty($password)) {
                    return response()->json([
                        'C' => 102,
                        'M' => 'Incomplete IMAP configuration.',
                        'R' => [],
                    ]);

                    $this->info('Incomplete IMAP configuration.');

                }else{
                    $result = ProcessEmailRepliesJob::dispatch($inboxCredentials);
                    $this->info("Job dispatched for IMAP {$username}");
                }

            }
        });

    }

}
