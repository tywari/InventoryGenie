<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'user_id'               => 'required|integer|min:1',
            'items'                 => 'required|array|min:1',
            'items.*.item_id'       => 'required|integer|distinct',
            'items.*.quantity'      => 'required|integer|min:1',
        ];
    }
}
