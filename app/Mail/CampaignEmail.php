<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CampaignEmail extends Mailable
{
    use Queueable, SerializesModels;

    protected $data;

    public function __construct($data)
    {
        $this->data = $data; // contains subject, html, name, etc.
    }

    public function build()
    {
        return $this->subject($this->data['subject'])
                    ->html($this->data['body']); // raw HTML from DB
    }
}
