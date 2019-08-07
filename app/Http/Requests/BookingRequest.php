<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'owner'             =>  'string|required',
            'booker'            =>  'string|required',
            'user'              =>  'string|required|exists:users,id',
            'status'            =>  'integer|min:1|max:1|required',
            'cautionReceived'   =>  'boolean|required',
        ];
    }
}
