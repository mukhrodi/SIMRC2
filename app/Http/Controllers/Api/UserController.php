<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function get($id = \null)
    {
        if ($id != \null) {
            $user = User::find($id);
            return response()->json([
                'success' => true,
                'user'    => $user,
            ], 200);
        }

        $users = User::all();
        return response()->json([
            'success'   => true,
            'users'     => $users,
        ], 200);
    }

    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'email'     => 'required|email|unique:users',
            'password'  => 'required|min:8',
            'role'      => 'required|in:ADMINISTRATOR,OPERATOR,USER',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => bcrypt($request->password),
            'role'      => strtoupper($request->role),
        ]);

        if ($user) {
            return response()->json([
                'success' => true,
                'user'    => $user,
            ], 201);
        }

        return response()->json([
            'success' => false,
        ], 409);
    }

    public function edit(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'email'     => 'required|email|unique:users,email,' . $id,
            'password'  => 'nullable|min:8',
            'role'      => 'required|in:ADMINISTRATOR,OPERATOR,USER',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::find($id);
        $user->name     = $request->name;
        $user->email    = $request->email;
        if ($request->password != null) {
            $user->password = bcrypt($request->password);
        }
        $user->role     = strtoupper($request->role);
        $user->save();

        if ($user) {
            return response()->json([
                'success' => true,
                'user'    => $user,
            ], 200);
        }

        return response()->json([
            'success' => false,
        ], 409);
    }

    public function delete($id)
    {
        $user = User::find($id);

        if ($user) {
            $user->delete();

            return response()->json([
                'success' => true,
                'user'    => $user,
            ], 200);
        }

        return response()->json([
            'success' => false,
        ], 409);
    }
}
