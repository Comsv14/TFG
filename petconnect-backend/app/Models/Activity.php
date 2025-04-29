<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'location',
        'starts_at',
        'ends_at',
        'user_id',
        'latitude',     // ← añadido
        'longitude',    // ← añadido
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class)
                    ->withPivot('registered_at');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
