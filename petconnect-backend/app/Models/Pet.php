<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Pet extends Model
{
    protected $fillable = ['name', 'breed', 'age', 'user_id'];

    /**
     * Relación: Una mascota puede tener muchas imágenes
     */
    public function images()
    {
        return $this->hasMany(PetImage::class);
    }

    /**
     * Relación: Una mascota puede tener muchos reportes de pérdida
     */
    public function lostReports()
    {
        return $this->hasMany(LostReport::class);
    }

    /**
     * Relación: Una mascota pertenece a un usuario
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Accesor para la URL de la imagen principal de la mascota
     */
    public function getPhotoUrlAttribute()
    {
        return $this->images->count()
            ? url(Storage::url($this->images->first()->path))
            : asset('default-avatar.png'); // Imagen predeterminada si no hay foto
    }
}
