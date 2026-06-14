<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'transactions';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'cashier',
        'total',
        'cost',
        'method',
        'member_name',
        'deleted',
        'date',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'cost' => 'decimal:2',
        'deleted' => 'boolean',
        'date' => 'datetime',
    ];

    /**
     * Scope to only include active (non-voided) transactions.
     */
    public function scopeActive($query)
    {
        return $query->where('deleted', false);
    }
}
