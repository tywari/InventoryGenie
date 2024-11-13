<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\UpdateInventoryLevelRequest;
use App\Events\InventoryUpdated;

class InventoryLevelController extends Controller
{
    /**
     * Update the inventory quantity of the specified item.
     */
    public function updateQuantity(UpdateInventoryLevelRequest $request, $id)
    {
        DB::beginTransaction();

        try {
            $item = Item::with('inventoryLevel')->findOrFail($id);
            if (!$item) {
                return response()->json(['message' => 'Item not found'], 400);
            }
            $inventory = $item->inventoryLevel;

            $quantity = $request->input('quantity');

            $inventory->quantity = $quantity;
            $inventory->save();

            event(new InventoryUpdated($inventory));

            Log::info('InventoryUpdated event dispatched for item ID: ' . $inventory->id);

            DB::commit();

            return response()->json($item, 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update inventory quantity', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update inventory quantity'], 500);
        }
    }
}
