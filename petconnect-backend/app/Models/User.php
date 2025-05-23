<?php

namespace App\Models;
use App\Models\LostPet;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use App\Models\LostReport;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'latitude',
        'longitude',
        'role',
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
       /**
     * Relación 1:N con LostPet
     */
    public function lostPets()
    {
        return $this->hasMany(LostPet::class);
    }
    public function lostReports()
{
    return $this->hasMany(LostReport::class);
}
public function isAdmin()
{
    return $this->role === 'admin';
}

}
