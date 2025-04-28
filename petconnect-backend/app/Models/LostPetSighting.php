<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LostPetSighting extends Model
{
    use HasFactory;

    public $timestamps = false; // usamos solo sighted_at

    protected $fillable = [
        'lost_pet_id',
        'user_id',
        'location',
        'comment',
        'photo',
    ];

    protected $dates = [
        'sighted_at',
    ];

    public function lostPet()
    {
        return $this->belongsTo(LostPet::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
