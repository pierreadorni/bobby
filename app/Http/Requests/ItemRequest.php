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
            'name'              =>  'string|between:2,191|required|unique:items,name,'.\Request::instance()->id.',id,deleted_at,NULL,association_id,'.\Request::instance()->association_id,
            'quantity'          =>  'integer|min:0|required',
            'place_id'          =>  'exists:itemPlaces,id|integer|min:0|required',
            'status'            =>  'integer|min:1|max:3|required',
            'caution'           =>  'min:0|required',
            'type_id'           =>  'exists:itemTypes,id|integer|min:0|required',
            'association_id'    =>  'string|required',
        ];
    }

 
}
