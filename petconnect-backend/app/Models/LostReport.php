<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LostReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'pet_id',
        'type',
        'comment',
        'happened_at',
        'latitude',
        'longitude',
        'photo',
        'resolved',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }
}
