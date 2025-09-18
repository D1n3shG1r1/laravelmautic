<?php
/*
https://roach-php.dev/docs/laravel/
commands:
create-spide: php artisan roach:spider LaravelDocsSpider
run-spider: php artisan roach:run LaravelDocsSpider
*/

namespace App\Spiders;
use Generator;
//use App\RoachProcessors\SaveToDatabaseProcessor;
use RoachPHP\Downloader\Middleware\RequestDeduplicationMiddleware;
use RoachPHP\Extensions\LoggerExtension;
use RoachPHP\Extensions\StatsCollectorExtension;
use RoachPHP\Http\Response;
use RoachPHP\Spider\BasicSpider;
use RoachPHP\Spider\ParseResult;
use App\Models\roach_websites_model;

class LaravelDocsSpider extends BasicSpider
{
    public array $startUrls = []; //["https://timesofindia.indiatimes.com/"];

    public array $downloaderMiddleware = [
        RequestDeduplicationMiddleware::class,
    ];

    public array $spiderMiddleware = [];

    public array $extensions = [
        LoggerExtension::class,
        StatsCollectorExtension::class,
    ];

    public array $itemProcessors = [
        /*\RoachPHP\ItemPipeline\Processors\DebugProcessor::class,
        \RoachPHP\ItemPipeline\Processors\JsonLinesFileProcessor::class => [
            'filename' => 'storage/app/spider_output.jsonl',
            'overwrite' => true,
        ],*/
        \App\RoachProcessors\SaveToDatabaseProcessor::class,
    ];

    
    public int $concurrency = 2;

    public int $requestDelay = 1;

    /*function __construct()
    {
        info('Roach spider is loading websites in construct!');
        //get websites from db
        $Websites = roach_websites_model::select("*")->where("active", 1)->get();
       

        if($Websites){
            $dynamicUrls = [];
            foreach($Websites as $Website){
                $dynamicUrls[] = $Website->websitelink;
            }            
            //dd($dynamicUrls);
            
            info('dynamicUrls count' . count($dynamicUrls));

            parent::__construct($dynamicUrls);
        }
        
    }*/

    /*public function startRequests(): \Generator
    {
        $websites = roach_websites_model::where('active', 1)->get();
        
        info('Roach spider is loading websites!');

        foreach ($websites as $website) {
            yield $this->request('GET', $website->websitelink);
        }
    }*/

    protected function initialRequests(): array
    {
        //with frequency
        $websites = roach_websites_model::where('active', 1)->get();

        $requests = [];
        foreach ($websites as $website) {
            //frequency monthday weekdays cronexpressions
            $frequency = $website->frequency;
            $monthday = $website->monthday;
            $weekdays = $website->weekdays;
            $cronexpressions = $website->cronexpressions;

            if ($frequency == 'daily') {
                $requests[] = new \RoachPHP\Http\Request(
                    'GET',
                    $website->websitelink,
                    [$this, 'parse'],
                    ['meta' => ['websiteId' => $website->id]]
                );
            } elseif ($frequency == 'weekly') {
                // If frequency is 'weekly', check if today's day is in the list of weekdays
                $days = json_decode($weekdays); // Decode the weekdays into an array
                if (in_array(now()->format('l'), $days)) {
                    $requests[] = new \RoachPHP\Http\Request(
                        'GET',
                        $website->websitelink,
                        [$this, 'parse'],
                        ['meta' => ['websiteId' => $website->id]]
                    );
                }
            } elseif ($frequency == 'customweekdays') {
                // If frequency is 'customweekdays', check if today's day is in the list of custom weekdays
                $days = json_decode($weekdays); // Decode the weekdays into an array
                if (in_array(now()->format('l'), $days)) {
                    $requests[] = new \RoachPHP\Http\Request(
                        'GET',
                        $website->websitelink,
                        [$this, 'parse'],
                        ['meta' => ['websiteId' => $website->id]]
                    );
                }
            } elseif ($frequency == 'monthly' && $monthday == now()->day) {
                // Update records on the specified day of the month
                $requests[] = new \RoachPHP\Http\Request(
                    'GET',
                    $website->websitelink,
                    [$this, 'parse'],
                    ['meta' => ['websiteId' => $website->id]]
                );
            }
        }

        return $requests;
    }


