<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Sighting;

class LostPet extends Model
{
    use HasFactory;

    protected $table = 'lost_pets';

    protected $fillable = [
        'pet_name',
        'description',
        'last_seen_location',
        'last_seen_latitude',
        'last_seen_longitude',
        'photo',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sightings()
    {
        return $this->hasMany(Sighting::class);
    }
}
