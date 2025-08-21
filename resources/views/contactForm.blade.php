@php

$widgetId = $widgetAttribute["widgetId"];
$widgetKey = $widgetAttribute["widgetKey"];
$active = $widgetAttribute["active"];
$widgetParametersJson = $widgetAttribute["widgetParameters"];
$widgetParameters = json_decode($widgetAttribute["widgetParameters"], true);
$widgetType = $widgetAttribute["widgetType"];
$widgetHeading = $widgetAttribute["widgetHeading"];


$fields = [
    'inputFirstName' => ['label' => 'First Name', 'name' => 'fname', 'type' => 'text'],
    'inputLastName' => ['label' => 'Last Name', 'name' => 'lname', 'type' => 'text'],
    'inputEmail' => ['label' => 'Email', 'name' => 'email', 'type' => 'text'],
    'inputPhone' => ['label' => 'Mobile Number', 'name' => 'mobilenumber', 'type' => 'text'],
    'inputCompany' => ['label' => 'Company', 'name' => 'company', 'type' => 'text'],
    'inputCountry' => ['label' => 'Country', 'name' => 'country', 'type' => 'text'],
    'inputReason' => ['label' => 'Reason', 'name' => 'reason', 'type' => 'text'],
    'inputMessage' => ['label' => 'Message', 'name' => 'message', 'type' => 'text'],
];



// Filter enabled fields
$enabledFields = array_filter($fields, function ($key) use ($widgetParameters) {
    return in_array($key, $widgetParameters);
}, ARRAY_FILTER_USE_KEY);

// Break into rows of 2 fields per row
$chunks = array_chunk($enabledFields, 2, true);
@endphp


<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>

    <!--- Pluto template CSS --->
    <link rel="stylesheet" href="/css/remix-fa-icons.css" />
    <link rel="stylesheet" href="/css/pluto/css/bootstrap.min.css" />
    <link rel="stylesheet" href="/css/pluto/css/style.css" />
    <link rel="stylesheet" href="/css/pluto/css/responsive.css" />
    <link rel="stylesheet" href="/css/pluto/css/colors.css" />
    <link rel="stylesheet" href="/css/pluto/css/color_2.css" />
    <link rel="stylesheet" href="/css/pluto/css/bootstrap-select.css" />
    <link rel="stylesheet" href="/css/pluto/css/perfect-scrollbar.css" />
    <link rel="stylesheet" href="/css/pluto/css/custom.css" />
    <!-- External libraries -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" rel="stylesheet" />

    <style>
        #content {
            width: 50%;
            min-height: 100vh;
            transition: ease all 0.3s;
            position: relative;
            padding: 60px 25px 25px 25px;
            background: #ffffff;
            margin: auto;
        }

        .toastMessage {
            display: none;
            position: fixed !important;
            width: fit-content;
            right: 10px;
            bottom: 10px;
            z-index: 1050;
        }

        .form-input {
            width: 100%;
            border: 1px solid #ebebeb;
            border-radius: 5px;
            -moz-border-radius: 5px;
            -webkit-border-radius: 5px;
            -o-border-radius: 5px;
            -ms-border-radius: 5px;
            padding: 7px 7px;
            box-sizing: border-box;
            font-size: 14px;
            font-weight: 500;
            color: #222;
        }
    </style>

    <!-- JS Scripts -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
        crossorigin="anonymous"></script>
    <script src="/js/script.js"></script>
</head>

