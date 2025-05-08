<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BrevoWebhookController extends Controller
{
    public function handle(Request $request)
    {
        // Log or store incoming webhook data
        Log::info('Brevo Webhook:', $request->all());

        // You can store this in DB, mark email as opened/clicked, etc.
        $event = $request->input('event');

        switch ($event) {
            case 'delivered':
                // update email status in DB
                break;
            case 'opened':
                // mark as opened
                break;
            case 'click':
                // track click
                break;
            case 'reply':
                // handle reply
                break;
            case 'soft_bounce':
            case 'hard_bounce':
                // mark as failed
                break;
            // Handle other events...
        }

        return response()->json(['status' => 'received'], 200);

        /*
        Store events in db
        $data = $request->all();

        // Example Brevo webhook fields
        $email = $data['email'] ?? null;
        $event = $data['event'] ?? null;
        $messageId = $data['message-id'] ?? null;
        $timestamp = isset($data['date']) ? now()->parse($data['date']) : now();

        if ($email && $event) {
            EmailEvent::create([
                'email' => $email,
                'event' => $event,
                'message_id' => $messageId,
                'payload' => $data,
                'event_at' => $timestamp,
            ]);
        }

        return response()->json(['status' => 'stored'], 200);
        */
    }
}

/*
C. Configure Webhook in Brevo Dashboard
Go to https://app.brevo.com

Navigate to Transactional > Settings > Webhooks

Click Create Webhook

URL: https://yourdomain.com/webhooks/brevo

Select Events:

Opened

Clicked

Replied

Delivered

Bounced, etc.

Save and test with a sample payload.

=======================

✅ Sample Email Send with Tracking Pixel (if needed)
If for some reason you want to manually inject tracking, you can add a tracking pixel like this:

php
Copy
Edit
$body = '<p>Hello ' . $user->name . '</p><p>Your offer is ready!</p>';
$body .= '<img src="https://yourdomain.com/track/open/'.$user->id.'" width="1" height="1" />';
But usually, Brevo does this automatically if you're using SMTP + HTML + verified domain.

=======================
✅ Reply Tracking in Brevo
To track replies:

You must configure a dedicated reply-to address.

Set up Inbound Parsing (under your Brevo SMTP settings or by contacting support).

Choose “reply” in the webhook events list.

Replies will trigger the "reply" event in your webhook controller.
*/