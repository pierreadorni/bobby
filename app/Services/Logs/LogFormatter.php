<?php

namespace App\Services\Logs;
use Monolog\Formatter\NormalizerFormatter;
use Portail;
use Carbon\Carbon;

class LogFormatter extends NormalizerFormatter
{

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * {@inheritdoc}
     */
    public function format(array $record)
    {
        $record = parent::format($record);

        return $this->getDocument($record);
    }

    /**
     * Convert a log message into an MariaDB Log entity
     * @param array $record
     * @return array
     */
    protected function getDocument(array $record)
    {
        $fills = $record['extra'];
        $fills['level'] = strtolower($record['level_name']);
        $fills['description'] = $record['message'];
        $user = Portail::getUser();
        if (!empty($user)) {
            $fills['user_id'] = $user['id'];
        }
        $fills['created_date'] = Carbon::now()->format('Y-m-d');

        return $fills;
    }
}