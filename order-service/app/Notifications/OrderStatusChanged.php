<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class OrderStatusChanged extends Notification
{
    use Queueable;
    protected $order;
    /**
     * Create a new notification instance.
     */
    public function __construct($order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toBroadcast($notifiable)
    {
        Log::info('Order Status Changed - Inventory:', [$this->order]);
        return [
            'inventory' => $this->order->toArray(),
            'message' => 'Hello ' . $notifiable->name . ', Status for order id' . $this->order->id . ' changed.',
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'inventory_item_id' => $this->order->id,
            'quantity' => $this->order->quantity,
            'message' => 'Status for order id' . $this->order->id . ' changed.',
        ];
    }
}
