<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'location',
        'starts_at',
        'ends_at',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class)
                    ->withPivot('registered_at')
                    ->withTimestamps();
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
