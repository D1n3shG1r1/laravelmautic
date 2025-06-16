<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use App\Models\scrap_sitemap_data;

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

    function getNews(Request $request){

        // Check if user is authenticated
        if ($this->USERID <= 0) {
            return Redirect::to(url('signin'));
        }

        $csrfToken = csrf_token();
        $userCompany = $this->getSession('companyId');
        $isAdmin = $this->getSession('isAdmin');

        // Request inputs
        $websiteName = $request->input('websiteName');
        $fromDate = $request->input('fromDate');
        $toDate = $request->input('toDate');

        // Build the base query
        $pagesQuery = scrap_sitemap_data::query()
            ->select([
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
                'keywords as Keywords',
            ]);

        // Apply filters
        if (!empty($websiteName)) {
            $pagesQuery->where('websiteName', 'LIKE', '%' . $websiteName . '%');
        }

        if (!empty($fromDate)) {
            $pagesQuery->where('pickupDate', '>=', $fromDate);
        }

        if (!empty($toDate)) {
            $pagesQuery->where('pickupDate', '<=', $toDate);
        }

        // Filter based on user/admin
        if ($isAdmin > 0) {
            $pagesQuery->where('created_by_company', $userCompany);
        } else {
            $pagesQuery->where('created_by', $this->USERID);
        }

        // Order and paginate
        $pages = $pagesQuery->orderBy('pickupDate', 'desc')->paginate(10)->withQueryString();

        // Format and clean paginated results
        $pages->getCollection()->transform(function ($page) {
            $page->Website = substr(strip_tags($page->Website), 0, 160) . '...';
            $page->PageLink = substr(strip_tags($page->PageLink), 0, 160) . '...';
            $page->Heading = substr(strip_tags($page->Heading), 0, 160) . '...';
            $page->SubHeading = substr(strip_tags($page->SubHeading), 0, 160) . '...';
            $page->Body = substr(strip_tags($page->Body), 0, 160) . '...';
            $page->Author = substr(strip_tags($page->Author), 0, 160) . '...';

            return $page;
        });

        // Format date fields
        if ($pages) {
            foreach ($pages as &$page) {
                $page->PublishDate = date('M d, y', strtotime($page->PublishDate));
                $page->PickupDate = date('M d, y', strtotime($page->PickupDate));
            }
        }

        // Pass data to frontend
        $data = [
            'news' => $pages,
            'newsUrl' => url('news'),
        ];

        return Inertia::render('News', [
            'pageTitle' => 'News',
            'csrfToken' => $csrfToken,
            'params' => $data,
        ]);
    }


    function new(Request $request){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            $data = array();
            $data["newsUrl"] = url('news');
            
            return Inertia::render('NewNews', [
                'pageTitle'  => 'New News',
                'csrfToken' => $csrfToken,
                'params' => $data
            ]);

        }else{
            //redirect to signin
            return Redirect::to(url('signin'));
        }
    }
    
    function save(Request $request){

        if($this->USERID > 0){
            $userCompany = $this->getSession('companyId');
            $firstName = $this->getSession('firstName');
            $lastName = $this->getSession('lastName');
            $fullName = $firstName." ".$lastName; 
            $today = date("Y-m-d");
            
            $sitemapDBID = 0;
            $selectorId = 0;
            $selector = "";
            $selectorType = "html";


            $website = $request->input("website");
            $pageLink = $request->input("pageLink");
            $heading = $request->input("heading");
            $subHeading = $request->input("subHeading");
            $body = $request->input("body");
            $author = $request->input("author");
            $publishedOn = $request->input("publishedOn");
            $pickupDate = date("Y-m-d");
            $createDateTime = date("Y-m-d H:i:s");

            $sitemapDataObj = new scrap_sitemap_data();
            
            //$sitemapDataObj->id = db_randnumber();
            $sitemapDataObj->sitemapId = $sitemapDBID;
            $sitemapDataObj->selectorId = $selectorId;
            $sitemapDataObj->selector = $selector;
            $sitemapDataObj->selectorType = $selectorType;
            $sitemapDataObj->selectorData = $body;
            $sitemapDataObj->websiteName = $website;
            $sitemapDataObj->websiteUrl = $pageLink;
            $sitemapDataObj->author = $author;
            $sitemapDataObj->heading = $heading;
            $sitemapDataObj->subHeading = $subHeading;
            $sitemapDataObj->publishDate = $publishedOn;
            $sitemapDataObj->pickupDate = $pickupDate;
            $sitemapDataObj->keywords = '';
            $sitemapDataObj->date_added = $createDateTime;
            $sitemapDataObj->date_modified = $createDateTime;           
            $sitemapDataObj->created_by = $this->USERID;
            $sitemapDataObj->created_by_user = $fullName;
            $sitemapDataObj->created_by_company = $userCompany;
            $sitemapDataObj->modified_by = $this->USERID;
            $sitemapDataObj->modified_by_user = $fullName;
            
            $saved = $sitemapDataObj->save();

            if($saved){
                $response = [
                    'C' => 100,
                    'M' => $this->ERRORS[130],
                    'R' => [],
                ];
            }else{
                $response = [
                    'C' => 101,
                    'M' => $this->ERRORS[133],
                    'R' => [],
                ];
            }
            

        }else{
            //session expired
            $response = [
                'C' => 1004,
                'M' => $this->ERRORS[1004],
                'R' => [],
            ];
        }
        
        return response()->json($response); die;
    }



    function editnews($id){
        if ($this->USERID > 0) {
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');
    
            // Retrieve the news item based on the given ID
            $row = scrap_sitemap_data::select("id", "websiteName", "websiteUrl", "selectorData", "author", "heading", "subHeading", "publishDate", "pickupDate")
                ->where("id", $id);
    
            // Check if the user is an admin and filter accordingly
            if ($isAdmin > 0) {
                $row = $row->where('created_by_company', $userCompany);
            } else {
                $row = $row->where('created_by', $this->USERID);
            }
    
            $row = $row->first(); // Execute the query and get the result
    
            // Check if a news row is found
            if ($row) {
                $data = array();
                $data["newsUrl"] = url('news');
                $data["data"] = $row;
    
                return Inertia::render('EditNews', [
                    'pageTitle' => 'Edit News',
                    'csrfToken' => $csrfToken,
                    'params' => $data
                ]);
            } else {
                // Return a 404 response if no record is found
                abort(404, 'Page not found');
            }
        } else {
            // Redirect to the sign-in page if the user is not authenticated
            return Redirect::to(url('signin'));
        }
    }
    
    
    
    function update(Request $request){
        
        if($this->USERID > 0){
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');
            $firstName = $this->getSession('firstName');
            $lastName = $this->getSession('lastName');
            $fullName = $firstName." ".$lastName; 
            $today = date("Y-m-d");

            $id = $request->input("id");
            $website = $request->input("website");
            $pageLink = $request->input("pageLink");
            $heading = $request->input("heading");
            $subHeading = $request->input("subHeading");
            $body = $request->input("body");
            $author = $request->input("author");
            $publishedOn = $request->input("publishedOn");

            $updateData = array(
                "date_modified" => $today,
                "modified_by" => $this->USERID,
                "modified_by_user" => $fullName,
                "selectorData" => $body,
                "websiteName" => $website,
                "websiteUrl" => $pageLink,
                "author" => $author,
                "heading" => $heading,
                "subHeading" => $subHeading,
                "publishDate" => $publishedOn
            );

            $row = scrap_sitemap_data::where("id", $id);
            // Check if the user is an admin and filter accordingly
            if ($isAdmin > 0) {
                $row = $row->where('created_by_company', $userCompany);
            } else {
                $row = $row->where('created_by', $this->USERID);
            }

            $row->update($updateData);

            $response = [
                'C' => 100,
                'M' => $this->ERRORS[132],
                'R' => [],
            ];

        }else{
            //session expired
            $response = [
                'C' => 1004,
                'M' => $this->ERRORS[1004],
                'R' => [],
            ];
        }
        return response()->json($response); die;

    }

    function delete(Request $request){
        
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            $id = $request->input("id");
             
            $deleted = scrap_sitemap_data::where("created_by_company", $userCompany)->where("id", $id)->delete();
            
            if($deleted){
                $response = [
                    'C' => 100,
                    'M' => $this->ERRORS[131],
                    'R' => [],
                ];
            }else{
                $response = [
                    'C' => 100,
                    'M' => $this->ERRORS[134],
                    'R' => [],
                ];
            }
            
        }else{
            //session expired
            
            $response = [
                'C' => 1004,
                'M' => $this->ERRORS[1004],
                'R' => [],
            ];
        }

        return response()->json($response); die;
    }
}
