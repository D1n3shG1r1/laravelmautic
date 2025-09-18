<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

use App\Models\roach_websites_model;
use App\Models\role_model;
use Carbon\Carbon;

class RoachWebsites extends Controller
{
    var $ERRORS = [];
    var $USERID = 0;
    function __construct(){
        parent::__construct();    
        $this->ERRORS = config("errormessage");
        $this->USERID = $this->getSession('userId');
    }
    
    function websites(Request $request){
        if ($this->USERID > 0) {
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');

            // Build base query
            $query = roach_websites_model::select("id", "name", "purpose", "description", "websitelink", "date_added", "created_by", "created_by_user", "created_by_company", "date_modified", "modified_by", "modified_by_user", "active");

            // Apply user/company filter
            if ($isAdmin > 0) {
                $query->where("created_by_company", $userCompany);
            } else {
                $query->where("created_by", $this->USERID);
            }
            
            $query->orderBy("date_added","desc");

            // Paginate website
            $websites = $query->paginate(10);
            
            if($websites){
                foreach($websites as &$website){
                    $website->date_added = date('d-m-Y', strtotime($website->date_added));
                }
            }


            // Prepare the data to send to the view
            $data = [
                "websites" => $websites,
                "websitesUrl" => url('websites')
            ];

            // Return the view
            return Inertia::render('RoachWebsites', [
                'pageTitle' => 'Roach Websites',
                'csrfToken' => $csrfToken,
                'params' => $data
            ]);

        } else {
            // Redirect to signin if the user is not authenticated
            return Redirect::to(url('signin'));
        }

    }


