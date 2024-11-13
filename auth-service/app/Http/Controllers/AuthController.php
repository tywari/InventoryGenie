<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Services\ResponseService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = JWTAuth::fromUser($user);

            Log::info("User registered successfully", ['user_id' => $user->id]);

            return response()->json([
                'access_token' => $token,
                'token_type'   => 'Bearer',
                'user'         => $user,
            ], 201);

        } catch (\Exception $e) {
            Log::error("Registration failed", ['error' => $e->getMessage()]);
            return ResponseService::error('Registration failed');
        }
    }

//    public function login(LoginRequest $request)
//    {
//        try {
//            if (!Auth::attempt($request->only('email', 'password'))) {
//                Log::warning("Invalid login attempt", ['email' => $request->email]);
//                return ResponseService::error('Invalid login details', 401);
//            }
//
//            $user = User::where('email', $request->email)->firstOrFail();
//            $token = $user->createToken('auth_token')->plainTextToken;
//
//            Log::info("User logged in successfully", ['user_id' => $user->id]);
//
//            return ResponseService::success(['user' => $user, 'access_token' => $token, 'token_type' => 'Bearer'], 'User logged in successfully');
//        } catch (\Exception $e) {
//            Log::error("Login failed", ['error' => $e->getMessage()]);
//            return ResponseService::error('Login failed');
//        }
//    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            Log::info("User logged out successfully");
            return ResponseService::success(null, 'Successfully logged out');
        } catch (\Exception $e) {
            Log::error("Logout failed", ['error' => $e->getMessage()]);
            return ResponseService::error('Logout failed');
        }
    }

    // Get Authenticated User
    public function user()
    {
        return response()->json(Auth::user());
    }
}
