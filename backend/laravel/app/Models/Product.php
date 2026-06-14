<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'sku',
        'name',
        'category',
        'cost',
        'price',
        'stock',
        'min_stock',
        'wholesale_price',
        'wholesale_min_qty',
        'tax_included',
        'open_price',
        'active',
        'image_url',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'price' => 'decimal:2',
        'stock' => 'decimal:3',
        'min_stock' => 'decimal:3',
        'wholesale_price' => 'decimal:2',
        'wholesale_min_qty' => 'integer',
        'tax_included' => 'boolean',
        'open_price' => 'boolean',
        'active' => 'boolean',
    ];

    /**
     * Scope to only include low stock products.
     */
    public function scopeLowStock($query)
    {
        return $query->whereColumn('stock', '<=', 'min_stock')->where('active', true);
    }
}
