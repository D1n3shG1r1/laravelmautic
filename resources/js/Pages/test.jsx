import React, {useState, useEffect, useRef } from "react";
import Layout from "@/Layouts/Layout";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import "bootstrap-icons/font/bootstrap-icons.css";


const EmailComponent = ({pageTitle, csrfToken, params}) => {

const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const save = (event) => {
    var formData = {};
    if (file) {
      formData = new FormData();

      console.log("formData");
      console.log(formData);

      formData.append('file', file);

      console.log("formData2");
      console.log(formData);
    }

    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    var url = "email/save";
    var postJson = {
      "mytoken":"123456",
      "formData":formData
    };
    
    console.log("postJson");
    console.log(postJson);

    httpRequest(url, postJson, function(resp){
      console.log(resp);
    }, false);
  }

  return (
    <Layout pageTitle={pageTitle}>
      <div className="midde_cont">
        <form ref={formRef} onSubmit={save} method="post">

        <InputLabel className="form-label">
            Attachments&nbsp;<i
            className="bi bi-question-circle"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Attachments are sent as file copy and can’t be tracked. To track downloads, use their link in the email content."
            style={{ cursor: "pointer" }}
            ></i>
        </InputLabel>
        <TextInput type="file" className="form-control" name="attachments" id="attachments" placeholder="Attachments" onChange={handleFileChange} />
        </form>
    </Layout>
  );
};

export default EmailComponent;


=================== function to post request ============================

function httpRequest(url, postJson, cb, headers = true, timeoutMs = 10000) {
    const controller = new AbortController();
    const signal = controller.signal;

    var requestOptions = {
        method: 'POST',
        body: JSON.stringify(postJson),
        signal: signal
    };

    if(headers){
        requestOptions["headers"] = { 'Content-Type': 'application/json' }
    }

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