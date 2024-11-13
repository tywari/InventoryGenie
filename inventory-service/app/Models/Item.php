<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Item extends Model
{
    protected $fillable = ['name', 'description', 'sku'];

    /**
     * @return HasOne
     */
    public function inventoryLevel(): HasOne
    {
        return $this->hasOne(InventoryLevel::class);
    }
}
