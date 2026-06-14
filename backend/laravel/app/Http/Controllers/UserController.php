<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support5\Facades\Hash;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Simulated Database lookup
        // $user = User::where('email', $request->email)->first();
        // if ($user && Hash::check($request->password, $user->password_hash)) { ... }

        return response()->json([
            'success' => true,
            'user' => [
                'id' => 'u1',
                'name' => 'Pemilik (Owner)',
                'email' => $request->email,
                'role' => 'owner'
            ]
        ]);
    }
}