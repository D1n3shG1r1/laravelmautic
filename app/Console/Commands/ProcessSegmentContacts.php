<?php
/*
namespace App\Console\Commands;

use App\Models\contacts_model;
use App\Models\segments_model;
use App\Models\segment_contacts_model;

use Illuminate\Console\Command;

class ProcessSegmentContacts extends Command
{
    // The name and signature of the console command
    protected $signature = 'process:segment-contacts';

    //Run the Command
    //php artisan process:segment-contacts


    // The console command description
    protected $description = 'Fetch contacts based on segment filters and save their relationship in segment_contacts table';

    /**
     * Execute the console command.
     *
     * @return void
     * /

    
     public function handle()
     {
        //segments_model contacts_model segment_contacts_model
        // Step 1: Retrieve the filters from the 'segments_model'
        $segments = segments_model::all(); // You can customize the query based on your needs
        
        foreach ($segments as $segment) {
            // Get the filters for each segment
            $filters = $segment->filters;  // Assuming 'filters' is a JSON or related column on the Segment model

            if (!$filters) {
                $this->info("No filters found for segment ID: {$segment->id}");
                continue; // Skip if no filters are found
            }

            // Step 2: Retrieve contacts based on the filters
            $contacts = contacts_model::where($filters)->get();  // Customize the filtering logic as needed

            if ($contacts->isEmpty()) {
                $this->info("No contacts found for filters in segment ID: {$segment->id}");
                continue; // Skip if no contacts match the filters
            }

            // Step 3: Save contact and segment IDs in the 'segment_contacts' table
            foreach ($contacts as $contact) {
                segment_contacts_model::create([
                    'contact_id' => $contact->id,
                    'segment_id' => $segment->id,
                ]);
            }

            $this->info("Successfully processed segment ID: {$segment->id}");
        }
    }
}
*/

namespace App\Console\Commands;

use App\Jobs\ProcessSegmentContactsJob;
use App\Models\segments_model;
use Illuminate\Console\Command;

class ProcessSegmentContacts extends Command
{
    protected $signature = 'process:segment-contacts';
    protected $description = 'Fetch contacts based on segment filters and save their relationship in segment_contacts table';

    public function handle()
    {
        // Fetch all segments in smaller batches to prevent memory issues
        segments_model::chunk(100, function ($segments) {
            foreach ($segments as $segment) {
                // Dispatch a job for each segment to process its contacts
                $this->info('Job dispatched segment:'.$segment->id);
                ProcessSegmentContactsJob::dispatch($segment->id);
            }
        });

        $this->info('Jobs dispatched to process contacts for segments.');
    }
}
