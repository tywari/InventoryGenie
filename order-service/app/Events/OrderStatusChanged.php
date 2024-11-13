<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class OrderStatusChanged implements ShouldBroadcastNow
{
    use SerializesModels;

    public $order;

    public function __construct($order)
    {
        $this->order = $order;
    }

    public function broadcastOn()
    {
        return new Channel('order-updates');
    }

    public function broadcastAs()
    {
        return 'order.status_changed';
    }

    public function broadcastWith()
    {
        return [
            'order' => $this->order,
        ];
    }
}
