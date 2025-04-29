<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pet extends Model
{
    use HasFactory;

    protected $fillable = [
        'name','breed','age','user_id'
        // ya no guardamos 'photo' aquí
    ];

    /**
     * Relación uno a muchos con imágenes.
     */
    public function images()
    {
        return $this->hasMany(PetImage::class);
    }
}