    function newwebsite(Request $request){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');
            
            // Prepare the data to send to the view
            $data = [
                "websitesUrl" => url('websites')
            ];
            
            // Return the view
            return Inertia::render('RoachNewWebsite', [
                'pageTitle' => 'New Website',
                'csrfToken' => $csrfToken,
                'params' => $data
            ]);

        }else{
            // Redirect to signin if the user is not authenticated
            return Redirect::to(url('signin'));
        }
    }

    function newwebsitesave(Request $request){
        
        if($this->USERID > 0){
            
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');
            $firstName = $this->getSession('firstName');
            $lastName = $this->getSession('lastName');
            $fullName = $firstName." ".$lastName; 
            $today = date("Y-m-d");

            $name = $request->input("name");
            $websiteLink = $request->input("websiteLink");
            $description = $request->input("description");
            $active = $request->input("active");

            $selectedFrequency = $request->input("selectedFrequency");
            $selectedMonthDay = $request->input("selectedMonthDay");
            $selectedWeekdays = $request->input("selectedWeekdays");
            
            // Determine when the website should be scrap
            $cronExpressions = '';
            $frequency = $selectedFrequency;
            $days = $selectedWeekdays;
            $dayOfMonth = $selectedMonthDay;

            // Determine cron expression based on frequency
            if ($frequency === 'daily') {
                $cronExpressions = '0 0 * * *'; // Every day at midnight
            } elseif ($frequency === 'weekly') {
                $cronExpressions = '0 0 * * 1'; // Every Monday
            } elseif ($frequency === 'customweekdays') {
                foreach ($days as $day) {
                    $cronExpressions = '0 0 * * ' . getCronDay($day); // Custom weekdays
                }
            } elseif ($frequency === 'monthly' && $dayOfMonth) {
                $cronExpressions = "0 0 $dayOfMonth * *"; // On specific day of the month
            }


            $websiteObj = new roach_websites_model();
            //$websiteObj->id = 
            $websiteObj->name = $name;
            $websiteObj->description = $description;
            $websiteObj->websitelink = $websiteLink;
            $websiteObj->date_added = $today;
            $websiteObj->created_by = $this->USERID;
            $websiteObj->created_by_user = $fullName;
            $websiteObj->created_by_company = $userCompany;
            $websiteObj->date_modified = $today;
            $websiteObj->modified_by = $this->USERID;
            $websiteObj->modified_by_user = $fullName;
            $websiteObj->active = $active;
            $websiteObj->frequency = $selectedFrequency;
            $websiteObj->monthday = $selectedMonthDay;
            $websiteObj->weekdays = json_encode($selectedWeekdays);
            $websiteObj->cronexpressions = $cronExpressions;
            $saved = $websiteObj->save();
            
            if($saved){
                $response = [
                    'C' => 100,
                    'M' => $this->ERRORS[131],
                    'R' => [],
                ];
            }else{
                $response = [
                    'C' => 101,
                    'M' => $this->ERRORS[131],
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

    function editwebsite($id){
        if($this->USERID > 0){
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');
            
            if ($isAdmin > 0) {
                $websiteObj = roach_websites_model::select("id", "name", "purpose", "description", "websitelink", "date_added", "created_by", "created_by_user", "created_by_company", "date_modified", "modified_by", "modified_by_user", "active", "frequency", "monthday", "weekdays")->where("created_by_company", $userCompany)->where("id", $id)->first();
            }else{
                $websiteObj = roach_websites_model::select("id", "name", "purpose", "description", "websitelink", "date_added", "created_by", "created_by_user", "created_by_company", "date_modified", "modified_by", "modified_by_user", "active", "frequency", "monthday", "weekdays")->where("created_by", $this->USERID)->where("id", $id)->first();
            }

            // Prepare the data to send to the view
            $data = [
                "website" => $websiteObj,
                "websitesUrl" => url('websites')
            ];
            
            // Return the view
            return Inertia::render('RoachEditWebsite', [
                'pageTitle' => 'Edit Website',
                'csrfToken' => $csrfToken,
                'params' => $data
            ]);

        }else{
            // Redirect to signin if the user is not authenticated
            return Redirect::to(url('signin'));
        }
    } 
    
    function websiteupdate(Request $request){

        if($this->USERID > 0){
            
            //dd($request);
      
            $csrfToken = csrf_token();
            $userCompany = $this->getSession('companyId');
            $isAdmin = $this->getSession('isAdmin');
            $firstName = $this->getSession('firstName');
            $lastName = $this->getSession('lastName');
            $fullName = $firstName." ".$lastName; 
            $today = date("Y-m-d");

            $id = $request->input("id");
            $name = $request->input("name");
            $purpose = $request->input("purpose");
            $websiteLink = $request->input("websiteLink");
            $description = $request->input("description");
            $active = $request->input("active");
            $selectedFrequency = $request->input("selectedFrequency");
            $selectedMonthDay = $request->input("selectedMonthDay");
            $selectedWeekdays = $request->input("selectedWeekdays");
            
            // Determine when the website should be scrap
            $cronExpressions = '';
            $frequency = $selectedFrequency;
            $days = $selectedWeekdays;
            $dayOfMonth = $selectedMonthDay;

            // Determine cron expression based on frequency
            if ($frequency === 'daily') {
                $cronExpressions = '0 0 * * *'; // Every day at midnight
            } elseif ($frequency === 'weekly') {
                $cronExpressions = '0 0 * * 1'; // Every Monday
            } elseif ($frequency === 'customweekdays') {
                foreach ($days as $day) {
                    $cronExpressions = '0 0 * * ' . getCronDay($day); // Custom weekdays
                }
            } elseif ($frequency === 'monthly' && $dayOfMonth) {
                $cronExpressions = "0 0 $dayOfMonth * *"; // On specific day of the month
            }


            $updateData = array(
                "name" => $name,
                "purpose" => $purpose,
                "description" => $description,
                "websitelink" => $websiteLink,
                "date_modified" => $today,
                "modified_by" => $this->USERID,
                "modified_by_user" => $fullName,
                "active" => $active,
                "frequency" => $selectedFrequency,
                "monthday" => $selectedMonthDay,
                "weekdays" => json_encode($selectedWeekdays),
                "cronexpressions" => $cronExpressions
            );
            
            roach_websites_model::where("created_by_company",$userCompany)->where("id",$id)->update($updateData);
            
            $response = [
                'C' => 100,
                'M' => $this->ERRORS[131],
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
            $deleted = roach_websites_model::where("created_by_company",$userCompany)->where("id", $id)->delete();

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


    function websiteData(){
        
    }
}