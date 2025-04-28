<?php

namespace App\Policies;

use App\Models\Pet;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PetPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any pets.
     */
    public function viewAny(User $user): bool
    {
        // Cualquier usuario autenticado ve su lista
        return true;
    }

    /**
     * Determine whether the user can view the pet.
     */
    public function view(User $user, Pet $pet): bool
    {
        return $user->id === $pet->user_id;
    }

    /**
     * Determine whether the user can create pets.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the pet.
     */
    public function update(User $user, Pet $pet): bool
    {
        return $user->id === $pet->user_id;
    }

    /**
     * Determine whether the user can delete the pet.
     */
    public function delete(User $user, Pet $pet): bool
    {
        return $user->id === $pet->user_id;
    }

    // Puedes añadir restore/forceDelete si lo necesitas
}
