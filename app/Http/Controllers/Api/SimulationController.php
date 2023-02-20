<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Component;
use App\Models\Simulation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class SimulationController extends Controller
{
    public function get($id = null)
    {
        if ($id) {
            $simulation = Simulation::find($id);
            $simulation->price = $simulation->getComponentsPrice();
            $simulation->components = $simulation->components()->get();
            if ($simulation) {
                return response()->json([
                    'success' => true,
                    'simulation' => $simulation
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Simulation not found'
                ]);
            }
        } else {
            $simulations = Simulation::where('user_id', null)->get();
            foreach ($simulations as $simulation) {
                $simulation->components = $simulation->components()->get();
            }
            return response()->json([
                'success' => true,
                'simulations' => $simulations
            ]);
        }
    }

    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'code' => 'required',
            'description' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'components' => 'required|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        $image = $request->file('image');
        $image_name = time() . '.' . $image->getClientOriginalExtension();
        $destinationPath = \storage_path('/app/public/simulations');
        $image->move($destinationPath, $image_name);
        $image_path = '/simulations/' . $image_name;

        $simulation = Simulation::create([
            'name' => $request->name,
            'code' => $request->code,
            'description' => $request->description,
            'image_path' => $image_path
        ]);
        $simulation->components()->sync($request->components);
        $simulation->components = $simulation->components()->get();

        if ($simulation) {
            return response()->json([
                'success' => true,
                'simulation' => $simulation
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Simulation could not be added'
            ], 409);
        }
    }

    public function edit(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'code' => 'required',
            'description' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'components' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        $simulation = Simulation::find($id);

        if ($request->file('image')) {
            $image = $request->file('image');
            $image_name = time() . '.' . $image->getClientOriginalExtension();
            $destinationPath = \storage_path('/app/public/simulations');
            $image->move($destinationPath, $image_name);
            $image_path = '/simulations/' . $image_name;
            $simulation->image_path = $image_path;
        }

        $simulation->name = $request->name;
        $simulation->code = $request->code;
        $simulation->description = $request->description;
        $simulation->save();
        $simulation->components()->sync($request->components);
        $simulation->components = $simulation->components()->get();

        if ($simulation) {
            return response()->json([
                'success' => true,
                'simulation' => $simulation
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Simulation could not be edited'
            ], 409);
        }
    }

    public function delete($id)
    {
        $simulation = Simulation::find($id);

        if ($simulation) {
            $simulation->components()->detach();
            $simulation->delete();
            return response()->json([
                'success' => true,
                'message' => 'Simulation deleted'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Simulation not found'
            ]);
        }
    }
}
