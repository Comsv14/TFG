<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class LostPetSighting extends Model
{
    use HasFactory;

    protected $fillable = [
        'lost_pet_id',
        'user_id',
        'location',
        'comment',
        'photo',
        'latitude',
        'longitude',
        'sighted_at',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'sighted_at' => 'datetime',
    ];

    // Relación con la mascota perdida
    public function lostPet()
    {
        return $this->belongsTo(LostPet::class);
    }

    // Relación con el usuario que reportó
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accesor para la URL de la foto
    public function getPhotoUrlAttribute()
    {
        return $this->photo ? url(Storage::url($this->photo)) : null;
    }
}
