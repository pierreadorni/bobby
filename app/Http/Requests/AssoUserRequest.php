<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssoUserRequest extends FormRequest
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
            'association'  =>  'integer'.($this->isMethod('put')?'':'|required'),
            'user'  =>  'integer'.($this->isMethod('put')?'':'|required'),
        ];
    }
}
