<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class LostPet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'pet_name',
        'description',
        'last_seen_location',
        'last_seen_latitude',
        'last_seen_longitude',
        'photo',
        'posted_at',
        'found'
    ];

    protected $casts = [
        'found' => 'boolean',
        'last_seen_latitude' => 'float',
        'last_seen_longitude' => 'float',
        'posted_at' => 'datetime',
    ];

    // Relación con el usuario (dueño)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación con avistamientos (sightings)
    public function sightings()
    {
        return $this->hasMany(LostPetSighting::class);
    }

    // Accesor para la URL de la foto
    public function getPhotoUrlAttribute()
    {
        return $this->photo ? url(Storage::url($this->photo)) : null;
    }

    // Scopes
    public function scopeLost($query)
    {
        return $query->where('found', false);
    }

    public function scopeFound($query)
    {
        return $query->where('found', true);
    }
    public function comments()
{
    return $this->hasMany(LostPetComment::class);
}
}
