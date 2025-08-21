const SERVICEURL = 'http://local.laravelmautic.com/';

window.initAutomationWidget = function (config) {
    const container = document.createElement("div");
    container.style = "position:fixed; bottom:20px; right:20px; z-index:9999;";
  
    const currentDomain = window.location.hostname;
  
    fetch(SERVICEURL+`api/check-domain?key=${config.key}&domain=${currentDomain}`)
      .then(res => res.json())
      .then(data => {
        if (data.active > 0) {
          if (data.verified) {
            renderForm(container, config);
          } else {
            renderVerifyButton(container, config, currentDomain);
          }
        } else {
          //currently widget is unavailable
          container.innerHTML = `
            <div style="background:#fff; border:1px solid #ccc; padding:16px; color: #555;">
              <p>This widget is currently unavailable.</p>
            </div>
          `;
        }
      });
    
    document.body.appendChild(container);
  };
  
  function renderForm(container, config) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #ccc; padding:16px;">
        <h4>Join Our List</h4>
        <input type="text" id="yw-fname" placeholder="First Name" />
        <input type="text" id="yw-lname" placeholder="Last Name" />
        <input type="text" id="yw-company" placeholder="Company Name" />
        <input type="email" id="yw-email" placeholder="Email" />
        <input type="text" id="yw-phone" placeholder="Mobile Number" />
        <input type="text" id="yw-reasontocontact" placeholder="Reason to Contact" />
        <input type="text" id="yw-country" placeholder="Country" />
        <textarea id="yw-message" placeholder="Message"></textarea>
        <button id="yw-submit">Submit</button>
        <div id="yw-message"></div>
      </div>
    `;
  
    document.getElementById("yw-submit").addEventListener("click", function () {
      const fname = document.getElementById("yw-fname").value;
      const lname = document.getElementById("yw-lname").value;
      const email = document.getElementById("yw-email").value;
      const phone = document.getElementById("yw-phone").value;
  
      fetch(SERVICEURL+"api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            fname,
            lname,
            email,
            phone,
            key: config.key,
            page_url: window.location.href,
            referrer: document.referrer,
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
      fetch(SERVICEURL+"api/verify-domain", {
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

  //=====================================
  // New Version of popup
  🧪 What It Does
✅ Shows after 5 seconds

✅ Hides with animation

✅ Remembers dismissal

✅ Shows again after 24 hours

  <div id="widget-popup" style="
  display: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background:#fff;
  border:1px solid #ccc;
  padding:24px;
  border-radius:8px;
  max-width:400px;
  font-family:Arial, sans-serif;
  box-shadow:0 6px 18px rgba(0,0,0,0.1);
  transform: translateY(100%);
  transition: transform 0.4s ease-in-out, opacity 0.4s;
  opacity: 0;
  z-index: 1000;
">
  <!-- Close Button -->
  <button onclick="closePopup()" style="
    position:absolute;
    top:10px;
    right:10px;
    background:transparent;
    border:none;
    font-size:20px;
    cursor:pointer;
    color:#999;
  " title="Close">&times;</button>

  <h4 style="margin-bottom:16px; color:#333;">Join Our List</h4>

  <div style="margin-bottom:12px;">
    <input type="text" id="yw-fname" placeholder="First Name" style="width:100%; padding:12px; border:1px solid #ccc; border-radius:4px; font-size:14px; background:#f9f9f9;" />
  </div>

  <div style="margin-bottom:12px;">
    <input type="text" id="yw-lname" placeholder="Last Name" style="width:100%; padding:12px; border:1px solid #ccc; border-radius:4px; font-size:14px; background:#f9f9f9;" />
  </div>

  <div style="margin-bottom:12px;">
    <input type="text" id="yw-company" placeholder="Company Name" style="width:100%; padding:12px; border:1px solid #ccc; border-radius:4px; font-size:14px; background:#f9f9f9;" />
  </div>

  <div style="margin-bottom:12px;">
    <input type="email" id="yw-email" placeholder="Email" style="width:100%; padding:12px; border:1px solid #ccc; border-radius:4px; font-size:14px; background:#f9f9f9;" />
  </div>

  <div style="margin-bottom:12px;">
    <input type="text" id="yw-phone" placeholder="Mobile Number" style="width:100%; padding:12px; border:1px solid #ccc; border-radius:4px; font-size:14px; background:#f9f9f9;" />
  </div>

  <div style="margin-bottom:12px;">
    <input type="text" id="yw-reasontocontact" placeholder="Reason to Contact" style="width:100%; padding:12px; border:1px solid #ccc; border-radius:4px; font-size:14px; background:#f9f9f9;" />
  </div>

  <div style="margin-bottom:12px;">
    <input type="text" id="yw-country" placeholder="Country" style="width:100%; padding:12px; border:1px solid #ccc; border-radius:4px; font-size:14px; background:#f9f9f9;" />
  </div>

  <div style="margin-bottom:12px;">
    <textarea id="yw-message" placeholder="Message" rows="3" style="width:100%; padding:12px; border:1px solid #ccc; border-radius:4px; font-size:14px; resize: vertical; background:#f9f9f9;"></textarea>
  </div>

  <button id="yw-submit" style="
    background:#007bff;
    color:white;
    border:none;
    padding:12px;
    width:100%;
    border-radius:4px;
    cursor:pointer;
    font-weight:bold;
    font-size:14px;
  ">Submit</button>

  <div id="yw-feedback" style="margin-top:12px; font-size:14px; display:none;"></div>
</div>

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
