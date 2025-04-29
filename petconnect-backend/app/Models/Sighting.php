<?php
// petconnect-backend/app/Models/Sighting.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\LostPet;

class Sighting extends Model
{
    use HasFactory;

    protected $fillable = [
        'lost_pet_id',
        'user_id',
        'location',
        'latitude',
        'longitude',
        'comment',
        'photo',
    ];

    // Qué mascota
    public function lostPet()
    {
        return $this->belongsTo(LostPet::class);
    }

    // Quién reportó
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
