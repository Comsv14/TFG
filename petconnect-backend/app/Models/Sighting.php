<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\LostPet;

class Sighting extends Model
{
    use HasFactory;

    // ↓ Aquí falta indicarle la tabla correcta:
    protected $table = 'lost_pet_sightings';

    protected $fillable = [
        'lost_pet_id','user_id','location','latitude','longitude','comment','photo',
    ];

    public function lostPet()
    {
        return $this->belongsTo(LostPet::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
