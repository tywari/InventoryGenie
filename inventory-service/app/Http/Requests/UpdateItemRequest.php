<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateItemRequest extends FormRequest
{
    public function authorize()
    {
        // Implement authorization logic if needed
        return true;
    }

    public function rules()
    {
        return [
            'name'        => 'sometimes|required|string|max:255',
            'sku'         => 'sometimes|required|string|unique:items,sku,' . $this->route('id'),
            'description' => 'nullable|string',
            'quantity'    => 'nullable|integer|min:0',
            'threshold'   => 'nullable|integer|min:0',
        ];
    }
}