    protected function initialRequests__dd(): array{
        //without frequency
        $websites = roach_websites_model::where('active', 1)->get();

        $requests = [];
        foreach ($websites as $website) {
            $requests[] = new \RoachPHP\Http\Request(
                'GET',
                $website->websitelink,
                [$this, 'parse'],
                ['meta' => ['websiteId' => $website->id]]
            );
        }

        return $requests;
    }


    // ✅ Correct way to return processors
    public function getItemProcessors(): array
    {
        //(Remove DebugProcessor and JsonLinesFileProcessor if you don’t need them anymore.)

        /*return [
            \RoachPHP\ItemPipeline\Processors\DebugProcessor::class,
            \RoachPHP\ItemPipeline\Processors\JsonLinesFileProcessor::class => [
                'filename' => storage_path('app/spider_output.jsonl'),
                'overwrite' => true,
            ],
            \App\RoachProcessors\SaveToDatabaseProcessor::class,
        ];*/

        return [
            SaveToDatabaseProcessor::class,
        ];
    }

    /**
     * @return Generator<ParseResult>
     */
    public function parse(Response $response): Generator
    {
        //dd($response->getRequest());
        //dd($response);
        
        $meta = $response->getRequest()->getOptions()['meta'] ?? [];
        $roachWebsiteId = $meta['websiteId'] ?? null;

        info('Roach spider is parsing the response!');

         // Use `each()` to get all elements of each type
        $h1 = $response->filter('h1')->each(function ($node) {
            return $node->text(); // Extract the text of each h1 element
        });

        $h2 = $response->filter('h2')->each(function ($node) {
            return $node->text(); // Extract the text of each h2 element
        });

        $h3 = $response->filter('h3')->each(function ($node) {
            return $node->text(); // Extract the text of each h3 element
        });

        $h4 = $response->filter('h4')->each(function ($node) {
            return $node->text(); // Extract the text of each h4 element
        });

        $h5 = $response->filter('h5')->each(function ($node) {
            return $node->text(); // Extract the text of each h5 element
        });

        $h6 = $response->filter('h6')->each(function ($node) {
            return $node->text(); // Extract the text of each h6 element
        });

        $a = $response->filter('a')->each(function ($node) {
            return $node->text(); // Extract the text of each a element
        });

        $p = $response->filter('p')->each(function ($node) {
            return $node->text(); // Extract the text of each p element
        });


        // Extracting the page title (from the <title> tag)
        $title = $response->filter('title')->text();

        // Extracting subtitles (if any, usually <h3> or similar)
        $subtitles = $response->filter('h3')->each(function ($node) {
            return $node->text();
        });

        // Extracting links (all anchor tags <a>)
        $links = $response->filter('a')->each(function ($node) {
            return $node->attr('href'); // Extract the href attribute of <a> tags
        });

        // Extracting thumbnails (usually <img> tags with src attribute for the image)
        $thumbnails = $response->filter('img')->each(function ($node) {
            return $node->attr('src'); // Extract the src attribute of <img> tags
        });

        // Yielding the scraped data as an item
        yield $this->item([
            'roachWebsiteId' => $roachWebsiteId,
            'title' => $title,
            'h1' => $h1,
            'h2' => $h2,
            'h3' => $h3,
            'h4' => $h4,
            'h5' => $h5,
            'h6' => $h6,
            'subtitles' => $subtitles,
            'links' => $links,
            'thumbnails' => $thumbnails,
            'paragraph' => $p
        ]);
    }
}