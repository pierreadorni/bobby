<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookingLineRequest extends FormRequest
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
            'booking'  =>  'integer|between:3,191'.($this->isMethod('put')?'':'|required'),
            'item'  =>  'integer|integer|unsigned',
            'quantity'  =>  'integer|between:3,191'.($this->isMethod('put')?'':'|required'),
            'date'  =>  'timestamp'.($this->isMethod('put')?'':'|required'),
            'status'    =>  'string|between:3,191'.($this->isMethod('put')?'':'|required'),
        ];
    }
}
