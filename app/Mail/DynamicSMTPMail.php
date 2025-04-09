<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DynamicSMTPMail extends Mailable
{
    use Queueable, SerializesModels;
    public Array $PARAMETERS;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Array $param = array())
    {
        
        $this->PARAMETERS = $param;

    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        //dd($this->PARAMETERS); die;
        $f = $this->PARAMETERS['from'];
        $subject = $this->PARAMETERS['subject'];
        $templateBlade = $this->PARAMETERS['templateBlade'];
        $templateData =  $this->PARAMETERS['templateData'];
        return $this
                ->from($f['email'], $f['name'])
                ->subject($subject)
                ->markdown($templateBlade, $templateData);
        
    }
}