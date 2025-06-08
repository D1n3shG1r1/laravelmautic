<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use App\Models\scrap_sitemap_data;
//use App\Models\emailsbuilder_model;
//use App\Models\segments_model;
//use App\Models\segment_contacts_model;
//use App\Models\contacts_model;
//use App\Models\role_model;

class Newsletters extends Controller
{
    var $ERRORS = [];
    var $USERID = 0;
    function __construct(){
        parent::__construct();    
        $this->ERRORS = config("errormessage");
        $this->USERID = $this->getSession('userId');
    }

    function getnewswebsites(Request $request){
        
        if ($this->USERID <= 0) {
            return response()->json([
                'C' => 1004,
                'M' => $this->ERRORS[1004] ?? 'Session expired',
                'R' => [],
            ]);
        }

        $csrfToken = csrf_token();
        $userCompany = $this->getSession('companyId');
        $isAdmin = $this->getSession('isAdmin');

        $websiteName = $request->input('websiteName');
        $fromDate = $request->input('fromDate');
        $toDate = $request->input('toDate');

        // NEW: Pagination inputs with fallback
        $page = (int)$request->input('page', 1);
        $pageSize = (int)$request->input('pageSize', 10);
        $offset = ($page - 1) * $pageSize;

        $pages = scrap_sitemap_data::query()
            ->select(
                'id', 
                'created_by', 
                'sitemapId', 
                'selectorId', 
                'selector', 
                'selectorType', 
                'selectorData as Body', 
                'websiteName as Website', 
                'websiteUrl as PageLink', 
                'author as Author', 
                'heading as Heading', 
                'subHeading as SubHeading', 
                'publishDate as PublishDate', 
                'pickupDate as PickupDate', 
                'keywords as Keywords'
            );

        if (!empty($websiteName)) {
            $pages->where('websiteName', 'LIKE', '%' . $websiteName . '%');
        }

        if (!empty($fromDate)) {
            $pages->where('pickupDate', '>=', $fromDate);
        }

        if (!empty($toDate)) {
            $pages->where('pickupDate', '<=', $toDate);
        }

        if ($isAdmin > 0) {
            $pages->where("created_by_company", $userCompany);
        } else {
            $pages->where("created_by", $this->USERID);
        }

        $pages->orderBy('pickupDate', 'desc');

        // NEW: Apply pagination
        $results = $pages
            ->offset($offset)
            ->limit($pageSize)
            ->get();

        $processedResults = $results->map(function ($pageRw) {
            $pageRw->Website = $this->truncate(strip_tags($pageRw->Website));
            $pageRw->PageLink = $this->truncate(strip_tags($pageRw->PageLink));
            $pageRw->Heading = $this->truncate(strip_tags($pageRw->Heading));
            $pageRw->SubHeading = $this->truncate(strip_tags($pageRw->SubHeading));
            $pageRw->Body = $this->truncate(strip_tags($pageRw->Body));
            $pageRw->Author = $this->truncate(strip_tags($pageRw->Author));
            return $pageRw;
        });

        return response()->json([
            'C' => 100,
            'M' => 'success',
            'R' => [
                'websitesList' => $processedResults,
                'page' => $page,
                'pageSize' => $pageSize,
                'hasMore' => $processedResults->count() === $pageSize // optional
            ]
        ]);
    }

    function getnewswebsitesd(Request $request){

        if ($this->USERID <= 0) {
            return response()->json([
                'C' => 1004,
                'M' => $this->ERRORS[1004] ?? 'Session expired',
                'R' => [],
            ]);
        }

        $csrfToken = csrf_token();
        $userCompany = $this->getSession('companyId');
        $isAdmin = $this->getSession('isAdmin');

        $websiteName = $request->input('websiteName');
        $fromDate = $request->input('fromDate');
        $toDate = $request->input('toDate');

        $pages = scrap_sitemap_data::query()
            ->select(
                'id', 
                'created_by', 
                'sitemapId', 
                'selectorId', 
                'selector', 
                'selectorType', 
                'selectorData as Body', 
                'websiteName as Website', 
                'websiteUrl as PageLink', 
                'author as Author', 
                'heading as Heading', 
                'subHeading as SubHeading', 
                'publishDate as PublishDate', 
                'pickupDate as PickupDate', 
                'keywords as Keywords'
            );

        if (!empty($websiteName)) {
            $pages->where('websiteName', 'LIKE', '%' . $websiteName . '%');
        }

        if (!empty($fromDate)) {
            $pages->where('pickupDate', '>=', $fromDate);
        }

        if (!empty($toDate)) {
            $pages->where('pickupDate', '<=', $toDate);
        }

        if ($isAdmin > 0) {
            $pages->where("created_by_company", $userCompany);
        } else {
            $pages->where("created_by", $this->USERID);
        }

        $pages->orderBy('pickupDate', 'desc');

        $results = $pages->get();

        // Process the results
        $processedResults = $results->map(function ($pageRw) {
            $pageRw->Website = $this->truncate(strip_tags($pageRw->Website));
            $pageRw->PageLink = $this->truncate(strip_tags($pageRw->PageLink));
            $pageRw->Heading = $this->truncate(strip_tags($pageRw->Heading));
            $pageRw->SubHeading = $this->truncate(strip_tags($pageRw->SubHeading));
            $pageRw->Body = $this->truncate(strip_tags($pageRw->Body));
            $pageRw->Author = $this->truncate(strip_tags($pageRw->Author));
            return $pageRw;
        });

        //dd($processedResults);
        //if ($processedResults->isNotEmpty()) {
            
            return response()->json([
                'C' => 100,
                'M' => 'success',
                'R' => array('websitesList' => $processedResults),
            ]);
        //}
        /*
        return response()->json([
            'C' => 101,
            'M' => 'No result found',
            'R' => [],
        ]);
        */
    }

