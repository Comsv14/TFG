<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LostPet extends Model
{
    use HasFactory;

    public $timestamps = false; // usamos solo posted_at

    protected $fillable = [
        'pet_name','description','last_seen_location','photo','user_id'
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
