<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Relaciones
    public function pets()
    {
        return $this->hasMany(Pet::class);
    }

    public function activities()
    {
        return $this->belongsToMany(Activity::class)
                    ->withPivot('registered_at')
                    ->withTimestamps();
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function lostPets()
    {
        return $this->hasMany(LostPet::class);
    }
}
