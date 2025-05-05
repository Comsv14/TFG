<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LostPetResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'        => $this->id,
            'comment'   => $this->description,
            'location'  => $this->last_seen_location,
            'lat'       => $this->last_seen_latitude,
            'lng'       => $this->last_seen_longitude,
            'posted_at' => optional($this->posted_at)->format('Y-m-d'),
            'pet' => [
                'id'    => $this->pet->id,
                'name'  => $this->pet->name,
                'breed' => $this->pet->breed,
                'age'   => $this->pet->age,
                'photo' => $this->pet->image
                    ? asset('storage/'.$this->pet->image)
                    : null,
            ],
            'photo' => $this->photo_url,
            'user'  => $this->user,
            'sightings' => $this->sightings,   // se cargan en el show()
        ];
    }
}
