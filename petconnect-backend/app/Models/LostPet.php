<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LostPet extends Model
{
    use HasFactory;

    public $timestamps = false; // usamos solo posted_at

    protected $fillable = [
        'user_id',
        'pet_name',
        'description',
        'photo',
        'last_seen_location',
        'found',
    ];

    protected $dates = [
        'posted_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sightings()
    {
        return $this->hasMany(LostPetSighting::class);
    }
}
