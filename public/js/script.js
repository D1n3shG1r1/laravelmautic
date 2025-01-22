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
    if(obj == '' || obj == null || obj == undefined){
        return false;
    }else{
        return true;
    }
}

function validateEmail(email){
    return String(email)
    .toLowerCase()
    .match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function validatePassword(password) { 
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
        result = {"Err":2,"Msg":"Password must contain: At least one lowercase letter"};
    } 
    
    // checking the number 
    let numbersRegex = /[0-9]/g; 
    if (password.match(numbersRegex)) { 
        //ok
    } else { 
        result = {"Err":3,"Msg":"Password must contain: At least one number"};
    } 
  
    // Checking length of the password 
    if (password.length >= 8 && password.length <= 32) { 
        //ok
    } else { 
        result = {"Err":4,"Msg":"Password must contain: 8-32 characters long"};
    } 

    return result;
}

function showToastMsg(err, msg){
    alert(msg);
    /*
    if(err > 0){
		//error
        document.getElementById("toastMessage").classList.remove("successMessage");
        document.getElementById("toastMessage").classList.add("errorMessage");
    }else{
        //success
        document.getElementById("toastMessage").classList.remove("errorMessage");
        document.getElementById("toastMessage").classList.add("successMessage");
    }
    
    document.querySelector('span[class="toastMessageContent"]').innerHTML=msg;
    document.getElementById("toastMessage").classList.remove("hide");
    document.getElementById("toastMessage").classList.add("show");
    
    setTimeout(function(){
        document.getElementById("toastMessage").classList.remove("show");
        document.getElementById("toastMessage").classList.add("hide");

    }, 3000);
    */
}

function truncateString(str, maxLength) {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + '...';
    }
    return str;
}

function httpRequest(url, postJson, cb){
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