<body class="font-sans antialiased">
    <div class="full_container">
        <div class="inner_container">
            <!-- right content -->
            <div id="content">
                <main class="main relative">
                    <div class="midde_cont">
                        <div class="container-fluid">
                            <!-- row -->
                            <div class="row column1">
                                <div class="col-md-12">
                                    <div class="white_shd full margin_bottom_30">
                                        <div class="logo_login py-3">
                                            <div class="center"><img width="210" src="{{url('images/sciplogo.png')}}" alt="#"></div>
                                        </div>
                                        <div class="full graph_head">
                                            <div class="heading1 margin_0">
                                                <h2>{{$widgetHeading}}</h2>
                                            </div>
                                        </div>

                                        <div class="full price_table padding_infor_info">
                                            <div class="row">
                                                <!-- user profile section -->
                                                <div class="col-lg-12">
                                                    <div class="full dis_flex center_text">
                                                        <form class="profile_contant">
                                                            <input type="hidden" value="{{$widgetKey}}" id="key" name="key" />
                                                        @foreach ($chunks as $row)
                                                            <div class="form-group row mb-3">
                                                                @foreach ($row as $key => $field)
                                                                    @php
                                                                        $columnClass = count($row) === 1 ? 'col-md-12' : 'col-md-6';
                                                                    @endphp
                                                                    <div class="{{ $columnClass }}">
                                                                        <label for="{{ $field['name'] }}" class="form-label">
                                                                            {{ $field['label'] }}
                                                                            
                                                                        </label>
                                                                        <input type="{{ $field['type'] }}" class="form-input" name="{{ $field['name'] }}" id="{{ $field['name'] }}" placeholder="{{ $field['label'] }}" value="">
                                                                    </div>
                                                                @endforeach
                                                            </div>
                                                        @endforeach

                                                        <div class="form-group row mb-3">
                                                            <div class="col-md-12 profile-btn-box text-right">
                                                                <button type="button" id="profSaveBtn" class="btn cur-p btn-primary"
                                                                    data-txt="Save" data-loadingtxt="Saving..." onclick="validateForm(this);">
                                                                    Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                    </div>
                                                </div>
                                            </div> <!-- /.row -->
                                        </div> <!-- /.price_table -->
                                    </div> <!-- /.white_shd -->
                                </div> <!-- /.col-md-12 -->
                            </div> <!-- /.row.column1 -->
                        </div> <!-- /.container-fluid -->
                    </div> <!-- /.midde_cont -->
                </main>
            </div> <!-- /#content -->
        </div> <!-- /.inner_container -->
    </div> <!-- /.full_container -->

    <div id="toastMessage" class="toastMessage alert alert-danger" role="alert">
        This is a danger alert—check it out!
    </div>


    <script>
        
    function validateForm(button) {
        const widgetParametersJson = {!! json_encode($widgetParameters) !!};

        // Map input keys to DOM IDs and labels
        const fieldMap = {
            inputFirstName: { id: "fname", label: "First name" },
            inputLastName: { id: "lname", label: "Last name" },
            inputEmail: { id: "email", label: "Email", validateEmail: true },
            inputPhone: { id: "mobilenumber", label: "Mobile number" },
            inputCompany: { id: "company", label: "Company" },
            inputCountry: { id: "country", label: "Country" },
            inputReason: { id: "reason", label: "Reason to contact" },
            inputMessage: { id: "message", label: "Message" }
        };

        const formData = {};

        for (let key of widgetParametersJson) {
            const field = fieldMap[key];
            if (!field) continue;

            const element = document.getElementById(field.id);
            if (!element) continue;

            const value = element.value.trim();

            if (!isRealVal(value)) {
                showToastMsg(1, `${field.label} is required.`);
                return false;
            }

            if (field.validateEmail && !validateEmail(value)) {
                showToastMsg(1, `Enter valid ${field.label.toLowerCase()}.`);
                return false;
            }

            formData[field.id] = value;
        }

        formData["key"] = document.getElementById("key").value;
        
        // Disable button and show loading text
        const originalText = button.innerText;
        button.disabled = true;
        button.innerText = "Saving...";

        // CSRF token from meta tag or Laravel
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        // Send data using AJAX
        $.ajax({
            url: "{{ url('api/contactformsubmit') }}",
            method: "POST",
            headers: {
                'X-CSRF-TOKEN': csrfToken
            },
            data: formData,
            success: function(response) {

                if(response.code == 100){
                    showToastMsg(0, response.message || "Form submitted successfully.");
                }else{
                    showToastMsg(1, response.message || "Form submitted successfully.");
                }
                
                button.disabled = false;
                button.innerText = originalText;
                // Optional: clear form or redirect
                $('form.profile_contant')[0].reset();
                
            },
            error: function(xhr) {
                const message = xhr.responseJSON?.message || "Something went wrong.";
                showToastMsg(1, message);
                button.disabled = false;
                button.innerText = originalText;
            }
        });    
    }

    </script>
</body>
</html>
