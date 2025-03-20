import React, {useState, useEffect, useRef } from "react";
import Layout from "@/Layouts/Layout";
import GrapesJSBuilder from "@/Components/GrapesJSBuilder";
import BootstrapModal from "@/Components/BootstrapModal";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import ToggleButton from "@/Components/ToggleButton";
import "bootstrap-icons/font/bootstrap-icons.css";
import Styles from "../../css/Modules/Emails.module.css";

const templates = [
  {
    id: 1,
    name: "Template 1",
    thumbnail: "template1.jpg", // Replace with actual image URL
    html: `<body style="box-sizing: border-box; margin: 0;">
  <div data-section-wrapper="1" id="i3xx" style="box-sizing: border-box; background-color: #ffffff;">
    <div data-section="1" id="ihok" style="box-sizing: border-box; Margin: 0px auto; border-radius: 4px; max-width: 600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" id="itpg" style="box-sizing: border-box; width: 100%; border-radius: 4px;" width="100%">
        <tbody style="box-sizing: border-box;">
          <tr style="box-sizing: border-box;">
            <td id="ia7i" style="box-sizing: border-box; direction: ltr; padding: 20px 0; text-align: center; vertical-align: top;" align="center" valign="top">
              <div data-slot-container="1" class="mj-column-per-100 outlook-group-fix" id="ibei" style="box-sizing: border-box; font-size: 13px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 100%;">
                <table background="#FFFFFF" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="box-sizing: border-box;">
                  <tbody style="box-sizing: border-box;">
                    <tr style="box-sizing: border-box;">
                      <td id="ir00x" style="box-sizing: border-box; background-color: #FFFFFF; vertical-align: top; padding: 20px 20px;" bgcolor="#FFFFFF" valign="top">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="box-sizing: border-box;">
                          <tbody style="box-sizing: border-box;">
                            <tr style="box-sizing: border-box;">
                              <td align="left" id="isp61" style="box-sizing: border-box; padding: 0; word-break: break-word;">
                                <div data-slot="text" id="ioytj" style="box-sizing: border-box; font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; text-align: left; color: #414141;">
                                  <h1 style="box-sizing: border-box;">Hello World!
                                  </h1>
                                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid officia consequatur placeat reprehenderit excepturi, tempore,
                                  id quos quaerat ab fuga.
                                  <br style="box-sizing: border-box;">
                                  <br style="box-sizing: border-box;"> Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                  Inventore, voluptate.
                                  <br style="box-sizing: border-box;">
                                  <br style="box-sizing: border-box;"> Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                  Dignissimos alias rerum nemo ducimus modi perspiciatis.
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div data-slot-container="1" class="mj-column-per-100 outlook-group-fix" id="ijeg9" style="box-sizing: border-box; font-size: 13px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" id="io5u7" style="box-sizing: border-box; vertical-align: top;" valign="top">
                  <tbody style="box-sizing: border-box;">
                    <tr style="box-sizing: border-box;">
                      <td align="left" id="i5v5l" style="box-sizing: border-box; padding: 20px 20px; word-break: break-word;">
                        <div data-slot="text" id="iyphd" style="box-sizing: border-box; font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.4; text-align: left; color: #999999;">
                          {unsubscribe_text} | {webview_text}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</body>`,
    css: ``
  },
  {
    id: 2,
    name: "Template 2",
    thumbnail: "template2.jpg",
    html: `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title>{subject}
    </title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a {
        padding:0;
      }
      body {
        margin:0;
        padding:0;
        -webkit-text-size-adjust:100%;
        -ms-text-size-adjust:100%;
      }
      table, td {
        border-collapse:collapse;
        mso-table-lspace:0pt;
        mso-table-rspace:0pt;
      }
      img {
        border:0;
        height:auto;
        line-height:100%;
        outline:none;
        text-decoration:none;
        -ms-interpolation-mode:bicubic;
      }
      p {
        display:block;
        margin:13px 0;
      }
    </style>
    <!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
    <!--[if lte mso 11]>
<style type="text/css">
.mj-outlook-group-fix { width:100% !important; }
</style>
<![endif]-->
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
    <style type="text/css">
      @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
    </style>
    <!--<![endif]-->
    <style type="text/css">
      @media only screen and (min-width:480px) {
        .mj-column-per-100 {
          width:100% !important;
          max-width: 100%;
        }
        .mj-column-per-60 {
          width:60% !important;
          max-width: 60%;
        }
        .mj-column-per-40 {
          width:40% !important;
          max-width: 40%;
        }
        .mj-column-per-50 {
          width:50% !important;
          max-width: 50%;
        }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 {
        width:100% !important;
        max-width: 100%;
      }
      .moz-text-html .mj-column-per-60 {
        width:60% !important;
        max-width: 60%;
      }
      .moz-text-html .mj-column-per-40 {
        width:40% !important;
        max-width: 40%;
      }
      .moz-text-html .mj-column-per-50 {
        width:50% !important;
        max-width: 50%;
      }
    </style>
    <style type="text/css">
      @media only screen and (max-width:479px) {
        table.mj-full-width-mobile {
          width: 100% !important;
        }
        td.mj-full-width-mobile {
          width: auto !important;
        }
      }
    </style>
    <style type="text/css">
    </style>
    <!-- CSS-STYLE -->
  </head>
  <body style="word-spacing:normal;background-color:#d6dde5;">
    <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">Preview Text goes here
    </div>
    <div style="background-color:#d6dde5;">
      <!-- LOGO HEADER -->
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="column-outlook" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix column" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:20px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:200px;">
                                  <a href="#" target="_blank" title="Link to Company Website">
                                    <img alt="Link to Company Website" src="http://local.mautic.com/themes/brienz/assets/your-logo-purple.png?v82b85145" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" title="Link to Company Website" width="200" height="auto">
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
      <!-- SECTION HEADER -->
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:5px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:360px;" ><![endif]-->
                <div class="mj-column-per-60 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                    <tbody>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;padding-top:5px;padding-bottom:5px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1;text-align:left;color:#6d6d6d;">
                            <p style="margin: 0; padding: 0;">{subject}
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td><td class="" style="vertical-align:middle;width:240px;" ><![endif]-->
                <div class="mj-column-per-40 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                    <tbody>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;padding-top:5px;padding-bottom:5px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1;text-align:left;color:#6d6d6d;">
                            <p style="margin: 0; padding: 0;">
                              <a href="{webview_url}" style="color:#6d6d6d !important;">View this mail in your browser</a>
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
      <!-- SECTION HERO -->
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0;font-size:0;mso-line-height-rule:exactly;"><v:image style="border:0;height:500px;mso-position-horizontal:center;position:absolute;top:0;width:600px;z-index:-3;" src="http://local.mautic.com/themes/brienz/assets/brienzlake.jpeg?v82b85145" xmlns:v="urn:schemas-microsoft-com:vml" /><![endif]-->
      <div style="margin:0 auto;max-width:600px;">
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr style="vertical-align:top;">
              <td background="http://local.mautic.com/themes/brienz/assets/brienzlake.jpeg?v82b85145" style="background:#486AE2 url('http://local.mautic.com/themes/brienz/assets/brienzlake.jpeg?v82b85145') no-repeat center center / cover;background-position:center center;background-repeat:no-repeat;padding:0px;padding-top:80px;padding-bottom:80px;vertical-align:top;height:-160px;" height="-160">
                <!--[if mso | IE]><table border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600" ><tr><td style=""><![endif]-->
                <div class="mj-hero-content" style="margin:0px auto;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;margin:0px;">
                    <tbody>
                      <tr>
                        <td style>
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;margin:0px;">
                            <tbody>
                              <tr>
                                <td align="center" style="font-size:0px;padding:10px 25px;padding-top:20px;padding-bottom:0px;word-break:break-word;">
                                  <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:24px;font-weight:500;line-height:1;text-align:center;color:#ffffff;">
                                    <p style="margin: 0; padding: 0;">Check out our blog:
                                    </p>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="font-size:0px;padding:10px 25px;padding-top:20px;padding-bottom:0px;word-break:break-word;">
                                  <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:36px;font-weight:700;line-height:1;text-align:center;color:#ffffff;">
                                    <p style="margin: 0; padding: 0;">We are half way there!
                                    </p>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="font-size:0px;padding:10px 25px;padding-top:20px;padding-bottom:0px;word-break:break-word;">
                                  <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:24px;font-weight:500;line-height:1;text-align:center;color:#ffffff;">
                                    <p style="margin: 0; padding: 0;">See our progress!
                                    </p>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="font-size:0px;padding:10px 25px;padding-top:80px;padding-bottom:0px;word-break:break-word;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                    <tbody>
                                      <tr>
                                        <td align="center" bgcolor="#9E094E" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#9E094E;" valign="middle">
                                          <a href="#" style="display:inline-block;background:#9E094E;color:#FFFFFF;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank">
                                            MORE UPDATES
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
      <!-- SECTION TEXT + BUTTON -->
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;padding-top:25px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:0px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:20px;font-weight:500;line-height:1.5;text-align:left;color:#000000;">
                            <p style="margin: 0; padding: 0;">This is an eyecatching headline
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="justify" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;font-weight:300;line-height:1.5;text-align:justify;color:#000000;">
                            <p style="margin: 0; padding: 0;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin rutrum enim eget magna efficitur, eu semper augue semper. Aliquam erat volutpat. Cras id dui lectus. Vestibulum sed finibus lectus, sit amet suscipit nibh. Proin nec commodo purus. Sed eget nulla elit. Nulla aliquet mollis faucibus.
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;font-weight:300;line-height:1.5;text-align:left;color:#000000;">
                            <p style="margin: 0; padding: 0;">Call us from monday to friday: 
                              <a title="phone" href="tel:+41 600 00 00">+41 600 00 00</a>
                              <br> Or write a mail: 
                              <a title="mail" href="mailto:info@company.com">info@company.com</a>
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;padding-top:20px;padding-bottom:40px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                            <tbody>
                              <tr>
                                <td align="center" bgcolor="#486AE2" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#486AE2;" valign="middle">
                                  <a href="#" style="display:inline-block;background:#486AE2;color:#FFFFFF;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank">
                                    READ MORE
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
      <!-- SECTION SPACER -->
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td style="font-size:0px;word-break:break-word;">
                          <div style="height:15px;line-height:15px;">&#8202;
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
      <!-- SECTION IMAGE + TEXT + BUTTON -->
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;padding-top:25px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:20px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:550px;">
                                  <img alt="Lake of Brienz - Switzerland" src="http://local.mautic.com/themes/brienz/assets/brienz.jpeg?v82b85145" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="550" height="auto">
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:0px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:20px;font-weight:500;line-height:1.5;text-align:left;color:#000000;">
                            <p style="margin: 0; padding: 0;">This is an eyecatching headline
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="justify" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;font-weight:300;line-height:1.5;text-align:justify;color:#000000;">
                            <p style="margin: 0; padding: 0;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin rutrum enim eget magna efficitur, eu semper augue semper. Aliquam erat volutpat. Cras id dui lectus. Vestibulum sed finibus lectus, sit amet suscipit nibh. Proin nec commodo purus. Sed eget nulla elit. Nulla aliquet mollis faucibus.
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;padding-top:20px;padding-bottom:40px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                            <tbody>
                              <tr>
                                <td align="center" bgcolor="#486AE2" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#486AE2;" valign="middle">
                                  <a href="#" style="display:inline-block;background:#486AE2;color:#FFFFFF;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank">
                                    READ MORE
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
      <!-- SECTION SPACER -->
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td style="font-size:0px;word-break:break-word;">
                          <div style="height:15px;line-height:15px;">&#8202;
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
      <!-- SECTION 2-COLUMNS IMAGE + TEXT + BUTTON -->
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:25px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:300px;" ><![endif]-->
                <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:250px;">
                                  <img alt="At the Top Of The Rothorn" src="http://local.mautic.com/themes/brienz/assets/sign.jpeg?v82b85145" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="250" height="auto">
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="justify" style="font-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;font-weight:300;line-height:1.5;text-align:justify;color:#000000;">
                            <p style="margin: 0; padding: 0;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin rutrum enim eget magna efficitur, eu semper augue semper. Aliquam erat volutpat. Cras id dui lectus. Vestibulum sed finibus lectus, sit amet suscipit nibh. Proin nec commodo purus. Sed eget nulla elit. Nulla aliquet mollis faucibus.
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;padding-top:20px;padding-bottom:40px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                            <tbody>
                              <tr>
                                <td align="center" bgcolor="#486AE2" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#486AE2;" valign="middle">
                                  <a href="#" style="display:inline-block;background:#486AE2;color:#FFFFFF;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank">
                                    READ MORE
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:300px;" ><![endif]-->
                <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:250px;">
                                  <img alt="Snow Covered Jungraujoch" src="http://local.mautic.com/themes/brienz/assets/jungfrau.jpeg?v82b85145" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="250" height="auto">
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="justify" style="font-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;font-weight:300;line-height:1.5;text-align:justify;color:#000000;">
                            <p style="margin: 0; padding: 0;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin rutrum enim eget magna efficitur, eu semper augue semper. Aliquam erat volutpat. Cras id dui lectus. Vestibulum sed finibus lectus, sit amet suscipit nibh. Proin nec commodo purus. Sed eget nulla elit. Nulla aliquet mollis faucibus.
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;padding-top:20px;padding-bottom:40px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                            <tbody>
                              <tr>
                                <td align="center" bgcolor="#486AE2" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#486AE2;" valign="middle">
                                  <a href="#" style="display:inline-block;background:#486AE2;color:#FFFFFF;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank">
                                    READ MORE
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
      <!-- SECTION SPACER -->
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td style="font-size:0px;word-break:break-word;">
                          <div style="height:15px;line-height:15px;">&#8202;
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
      <!-- SECTION FOOTER -->
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;padding-top:25px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:0px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:20px;font-weight:500;line-height:1.5;text-align:left;color:#000000;">
                            <p style="margin: 0; padding: 0;">This is an eyecatching headline
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="justify" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;font-weight:300;line-height:1.5;text-align:justify;color:#000000;">
                            <p style="margin: 0; padding: 0;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin rutrum enim eget magna efficitur, eu semper augue semper. Aliquam erat volutpat. Cras id dui lectus. Vestibulum sed finibus lectus, sit amet suscipit nibh. Proin nec commodo purus. Sed eget nulla elit. Nulla aliquet mollis faucibus.
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;font-weight:300;line-height:1.5;text-align:left;color:#000000;">
                            <p style="margin: 0; padding: 0;">Call us from monday to friday: 
                              <a title="phone" href="tel:+41 600 00 00">+41 600 00 00</a>
                              <br> Or write a mail: 
                              <a title="mail" href="mailto:info@company.com">info@company.com</a>
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;padding-top:20px;padding-bottom:40px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                            <tbody>
                              <tr>
                                <td align="center" bgcolor="#486AE2" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#486AE2;" valign="middle">
                                  <a href="#" style="display:inline-block;background:#486AE2;color:#FFFFFF;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank">
                                    READ MORE
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td style="font-size:0px;word-break:break-word;">
                          <div style="height:15px;line-height:15px;">&#8202;
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#486AE2" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="background:#486AE2;background-color:#486AE2;margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#486AE2;background-color:#486AE2;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:20px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word;">
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" ><tr><td><![endif]-->
                          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                            <tbody>
                              <tr>
                                <td style="padding:4px;vertical-align:middle;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#3b5998;border-radius:3px;width:20px;">
                                    <tbody>
                                      <tr>
                                        <td style="font-size:0;height:20px;vertical-align:middle;width:20px;">
                                          <a href="https://www.facebook.com/sharer/sharer.php?u=[[SHORT_PERMALINK]]" target="_blank">
                                            <img height="20" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/facebook.png" style="border-radius:3px;display:block;" width="20">
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <!--[if mso | IE]></td><td><![endif]-->
                          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                            <tbody>
                              <tr>
                                <td style="padding:4px;vertical-align:middle;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#55acee;border-radius:3px;width:20px;">
                                    <tbody>
                                      <tr>
                                        <td style="font-size:0;height:20px;vertical-align:middle;width:20px;">
                                          <a href="https://twitter.com/intent/tweet?url=[[SHORT_PERMALINK]]" target="_blank">
                                            <img height="20" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/twitter.png" style="border-radius:3px;display:block;" width="20">
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <!--[if mso | IE]></td><td><![endif]-->
                          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                            <tbody>
                              <tr>
                                <td style="padding:4px;vertical-align:middle;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#dc4e41;border-radius:3px;width:20px;">
                                    <tbody>
                                      <tr>
                                        <td style="font-size:0;height:20px;vertical-align:middle;width:20px;">
                                          <a href="https://plus.google.com/share?url=[[SHORT_PERMALINK]]" target="_blank">
                                            <img height="20" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/google-plus.png" style="border-radius:3px;display:block;" width="20">
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <!--[if mso | IE]></td></tr></table><![endif]-->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#486AE2" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="background:#486AE2;background-color:#486AE2;margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#486AE2;background-color:#486AE2;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:center;color:#ffffff;">
                            <p style="margin: 0; padding: 0;">Amazing Company
                              <br>11111 Beautiful City, 1212 Nice Street
                              <br>Switzerland
                              <br>
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
      <!-- SECTION POLICY -->
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="graylink-outlook" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div class="graylink" style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:60px;padding-top:20px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:center;color:#6d6d6d;">
                            <p style="margin: 0; padding: 0; font-size: 11px;">{unsubscribe_text} 
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
    </div>
  </body>
</html>
`,
    css: ``
  }
];

