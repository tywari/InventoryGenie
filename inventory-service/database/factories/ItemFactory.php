<?php

namespace Database\Factories;

use App\Models\InventoryLevel;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Item;

class ItemFactory extends Factory
{
    // The name of the factory's corresponding model.
    protected $model = Item::class;

    // Define the model's default state.
    public function definition()
    {
        return [
            'name'        => $this->faker->word(),
            'sku'         => $this->faker->unique()->regexify('[A-Z0-9]{8}'),
            'description' => $this->faker->sentence(),
        ];
    }

    public function withInventoryLevel()
    {
        return $this->has(
            InventoryLevel::factory(),
            'inventoryLevel'
        );
    }
}
