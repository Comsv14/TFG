<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    public function toArray($request)
    {
        // obtenemos la media o null
        $rawAverage = $this->average_rating
            ?? $this->participants()->avg('rating');

        // si es null la convertimos a 0.0
        $average = $rawAverage !== null ? (float) $rawAverage : 0.0;

        return [
            'id'                 => $this->id,
            'creator'            => new UserResource($this->whenLoaded('creator')),
            'title'              => $this->title,
            'description'        => $this->description,
            'location'           => $this->location,
            'latitude'           => $this->latitude,
            'longitude'          => $this->longitude,
            'starts_at'          => optional($this->starts_at)->toIso8601String(),
            'ends_at'            => optional($this->ends_at)->toIso8601String(),
            'finished_at'        => optional($this->finished_at)->toIso8601String(),
            'is_finished'        => $this->is_finished,
            'participants_count' => $this->participants_count ?? $this->participants()->count(),
            'average_rating'     => round($average, 1),        // ← seguro siempre float
        ];
    }
}
