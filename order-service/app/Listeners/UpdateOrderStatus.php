<?php

namespace App\Listeners;

use App\Events\OrderStatusChanged;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateOrderStatus implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(OrderStatusChanged $event)
    {
        $inventoryItem = $event->order;
        $user = User::where('id', $inventoryItem->user_id)->first();
        $user->notify(new OrderStatusChanged($inventoryItem));
    }
}
