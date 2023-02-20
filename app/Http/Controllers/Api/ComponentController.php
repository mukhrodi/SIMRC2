<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Component;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use MongoDB\BSON\Regex;

class ComponentController extends Controller
{
    public function get($id = null)
    {
        if ($id) {
            $component = Component::find($id);
            if ($component) {
                return response()->json([
                    'success' => true,
                    'component' => $component
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Component not found'
                ], 404);
            }
        } else {
            $components = Component::all();
            return response()->json([
                'success' => true,
                'components' => $components
            ], 200);
        }
    }

    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'description' => 'required',
            'price' => 'required|numeric',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        $image = $request->file('image');
        $image_name = time() . '.' . $image->getClientOriginalExtension();
        $destinationPath = \storage_path('/app/public/components');
        $image->move($destinationPath, $image_name);
        $image_path = '/components/' . $image_name;

        $component = Component::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'image_path' => $image_path
        ]);

        if ($component) {
            return response()->json([
                'success' => true,
                'component' => $component
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Component could not be added'
            ], 500);
        }
    }

    public function edit(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'description' => 'required',
            'price' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        $component = Component::find($id);

        if ($request->file('image')) {
            $image = $request->file('image');
            $image_name = time() . '.' . $image->getClientOriginalExtension();
            $destinationPath = \storage_path('/app/public/components');
            $image->move($destinationPath, $image_name);
            $image_path = '/components/' . $image_name;
            $component->image_path = $image_path;
        }

        $component->name = $request->name;
        $component->description = $request->description;
        $component->price = $request->price;
        $component->save();

        if ($component) {
            return response()->json([
                'success' => true,
                'component' => $component
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Component could not be updated'
            ], 500);
        }
    }

    public function delete($id)
    {
        $component = Component::find($id);

        if ($component) {
            $component->delete();
            return response()->json([
                'success' => true,
                'message' => 'Component deleted'
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Component not found'
            ], 404);
        }
    }
}
