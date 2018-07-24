<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ItemRequest extends FormRequest
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
            'name' =>  'string'.($this->isMethod('put')?'':'|required'),
            'quantity'  =>  'integer'.($this->isMethod('put')?'':'|required'),
            'place'   => 'string'.($this->isMethod('put')?'':'|required'),
            'status'   =>  ($this->isMethod('put')?'':'|required'),
            'caution'   =>  'integer'.($this->isMethod('put')?'':'|required'),
            'type'   =>  'integer'.($this->isMethod('put')?'':'|required'),
            'association'   =>  'integer'.($this->isMethod('put')?'':'|required'),
        ];
    }

 
}
