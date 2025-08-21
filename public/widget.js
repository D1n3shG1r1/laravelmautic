const WIDGETSERVICEURL = 'http://local.laravelmautic.com/';
//const WEBHOOK_URL = "https://yourdomain.com/api/webhook";
//=== webhook widget
(function () {
  // Configurable webhook URL
  const WEBHOOK_URL = WIDGETSERVICEURL + "api/webhook";

  // Define selected input fields to collect
  //allowed inputs ["inputFirstName", "inputLastName", "inputEmail", "inputPhone", "inputCompany", "inputCountry", "inputReason", "inputMessage"]
  const selectedInputs = window.MySelectedInputs;

  //additional metadata
  const extraPayload = window.MyWebhookExtras;
  
  if(isRealVal(selectedInputs) && isRealVal(extraPayload)){

    if(extraPayload.type == "webhook"){

      /*
      // Collect input values from DOM
      function collectInputData(fields) {
        const data = {};
        fields.forEach(field => {
          const el = document.querySelector(`[name="${field}"], [id="${field}"]`);
          if (el && el.value) {
            data[field] = el.value;
          }
        });
        return data;
      }*/
  
      // Send data to webhook
      function sendWebhook(data) {
        fetch(WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(resp => {
          console.log("Webhook sent successfully:", resp);
        })
        .catch(err => {
          console.error("Webhook error:", err);
        });
      }
  
      // Delay execution slightly to allow DOM to load inputs
      window.addEventListener("load", function () {
        var inputFirstNameIdx = selectedInputs.indexOf("inputFirstName");
        var inputLastNameIdx = selectedInputs.indexOf("inputLastName");
        var inputEmailIdx = selectedInputs.indexOf("inputEmail");
        var inputPhoneIdx = selectedInputs.indexOf("inputPhone");
        var inputCompanyIdx = selectedInputs.indexOf("inputCompany");
        var inputCountryIdx = selectedInputs.indexOf("inputCountry");
        var inputReasonIdx = selectedInputs.indexOf("inputReason");
        var inputMessageIdx = selectedInputs.indexOf("inputMessage");
        
        var inputData = {};
        
        if(inputFirstNameIdx > -1){
          inputData["fname"] = ''; // give value for first name
        }
  
        if(inputLastNameIdx > -1){
          inputData["lname"] = ''; // give value for last name
        }
  
        if(inputEmailIdx > -1){
          inputData["email"] = ''; // give value for email
        }
  
        if(inputPhoneIdx > -1){
          inputData["phone"] = ''; // give value for mobile number
        }
  
        if(inputCompanyIdx > -1){
          inputData["company"] = ''; // give value for company
        }
  
        if(inputCountryIdx > -1){
          inputData["country"] = ''; // give value for country
        }
        
        if(inputReasonIdx > -1){
          inputData["reason"] = ''; // give value for reason to contact
        }
  
        if(inputMessageIdx > -1){
          inputData["message"] = ''; // give value for message
        }
        
        
        //const inputData = collectInputData(selectedInputs);
        const payload = {
          ...inputData,
          ...extraPayload
        };
        sendWebhook(payload);
      });
    }
  }
  
})();



//=== popup widget
window.initAutomationWidget = function (config) {

    //const container = document.createElement("div");
    //container.style = "position:fixed; bottom:20px; right:20px; z-index:9999;";
  
  /*
    1. window.location.href — Full URL (including protocol, domain, path, query parameters, etc.).
    
    2. window.location.hostname — The domain (e.g., www.example.com).
    window.location.pathname — The path (e.g., /about-us).

    3. window.location.protocol — The protocol (e.g., https:).

    4. window.location.search — The query string (e.g., ?id=123&name=abc).

    5. window.location.port — The port (e.g., 8080 if specified).
  */

    const currentDomain = window.location.hostname +''+ window.location.pathname;
  
    fetch(WIDGETSERVICEURL+`api/check-domain?key=${config.key}&domain=${currentDomain}`)
      .then(res => res.json())
      .then(data => {
        
        if (data.active > 0 && data.isValid > 0) {
          /*if (data.verified) {*/
            //renderForm(container, config);
            renderForm(data, config);
          /*} else {
            renderVerifyButton(container, config, currentDomain);
          }*/
        } /*else {
          //currently widget is unavailable
          container.innerHTML = `
            <div style="background:#fff; border:1px solid #ccc; padding:16px; color: #555;">
              <p>This widget is currently unavailable.</p>
            </div>
          `;
        }*/
      });
    
    //document.body.appendChild(container);
  };
  
  //function renderForm(container, config) {
  function renderForm(widgetData, config) {
    
    const container = document.createElement("div");

    //widgetData.active
    //widgetData.verified
    const requiredFields = widgetData.requiredInputs;
    const widgetType = widgetData.widgetType;
    const widgetHeading = widgetData.widgetHeading;

    const popupKey = config.key; //"ywPopupClosedAt";
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    /*var requiredFields = ["inputFirstName", "inputLastName", "inputEmail", "inputPhone", "inputCompany", "inputCountry", "inputReason", "inputMessage"];*/
    
    var inputFirstNameIdx = requiredFields.indexOf("inputFirstName");
    var inputLastNameIdx = requiredFields.indexOf("inputLastName");
    var inputEmailIdx = requiredFields.indexOf("inputEmail");
    var inputPhoneIdx = requiredFields.indexOf("inputPhone");
    var inputCompanyIdx = requiredFields.indexOf("inputCompany");
    var inputCountryIdx = requiredFields.indexOf("inputCountry");
    var inputReasonIdx = requiredFields.indexOf("inputReason");
    var inputMessageIdx = requiredFields.indexOf("inputMessage");
    
    //popup html
    var innerHTMLstr = `
    <div id="widget-popup" style="display: none; position: fixed; bottom: 20px; right: 20px; background: #fff; border: 1px solid #ccc; padding: 24px; border-radius: 8px; max-width: 400px; font-family: 'Arial, sans-serif'; box-shadow: 0 6px 18px rgba(0,0,0,0.1); transform: translateY(100%); transition: transform 0.4s ease-in-out, opacity 0.4s; opacity: 0; z-index: 1000;">

    <button id="widget-popup-close-btn" style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; font-size: 20px; cursor: pointer; color: #999; padding: 0; width: 30px; height: 30px;" title="Close">&times;</button>

    <h4 id="widget-heading" style="margin-bottom: 16px; color: #333; width: fit-content;">`+widgetHeading+`</h4>`;

    if(inputFirstNameIdx > -1){
      innerHTMLstr += `
      <div id="widget-fname-container" style="margin-bottom: 12px; width: 50%; float: left; padding: 5px;">
      <input type="text" id="widget-fname" placeholder="First Name" style="
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          background: #f9f9f9;
          box-sizing: border-box;"
        />
      </div>`;
    }
    
    if(inputLastNameIdx > -1){
      innerHTMLstr += `<div id="widget-lname-container" style="margin-bottom: 12px; width: 50%; float: left; padding: 5px;">
        <input type="text" id="widget-lname" placeholder="Last Name" style="
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          background: #f9f9f9;
          box-sizing: border-box;"
        />
      </div>`;
    }
    
    if(inputEmailIdx > -1){
      innerHTMLstr += `<div id="widget-email-container" style="margin-bottom: 12px; width: 50%; float: left; padding: 5px;">
        <input type="email" id="widget-email" placeholder="Email" style="
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          background: #f9f9f9;
          box-sizing: border-box;"
        />
      </div>`;
    }

    if(inputPhoneIdx > -1){
      innerHTMLstr += `<div id="widget-phone-container" style="margin-bottom: 12px; width: 50%; float: left; padding: 5px;">
        <input type="text" id="widget-phone" placeholder="Mobile Number" style="
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          background: #f9f9f9;
          box-sizing: border-box;"
        />
      </div>`;
    }
    
    if(inputCompanyIdx > -1){
      innerHTMLstr += `<div id="widget-company-container" style="margin-bottom: 12px; width: 50%; float: left; padding: 5px;">
        <input type="text" id="widget-company" placeholder="Company" style="
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          background: #f9f9f9;
          box-sizing: border-box;"
        />
      </div>`;
    }

    if(inputCountryIdx > -1){
      innerHTMLstr += `<div id="widget-country-container" style="margin-bottom: 12px; width: 50%; float: left; padding: 5px;">
        <input type="text" id="widget-country" placeholder="Country" style="
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          background: #f9f9f9;
          box-sizing: border-box;"
        />
      </div>`;
    }
    
    if(inputReasonIdx > -1){
      innerHTMLstr += `<div id="widget-reasontocontact-container" style="margin-bottom: 12px; width: 50%; float: left; padding: 5px;">
        <input type="text" id="widget-reasontocontact" placeholder="Reason to Contact" style="
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          background: #f9f9f9;
          box-sizing: border-box;"
        />
      </div>`;
    }
    
    if(inputMessageIdx > -1){
      innerHTMLstr += `<div id="widget-message-container" style="margin-bottom: 12px; width: 50%; float: left; padding: 5px;">
        <textarea id="widget-message" rows="3" placeholder="Message" style="
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            background: #f9f9f9;
            box-sizing: border-box;
            resize:none;"></textarea>
      </div>`;
    }

    innerHTMLstr +=`<button id="yw-submit" style="
        background: #007bff;
        color: white;
        border: none;
        padding: 12px;
        width: 100%;
        borderRadius: 4px;
        cursor: pointer;
        fontWeight: bold;
        fontSize: 14px;">Submit</button>

        <div id="yw-feedback" style=
        margin-top: 12px;
        fontSize: 14px;
        display: none;"></div>
    </div>`;


    innerHTMLstr +=`
    <style>
      .widgetToastMessage {
        display: none;
        position: fixed !important;
        width: fit-content;
        right: 10px;
        bottom: 10px;
        z-index: 1050;
      }


      .alert {
          position: relative;
          padding: .75rem 1.25rem;
          margin-bottom: 1rem;
          border: 1px solid transparent;
          border-radius: .25rem;
      }

      .alert-danger {
          color: #721c24;
          background-color: #f8d7da;
          border-color: #f5c6cb;
      }

      .alert-success {
          color: #155724;
          background-color: #d4edda;
          border-color: #c3e6cb;
      }
      </style>
    <div id="widgetToastMessage" class="widgetToastMessage alert alert-danger" role="alert"></div>`
  
    container.innerHTML = innerHTMLstr;
    document.body.appendChild(container);

    setTimeout(function(){
      //show or render popup
      const popup = document.getElementById("widget-popup");
      popup.style.display = "block";
      setTimeout(() => {
        popup.style.transform = "translateY(0)";
        popup.style.opacity = "1";
      }, 100);

      /*
      function showPopup() {
        const popup = document.getElementById("widget-popup");
        popup.style.display = "block";
        setTimeout(() => {
          popup.style.transform = "translateY(0)";
          popup.style.opacity = "1";
        }, 100);
      }
      */


      
      document.getElementById("widget-popup-close-btn").addEventListener("click", function () {
        const popup = document.getElementById("widget-popup");
        popup.style.transform = "translateY(100%)";
        popup.style.opacity = "0";
        setTimeout(() => {
          popup.style.display = "none";
        }, 400);

        // Save timestamp of when it was closed
        //localStorage.setItem(popupKey, Date.now());
      });
      
      /*
      function closePopup() {
        const popup = document.getElementById("widget-popup");
        popup.style.transform = "translateY(100%)";
        popup.style.opacity = "0";
        setTimeout(() => {
          popup.style.display = "none";
        }, 400);

        // Save timestamp of when it was closed
        localStorage.setItem(popupKey, Date.now());
      }
      */



      //popup submit
      document.getElementById("yw-submit").addEventListener("click", function () {
            
        var widget_fname = '';
        var widget_lname = '';
        var widget_email = '';
        var widget_phone = '';
        var widget_company = '';
        var widget_country = '';
        var widget_reasontocontact = '';
        var widget_message = '';

        if(inputFirstNameIdx > -1){
          widget_fname = document.getElementById("widget-fname").value;
        }

        if(inputLastNameIdx > -1){
          widget_lname = document.getElementById("widget-lname").value;
        }

        if(inputEmailIdx > -1){
          widget_email = document.getElementById("widget-email").value;
        }

        if(inputPhoneIdx > -1){
          widget_phone = document.getElementById("widget-phone").value;
        }

        if(inputCompanyIdx > -1){
          widget_company = document.getElementById("widget-company").value;
        }

        if(inputCountryIdx > -1){
          widget_country = document.getElementById("widget-country").value;
        }

        if(inputReasonIdx > -1){
          widget_reasontocontact = document.getElementById("widget-reasontocontact").value;
        }

        if(inputMessageIdx > -1){
          widget_message = document.getElementById("widget-message").value;
        }
        
        if(inputFirstNameIdx > -1){
          if(!isRealVal(widget_fname)){
            var err = 1;
            var msg = "First name is required.";
            showToastMsg(err, msg);
            return false;
          }
        }

        if(inputLastNameIdx > -1){
          if(!isRealVal(widget_lname)){
            var err = 1;
            var msg = "Last name is required.";
            showToastMsg(err, msg);
            return false;
          }
        }

        if(inputEmailIdx > -1){
          if(!isRealVal(widget_email)){
            var err = 1;
            var msg = "Email is required.";
            showToastMsg(err, msg);
            return false;
          }
          
          if(!validateEmail(widget_email)){
            var err = 1;
            var msg = "Enter valid email.";
            showToastMsg(err, msg);
            return false;
          }
        }
        
        if(inputPhoneIdx > -1){
          
          if(!isRealVal(widget_phone)){
            var err = 1;
            var msg = "Mobile number is required.";
            showToastMsg(err, msg);
            return false;
          }
        }
        
        if(inputCompanyIdx > -1){
          
          if(!isRealVal(widget_company)){
            var err = 1;
            var msg = "Company is required.";
            showToastMsg(err, msg);
            return false;
          }
        }
        
        if(inputCountryIdx > -1){
          
          if(!isRealVal(widget_country)){
            var err = 1;
            var msg = "Country is required.";
            showToastMsg(err, msg);
            return false;
          }
        }
        
        if(inputReasonIdx > -1){
          
          if(!isRealVal(widget_reasontocontact)){
            var err = 1;
            var msg = "Reason to contact is required.";
            showToastMsg(err, msg);
            return false;
          }
        }
        
        if(inputMessageIdx > -1){
          
          if(!isRealVal(widget_message)){
            var err = 1;
            var msg = "Message is required.";
            showToastMsg(err, msg);
            return false;
          }
        }
        
        
        fetch(WIDGETSERVICEURL+"api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "fname":widget_fname,
            "lname":widget_lname,
            "email":widget_email,
            "phone":widget_phone,
            "company":widget_company,
            "country":widget_country,
            "reason":widget_reasontocontact,
            "message":widget_message,
            "key": config.key,
            "page_url": window.location.href,
            "referrer": document.referrer,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            document.getElementById("yw-message").innerText = "Thanks! We got it.";
          })
          .catch(() => {
            document.getElementById("yw-message").innerText = "Something went wrong.";
          });
      });
    }, 500);

  }
  
  function renderVerifyButton(container, config, domain) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid red; padding:16px;">
        <p>This domain (<b>${domain}</b>) is not verified for this widget.</p>
        <button id="verify-domain">Verify this domain</button>
        <div id="verify-message" style="margin-top:10px;"></div>
      </div>
    `;
  
    document.getElementById("verify-domain").addEventListener("click", () => {
      fetch(WIDGETSERVICEURL+"api/verify-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            key: config.key,
            domain: domain,
        }),
      })
        .then(res => res.json())
        .then(data => {
          document.getElementById("verify-message").innerText = "Domain verified! Refresh the page.";
        })
        .catch(() => {
          document.getElementById("verify-message").innerText = "Verification failed.";
        });
    });
  }

  function isRealVal(obj){
    return obj !== '' && obj !== null && obj !== undefined;
  }

  function validateEmail(email){
      return String(email)
      .toLowerCase()
      .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }

  function validateMobile(number) {
      const regex = /^[+]?[0-9]{10,15}$/;
      return regex.test(number);
  }


function showToastMsg(err, msg){
  
  if(err > 0){
      //error
      $("#widgetToastMessage").removeClass("alert-success");
      $("#widgetToastMessage").addClass("alert-danger");
  }else{
          //success
      $("#widgetToastMessage").removeClass("alert-danger");
      $("#widgetToastMessage").addClass("alert-success");
      }

  $("#widgetToastMessage").html(msg);
  $("#widgetToastMessage").show();
  setTimeout(function(){
      $("#widgetToastMessage").hide("slow");
  }, 5000);
}

/*
<script>
  const popupKey = "ywPopupClosedAt";
  const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  function showPopup() {
    const popup = document.getElementById("widget-popup");
    popup.style.display = "block";
    setTimeout(() => {
      popup.style.transform = "translateY(0)";
      popup.style.opacity = "1";
    }, 100);
  }

  function closePopup() {
    const popup = document.getElementById("widget-popup");
    popup.style.transform = "translateY(100%)";
    popup.style.opacity = "0";
    setTimeout(() => {
      popup.style.display = "none";
    }, 400);

    // Save timestamp of when it was closed
    localStorage.setItem(popupKey, Date.now());
  }

  function shouldShowPopup() {
    const lastClosedAt = localStorage.getItem(popupKey);
    if (!lastClosedAt) return true; // Never closed
    const now = Date.now();
    return now - parseInt(lastClosedAt) >= oneDay;
  }

  window.addEventListener("load", () => {
    if (shouldShowPopup()) {
      setTimeout(showPopup, 5000); // Show after 5 seconds
    }
  });

  document.getElementById("yw-submit").addEventListener("click", function () {
    const fname = document.getElementById("yw-fname").value.trim();
    const email = document.getElementById("yw-email").value.trim();
    const feedback = document.getElementById("yw-feedback");

    if (!fname || !email) {
      feedback.style.display = "block";
      feedback.style.color = "red";
      feedback.innerText = "Please fill in your first name and email.";
      return;
    }

    feedback.style.display = "block";
    feedback.style.color = "green";
    feedback.innerText = "Thanks for submitting! We'll be in touch.";

    setTimeout(() => {
      document.querySelectorAll("#widget-popup input, #widget-popup textarea").forEach(el => el.value = '');
    }, 1500);
  });
</script>
*/