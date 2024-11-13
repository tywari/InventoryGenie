<?php

namespace App\Http\Controllers;

use App\Events\OrderStatusChanged;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;

class OrderController extends Controller
{
    /**
     * Display a paginated list of orders.
     */
    public function index(Request $request)
    {
        try {
            $page = $request->input('page', 1);
            $limit = $request->input('limit', 15);

            $orders = Order::with('items')
                ->paginate($limit, ['*'], 'page', $page);

            return response()->json($orders, 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch orders', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch orders'], 500);
        }
    }

    /**
     * Store a newly created order in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        DB::beginTransaction();

        try {
            $userId = $request->user_id;

            // Create the order
            $order = Order::create([
                'user_id'     => $userId,
                'status'      => 'pending',
                'total_price' => 0,
            ]);

            $totalPrice = 0;
            $inventoryApiUrl = env('INVENTORY_API_URL');

            foreach ($request->items as $orderItemData) {
                $response = Http::withToken($request->bearerToken())
                    ->get("{$inventoryApiUrl}/items/{$orderItemData['item_id']}");

                if ($response->failed()) {
                    DB::rollBack();
                    return response()->json(['error' => 'Item not found or Inventory Service unavailable'], 404);
                }

                $itemData = $response->json();

                $price = $itemData['price'] ?? 0;
                $availableQuantity = $itemData['inventory_level']['quantity'] ?? 0;
                $quantity = $orderItemData['quantity'];

                if ($quantity > $availableQuantity) {
                    DB::rollBack();
                    return response()->json(['error' => "Insufficient inventory for item ID {$orderItemData['item_id']}"], 400);
                }

                $subtotal = $price * $quantity;
                $totalPrice += $subtotal;

                // Create OrderItem
                OrderItem::create([
                    'order_id' => $order->id,
                    'item_id'  => $orderItemData['item_id'],
                    'quantity' => $quantity,
                    'price'    => $price,
                ]);

                // Update inventory via Inventory Service
                $updateResponse = Http::withToken($request->bearerToken())
                    ->post("{$inventoryApiUrl}/items/{$orderItemData['item_id']}/update-quantity", [
                        'quantity' => $availableQuantity - $quantity,
                    ]);

                if ($updateResponse->failed()) {
                    DB::rollBack();
                    Log::info('api_response', ['response' => $updateResponse->json()]);
                    return response()->json(['error' => "Failed to update inventory for item ID {$orderItemData['item_id']}"], 500);
                }
            }

            // Update total price of the order
            $order->update(['total_price' => $totalPrice]);

            // Commit the transaction
            DB::commit();

            return response()->json($order->load('items'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed', ['error' => $e]);
            return response()->json(['error' => 'Order creation failed'], 500);
        }
    }

    /**
     * Display the specified order.
     */
    public function show($id)
    {
        try {
            $order = Order::with('items')->findOrFail($id);
            return response()->json($order, 200);
        } catch (\Exception $e) {
            Log::error('Order not found', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Order not found'], 404);
        }
    }

    /**
     * Update the specified order in storage.
     */
    public function update(UpdateOrderRequest $request, $id)
    {
        DB::beginTransaction();

        try {
            $order = Order::findOrFail($id);

            // Allow updates only if the order is still in 'pending' status
            if (!in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_PROCESSING])) {
                return response()->json(['error' => 'Only pending orders can be updated'], 400);
            }

            // Update only the status of the order based on the request input
            $newStatus = $request->input('status');

            // Define allowed statuses that can be updated (e.g., 'completed', 'canceled')
            $allowedStatuses = [Order::STATUS_COMPLETED, Order::STATUS_CANCELLED, Order::STATUS_PROCESSING];

            // Ensure the provided status is valid
            if (!in_array($newStatus, $allowedStatuses)) {
                return response()->json(['error' => 'Invalid status update'], 400);
            }

            // Update the order's status
            $order->update(['status' => $newStatus]);

            // Trigger any related events (e.g., notifications for status changes)
            event(new OrderStatusChanged($order));

            DB::commit();

            // Return the updated order information
            return response()->json($order, 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order status update failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Order status update failed'], 500);
        }
    }

    /**
     * Remove the specified order from storage.
     */
    public function destroy(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $order = Order::with('items')->findOrFail($id);

            if (!$order) {
                return response()->json(['error' => 'Invalid Order id'], 400);
            }

            if ($order->status !== Order::STATUS_PENDING) {
                return response()->json(['error' => 'Only created orders can be deleted'], 400);
            }

            $inventoryApiUrl = config('services.inventory.api_url');

            // Restore inventory quantities
            foreach ($order->items as $orderItem) {
                $itemId = $orderItem->item_id;
                $quantity = $orderItem->quantity;

                // Fetch current item data
                $response = Http::withToken($request->bearerToken())
                    ->get("{$inventoryApiUrl}/items/{$itemId}");

                if ($response->failed()) {
                    DB::rollBack();
                    return response()->json(['error' => 'Failed to fetch item data'], 500);
                }

                $itemData = $response->json();
                $currentQuantity = $itemData['inventory_level']['quantity'] ?? 0;

                // Restore inventory
                $updateResponse = Http::withToken($request->bearerToken())
                    ->put("{$inventoryApiUrl}/items/{$itemId}/update-quantity", [
                        'quantity' => $currentQuantity + $quantity,
                    ]);

                if ($updateResponse->failed()) {
                    DB::rollBack();
                    return response()->json(['error' => 'Failed to restore inventory'], 500);
                }
            }

            // Delete the order and its items
            $order->items()->delete();
            $order->delete();

            DB::commit();

            return response()->json(['message' => 'Order deleted successfully'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order deletion failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Order deletion failed'], 500);
        }
    }
}