const EmailComponent = ({ pageTitle }) => {
  const blankThumbnail = window.url('themes/blank/thumbnail.png');
  const brienzThumbnail = window.url('themes/brienz/thumbnail.png');
  
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null); // Store the modal instance

  const [isBuilderVisible, setIsBuilderVisible] = useState(false);
  const applyBuilder = () => {};

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then(() => {
      if (modalRef.current) {
        modalInstanceRef.current = new bootstrap.Modal(modalRef.current);
        modalInstanceRef.current.show();
      }
    });
  }, []);

  const [isListEmail, setIsListEmail] = useState(false);
  const selectEmailType = (type) => {
    console.log("Selected email type:", type);
    setIsListEmail(type);
    // Close the modal programmatically
    if (modalInstanceRef.current) {
      modalInstanceRef.current.hide();
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };
  

  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    alias: '',
    publicname: '',
    description: ''
  });
  
  const handleInputChange = (e) => {
        
    const { name, value } = e.target;
    setFormValues({
    ...formValues,
    [name]: value
    });
  };

  const [toggleValue, setToggleValue] = useState(false);

  const handleToggle = (value) => {
    setToggleValue(value);
    console.log("Toggle value:", value);
  };

  const save = () => {

  };

  const cancel = () => {
    window.location.href = window.url('emails');
  }

  return (
    <Layout pageTitle={pageTitle}>
      <div className="midde_cont">
        <div className="container-fluid">
          <div className="row column_title">
            <div className="col-md-12">
              <div className="page_title row">
                <div className="col-md-6">
                  <h2>New Email</h2>
                </div>
                <div className={`${Styles.textRight} col-md-6`}>
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <PrimaryButton id="builderBtn" type="button" className="btn btn-primary" onClick={() => setIsBuilderVisible(true)}><i className="bi bi-window-sidebar"></i> Builder</PrimaryButton>
                    <PrimaryButton type="button" className="btn btn-primary"><i className="bi bi-floppy2-fill"></i> Save</PrimaryButton>
                    <PrimaryButton type="button" className="btn btn-primary" onClick={() => cancel()}><i className="bi bi-x"></i> Cancel</PrimaryButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row column1">
                              
            <div className="col-md-9">
                <form id="segmentForm" className="white_shd full margin_bottom_30" ref={formRef} onSubmit={save} method="post">
                    <div className="full inner_elements">
                        <div className="row">
                            <div className="col-md-12">
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className={`${Styles.borderRadius} nav-link active`} id="theme-tab" data-bs-toggle="tab" data-bs-target="#theme" type="button" role="tab" aria-controls="theme" aria-selected="true">Theme</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={`${Styles.borderRadius} nav-link`}  id="advanced-tab" data-bs-toggle="tab" data-bs-target="#advanced" type="button" role="tab" aria-controls="advanced" aria-selected="false">Advanced</button>
                                    </li>
                                    </ul>
                                    <div className="tab-content" id="myTabContent">
                                    
                                    <div className="tab-pane fade show active" id="theme" role="tabpanel" aria-labelledby="theme-tab">
                                      <div className="full dis_flex center_text">
                                        <div className="col-md-12 form-group mb-3">
                                            <div className="row mb-3">
                                              {/* Blank Theme*/}
                                              <div className={`col-md-3 ${Styles.themeList}`}>
                                                <div className={`${Styles.panel} ${Styles.themeListPanel} panel-default theme-selected`}>
                                                <div className={`${Styles.panelBody} ${Styles.textCenter}`}>
                                                <h3 className={`${Styles.themeHeading}`}>Blank</h3>
                                                <a href="#" data-toggle="modal" data-target="#theme-blank">
                                                    <div style={{backgroundImage: `url(${blankThumbnail})`,backgroundRepeat:"no-repeat",backgroundSize:"contain", backgroundPosition:"center", width: "100%", height: "250px"}}></div>
                                                </a>
                                                <a href="#" type="button" data-theme="blank" className={`${Styles.selectAnchorBtn} ${Styles.selectThemeLink} btn ${Styles.btnDefault} hide`} onClick={() => handleTemplateSelect(templates[0])}>Select</a>
                                                <button type="button" className={`select-theme-selected btn ${Styles.btnDefault}`} disabled="disabled">
                                                    Selected
                                                </button>
                                                </div>
                                                </div>
                                                                    
                                                <div className="modal fade" id="theme-blank" role="dialog" aria-labelledby="blank">
                                                  <div className="modal-dialog" role="document">
                                                        <div className="modal-content">
                                                          <div className="modal-header">
                                                              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                                                              <h4 className="modal-title" id="blank">Blank</h4>
                                                          </div>
                                                          <div className="modal-body">
                                                            <div style={{backgroundImage: `url(${blankThumbnail})`,backgroundRepeat:"no-repeat",backgroundSize:"contain", backgroundPosition:"center", width: "100%", height: "600px"}}></div>
                                                          </div>
                                                        </div>
                                                    </div>
                                                </div>
                                              </div>
                                              {/* Brienz Theme*/}          
                                              <div className={`col-md-3 ${Styles.themeList}`}>
                                                <div className={`${Styles.panel} ${Styles.themeListPanel} panel-default`}>
                                                  <div className={`${Styles.panelBody} ${Styles.textCenter}`}>
                                                    <h3 className={`${Styles.themeHeading}`}>Brienz</h3>
                                                    <a href="#" data-toggle="modal" data-target="#theme-brienz">
                                                    <div 
                                                      style={{
                                                        backgroundImage: `url(${brienzThumbnail})`, 
                                                        backgroundRepeat: "no-repeat",
                                                        backgroundSize: "contain", 
                                                        backgroundPosition: "center",
                                                        width: "100%", 
                                                        height: "250px"
                                                      }}
                                                    ></div>
                                                  </a>

                                                    
                                                    <a href="#" type="button" data-theme="brienz" className={`${Styles.selectAnchorBtn} ${Styles.selectThemeLink} btn ${Styles.btnDefault}`} onClick={() => handleTemplateSelect(templates[1])}>Select</a>

                                                    <button type="button" className={`select-theme-selected btn ${Styles.btnDefault} hide`} disabled="disabled">Selected</button>
                                                    </div>
                                                </div>
                                                                    
                                                <div className="modal fade" id="theme-brienz" role="dialog" aria-labelledby="brienz">
                                                  <div className="modal-dialog" role="document">
                                                    <div className="modal-content">
                                                      <div className="modal-header">
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                                                        <h4 className="modal-title" id="brienz">Brienz</h4>
                                                      </div>
                                                      <div className="modal-body">
                                                          <div style={{backgroundImage: `url(${brienzThumbnail})`, backgroundRepeat:"no-repeat",backgroundSize:"contain", backgroundPosition:"center", width: "100%", height: "600px"}}></div>
                                                      </div>
                                                    </div>
                                                    </div>
                                                </div>
                                              </div>
                                            </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="tab-pane fade" id="advanced" role="tabpanel" aria-labelledby="advanced-tab">
                                      <div className="full dis_flex center_text">
                                        <div className="col-md-6 form-group mb-3">
                                            <div className="row mb-3">
                                                <div className="col-md-12">
                                                  <InputLabel className="form-label" value="From Name"/>
                                                  <TextInput type="text" className="form-control" name="fromname" id="fromname" placeholder="From Name" value={formValues.name} onChange={handleInputChange} />
                                                </div>
                                            </div>
                                            
                                            <div className="row mb-3">
                                                <div className="col-md-12">
                                                  <InputLabel className="form-label" value="From Address"/>
                                                  <TextInput type="text" className="form-control" name="fromaddress" id="fromaddress" placeholder="From Address" value={formValues.name} onChange={handleInputChange} />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-12">
                                                    <InputLabel className="form-label" value="Reply to Address"/>
                                                    <TextInput type="text" className="form-control" name="replytoaddress" id="replytoaddress" placeholder="Reply To Address" value={formValues.name} onChange={handleInputChange} />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-12">
                                                    <InputLabel className="form-label" value="BCC Address"/>
                                                    <TextInput type="text" className="form-control" name="bccaddress" id="bccaddress" placeholder="BCC Address" value={formValues.name} onChange={handleInputChange} />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-12">
                                                    <InputLabel className="form-label" value="Attachments"/>
                                                    <TextInput type="text" className="form-control" name="attachments" id="attachments" placeholder="Attachments" value={formValues.name} onChange={handleInputChange} />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-12">
                                                    <InputLabel className="form-label" value="Plain Text Version"/>
                                                    <textarea className="form-control" name="plaintext" id="plaintext" placeholder="Type your email content" value={formValues.name} onChange={handleInputChange} ></textarea>
                                                </div>
                                            </div>
                                          </div>

                                        <div className="col-md-6 form-group mb-3">
                                          {/*Custom Headers*/}
                                        </div>


                                      </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="col-md-3 white_shd">
                
                <form id="segmentForm" className="full margin_bottom_30" ref={formRef} onSubmit={save} method="post">
                <div className={`${Styles.pdt_5} full inner_elements formgroup mb-3`}>
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <InputLabel className="form-label" value="Subject"/>
                      <TextInput type="text" className="form-control" name="subject" id="subject" placeholder="Subject" value={formValues.name} onChange={handleInputChange} />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                      <div className="col-md-12">
                        <InputLabel className="form-label" value="Internal Name"/>
                        <TextInput type="text" className="form-control" name="internalname" id="internalname" placeholder="Internal Name" value={formValues.name} onChange={handleInputChange} />
                      </div>
                  </div>
                  {isListEmail === 'list' && (
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <InputLabel className="form-label" value="Contact Segment" />
                        <TextInput 
                          type="text" 
                          className="form-control" 
                          name="contactsegment" 
                          id="contactsegment" 
                          placeholder="Contact Segment" 
                          value={formValues.name} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                  )}
                  

                  <div className="row mb-3">
                      <div className="col-md-12">
                        <InputLabel className="form-label" value="Available for use"/>
                        <ToggleButton onToggle={handleToggle} />
                      </div>
                  </div>

                  <div className="row mb-3">
                      <div className="col-md-12">
                        <InputLabel className="form-label" value="Activate at (date/time)"/>
                        <TextInput type="text" className="form-control" name="activateat" id="activateat" placeholder="Activate at (date/time)" value={formValues.name} onChange={handleInputChange} />
                      </div>
                  </div>

                  <div className="row mb-3">
                      <div className="col-md-12">
                        <InputLabel className="form-label" value="Deactivate at (date/time)"/>
                        <TextInput type="text" className="form-control" name="deactivateat" id="deactivateat" placeholder="Deactivate at (date/time)" value={formValues.name} onChange={handleInputChange} />
                      </div>
                  </div>
                </div>
                </form>
                
            </div>

          </div>

        </div>

        {/* GrapesJS Builder */}
        {isBuilderVisible && (
        <div className={`${Styles.builderActive}`}>
          <GrapesJSBuilder 
            containerId="grapesjs-container"
            apiUrl="your-api-url"
            isVisible={isBuilderVisible} 
            onClose={() => setIsBuilderVisible(false)} // Handle close from child
            onApply={() => applyBuilder()}
            template={selectedTemplate}
          />
        </div>
        )}
        
        {/* Select Template type */}
        <BootstrapModal id="exampleModal" title="What type of email do you want to create?" modalRef={modalRef} onCancel={cancel} showFooter={false}>
          <div className="row">
            <div className="col-md-6">
              <div className={`${Styles.panel} ${Styles.panelSuccess}`}>
                <div className={`row ${Styles.panelHeading} ${Styles.panelSuccessHeading}`}>
                  <div className="col-xs-8 col-sm-10 np">
                    <h3 className={`${Styles.panelTitle}`}>Template Email</h3>
                  </div>
                  <div className={`${Styles.textRight} col-xs-4 col-sm-2 pl-0 pr-0 pt-10 pb-10`}>
                    <i className="fa fa-envelope-o hidden-xs fa-lg"></i>
                    <button
                      className={`${Styles.textPrimary} ${Styles.visibleXS} ${Styles.pullRight} btn btn-sm btn-default btn-nospin`}
                      onClick={() => selectEmailType("template")}
                    >
                      Select
                    </button>
                  </div>
                </div>
                <div className={`${Styles.panelBody}`}>
                  <ul className={`${Styles.dsListGroup} ds-list-check`}>
                    <li className={`${Styles.dsListGroupLi}`}><i className="mr-2 bi bi-check-circle"></i>For campaigns, forms, and triggers</li>
                    <li className={`${Styles.dsListGroupLi}`}><i className="mr-2 bi bi-check-circle"></i>Allows sending multiple times</li>
                    <li className={`${Styles.dsListGroupLi}`}><i className="mr-2 bi bi-check-circle"></i>Suited for transactional use</li>
                    <li className={`${Styles.dsListGroupLi}`}><i className="mr-2 bi bi-check-circle"></i>Based on users' specific actions</li>
                  </ul>
                </div>
                <div className={`${Styles.textCenter} ${Styles.panelFooter} hidden-xs`}>
                <PrimaryButton className={`btn ${Styles.textSuccess}`} onClick={() => selectEmailType("template")}>Select</PrimaryButton>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className={`${Styles.panel} ${Styles.panelPrimary}`}>
                <div className={`row ${Styles.panelHeading} ${Styles.panelPrimaryHeading}`}>
                  <div className="col-xs-8 col-sm-10 np">
                    <h3 className={`${Styles.panelTitle}`}>Segment Email</h3>
                  </div>
                  <div className={`${Styles.textRight} col-xs-4 col-sm-2 pl-0 pr-0 pt-10 pb-10`}>
                    <i className="hidden-xs fa fa-pie-chart fa-lg"></i>
                    <button
                      className={`${Styles.textPrimary} ${Styles.visibleXS} ${Styles.pullRight} btn btn-sm btn-default btn-nospin`}
                      onClick={() => selectEmailType("list")}
                    >
                      Select
                    </button>
                  </div>
                </div>
                <div className={`${Styles.panelBody}`}>
                  <ul className={`${Styles.dsListGroup} ds-list-check`}>
                    <li className={`${Styles.dsListGroupLi}`}><i className="mr-2 bi bi-check-circle"></i>For newsletters, offers, updates, etc.</li>
                    <li className={`${Styles.dsListGroupLi}`}><i className="mr-2 bi bi-check-circle"></i>Allows one send per contact</li>
                    <li className={`${Styles.dsListGroupLi}`}><i className="mr-2 bi bi-check-circle"></i>Designed for marketing use</li>
                    <li className={`${Styles.dsListGroupLi}`}><i className="mr-2 bi bi-check-circle"></i>Used in mass email sending</li>
                  </ul>
                </div>
                <div className={`${Styles.textCenter} ${Styles.panelFooter} hidden-xs`}>
                <PrimaryButton className={`btn ${Styles.textPrimary}`} onClick={() => selectEmailType("list")}>Select</PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </BootstrapModal>
      </div>
    </Layout>
  );
};

export default EmailComponent;