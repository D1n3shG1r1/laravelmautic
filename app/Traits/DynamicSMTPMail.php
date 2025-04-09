<?php

namespace App\Traits;

use Illuminate\Support\Facades\Config;

trait DynamicSMTPMail
{
    /**
     * Set the dynamic SMTP configuration.
     *
     * @param array $config
     * @return void
     */
    public function setDynamicSMTPConfig(array $config)
    {
        Config::set('mail.mailers.smtp.host', $config['host']);
        Config::set('mail.mailers.smtp.port', $config['port']);
        Config::set('mail.mailers.smtp.username', $config['username']);
        Config::set('mail.mailers.smtp.password', $config['password']);
        Config::set('mail.mailers.smtp.encryption', $config['encryption']);
        Config::set('mail.from.address', $config['from_address']);
        Config::set('mail.from.name', $config['from_name']);
    }
}
