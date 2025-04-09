<?php

namespace App\Traits;

use App\Mail\DynamicSMTPMail;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use Swift_Mailer;
use Swift_SmtpTransport;

trait SmtpConfigTrait {

    public function MYSMTP($smtpDetails, $recipient, $subject, $templateBlade, $data) {
        $smtpDetails['encryption'] = "";
        try {
            
            $configuration = [
                'smtp_host'         => $smtpDetails['host'],
                'smtp_port'         => $smtpDetails['port'],
                'smtp_username'     => $smtpDetails['username'],
                'smtp_password'     => $smtpDetails['password'],
                'smtp_encryption'   => $smtpDetails['encryption'],
                'from_email'        => $smtpDetails['from_email'],
                'from_name'         => $smtpDetails['from_name'],
                'replyTo_email'     => $smtpDetails['replyTo_email'],
                'replyTo_name'      => $smtpDetails['replyTo_name'],
            ];
            
            $this->approach3($configuration, $recipient, $subject, $templateBlade, $data);

            return true;
        } catch (\Throwable $th) {
            throw $th;
            return false;
        }

    }

    public function approach1($configuration, $user) {
        $mailer = app()->makeWith('custom.smtp.mailer', $configuration);
        $mailer->to( $user->email )->send( new DynamicSMTPMail($user->name, ['email' => $configuration['from_email'], 'name' => $configuration['from_name']]) );
    }

    public function approach2($configuration, $user) {
       
        // backup mailing configuration
        $backup = Mail::getSwiftMailer();

        // set mailing configuration
        $transport = (new Swift_SmtpTransport(
                                $configuration['smtp_host'], 
                                $configuration['smtp_port'], 
                                $configuration['smtp_encryption']))

                    ->setUsername($configuration['smtp_username'])
                    ->setPassword($configuration['smtp_password']);

        $maildoll = new Swift_Mailer($transport);

        // set mailtrap mailer
        Mail::setSwiftMailer($maildoll);

        Mail::to($user->email)->send( new DynamicSMTPMail( $user->name, ['email' => $configuration['from_email'], 'name' => $configuration['from_name']] ) );

        // reset to default configuration
        Mail::setSwiftMailer($backup);
    }

    public function approach3($configuration, $recipient, $subject, $templateBlade, $data) {
        $backup = Config::get('mail.mailers.smtp');

        Config::set('mail.mailers.smtp.host', $configuration['smtp_host']);
        Config::set('mail.mailers.smtp.port', $configuration['smtp_port']);
        Config::set('mail.mailers.smtp.username', $configuration['smtp_username']);
        Config::set('mail.mailers.smtp.password', $configuration['smtp_password']);
        Config::set('mail.mailers.smtp.encryption', $configuration['smtp_encryption']);
        Config::set('mail.mailers.smtp.transport', 'smtp');
        //Config::set('mail.mailers.smtp.auth_mode', true);

        $toEmail = $recipient["email"];
        $toName = $recipient["name"];
        $param = array(
            "from" => array("email" => $configuration['from_email'],"name" => $configuration['from_name']),
            "subject" => $subject,
            "templateBlade" => $templateBlade,
            "templateData" => $data
        );

        // Add CC and BCC logic
        // Split comma-separated emails into arrays
        $ccEmails = isset($recipient['cc']) ? array_map('trim', explode(',', $recipient['cc'])) : [];
        $bccEmails = isset($recipient['bcc']) ? array_map('trim', explode(',', $recipient['bcc'])) : [];


        // Send email with CC and BCC
        $mail = Mail::to($toEmail, $toName);

        if (!empty($ccEmails)) {
            $mail->cc($ccEmails);
        }

        if (!empty($bccEmails)) {
            $mail->bcc($bccEmails);
        }
        
        return $mail->send(new DynamicSMTPMail($param));

        //return Mail::to($toEmail,$toName)->send(new DynamicSMTPMail($param));

    }
}