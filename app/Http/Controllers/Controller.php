<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Session\Session as Session_N;

abstract class Controller
{
    //
    function __construct()
    {
        
        $userId = $this->getSession('userId');
        if($userId && $userId > 0){
            
            $userEmail = $this->getSession('userEmail');
            $firstName = $this->getSession('firstName');
            $lastName = $this->getSession('lastName');
            $roleId = $this->getSession('roleId');
            $isAdmin = $this->getSession('isAdmin');
            $roleName = $this->getSession('roleName');
            $companyId = $this->getSession('companyId');

            $authUser = db_randnumber();
        }else{
            $authUser = 0;
            $userEmail = "";
            $firstName = "";
            $lastName = "";
        }

        $viewdata = array();
        $viewdata["authUser"] = $authUser;
        $viewdata["userEmail"] = $userEmail;
        $viewdata["firstName"] = $firstName;
        $viewdata["lastName"] = $lastName;
        view()->share('AUTHDATA',$viewdata);
    }

    function setSession($key, $value){
        $session = new Session_N();
        $session->set($key, $value);
    }
    
    function getSession($key){
        $session = new Session_N();
        return $session->get($key);
    }

    function removeSession($key){
        $session = new Session_N();
        $session->remove($key);
    }
}
