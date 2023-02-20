<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Simulation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserSimulationController extends Controller
{
    public function get($id = null)
    {
        if ($id) {
            $simulation = Simulation::find($id);
            if ($simulation) {
                $simulation->components = $simulation->components()->get();
                $simulation->price = $simulation->getComponentsPrice();
                return response()->json([
                    'success' => true,
                    'simulation' => $simulation
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'User simulation not found'
                ]);
            }
        } else {
            $user = User::find(\auth()->user()->id);
            $simulations = $user->simulations()->get();
            foreach ($simulations as $simulation) {
                $simulation->price = $simulation->getComponentsPrice();
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
            'simulation_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        $simulationBlueprint = Simulation::find($request->simulation_id);

        if (!$simulationBlueprint) {
            return response()->json([
                'success' => false,
                'message' => 'User simulation blueprint not found'
            ]);
        }
        $simulation = $simulationBlueprint->replicate();
        $simulation->user_id = \auth()->user()->id;
        $simulation->created_at = now();
        $simulation->updated_at = now();
        $simulation->save();

        $simulation->components()->sync($simulationBlueprint->components->pluck('id')->toArray());

        if ($simulation) {
            return response()->json([
                'success' => true,
                'message' => 'User simulation created successfully',
                'simulation' => $simulation
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User simulation could not be created'
            ]);
        }
    }

    public function edit(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'components' => 'required|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        $simulation = Simulation::where('id', $id)->where('user_id', \auth()->user()->id)->first();
        if (!$simulation) {
            return response()->json([
                'success' => false,
                'message' => 'User simulation not found'
            ]);
        }
        $simulation->components()->sync($request->components);
        $simulation->components = $simulation->components()->get();
        $simulation->price = $simulation->getComponentsPrice();

        if ($simulation) {
            return response()->json([
                'success' => true,
                'message' => 'User simulation updated successfully',
                'simulation' => $simulation
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User simulation could not be updated'
            ]);
        }
    }

    public function delete($id)
    {
        $simulation = Simulation::where('id', $id)->where('user_id', \auth()->user()->id)->first();
        if ($simulation) {
            $simulation->components()->detach();
            $simulation->delete();
            return response()->json([
                'success' => true,
                'message' => 'User simulation deleted successfully'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User simulation not found'
            ]);
        }
    }
}