<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class LostReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'pet_id',
        'type',  // 'lost' or 'found'
        'comment',
        'happened_at',
        'latitude',
        'longitude',
        'photo',
        'resolved',
    ];

    protected $casts = [
        'resolved' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
        'happened_at' => 'datetime',
    ];

    // Relación con el usuario que reportó
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación con la mascota (si es reporte de pérdida de mascota)
    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }

    // Accesor para la URL de la foto
    public function getPhotoUrlAttribute()
    {
        return $this->photo ? url(Storage::url($this->photo)) : null;
    }

    // Scopes para reportes perdidos y encontrados
    public function scopeLost($query)
    {
        return $query->where('type', 'lost');
    }

    public function scopeFound($query)
    {
        return $query->where('type', 'found');
    }
}
