<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Pet extends Model
{
    protected $fillable = ['name', 'breed', 'age', 'user_id'];

    public function images()
    {
        return $this->hasMany(PetImage::class);
    }

    // Accesor para URL de la imagen
    public function getPhotoUrlAttribute()
    {
        return $this->images->count()
            ? url(Storage::url($this->images->first()->path))
            : null;
    }
}
