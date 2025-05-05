<?php
// app/Models/LostPet.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LostPet extends Model
{
    // No timestamps automáticos: usas `posted_at`
    public $timestamps = false;

    protected $fillable = [
        'pet_name',
        'description',
        'photo',
        'last_seen_location',
        'last_seen_latitude',
        'last_seen_longitude',
        'found',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sightings(): HasMany
    {
        return $this->hasMany(LostPetSighting::class);
    }
}
