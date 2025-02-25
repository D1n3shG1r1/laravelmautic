<!DOCTYPE html>
@php
$authUser = $AUTHDATA["authUser"];
$userEmail = $AUTHDATA["userEmail"];
$firstName = $AUTHDATA["firstName"];
$lastName = $AUTHDATA["lastName"];
@endphp
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <style>
            body {
                font-family: 'Nunito', sans-serif;
            }
        </style>
        
        <!--<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet">-->
        <!--
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        -->
        <!--- pluto template --->
        <!-- bootstrap css -->
        <link rel="stylesheet" href="/css/pluto/css/bootstrap.min.css" />
        <!-- site css -->
        <link rel="stylesheet" href="/css/pluto/css/style.css" />
        <!-- responsive css -->
        <link rel="stylesheet" href="/css/pluto/css/responsive.css" />
        <!-- color css -->
        <link rel="stylesheet" href="/css/pluto/css/colors.css" />
        <link rel="stylesheet" href="/css/pluto/css/color_2.css" />
        <!-- select bootstrap -->
        <link rel="stylesheet" href="/css/pluto/css/bootstrap-select.css" />
        <!-- scrollbar css -->
        <link rel="stylesheet" href="/css/pluto/css/perfect-scrollbar.css" />
        <!-- custom css -->
        <link rel="stylesheet" href="/css/pluto/css/custom.css" />
        <!--- pluto template --->
        
        <!-- for campaign builder Temporary commented-->
        <link rel="stylesheet" href="/dcss/libraries.css"/>
        <link rel="stylesheet" href="/dcss/app.css"/>
        <link rel="stylesheet" href="/dcss/custom.css"/>

        <link href="https://dcdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.min.css" rel="stylesheet" />
        <!-- Include Select2 CSS -->
        <link href="https://dcdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" rel="stylesheet" />
        <!-- for campaign builder Temporary commented-->

        <!-- Scripts -->
         <script>
            const SERVICEURL = "{{url('/')}}";
            window.authUser = "{{$authUser}}";
            window.email = "{{$userEmail}}";
            window.fullName = "{{$firstName.' '.$lastName}}";
            window.baseUrl = "{{url('/')}}";    
         </script>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <!--<script src="https://cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.jquery.min.js"></script>-->
        <script src="https://dcdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js"></script>

        <script src="https://dcdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js"></script>
        <script src="https://dcdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
        
        <script src="/djs/jsplumb.min.js"></script>
        <script src="/js/script.js"></script>
        
        <!--@routes -->
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

        </head>
        <body class="font-sans antialiased">
        @inertia
        
        @yield("contentbox")
        
        @stack("js")
    </body>
</html>