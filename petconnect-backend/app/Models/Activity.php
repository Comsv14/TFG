<?php
// app/Models/Activity.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'location',
        'latitude',
        'longitude',
        'starts_at',
        'ends_at',
        'finished_at',
        'average_rating',
    ];

    protected $casts = [
        'starts_at'   => 'datetime',
        'ends_at'     => 'datetime',
        'finished_at' => 'datetime',
        'average_rating' => 'decimal:2',
    ];

    protected $appends = ['is_finished', 'participants_count'];

    /* ---------- Relaciones ----------------------------------------- */

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function participants()
    {
        return $this->belongsToMany(User::class)
                    ->using(ActivityUser::class)
                    ->withPivot(['registered_at'])
                    ->withTimestamps();
    }

    public function ratings()
    {
        return $this->hasMany(ActivityRating::class, 'activity_id');
    }

    /* ---------- Atributos & helpers -------------------------------- */

    public function getIsFinishedAttribute(): bool
    {
        return $this->finished_at !== null || ($this->ends_at && $this->ends_at->isPast());
    }

    public function getParticipantsCountAttribute()
    {
        return $this->participants()->count();
    }

    public function recalculateAverageRating()
    {
        $this->average_rating = $this->ratings()->avg('rating') ?? 0.00;
        $this->save();
    }
}
