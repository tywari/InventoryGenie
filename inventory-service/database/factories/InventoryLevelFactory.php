<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\InventoryLevel;

class InventoryLevelFactory extends Factory
{
    protected $model = InventoryLevel::class;

    public function definition()
    {
        return [
            'quantity'  => $this->faker->numberBetween(0, 100),
            'threshold' => $this->faker->numberBetween(10, 50),
        ];
    }
}
