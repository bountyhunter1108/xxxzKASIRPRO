<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * Get aggregate statistics for the business owner dashboard.
     */
    public function getDashboardStats()
    {
        $today = now()->toDateString();

        // 1. Calculate today's sales (omset kotor)
        $todaySales = Transaction::active()
            ->whereDate('date', $today)
            ->sum('total');

        // 2. Calculate today's profit (total - HPP modal)
        $todayProfit = Transaction::active()
            ->whereDate('date', $today)
            ->selectRaw('SUM(total - cost) as profit')
            ->first()
            ->profit ?? 0.00;

        // 3. Count total active transactions today
        $todayTransactionsCount = Transaction::active()
            ->whereDate('date', $today)
            ->count();

        // 4. Calculate profit margin percentage
        $marginPercentage = 0;
        if ($todaySales > 0) {
            $marginPercentage = ($todayProfit / $todaySales) * 100;
        }

        return response()->json([
            'success' => true,
            'date' => $today,
            'stats' => [
                'revenue' => (float) $todaySales,
                'profit' => (float) $todayProfit,
                'transactions_count' => $todayTransactionsCount,
                'profit_margin_percent' => round($marginPercentage, 2),
            ],
            'recent_transactions' => Transaction::active()
                ->orderBy('date', 'desc')
                ->take(5)
                ->get(),
        ]);
    }
}
