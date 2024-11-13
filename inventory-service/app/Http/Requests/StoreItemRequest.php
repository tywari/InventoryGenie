<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreItemRequest extends FormRequest
{
    public function authorize()
    {
        // Implement authorization logic if needed
        return true;
    }

    public function rules()
    {
        return [
            'name'        => 'required|string|max:255',
            'sku'         => 'required|string|unique:items,sku',
            'description' => 'nullable|string',
            'quantity'    => 'nullable|integer|min:0',
            'threshold'   => 'nullable|integer|min:0',
        ];
    }
}
