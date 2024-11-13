<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;

class ItemController extends Controller
{
    /**
     * Display a paginated list of items with their inventory levels.
     */
    public function index(Request $request)
    {
        try {
            $page = $request->input('page', 1);
            $limit = $request->input('limit', 10);

            $items = Item::with('inventoryLevel')
                ->paginate($limit, ['*'], 'page', $page);

            return response()->json($items, 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch items', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch items'], 500);
        }
    }


    /**
     * Store a newly created item in storage.
     */
    public function store(StoreItemRequest $request)
    {
        DB::beginTransaction();

        try {
            $itemData = $request->validated();

            $item = Item::create($itemData);

            // Initialize inventory level
            $item->inventoryLevel()->create([
                'quantity'  => $request->input('quantity', 0),
                'threshold' => $request->input('threshold', 10),
            ]);

            DB::commit();

            return response()->json($item->load('inventoryLevel'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create item', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to create item'], 500);
        }
    }

    /**
     * Display the specified item with its inventory level.
     */
    public function show($id)
    {
        try {
            $item = Item::with('inventoryLevel')->findOrFail($id);
            return response()->json($item, 200);
        } catch (\Exception $e) {
            Log::error('Item not found', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Item not found'], 404);
        }
    }

    /**
     * Update the specified item in storage.
     */
    public function update(UpdateItemRequest $request, $id)
    {
        DB::beginTransaction();

        try {
            $item = Item::findOrFail($id);

            $itemData = $request->validated();
            $item->update($itemData);

            // Update inventory level if provided
            if ($request->has('quantity') || $request->has('threshold')) {
                $inventoryData = $request->only(['quantity', 'threshold']);
                $item->inventoryLevel()->update($inventoryData);
            }

            DB::commit();

            return response()->json($item->load('inventoryLevel'), 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update item', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update item'], 500);
        }
    }

    /**
     * Remove the specified item from storage.
     */
    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $item = Item::findOrFail($id);

            // Delete inventory level first due to foreign key constraints
            $item->inventoryLevel()->delete();
            $item->delete();

            DB::commit();

            return response()->json(['message' => 'Item deleted successfully'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete item', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to delete item'], 500);
        }
    }
}
