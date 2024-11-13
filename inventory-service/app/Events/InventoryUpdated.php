<?php

namespace App\Events;

use App\Models\InventoryLevel;
use App\Models\User;
use App\Notifications\InventoryThresholdReached;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class InventoryUpdated implements ShouldBroadcast
{
    use SerializesModels;

    public $inventoryItem;

    public function __construct(InventoryLevel $inventoryItem)
    {
        $this->inventoryItem = $inventoryItem;
    }

    public function broadcastOn()
    {
        return new Channel('inventory-updates');
    }

    public function broadcastAs()
    {
        return 'inventory.updated';
    }

    public function broadcastWith()
    {
        return [
            'inventory' => $this->inventoryItem->toArray(),
        ];
    }

    public function handle()
    {
        if ($this->inventoryItem->quantity <= $this->inventoryItem->threshold) {
            $stakeholders = User::whereIn('id', [1,2])->get();

            foreach ($stakeholders as $stakeholder) {
                $stakeholder->notify(new InventoryThresholdReached($this->inventoryItem));
            }
        }
    }
}
