//custom js script used in resources/views/app.blade.php



function addLoader(elm){
   
    var spinnerHtml = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    
    elm.style.width = elm.offsetWidth + "px";
    elm.style.height = elm.offsetHeight + "px";
    elm.setAttribute("disabled",true);
    elm.innerHTML = spinnerHtml;
}

function removeLoader(elm){
    var dataText = elm.getAttribute("data-text");
    elm.innerHTML = dataText;
    elm.removeAttribute("disabled");
}

function isRealVal(obj){
    return obj !== '' && obj !== null && obj !== undefined;
    /*if(obj == '' || obj == null || obj == undefined){
        return false;
    }else{
        return true;
    }*/
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

function validateTitle(name) {
    // Define validation criteria
    const minLength = 2;
    const maxLength = 50;
    const validCharacters = /^[A-Za-z\s]+$/; // Only letters and spaces
  
    var msg = "Name title is valid.";
    var err = 0;
    
    // Check conditions
    if (name.length < minLength) {
        msg = `Name title must be at least ${minLength} characters long.`;
        err = 1;
    }
    if (name.length > maxLength) {
        msg = `Name title must not exceed ${maxLength} characters.`;
        err = 1;
    }
    if (!validCharacters.test(name)) {
        msg = "Name title can only contain letters and spaces.";
        err = 1;
    }
  
    return {"Err":err,"Msg":msg};
}

function validateName(name) {
    // Define validation criteria
    const minLength = 2;
    const maxLength = 50;
    const validCharacters = /^[A-Za-z\s]+$/; // Only letters and spaces
  
    var msg = "Name is valid.";
    var err = 0;
    
    // Check conditions
    if (name.length < minLength) {
        msg = `Name must be at least ${minLength} characters long.`;
        err = 1;
    }
    if (name.length > maxLength) {
        msg = `Name must not exceed ${maxLength} characters.`;
        err = 1;
    }
    if (!validCharacters.test(name)) {
        msg = "Name can only contain letters and spaces.";
        err = 1;
    }
  
    return {"Err":err,"Msg":msg};
}

function validatePassword(password) { 
    // Ensure the password is a string (if it's not, return an error)
    if (typeof password !== 'string') {
        return { "Err": 1, "Msg": "Password must be a valid string" };
    }
    
    // checking uppercase letters 
    let uppercaseRegex = /[A-Z]/g; 
    var result = {"Err":0,"Msg":""};
    if (password.match(uppercaseRegex)) { 
        //ok
    } else { 
        result = {"Err":1,"Msg":"Password must contain: At least one uppercase letter"};
    } 
  
    // checking lowercase letters 
    let lowercaseRegex = /[a-z]/g; 
    if (password.match(lowercaseRegex)) { 
        //ok
    } else { 
        result = {"Err":1,"Msg":"Password must contain: At least one lowercase letter"};
    } 
    
    // checking the number 
    let numbersRegex = /[0-9]/g; 
    if (password.match(numbersRegex)) { 
        //ok
    } else { 
        result = {"Err":1,"Msg":"Password must contain: At least one number"};
    } 
  
    // Checking length of the password 
    if (password.length >= 8 && password.length <= 32) { 
        //ok
    } else { 
        result = {"Err":1,"Msg":"Password must contain: 8-32 characters long"};
    } 

    return result;
}

function showToastMsg(err, msg){
  
    if(err > 0){
        //error
        $("#toastMessage").removeClass("alert-success");
        $("#toastMessage").addClass("alert-danger");
    }else{
            //success
        $("#toastMessage").removeClass("alert-danger");
        $("#toastMessage").addClass("alert-success");
        }

    $("#toastMessage").html(msg);
    $("#toastMessage").show();
    setTimeout(function(){
        $("#toastMessage").hide("slow");
    }, 5000);
  
}

function truncateString(str, maxLength) {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + '...';
    }
    return str;
}

function getcsrfToken(){
    const url = " getcsrftoken";
    const postJson = {};
    httpRequest(url, postJson, function(){

    });
}

function httpRequest_dd(url, postJson, cb){
    // POST request using fetch with error handling
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postJson)
        
    };
    
    var reqUrl = SERVICEURL+'/'+url;
    
    fetch(reqUrl, requestOptions)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();
            // check for error response
            if (!response.ok) {
                //Network error
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                //return Promise.reject(error);
                //return cb({"C":1001,"R":response,"M":"error"});
                var err = 1;
                var msg = JSON.stringify(response);
                showToastMsg(err, msg);
                return false;
            }else{
                //server response
                if(data.C == 1004){
                    var err = 1;
                    var msg = 'Session expired.';
                    showToastMsg(err, msg);
                    setTimeout(function(){
                        window.location.href = SERVICEURL;
                    }, 2000);
                    
                }else{
                    return cb(data);
                }
                
            }

            //this.setState({ postId: data.id })
            
        })
        .catch(error => {
            //this.setState({ errorMessage: error.toString() });
            //console.error('There was an error!', error);
            //return cb({"C":1002,"R":error,"M":"error"});
            var err = 1;
            var msg = error;
            showToastMsg(err, msg);
            return false;
        });
}

function httpRequest(url, postJson, cb, timeoutMs = 10000) {
    const controller = new AbortController();
    const signal = controller.signal;

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postJson),
        signal: signal
    };

    const reqUrl = SERVICEURL + '/' + url;

    // Set timeout
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeoutMs);

    fetch(reqUrl, requestOptions)
        .then(async (response) => {
            clearTimeout(timeoutId);

            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();

            if (!response.ok) {
                const error = (data && data.message) || response.status;
                showToastMsg(1, JSON.stringify(error));
                return false;
            }

            if (data.C === 1004) {
                showToastMsg(1, 'Session expired.');
                setTimeout(() => {
                    window.location.href = SERVICEURL;
                }, 2000);
            } else {
                cb(data);
            }
        })
        .catch(error => {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                showToastMsg(1, 'Request timed out.');
            } else {
                showToastMsg(1, error.toString());
            }
            return false;
        });
}
