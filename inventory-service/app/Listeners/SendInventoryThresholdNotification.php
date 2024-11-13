<?php

namespace App\Listeners;

use App\Events\InventoryUpdated;
use App\Models\ItemStakeholders;
use App\Models\User;
use App\Notifications\InventoryThresholdReached;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendInventoryThresholdNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(InventoryUpdated $event)
    {
        $inventoryItem = $event->inventoryItem;

        if ($inventoryItem->quantity <= $inventoryItem->threshold) {
            $itemStakeholders = ItemStakeholders::where('item_id',$inventoryItem->item_id)->pluck('user_id')->toArray();
            $stakeholders = User::whereIn('id', $itemStakeholders)->get();

            foreach ($stakeholders as $stakeholder) {
                $stakeholder->notify(new InventoryThresholdReached($inventoryItem));
            }
        }
    }
}
