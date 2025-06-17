<?php
/* array structured for filter-dropdown-options */
return [
    "contactFilters" => [
        [
            "key"=> "available_lead_title",
            "id"=> "available_lead_title",
            "title"=> "Title",
            "value"=> "title",
            "label"=> "Title",
            "className"=> "segment-filter user",
            "function"=> "",
            "dataFieldObject"=> "contact",
            "dataFieldType"=> "lookup",
            "dataFieldOperators"=>[
                "equals"=>"=",
                "not equal"=>"!=",
                "empty"=>"empty",
                "not empty"=>"!empty",
                "like"=>"like",
                "not like"=>"!like",
                /*"including"=>"in",
                "excluding"=>"!in",*/
                "starts with"=>"startsWith",
                "ends with"=>"endsWith",
                "contains"=>"contains"
            ]
        ],
        [
            "key"=> "available_lead_firstname",
            "id"=> "available_lead_firstname",
            "title"=> "First Name",
            "value"=> "firstname",
            "label"=> "First Name",
            "className"=> "segment-filter user",
            "function"=> "",
            "dataFieldObject"=> "contact",
            "dataFieldType"=> "text",
            "dataFieldOperators"=>[
                "equals"=>"=",
                "not equal"=>"!=",
                "empty"=>"empty",
                "not empty"=>"!empty",
                "like"=>"like",
                "not like"=>"!like",
                /*"including"=>"in",
                "excluding"=>"!in",*/
                "starts with"=>"startsWith",
                "ends with"=>"endsWith",
                "contains"=>"contains"
            ]
        ],
        [
            "key"=> "available_lead_lastname",
            "id"=> "available_lead_lastname",
            "title"=> "Last Name",
            "value"=> "lastname",
            "label"=> "Last Name",
            "className"=> "segment-filter user",
            "function"=> "",
            "dataFieldObject"=> "contact",
            "dataFieldType"=> "text",
            "dataFieldOperators"=>[
                "equals"=>"=",
                "not equal"=>"!=",
                "empty"=>"empty",
                "not empty"=>"!empty",
                "like"=>"like",
                "not like"=>"!like",
                /*"including"=>"in",
                "excluding"=>"!in",*/
                "starts with"=>"startsWith",
                "ends with"=>"endsWith",
                "contains"=>"contains"
            ]
        ],
        [
            "key"=> "available_lead_email",
            "id"=> "available_lead_email",
            "title"=> "Email",
            "value"=> "email",
            "label"=> "Email",
            "className"=> "segment-filter user",
            "function"=> "",
            "dataFieldObject"=> "contact",
            "dataFieldType"=> "email",
            "dataFieldOperators"=> [
                "equals"=>"=",
                "not equal"=>"!=",
                "empty"=>"empty",
                "not empty"=>"!empty",
                "like"=>"like",
                "not like"=>"!like",
                /*"including"=>"in",
                "excluding"=>"!in",*/
                "starts with"=>"startsWith",
                "ends with"=>"endsWith",
                "contains"=>"contains"
            ]
        ],
        [
            "key"=> "available_lead_mobile",
            "id"=> "available_lead_mobile",
            "title"=> "Mobile",
            "value"=> "mobile",
            "label"=> "Mobile",
            "className"=> "segment-filter user",
            "function"=> "",
            "dataFieldObject"=> "contact",
            "dataFieldType"=> "tel",
            "dataFieldOperators"=>[
                "equals"=>"=",
                "not equal"=>"!=",
                "empty"=>"empty",
                "not empty"=>"!empty",
                "like"=>"like",
                "not like"=>"!like",
                /*"including"=>"in",
                "excluding"=>"!in",*/
                "starts with"=>"startsWith",
                "ends with"=>"endsWith",
                "contains"=>"contains"
            ]
        ],
        
        [
            "key"=> "available_lead_address1",
            "id"=> "available_lead_address1",
            "title"=> "Address Line 1",
            "value"=> "address1",
            "label"=> "Address Line 1",
            "className"=> "segment-filter user",
            "function"=> "",
            "dataFieldObject"=> "contact",
            "dataFieldType"=> "text",
            "dataFieldOperators"=> [
                "equals"=>"=",
                "not equal"=>"!=",
                "empty"=>"empty",
                "not empty"=>"!empty",
                "like"=>"like",
                "not like"=>"!like",
                /*"including"=>"in",
                "excluding"=>"!in",*/
                "starts with"=>"startsWith",
                "ends with"=>"endsWith",
                "contains"=>"contains"
            ]
        ],
        [
            "key"=> "available_lead_address2",
            "id"=> "available_lead_address2",
            "title"=> "Address Line 2",
            "value"=> "address2",
            "label"=> "Address Line 2",
            "className"=> "segment-filter user",
            "function"=> "",
            "dataFieldObject"=> "contact",
            "dataFieldType"=> "text",
            "dataFieldOperators"=> [
                "equals"=>"=",
                "not equal"=>"!=",
                "empty"=>"empty",
                "not empty"=>"!empty",
                "like"=>"like",
                "not like"=>"!like",
                /*"including"=>"in",
                "excluding"=>"!in",*/
                "starts with"=>"startsWith",
                "ends with"=>"endsWith",
                "contains"=>"contains"
            ]
        ],
        [
            "key"=> "available_lead_city",
            "id"=> "available_lead_city",
            "title"=> "City",
            "value"=> "city",
            "label"=> "City",
            "className"=> "segment-filter user",
            "function"=> "",
            "dataFieldObject"=> "contact",
            "dataFieldType"=> "text",
            "dataFieldOperators"=> [
                "equals"=>"=",
                "not equal"=>"!=",
                "empty"=>"empty",
                "not empty"=>"!empty",
                "like"=>"like",
                "not like"=>"!like",
                /*"including"=>"in",
                "excluding"=>"!in",*/
                "starts with"=>"startsWith",
                "ends with"=>"endsWith",
                "contains"=>"contains"
            ]
        ],
        [
            "key"=> "available_lead_state",
            "id"=> "available_lead_state",
            "title"=> "State",
            "value"=> "state",
            "label"=> "State",
            "className"=> "segment-filter user",
            "function"=> "",
            "dataFieldObject"=> "contact",
            "dataFieldType"=> "region",
            "dataFieldOperators"=>[
                "equals"=>"=",
                "not equal"=>"!=",
                "empty"=>"empty",
                "not empty"=>"!empty",
                "like"=>"like",
                "not like"=>"!like",
                /*"including"=>"in",
                "excluding"=>"!in",*/
                "starts with"=>"startsWith",
                "ends with"=>"endsWith",
                "contains"=>"contains"
            ]
        ],
        [
            "key"=> "available_lead_country",
            "id"=> "available_lead_country",
            "title"=> "Country",
            "value"=> "country",
            "label"=> "Country",
            "className"=> "segment-filter user",
            "function"=> "",
            "dataFieldObject"=> "contact",
            "dataFieldType"=> "country",
            "dataFieldOperators"=> [
                "equals"=>"=",
                "not equal"=>"!=",
                "empty"=>"empty",
                "not empty"=>"!empty",
                "like"=>"like",
                "not like"=>"!like",
                /*"including"=>"in",
                "excluding"=>"!in",*/
                "starts with"=>"startsWith",
                "ends with"=>"endsWith",
                "contains"=>"contains"
            ]
        ],
        [
            "key"=> "available_lead_zipcode",
            "id"=> "available_lead_zipcode",
            "title"=> "Zip Code",
            "value"=> "zipcode",
            "label"=> "Zip Code",
            "className"=> "segment-filter user",
            "function"=> "",
            "dataFieldObject"=> "contact",
            "dataFieldType"=> "text",
            "dataFieldOperators"=>[
                "equals"=>"=",
                "not equal"=>"!=",
                "empty"=>"empty",
                "not empty"=>"!empty",
                "like"=>"like",
                "not like"=>"!like",
                /*"including"=>"in",
                "excluding"=>"!in",*/
                "starts with"=>"startsWith",
                "ends with"=>"endsWith",
                "contains"=>"contains"
            ]
        ],
        [
            "key"=> "available_lead_date_added",
            "id"=> "available_lead_date_added",
            "title"=> "Date Added",
            "value"=> "date_added",
            "label"=> "Date Added",
            "className"=> "segment-filter user",
            "function"=> "",
            "dataFieldObject"=> "contact",
            "dataFieldType"=> "date",
            "dataFieldOperators"=> [
                "equals"=> "=",
                "not equal"=> "!=",
                "greater than"=> ">",
                "greater than or equal"=> ">=",
                "less than"=> "<",
                "less than or equal"=> "<=",
                /*"empty"=> "empty",
                "not empty"=> "!empty",
                "like"=> "like",
                "not like"=> "!like",
                "starts with"=> "startsWith",
                "ends with"=> "endsWith",
                "contains"=> "contains"*/
            ]
        ],
        [
            "key"=> "available_lead_tags",
            "id"=> "available_lead_tags",
            "title"=> "Tags",
            "value"=> "tags",
            "label"=> "Tags",
            "className"=> "segment-filter user",
            "function"=> "",
            "dataFieldObject"=> "contact",
            "dataFieldType"=> "tags",
            "dataFieldOperators"=>[
                "empty"=>"empty",
                "not empty"=>"!empty",
                "including"=>"in",
                "excluding"=>"!in"
            ]
        ],
        
    ]
];

