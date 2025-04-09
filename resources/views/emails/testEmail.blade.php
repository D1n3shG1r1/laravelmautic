<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Email</title>
    <style>
        /* General styles */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        table {
            width: 100%;
            border-spacing: 0;
            margin: 0;
            padding: 0;
        }

        img {
            max-width: 100%;
            height: auto;
            display: block;
        }

        /* Email container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e1e1e1;
            border-radius: 8px;
            overflow: hidden;
        }

        /* Header section */
        .email-header {
            background-color: #004c97;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }

        .email-header img {
            width: 120px; /* Adjust this size based on your logo */
            margin-bottom: 10px;
        }

        .email-header h1 {
            font-size: 24px;
            margin: 0;
        }

        /* Body content */
        .email-body {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
        }

        .email-body p {
            margin: 0 0 15px 0;
        }

        .email-body a {
            color: #004c97;
            text-decoration: none;
        }

        /* Special Note */
        .special-note {
            background-color: #fffbf1;
            padding: 15px;
            border: 1px solid #ffdb99;
            margin-top: 20px;
            border-radius: 5px;
        }

        .special-note h3 {
            margin-top: 0;
            color: #f39c12;
        }

        /* Footer section */
        .email-footer {
            background-color: #f4f4f4;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #888888;
        }

        /* Button */
        .btn {
            background-color: #004c97;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            font-weight: bold;
            margin-top: 15px;
        }

        /* Responsive styles */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
            }

            .email-header h1 {
                font-size: 20px;
            }

            .email-body {
                padding: 15px;
            }

            .btn {
                padding: 12px 25px;
            }
        }
    </style>
</head>
<body>
    <table role="presentation" class="email-container">
        <tr>
            <td class="email-header">
                <!-- Replace 'logo-url.png' with the actual logo URL -->
                <img style="margin:auto;" src="{{ $companyLogo }}" alt="{{$companyName}}">
                <!--<h1 style="text-align:center;">SmartKYC</h1>-->
                <p style="text-align:center;">Test Email</p>
            </td>
        </tr>
        <tr>
            <td class="email-body">
                <p>Dear {{ ucwords($userName) }},</p>
                
                    <p>
                    I hope this email finds you well. This is just a test email to ensure everything is functioning properly.
                    </p>
                    
                    <p>Please disregard this message, but kindly confirm if you've received it.</p>

            </td>
        </tr>
        <tr>
            <td class="email-footer">
                <p style="text-align:center;">&copy; {{date('Y')}}. All Rights Reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>
