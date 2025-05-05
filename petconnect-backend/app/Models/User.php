<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',    // <-- aquí
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Para devolver siempre la URL completa
    public function getAvatarUrlAttribute()
    {
        return $this->avatar
            ? url(\Illuminate\Support\Facades\Storage::url($this->avatar))
            : null;
    }
    public function lostPets()
    {
        return $this->hasMany(LostPet::class);
    }
}
