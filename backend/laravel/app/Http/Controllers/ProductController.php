<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function getLowStockProducts()
    {
        // $products = Product::whereColumn('stock', '<=', 'min_stock')->get();
        return response()->json([
            'success' => true,
            'low_stock_count' => 0,
            'items' => []
        ]);
    }
}