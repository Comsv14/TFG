<?php
// app/Events/NewLostPetReport.php

namespace App\Events;

use App\Models\LostReport;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewLostPetReport
{
    use Dispatchable, SerializesModels;

    public $report;

    public function __construct(LostReport $report)
    {
        $this->report = $report;
    }
}
