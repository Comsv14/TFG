<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PetImage extends Model
{
    use HasFactory;

    protected $fillable = ['pet_id','path'];

    /**
     * Cada imagen pertenece a una mascota.
     */
    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }
}
