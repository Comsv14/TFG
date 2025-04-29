<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pet extends Model
{
    use HasFactory;

    protected $fillable = [
        'name','breed','age','photo','user_id'
    ];
    

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
