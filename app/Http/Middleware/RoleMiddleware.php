<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $roles  Comma separated list of roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $roles)
    {
        if (!Auth::check()) {
            // Not logged in
            return redirect()->route('login');
        }

        $user = Auth::user();
        $rolesArray = explode(',', $roles);

        // Check user role - assuming user has a 'role' attribute or 'is_admin' flag
        // Adjust this logic based on your User model's role implementation
        foreach ($rolesArray as $role) {
            $role = trim($role);
            if ($role === 'admin' && $user->is_admin) {
                return $next($request);
            }
            if (isset($user->role) && $user->role === $role) {
                return $next($request);
            }
        }

        abort(403, 'Unauthorized');
    }
}
