<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInventoryLevelRequest extends FormRequest
{
    public function authorize()
    {
        // Implement authorization logic if needed
        return true;
    }

    public function rules()
    {
        return [
            'quantity'    => 'nullable|integer|min:1',
        ];
    }
}