    // Optional helper for truncating strings
    function truncate($string, $limit = 160){
        return mb_strlen($string) > $limit ? mb_substr($string, 0, $limit) . '...' : $string;
    }


    function createnewsletter(Request $request){
        //feed content in selected theme template
       
        $selectedWebsitesId = $request->input('selectedWebsitesId');

        $pages = scrap_sitemap_data::query()->select('id', 'selectorData', 'websiteName', 'websiteUrl', 'author', 'heading', 'subHeading', 'publishDate')
        ->whereIn('id', $selectedWebsitesId);

        $results = $pages->get();

        //do it later
        //themes for newsletter
        $newsletterThemesData = [];
        $themesNames = ["newsletter"];
       
       foreach ($themesNames as $themeName) {
           $templatePath = public_path('themes/'.$themeName . '/' . $themeName . '.html');
           
           if (file_exists($templatePath)) {
               
               $html = fileRead($templatePath);
               
               $thumbnailPath = url('themes/'.$themeName . '/thumbnail.png');
           
               // Add theme data to the array
               $newsletterThemesData[] = [
                   'name' => str_replace('_', ' ', $themeName),
                   'id' => $themeName,
                   'html' => $html,
                   'css' => '',
                   'thumbnail' => $thumbnailPath,
               ];
           }
       }

        /*--- working code ---*/
        $newsletterData = $results;

        
        //get template html
        $themeName = 'newsletter';
        $templatePath = public_path('themes/'.$themeName . '/' . $themeName . '.html');
        $templateContent = file_get_contents($templatePath);
        $finalRowsHtml = '';
        $newsletterHtml = '';

        if(!empty($templateContent) && $templateContent != ''){
            
            $templateContentParts = explode("[#ROW_HTML_TEMPLATE#]",$templateContent);

            $mainSkeleton = $templateContentParts[0]; //main skeleton
            $rowSkeleton = $templateContentParts[1]; //data rows skeleton
            
            //echo $rowSkeleton; die;
            if(!empty($newsletterData)){
                
                foreach($newsletterData as $newsletterRw){
                    
                    $newsContent = $newsletterRw->selectorData;
                    $newsContent = substr($newsContent,0,220).'...';
                    $websiteName = $newsletterRw->websiteName;
                    $websiteUrl = $newsletterRw->websiteUrl;
                    $author = $newsletterRw->author;
                    $author = ucwords($author);
                    $heading = $newsletterRw->heading;
                    $heading = ucwords($heading);
                    $subHeading = $newsletterRw->subHeading;
                    $subHeading = ucwords($subHeading);
                    $publishDate = $newsletterRw->publishDate;
                    $publishDate = date('F j, Y', strtotime($publishDate));
                    $tmpRow = $rowSkeleton;
                    //$tmpRow = str_replace(,$websiteName,$rowSkeleton);
                    //$tmpRow = str_replace(,$websiteUrl,$tmpRow);
                    $tmpRow = str_replace("[#HEADING#]",$heading,$tmpRow);
                    $tmpRow = str_replace("[#SUBHEADING#]",$subHeading,$tmpRow);
                    $tmpRow = str_replace("[#CONTENT#]",$newsContent,$tmpRow);
                    $tmpRow = str_replace("[#AUTHOR#]",$author,$tmpRow);
                    $tmpRow = str_replace("[#PUBLISHEDON#]",$publishDate,$tmpRow);
                    $tmpRow = str_replace("[#NEWS_IMG_URL#]",url('images/newspaper.jpg'),$tmpRow);
                    $tmpRow = str_replace("[#READMORE_LINK#]",$websiteUrl,$tmpRow);
                    
                    $finalRowsHtml .= $tmpRow;
                }
            
                foreach($newsletterData as $newsletterRw){
                    
                    $newsContent = $newsletterRw->selectorData;
                    $newsContent = substr($newsContent,0,220).'...';
                    $websiteName = $newsletterRw->websiteName;
                    $websiteUrl = $newsletterRw->websiteUrl;
                    $author = $newsletterRw->author;
                    $author = ucwords($author);
                    $heading = $newsletterRw->heading;
                    $heading = ucwords($heading);
                    $subHeading = $newsletterRw->subHeading;
                    $subHeading = ucwords($subHeading);
                    $publishDate = $newsletterRw->publishDate;
                    $publishDate = date('F j, Y', strtotime($publishDate));
                    $tmpRow = $rowSkeleton;
                    //$tmpRow = str_replace(,$websiteName,$rowSkeleton);
                    //$tmpRow = str_replace(,$websiteUrl,$tmpRow);
                    $tmpRow = str_replace("[#HEADING#]",$heading,$tmpRow);
                    $tmpRow = str_replace("[#SUBHEADING#]",$subHeading,$tmpRow);
                    $tmpRow = str_replace("[#CONTENT#]",$newsContent,$tmpRow);
                    $tmpRow = str_replace("[#AUTHOR#]",$author,$tmpRow);
                    $tmpRow = str_replace("[#PUBLISHEDON#]",$publishDate,$tmpRow);
                    $tmpRow = str_replace("[#NEWS_IMG_URL#]",url('images/newspaper.jpg'),$tmpRow);
                    $tmpRow = str_replace("[#READMORE_LINK#]",$websiteUrl,$tmpRow);
                    
                    $finalRowsHtml .= $tmpRow;
                }

                foreach($newsletterData as $newsletterRw){
                    
                    $newsContent = $newsletterRw->selectorData;
                    $newsContent = substr($newsContent,0,220).'...';
                    $websiteName = $newsletterRw->websiteName;
                    $websiteUrl = $newsletterRw->websiteUrl;
                    $author = $newsletterRw->author;
                    $author = ucwords($author);
                    $heading = $newsletterRw->heading;
                    $heading = ucwords($heading);
                    $subHeading = $newsletterRw->subHeading;
                    $subHeading = ucwords($subHeading);
                    $publishDate = $newsletterRw->publishDate;
                    $publishDate = date('F j, Y', strtotime($publishDate));
                    $tmpRow = $rowSkeleton;
                    //$tmpRow = str_replace(,$websiteName,$rowSkeleton);
                    //$tmpRow = str_replace(,$websiteUrl,$tmpRow);
                    $tmpRow = str_replace("[#HEADING#]",$heading,$tmpRow);
                    $tmpRow = str_replace("[#SUBHEADING#]",$subHeading,$tmpRow);
                    $tmpRow = str_replace("[#CONTENT#]",$newsContent,$tmpRow);
                    $tmpRow = str_replace("[#AUTHOR#]",$author,$tmpRow);
                    $tmpRow = str_replace("[#PUBLISHEDON#]",$publishDate,$tmpRow);
                    $tmpRow = str_replace("[#NEWS_IMG_URL#]",url('images/newspaper.jpg'),$tmpRow);
                    $tmpRow = str_replace("[#READMORE_LINK#]",$websiteUrl,$tmpRow);
                    
                    $finalRowsHtml .= $tmpRow;
                }

                $mainSkeleton = str_replace("[#LOGO_IMG_URL#]",url('images/sciplogo.png'),$mainSkeleton);

                $date = date('Y-m-d');
                $createdDate = date('F j, Y', strtotime($date));
                $mainSkeleton = str_replace("[#CREATED_DATE#]",$createdDate,$mainSkeleton);

                $signupLink = '';
                $mainSkeleton = str_replace("[#SIGNUP_LINK#]",$signupLink,$mainSkeleton);

                $shareLink = '';
                $mainSkeleton = str_replace("[#SHARE_LINK#]",$shareLink,$mainSkeleton);

                $subscriberEmail = 'subscriber@example.com';
                $mainSkeleton = str_replace("[#SUBSCRIBER_EMAIL#]",$subscriberEmail,$mainSkeleton);

                $subjectLine = 'Top stories for you!';
                $mainSkeleton = str_replace("[#SUBJECT#]",$subjectLine,$mainSkeleton);

                $newsletterHtml = str_replace("[#ROWS_HTML#]",$finalRowsHtml,$mainSkeleton);

            }
        }


        //dd($newsletterHtml);
        $newsletterThemesData[0]['html'] = $newsletterHtml;

        return response()->json([
            'C' => 100,
            'M' => 'success',
            'R' => $newsletterThemesData
        ]);

    }
}
