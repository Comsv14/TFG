<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ActivityUser extends Pivot
{
    protected $table = 'activity_user';

    protected $fillable = [
        'activity_id',
        'user_id',
        'rating',
        'registered_at',
    ];

    public $timestamps = true;
}
