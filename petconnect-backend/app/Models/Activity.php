<?php
// app/Models/Activity.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'location',
        'latitude',
        'longitude',
        'starts_at',
        'ends_at',
        'finished_at',
        'average_rating', // ✅ Añadido para guardar el promedio de calificaciones
    ];

    protected $casts = [
        'starts_at'   => 'datetime',
        'ends_at'     => 'datetime',
        'finished_at' => 'datetime',
    ];

    protected $appends = ['is_finished'];

    /* ---------- Relaciones ----------------------------------------- */

    /** Creador de la actividad */
    public function user() { return $this->belongsTo(User::class, 'user_id'); }
    public function creator() { return $this->user(); } // alias

    /** Participantes (inscritos) */
    public function participants()
    {
        return $this->belongsToMany(User::class)
                    ->using(ActivityUser::class)
                    ->withPivot(['rating', 'registered_at'])
                    ->withTimestamps();
    }

    /** Alias para compatibilidad con el controlador antiguo */
    public function users() { return $this->participants(); }

    /** Relación de calificaciones (ratings) */
    public function ratings()
    {
        return $this->hasMany(ActivityRating::class, 'activity_id');
    }

    /* ---------- Atributos & helpers -------------------------------- */

    public function getIsFinishedAttribute(): bool
    {
        if ($this->finished_at !== null) {
            return true;
        }
        return $this->ends_at && $this->ends_at->isPast();
    }

    public function checkAndMarkFinished(): void
    {
        if ($this->finished_at === null && $this->ends_at && $this->ends_at->isPast()) {
            $this->finished_at = now();
            $this->save();
        }
    }

    /** Recalcular promedio de calificaciones */
    public function recalculateAverageRating()
    {
        $this->average_rating = $this->ratings()->avg('rating') ?? 0;
        $this->save();
    }
}
