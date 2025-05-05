<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class LostPet extends Model
{
    protected $fillable = [
      'pet_name','description','photo',
      'last_seen_location',
      'last_seen_latitude','last_seen_longitude',
      'user_id','found','posted_at'
    ];

    // timestamps true para created_at/updated_at
    public $timestamps = true;

    public function getPhotoUrlAttribute()
    {
        return $this->photo
            ? url(Storage::url($this->photo))
            : null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sightings()
    {
        return $this->hasMany(LostSighting::class);
    }
}
