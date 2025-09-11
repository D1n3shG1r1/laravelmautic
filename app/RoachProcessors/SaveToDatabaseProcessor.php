<?php

namespace App\RoachProcessors;

use RoachPHP\ItemPipeline\ItemInterface;
use RoachPHP\ItemPipeline\Processors\ItemProcessorInterface;
use RoachPHP\Support\ConfigurableInterface;
use App\Models\ScrapedPage;

class SaveToDatabaseProcessor implements ItemProcessorInterface
{

    // Required by ConfigurableInterface
    public function configure(array $options): void
    {
        // You can optionally use $options to customize the processor
        
    }

    public function processItem(ItemInterface $item): ItemInterface
    {
        try {
            //info('Attempting to save item: ' . json_encode($item->all()));
            info('Attempting to save items');

            /*ScrapedPage::create([
                'title' => $item->get('title'),
                'h1' => json_encode($item->get('h1')),
                'h2' => json_encode($item->get('h2')),
                'h3' => json_encode($item->get('h3')),
                'h4' => json_encode($item->get('h4')),
                'h5' => json_encode($item->get('h5')),
                'h6' => json_encode($item->get('h6')),
                'subtitles' => json_encode($item->get('subtitles')),
                'links' => json_encode($item->get('links')),
                'thumbnails' => json_encode($item->get('thumbnails')),
                'paragraph' => json_encode($item->get('paragraph')),
            ]);*/

            $ScrapedPageObj = new ScrapedPage();
            
            //$ScrapedPageObj->id = 1;
            $ScrapedPageObj->roachWebsiteId = $item->get('roachWebsiteId');
            $ScrapedPageObj->title = $item->get('title');
            $ScrapedPageObj->h1 = json_encode($item->get('h1'));
            $ScrapedPageObj->h2 = json_encode($item->get('h2'));
            $ScrapedPageObj->h3 = json_encode($item->get('h3'));
            $ScrapedPageObj->h4 = json_encode($item->get('h4'));
            $ScrapedPageObj->h5 = json_encode($item->get('h5'));
            $ScrapedPageObj->h6 = json_encode($item->get('h6'));
            $ScrapedPageObj->subtitles = json_encode($item->get('subtitles'));
            $ScrapedPageObj->links = json_encode($item->get('links'));
            $ScrapedPageObj->thumbnails = json_encode($item->get('thumbnails'));
            $ScrapedPageObj->paragraph = json_encode($item->get('paragraph'));
            $ScrapedPageObj->date_added = date("Y-m-d H:i:s");
            $saved = $ScrapedPageObj->save();
            info('Item saved to database:'.$saved);
            
        } catch (\Exception $e) {
            info('Failed to save item: ' . $e->getMessage());
        }

        return $item;
    }
}
