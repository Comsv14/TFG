<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LostPet extends Model
{
    protected $fillable = [
        'pet_name',
        'description',
        'photo',
        'last_seen_location',
        'last_seen_latitude',
        'last_seen_longitude',
        'posted_at',
        'user_id',
    ];

    /**  ← NUEVO: sin created_at / updated_at  */
    public $timestamps = false;

    protected $casts = [
        'posted_at' => 'datetime',
    ];

    /*------------------------------------------
    | Relaciones
    |-----------------------------------------*/
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sightings()
    {
        return $this->hasMany(Sighting::class);
    }

    /*------------------------------------------
    | Accesores
    |-----------------------------------------*/
    public function getPhotoUrlAttribute()
    {
        return $this->photo ? asset('storage/'.$this->photo) : null;
    }
}
