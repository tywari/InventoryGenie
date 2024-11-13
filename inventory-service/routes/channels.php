<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('inventory-updates', function ($user) {
    return true;
});

Broadcast::channel('test-channel', function ($user) {
    return true;
});
