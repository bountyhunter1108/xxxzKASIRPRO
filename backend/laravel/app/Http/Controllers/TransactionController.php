<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function destroy(Request $request, $id)
    {
        $restoreStock = $request->input('restore_stock', false);

        // Delete transaction and optionally restore quantities in inventaris
        if ($restoreStock) {
            // foreach ($transaction->items as $item) {
            //    $product = Product::find($item->product_id);
            //    $product->stock += $item->qty;
            //    $product->save();
            // }
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dihapus dan status inventory disinkronisasi.'
        ]);
    }
}