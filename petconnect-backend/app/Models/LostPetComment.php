<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LostPetComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lost_pet_id',
        'body',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lostPet()
    {
        return $this->belongsTo(LostPet::class);
    }
}
