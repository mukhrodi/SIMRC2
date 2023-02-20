<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Authorize
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, $role)
    {
        if (auth()->user() == \null) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authenticated.',
            ], 401);
        }
        $role = explode('|', $role);
        if (!in_array(strtolower(auth()->user()->role), $role)) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized. ' . implode(', ', $role),
            ], 401);
        }
        return $next($request);
    }
}
