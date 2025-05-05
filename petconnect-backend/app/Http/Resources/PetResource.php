<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PetResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'        => $this->id,
            'name'      => $this->name,
            'breed'     => $this->breed,
            'age'       => $this->age,
            'image_url' => $this->image
                ? asset('storage/' . $this->image)
                : null,
        ];
    }
}
