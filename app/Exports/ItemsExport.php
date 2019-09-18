<?php

namespace App\Exports;

use App\Item;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;

class ItemsExport implements FromCollection, WithHeadings, ShouldAutoSize, WithStrictNullComparison
{

    protected $asso_id;

    public function __construct($asso_id)
    {
        $this->asso_id = $asso_id;
    }


    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $data = Item::where('association_id', $this->asso_id)->get();
        foreach ($data as $item) {
            unset($item["id"]);
            unset($item["description"]);

            if ($item->type()->get()->count() > 0) {
                $item["type"] = $item->type()->get()->first()->name;
            } else {
                $item["type"] = "";
            }

            if ($item->place()->get()->count() > 0) {
                $item["place"] = $item->place()->get()->first()->name;
            } else {
                $item["place"] = "";
            }

            unset($item["type_id"]);
            unset($item["place_id"]);
            unset($item["association_id"]);
            unset($item["updated_at"]);
    		unset($item["created_at"]);
    		unset($item["deleted_at"]);
   
        }
        
        return $data;
    }


    // HEADERS
    public function headings(): array {
    	return [
    		'Nom',
    		'Quantité',
    		'Statut',
    		'Caution',
    		'Catégorie',
    		'Localisation',
    	];
    }
}
