<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;

use App\Models\campaigns_model;
use App\Models\contacts_model;
use App\Models\segments_model;
use App\Models\tags_model;
use App\Models\role_model;

use Facade\FlareClient\View;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;



class Dashboard extends Controller
{
    var $ERRORS = [];
    var $USERID = 0;
    function __construct(){
        parent::__construct();    
        $this->ERRORS = config("errormessage");
        $this->USERID = $this->getSession('userId');
    }

    function dashboard(Request $request){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin'); // Removed die for debugging

            $contactsCount = 0;
            $segmentsCount = 0;
            $campaignsCount = 0;
            $tagsCount = 0;

            // Fetch counts based on admin or regular user
            if ($isAdmin > 0) {
                $contactsCount = contacts_model::where("created_by_company", $userCompany)->count();
                $segmentsCount = segments_model::where("created_by_company", $userCompany)->count();
                $campaignsCount = campaigns_model::where("created_by_company", $userCompany)->count();
                $tagsCount = tags_model::where("created_by_company", $userCompany)->count();

                // Get last 7 days added contacts
                $today = Carbon::today(); // Today date using Carbon
                $endDate = Carbon::today()->subDays();
                $startDate = Carbon::today()->subDays(7); // 6 days ago
                
                // Calculate the difference in days
                $daysDifference = $startDate->diffInDays($today);
                
                $contacts = contacts_model::where("created_by_company", $userCompany)
                ->whereDate('date_added', '>=', $startDate->format('Y-m-d')) // Compare date part only
                ->whereDate('date_added', '<=', $endDate->format('Y-m-d')) // Compare date part only
                ->get();

                //get latest upcoming campaigns
                $upcomingCampigns = campaigns_model::select("id","name","publish_up","publish_down")
                ->where("created_by_company", $userCompany)
                ->where("is_published", 1)
                ->whereDate('publish_up', '>=', $today->format('Y-m-d'))
                ->orderBy("publish_up","asc")
                ->get();
                
                
            } else {
                $contactsCount = contacts_model::where("created_by", $this->USERID)->count();
                $segmentsCount = segments_model::where("created_by", $this->USERID)->count();
                $campaignsCount = campaigns_model::where("created_by", $this->USERID)->count();
                $tagsCount = tags_model::where("created_by", $this->USERID)->count();
            
                // Get last 7 days added contacts
                $today = Carbon::today(); // Today date using Carbon
                $endDate = Carbon::today()->subDays();
                $startDate = Carbon::today()->subDays(7); // 6 days ago
                
                // Calculate the difference in days
                $daysDifference = $startDate->diffInDays($today);
                
                $contacts = contacts_model::where("created_by", $this->USERID)
                ->whereDate('date_added', '>=', $startDate->format('Y-m-d')) // Compare date part only
                ->whereDate('date_added', '<=', $endDate->format('Y-m-d')) // Compare date part only
                ->get();

                $upcomingCampigns = campaigns_model::select("id","name","publish_up","publish_down")
                ->where("created_by", $this->USERID)
                ->where("is_published", 1)
                ->whereDate('publish_up', '>=', $today->format('Y-m-d'))
                ->orderBy("publish_up","asc")
                ->get();
            }
            
            $dateLabels = [];
            $datewiseRecords = array();
            for($i = 0; $i < $daysDifference; $i++){
                if($i == 0){
                    $dateStr = $startDate->format('d-m-Y');
                }else{
                    $dateStr = $startDate->addDay()->format('d-m-Y');
                }
                
                $dateLabels[] = $dateStr;
                $datewiseRecords[$dateStr] = 0;
            }

            if($contacts){
                foreach($contacts as $cont){
                    $dtKey = date("d-m-Y", strtotime($cont->date_added));
                    $datewiseRecords[$dtKey] = $datewiseRecords[$dtKey] + 1;
                }
            }

            // Prepare data for the chart
            $contactChart = [
                "data" => $datewiseRecords,
                "labels" => $dateLabels
            ];


            if($upcomingCampigns){
                foreach($upcomingCampigns as &$upCamp){
                    $upCamp->publish_up = date("d-m-Y", strtotime($upCamp->publish_up));
                    $upCamp->publish_down = date("d-m-Y", strtotime($upCamp->publish_down));
                }
            }


            // Return the data to the frontend
            $data = [
                "contactsCount" => $contactsCount,
                "segmentsCount" => $segmentsCount,
                "campaignsCount" => $campaignsCount,
                "tagsCount" => $tagsCount,
                "contactChart" => $contactChart,
                "upcomingCampigns" => $upcomingCampigns
            ];

            return Inertia::render('Dashboard', [
                'PageTitle' => 'Dashboard',
                'csrfToken' => $csrfToken,
                'Params' => $data
            ]);

        } else {
            // Redirect to sign-in if the user is not authenticated
            return Redirect::to(url('signin'));
        }
    }

    /*function dashboard(Request $request){

        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin'); die;

            $contactsCount = 0;
            $segmentsCount = 0;
            $campaignsCount = 0;
            $tagsCount = 0;

            if ($isAdmin > 0) {
                
                $contactsCount = contacts_model::where("created_by_company", $userCompany)->count();
                $segmentsCount = segments_model::where("created_by_company", $userCompany)->count();

                $campaignsCount = campaigns_model::where("created_by_company", $userCompany)->count();
                $tagsCount = tags_model::where("created_by_company", $userCompany)->count();

                // Get last 7 days added contacts
                $today = date("Y-m-d");
                $startDate = date("Y-m-d", strtotime("-7 days"));

                // Retrieve contacts added by the user within the last 7 days
                $contacts = contacts_model::where("created_by_company", $userCompany)
                    ->where("date_added", ">=", $startDate)
                    ->where("date_added", "<=", $today)
                    ->get();

                // Group the contacts by date and count the number of contacts for each date
                $contactsCountByDate = $contacts->groupBy('date_added')->map(function ($dayContacts) {
                    return $dayContacts->count();
                });

            } else {

                $contactsCount = contacts_model::where("created_by", $this->USERID)->count();
                $segmentsCount = segments_model::where("created_by", $this->USERID)->count();
                $campaignsCount = campaigns_model::where("created_by", $this->USERID)->count();
                $tagsCount = tags_model::where("created_by", $this->USERID)->count();

                // Get last 7 days added contacts
                $today = date("Y-m-d");
                $startDate = date("Y-m-d", strtotime("-7 days"));
                
                // Retrieve contacts added by the user within the last 7 days
                $contacts = contacts_model::where("created_by", $this->USERID)
                    ->where("date_added", ">=", $startDate)
                    ->where("date_added", "<=", $today)
                    ->get();

                // Group the contacts by date and count the number of contacts for each date
                $contactsCountByDate = $contacts->groupBy('date_added')->map(function ($dayContacts) {
                    return $dayContacts->count();
                });

            }

        
            $formattedData = [];
            foreach ($contactsCountByDate as $date => $count) {
                $formattedData[] = ['date' => date("M d, y", strtotime($date)), 'count' => $count];
            }

            // Get today's date
            $carbonToday = Carbon::today();

            // Get the start date, 7 days ago
            $startDate = Carbon::today()->subDays(7);

            // Create an array to store the date range
            $dateLables = [];

            // Loop through the dates between the start and end date
            for ($date = $startDate; $date <= $carbonToday; $date->addDay()) {
                $dateLables[] = $date->format('M d, y');
            }

            
            $contactChart =["data"=>$formattedData, "lable"=>$dateLables];
            
            $data = array();
            $data["contactsCount"] = $contactsCount;
            $data["segmentsCount"] = $segmentsCount;
            $data["campaignsCount"] = $campaignsCount;
            $data["tagsCount"] = $tagsCount;
            $data["contactChart"] = $contactChart;

            //dd($data);
            return Inertia::render('Dashboard', [
                'PageTitle'  => 'Dashboard',
                'csrfToken' => $csrfToken,
                'Params' => $data
            ]);
            
        }else{
            //redirect to signin
            return Redirect::to(url('signin'));
        }

    }*/
}
