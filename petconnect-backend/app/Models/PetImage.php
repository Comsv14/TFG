<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PetImage extends Model
{
    protected $fillable = ['pet_id', 'path'];

    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }
}
