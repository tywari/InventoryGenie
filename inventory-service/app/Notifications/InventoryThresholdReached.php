<?php

namespace App\Notifications;

use App\Models\InventoryLevel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class InventoryThresholdReached extends Notification implements ShouldQueue
{
    use Queueable;

    protected $inventoryItem;

    /**
     * Create a new notification instance.
     */
    public function __construct(InventoryLevel $inventoryItem)
    {
        $this->inventoryItem = $inventoryItem;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable)
    {
        return ['mail', 'broadcast'];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast($notifiable)
    {
        Log::info('InventoryThresholdReached - Inventory:', [$this->inventoryItem]);
        return [
            'inventory' => $this->inventoryItem->toArray(),
            'message' => 'Hello ' . $notifiable->name . ', Inventory level for ' . $this->inventoryItem->item->name . ' is low.',
        ];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable)
    {
        return [
            'inventory_item_id' => $this->inventoryItem->id,
            'item_name' => $this->inventoryItem->item->name,
            'quantity' => $this->inventoryItem->quantity,
            'message' => 'Inventory level for ' . $this->inventoryItem->item->name . ' is low.',
        ];
    }
}
