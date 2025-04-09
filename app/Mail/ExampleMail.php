<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Traits\DynamicSMTPMail;

class ExampleMail extends Mailable
{
    use Queueable, SerializesModels, DynamicSMTPMail;

    public $data;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;

        // Example dynamic configuration
        $smtpConfig = [
            'host' => 'smtp-relay.brevo.com',
            'port' => 587,
            'username' => 'dineshleadtech@gmail.com',
            'password' => 'OwZtPF5pvsz3dBWn',
            'encryption' => 'tls',
            'from_address' => 'info@dkgiri.in',
            'from_name' => 'dkgiri',
        ];

        $smtpDetails['host'] = "smtp-relay.brevo.com";
        $smtpDetails['port'] = "587";
        $smtpDetails['username'] = "dineshleadtech@gmail.com";
        $smtpDetails['password'] = "OwZtPF5pvsz3dBWn";
        $smtpDetails['encryption'] = "";
        $smtpDetails['from_email'] = "info@dkgiri.in";
        $smtpDetails['from_name'] = "dkgiri";
        $smtpDetails['replyTo_email'] = "info@dkgiri.in";
        $smtpDetails['replyTo_name'] = "dkgiri";

        $this->setDynamicSMTPConfig($smtpConfig);
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('info@dkgiri.in', 'dkgiri')
        ->subject('Dynamic SMTP Mail')
        ->view('emails.example')
        ->with('data', $this->data);
    }
}
