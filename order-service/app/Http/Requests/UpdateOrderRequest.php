<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    public function authorize()
    {
        // Implement authorization logic if needed
        return true;
    }

    public function rules()
    {
        return [
            'user_id'               => 'required|integer|min:1',
            'status'                => 'required|string|in:pending,processing,completed,cancelled',
        ];
    }
}
