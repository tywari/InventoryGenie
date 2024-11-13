<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ItemsTableSeeder extends Seeder
{
    public function run()
    {
        // Sample items data
        $items = [
            [
                'name'        => 'Widget A',
                'sku'         => 'WIDGETA001',
                'description' => 'A high-quality widget A',
            ],
            [
                'name'        => 'Widget B',
                'sku'         => 'WIDGETB002',
                'description' => 'A durable widget B',
            ],
            [
                'name'        => 'Widget C',
                'sku'         => 'WIDGETC003',
                'description' => 'A durable widget C',
            ],
            [
                'name'        => 'Widget D',
                'sku'         => 'WIDGETD004',
                'description' => 'A durable widget D',
            ],
            [
                'name'        => 'Widget E',
                'sku'         => 'WIDGETE005',
                'description' => 'A durable widget E',
            ],
        ];

        foreach ($items as $item) {
            $itemId = DB::table('items')->insertGetId([
                'name'        => $item['name'],
                'sku'         => $item['sku'],
                'description' => $item['description'],
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);

            // Insert corresponding inventory level
            DB::table('inventory_levels')->insert([
                'item_id'    => $itemId,
                'quantity'   => random_int(0, 100),
                'threshold'  => random_int(10, 50),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Seed item_stakeholders for each item with one-to-many relationships
            $stakeholdersCount = random_int(1, 3); // Each item can have 1-3 stakeholders
            for ($j = 1; $j <= $stakeholdersCount; $j++) {
                DB::table('item_stakeholders')->insert([
                    'item_id'    => $itemId,
                    'user_id'    => random_int(1, 20), // assuming user IDs from 1 to 20
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Insert additional random items
        for ($i = 1; $i <= 10; $i++) {
            $itemId = DB::table('items')->insertGetId([
                'name'        => 'Product ' . $i,
                'sku'         => 'SKU' . Str::upper(Str::random(5)) . $i,
                'description' => 'Description for product ' . $i,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);

            // Insert corresponding inventory level
            DB::table('inventory_levels')->insert([
                'item_id'    => $itemId,
                'quantity'   => random_int(0, 100),
                'threshold'  => random_int(10, 50),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Seed item_stakeholders for each additional item
            $stakeholdersCount = random_int(1, 3);
            for ($j = 1; $j <= $stakeholdersCount; $j++) {
                DB::table('item_stakeholders')->insert([
                    'item_id'    => $itemId,
                    'user_id'    => random_int(1, 10),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
