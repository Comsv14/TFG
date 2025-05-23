<?php
// app/Models/ActivityRating.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityRating extends Model
{
    use HasFactory;

    protected $fillable = ['activity_id', 'user_id', 'rating'];

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

