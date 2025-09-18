<?php
use Illuminate\Support\Facades\Auth;

   if(!function_exists("db_randnumber")){
        function db_randnumber(){
            return time().rand(9999,999999);
        }
   }

   if(!function_exists('create_local_folder')){
        function create_local_folder($path){
        if(!is_dir($path)){
            mkdir($path,0777);
            exec("chmod 777 $path");
        }
        }
    }

    if(!function_exists('fileWrite')){
        function fileWrite($file,$data,$mode='w+'){
        $fp = fopen($file,$mode);
        fwrite($fp,$data);
        fclose($fp);
        }
    }

    if(!function_exists('fileRead')){
        function fileRead($file){
        $content = file_get_contents($file);
        return $content;
        }
    }

    if(!function_exists('fileRemove')){
        function fileRemove($file){
            unlink($file);
        }
    }

    if(!function_exists('genTimeSlot')){
        function genTimeSlot(){
            // Initialize an empty array to store the time strings
            $timeStrings = array();

            // Loop through the hours (0 to 23)
            for ($hour = 0; $hour <= 23; $hour++) {
                // Loop through the minutes (0, 15, 30, 45)
                for ($minute = 0; $minute <= 45; $minute += 15) {
                    // Format the hour and minute as a time string and add it to the array
                    $timeStrings[] = sprintf("%02d:%02d", $hour, $minute);
                }
            }
            
            // Add "24:00" to the array to represent midnight
            $timeStrings[] = "24:00";

            return $timeStrings;
        }
    }

    if(!function_exists('genOtp')){
        function genOtp(){
            $otp = rand(111111,999999);
            return $otp;
        }
    }

    if(!function_exists('generateSecureAlphanumeric')){
        function generateSecureAlphanumeric($length = 16) {
            $bytes = random_bytes($length);
            return substr(bin2hex($bytes), 0, $length);
        }
    }
    
    if(!function_exists('get_client_ip')){
        function get_client_ip() {
            $ipaddress = '';
            //echo "<pre>"; print_r($_SERVER); die;
            if (isset($_SERVER['HTTP_CLIENT_IP']))
                $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
            else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
                $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
            else if(isset($_SERVER['HTTP_X_FORWARDED']))
                $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
            else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
                $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
            else if(isset($_SERVER['HTTP_FORWARDED']))
                $ipaddress = $_SERVER['HTTP_FORWARDED'];
            else if(isset($_SERVER['REMOTE_ADDR']))
                $ipaddress = $_SERVER['REMOTE_ADDR'];
            else
                $ipaddress = 'UNKNOWN';

            return $ipaddress;
        }
    }

    if(!function_exists('getSetClientTimezone')){
        function getSetClientTimezone($ip){
            
            if($ip != 'UNKNOWN'){
                $ipInfo = file_get_contents('http://ip-api.com/json/' . $ip);
            }else{
                $ipInfo = file_get_contents('http://ip-api.com/json/');
            }   
                
            $ipInfo = json_decode($ipInfo);
            if($ipInfo->status == 'success'){
                $timezone = $ipInfo->timezone;
                date_default_timezone_set($timezone);
                //echo date_default_timezone_get();
                //echo date('Y/m/d H:i:s');
            }
            
        }
    }
    
    if(!function_exists('capitalizeWordsInPhrase')){
        function capitalizeWordsInPhrase($phrase) {
            // Function to capitalize words in a phrase
            if (strlen($phrase) > 0) {
                $words = explode(" ", $phrase);
                foreach ($words as &$word) {
                    $word = ucfirst($word);
                }
                return implode(" ", $words);
            } else {
                return "";
            }
        }
    }

    if(!function_exists('validatePhone')){
        function validatePhone($phoneNumber) {
            // Function to validate a phone number
            return preg_match('/^\d{5,15}$/', $phoneNumber);
        }
    }

    if(!function_exists('validateEmail')){
        function validateEmail($email) {
            // Function to validate an email address
            return filter_var($email, FILTER_VALIDATE_EMAIL);
        }
    }

    if(!function_exists('validatePassword')){
        function validatePassword($password) {
            // Function to validate a password
            $minLength = 8;
            $maxLength = 20;

            $hasUpperCase = preg_match('/[A-Z]/', $password);
            $hasLowerCase = preg_match('/[a-z]/', $password);
            $hasNumber = preg_match('/\d/', $password);
            $hasSpecialChar = preg_match('/[\W_]/', $password);

            $msg = "Password is valid.";
            $err = 0;

            if (strlen($password) < $minLength) {
                $msg = "Password must be at least $minLength characters long.";
                $err = 1;
            } elseif (strlen($password) > $maxLength) {
                $msg = "Password must not exceed $maxLength characters.";
                $err = 1;
            } elseif (!$hasUpperCase) {
                $msg = "Password must include at least one uppercase letter.";
                $err = 1;
            } elseif (!$hasLowerCase) {
                $msg = "Password must include at least one lowercase letter.";
                $err = 1;
            } elseif (!$hasNumber) {
                $msg = "Password must include at least one number.";
                $err = 1;
            } elseif (!$hasSpecialChar) {
                $msg = "Password must include at least one special character.";
                $err = 1;
            }

            return ["err" => $err, "msg" => $msg];
        }
    }

    if(!function_exists('validateName')){
        function validateName($name) {
            // Function to validate a name
            $minLength = 2;
            $maxLength = 50;

            $validCharacters = '/^[A-Za-z\s]+$/';

            $msg = "Name is valid.";
            $err = 0;

            if (strlen($name) < $minLength) {
                $msg = "Name must be at least $minLength characters long.";
                $err = 1;
            } elseif (strlen($name) > $maxLength) {
                $msg = "Name must not exceed $maxLength characters.";
                $err = 1;
            } elseif (!preg_match($validCharacters, $name)) {
                $msg = "Name can only contain letters and spaces.";
                $err = 1;
            }

            return ["err" => $err, "msg" => $msg];
        }
    }

    if(!function_exists('makeCurlRequest')){

        function makeCurlRequest($url, $method = 'GET', $headers = [], $data = null, $returnAsArray = false) {
            /**
             * cURL Helper Function
             * 
             * This function allows you to make flexible cURL requests by passing different parameters.
             *
             * @param string $url The URL to make the request to
             * @param string $method The HTTP method (GET, POST, PUT, DELETE, etc.)
             * @param array $headers (optional) The headers to send with the request
             * @param array|string $data (optional) The data to send in the request (for POST/PUT)
             * @param bool $returnAsArray (optional) Whether to return the response as an array (default: false)
             * @return mixed The response of the cURL request (string or array depending on $returnAsArray)
            */
        
            $ch = curl_init();

            // Set the URL and other necessary options
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // To get the response as a string
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Follow redirects (if any)
           
            // If the method is POST, PUT, DELETE, etc., set the appropriate options
            switch (strtoupper($method)) {
                case 'POST':
                    curl_setopt($ch, CURLOPT_POST, true);
                    if ($data) {
                        //curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data)); // For form-encoded data
                        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                    }
                    break;
                case 'PUT':
                    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
                    if ($data) {
                        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
                    }
                    break;
                case 'DELETE':
                    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
                    if ($data) {
                        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
                    }
                    break;
                // Add more methods if needed
            }

            // Add any custom headers
            if (!empty($headers)) {
                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            }

            // Disable SSL Verification (For Testing Only)
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            
            // Execute the cURL request
            $response = curl_exec($ch);

            // Handle errors
            if (curl_errno($ch)) {
                echo 'Curl error: ' . curl_error($ch);
                return false;
            }

            // Get the HTTP status code
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            // Close the cURL resource
            curl_close($ch);

            // If you want to return the response as an array (useful for JSON responses)
            if ($returnAsArray && $httpCode == 200) {
                return json_decode($response, true);
            }

            return $response; // Return the response as string if not expecting JSON
        }
    }


    if(!function_exists('getCronDay')){
        function getCronDay($day){
            $days = [
                'Sunday' => 0,
                'Monday' => 1,
                'Tuesday' => 2,
                'Wednesday' => 3,
                'Thursday' => 4,
                'Friday' => 5,
                'Saturday' => 6,
            ];
            return $days[$day] ?? 0; // Default to Sunday if invalid day
        }
    }

?>
