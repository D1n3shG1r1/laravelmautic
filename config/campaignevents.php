<?php
/* array structured for campain-events-dropdown-options */
return [

    "decisions" => [
                
        ["id" => 1, "event" => "emailclick", "value" => "email.click", "title" => "Clicks email", "description" => "Trigger actions when an email is clicked. Connect a Send Email action to the top of this decision."],
        
        ["id" => 2, "event" => "emailopen", "value" => "email.open", "title" => "Opens email", "description" => "Trigger actions when an email is opened. Connect a Send Email action to the top of this decision."],
        
        /*
        ["id" => 3, "event" => "emailreply", "value" => "email.reply", "title" => "Replies to email", "description" => "Trigger action when contact replies to an email. Connect a Send Email action to the top of this decision."],
        
        ["id" => 4, "event" => "pagedevicehit", "value" => "page.devicehit", "title" => "Device visit", "description" => "Trigger device  on a page/url hit."],
        
        ["id" => 5, "event" => "assetdownload", "value" => "asset.download", "title" => "Downloads asset", "description" => "Trigger actions upon downloading an asset."],

        ["id" => 6, "event" => "dwcdecision", "value" => "dwc.decision", "title" => "Request dynamic content", "description" => "This is the top level for a dynamic content request."],

        ["id" => 7, "event" => "formsubmit", "value" => "form.submit", "title" => "Submits form", "description" => "Trigger actions when a contact submits a form."],

        ["id" => 8, "event" => "pagepagehit", "value" => "page.pagehit", "title" => "Visits a page", "description" => "Trigger actions on a page/url hit."]*/

    ],
    
    "actions" => [
        
        ["id" => 1, "event" => "leaddeletecontact", "value" => "lead.deletecontact", "title" => "Delete contact", "description" => "<span class='text-danger'>Permanently deletes the contact as well as all associated statistical data. <strong>Warning: this is irreversible!</strong></span>"],
        
        ["id" => 2, "event" => "leadchangelist", "value" =>"lead.changelist", "title" => "Modify contact's segments", "description" => "Add contact to or remove contact from segment(s)"],
        
        ["id" => 3, "event" => "leadchangetags", "value" =>"lead.changetags", "title" => "Modify contact's tags", "description" => "Add tag to or remove tag from contact"],

        ["id" => 4, "event" => "emailsend", "value" =>"email.send", "title" => "Send email", "description" => "Send the selected email to the contact."],

        ["id" => 5, "event" => "leadupdatelead", "value" =>"lead.updatelead", "title" => "Update contact", "description" => "Update the current contact's fields with the defined values from this action"],
        
        /*
        ["id" => 6, "event" => "campaignaddremovelead", "value" => "campaign.addremovelead", "title" => "Change campaigns", "description" => "Add contact to specific campaigns and/or remove from specific campaigns when the event is triggered."],
        
        ["id" => 7, "event" => "leadadddnc", "value" => "lead.adddnc", "title" => "Add Do Not Contact", "description" => "Add DoNotContact flag to the contact"],

        ["id" => 8, "event" => "leadscorecontactscompanies", "value" => "lead.leadscorecontactscompanies", "title" => "Add to company's score", "description" => "This action will add the specified value to the company's existing score"],
        
        ["id" => 9, "event" => "leadaddtocompany", "value" => "lead.addtocompany", "title" => "Add to company action", "description" => "This action will add contacts to the selected company"],
        
        ["id" => 10, "event" => "leadchangepoints", "value" => "lead.changepoints", "title" => "Adjust contact points", "description" => "Add contact to specific campaigns and/or remove from specific campaigns when the event is triggered."],
         
        ["id" => 11, "event" => "stagechange", "value" => "stage.change", "title" => "Change contact's stage", "description" => "Choose a stage to change a contact to."],
        
        ["id" => 12, "event" => "campaignjump_to_event", "value" => "campaign.jump_to_event", "title" => "Jump to Event", "description" => "Jump to the chosen event within the campaign flow."],
        
        ["id" => 13, "event" => "pluginleadpush", "value" =>"plugin.leadpush", "title" => "Push contact to integration", "description" => "Push a contact to the selected integration."],
        
        ["id" => 14, "event" => "leadremovednc", "value" =>"lead.removednc", "title" => "Remove Do Not Contact", "description" => "Remove Do Not Contact flag from contact."],
        
        ["id" => 15, "event" => "campaignsendwebhook", "value" =>"campaign.sendwebhook", "title" => "Send a webhook", "description" => "Send a webhook (only for experienced users)."],
        
        ["id" => 16, "event" => "emailsendtouser", "value" =>"email.send.to.user", "title" => "Send email to user", "description" => "Send email to user, owner or other email addresses"],
        
        ["id" => 17, "event" => "messagesend", "value" =>"message.send", "title" => "Send marketing message", "description" => "Send a message through the configured channels within the marketing message selected."],
        
        ["id" => 18, "event" => "leadupdatecompany", "value" =>"lead.updatecompany", "title" => "Update contact's primary company", "description" => "Update the contact's primary company fields with the defined values from this action"],
        
        ["id" => 19, "event" => "leadchangeowner", "value" =>"lead.changeowner", "title" => "Update contact owner", "description" => "This action will update contact owner as part of a campaign"]
        */
    ],
    
    "conditions" => [
        
        ["id" => 1, "event" => "leadfield_value", "value" => "lead.field_value", "title" => "Contact field value", "description" => "Condition based on a contact field value."],

        ["id" => 2, "event" => "leadsegments", "value" => "lead.segments", "title" => "Contact segments", "description" => "Condition based on a contact segments."],

        ["id" => 3, "event" => "leadtags", "value" => "lead.tags", "title" => "Contact tags", "description" => "Condition based on a contact tags."],

        /*            
        ["id" => 4, "event" => "leadcampaigns", "value" => "lead.campaigns", "title" => "Contact campaigns", "description" => "Condition based on a contact campaigns."],

        ["id" => 5, "event" => "leaddevice", "value" => "lead.device", "title" => "Contact device", "description" => "Condition based on a contact device."],
        
        ["id" => 6, "event" => "leadowner", "value" => "lead.owner", "title" => "Contact owner", "description" => "Condition based on a contact owner."],

        ["id" => 7, "event" => "leadpoints", "value" => "lead.points", "title" => "Contact points", "description" => "Condition based on contact score"],

        ["id" => 8, "event" => "leadstages", "value" => "lead.stages", "title" => "Contact stages", "description" => "Condition that the contact belongs to at least one of the selected stages."],

        ["id" => 9, "event" => "formfield_value", "value" => "form.field_value", "title" => "Form field value", "description" => "Trigger actions when a submitted form field value suits the defined condition."],

        ["id" => 10, "event" => "notificationhasactive", "value" => "notification.has.active", "title" => "Has active notification", "description" => "Condition check If contact has active notification."],

        ["id" => 11, "event" => "emailvalidateaddress", "value" => "email.validate.address", "title" => "Has valid email address", "description" => "Attempt to validate contact's email address. This may not be 100% accurate."],

        ["id" => 12, "event" => "leaddnc", "value" => "lead.dnc", "title" => "Marked as DNC", "description" => "Condition checks if the contact has the Do Not Contact flag."],

        ["id" => 13, "event" => "leadpageHit", "value" => "lead.pageHit", "title" => "Visited page", "description" => "Condition based on all the pages the contact has visited in the past"]
        */
    ],

];