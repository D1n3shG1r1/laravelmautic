<?php

namespace App\Jobs;

use App\Models\contacts_model;
use App\Models\segments_model;
use App\Models\segment_contacts_model;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessSegmentContactsJob implements ShouldQueue
{
    use Queueable;

    protected $segmentId;

    /**
     * Create a new job instance.
     *
     * @param  int  $segmentId
     * @return void
     */
    public function __construct(int $segmentId)
    {
        $this->segmentId = $segmentId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Fetch the segment based on segmentId
        
        $segment = segments_model::find($this->segmentId);
        //dd($segment);
        // If the segment does not exist, skip this job
        if (!$segment) {
            return;
        }

        // Assuming the filters are stored as a JSON or an array on the segment
        $filters = $segment->filters; // or $segment->getFilters() if it's a custom method

        // If no filters exist, skip this job
        if (!$filters) {
            return;
        }

        $filtersArr = json_decode($filters, true);
        
        if(!empty($filtersArr)){

            // Get contacts based on the filters
            
            // Initialize the query builder for contacts model
            $contactsQuery = contacts_model::query();
            $contactsQuery->select('id');
            // Loop through each filter and dynamically build the query
            foreach ($filtersArr as $i => $filterRw) {
                /*
                [glue] => or
                [operator] => =
                [properties] => Array
                    (
                        [filter] => manojnakra@example.com
                    )
                [field] => email
                [type] => email
                [object] => contact
                */
                $glue = $filterRw['glue'];
                $operatorVal = $filterRw['operator'];
                $filter = $filterRw['properties']['filter'];
                $field = $filterRw['field'];
                
                $operator = '';
                
                if($operatorVal == '='){
                    $operator = '=';
                }else if($operatorVal == '!='){
                    $operator = '!=';
                }else if($operatorVal == 'empty'){
                    $operator = '=';
                    $filter = '';
                }else if($operatorVal == '!empty'){
                    $operator = '!=';
                    $filter = '';
                }else if($operatorVal == 'like'){
                    $operator = 'LIKE';
                    $filter = "%$filter%";
                }else if($operatorVal == '!like'){
                    $operator = 'NOT LIKE';
                    $filter = "%$filter%";
                }else if($operatorVal == 'startsWith'){
                    $operator = 'LIKE';
                    $filter = "$filter%";
                }else if($operatorVal == 'endsWith'){
                    $operator = 'LIKE';
                    $filter = "%$filter";
                }else if($operatorVal == 'contains'){
                    $operator = 'LIKE';
                    $filter = "%$filter%";
                }else if($operatorVal == 'in'){
                    $operator = 'IN' ;
                    $filter = "($filter)";
                }else if($operatorVal == '!in'){
                    $operator = 'NOT IN' ;
                    $filter = "($filter)";
                }else if($operatorVal == '>'){
                    $operator = '>' ;
                    $filter = $filter;
                }else if($operatorVal == '>='){
                    $operator = '>=' ;
                    $filter = $filter;
                }else if($operatorVal == '<'){
                    $operator = '<' ;
                    $filter = $filter;
                }else if($operatorVal == '<='){
                    $operator = '<=' ;
                    $filter = $filter;
                }
                
                if($operator != ''){
                    if ($i == 0) {
                        // For the first filter, use `where` directly
                        $contactsQuery->where($field, $operator, $filter);
                    } else {
                        // For subsequent filters, use `orWhere` or `where` based on the glue
                        if ($glue == "or") {
                            $contactsQuery->orWhere($field, $operator, $filter);
                        } else if ($glue == "and") {
                            $contactsQuery->where($field, $operator, $filter);
                        }
                    }
                }else{
                    Log::warning("Using inavlid Operator in contacts filter for segemet:$this->segmentId");
                    return;
                }
                
            }

            // Get the results from the query
            $contacts = $contactsQuery->get();

            // Begin a transaction to ensure data consistency
            DB::transaction(function () use ($segment, $contacts) {
                foreach ($contacts as $contact) {
                    
                    // Using firstOrCreate to prevent duplicate entries in segment_contacts
                    
                    $rows = segment_contacts_model::where("segment_id", $segment->id)->where("contact_id", $contact->id)->get();
                    
                    if($rows->isEmpty()){
                        
                        segment_contacts_model::firstOrCreate(
                            [
                                'segment_id' => $segment->id,
                                'contact_id' => $contact->id,
                                'date_added' => date("Y-m-d H:i:s"),
                                'manually_removed' => 0,
                                'manually_added' => 0
                            ]
                        );
                    }else{
                        //contct already associated
                        
                    }
                    
                    
                }
            });
        }
    }
}
