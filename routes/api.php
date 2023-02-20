<?php

use App\Http\Controllers\Api\ComponentController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\LogoutController;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\SimulationController;
use App\Http\Controllers\Api\UpdateController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserSimulationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::post('/register', RegisterController::class)->name('register');
Route::post('/login', LoginController::class)->name('login');

Route::get('/simulations', [SimulationController::class, 'get'])->name('simulations');
Route::get('/simulations/{id}', [SimulationController::class, 'get'])->name('simulations.id');
Route::get('/components', [ComponentController::class, 'get'])->name('components');

// route for user
Route::middleware(['auth:api'])->group(function () {
    Route::post('/update', UpdateController::class)->name('update');
    Route::post('/logout', LogoutController::class)->name('logout');
    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    Route::get('/me/simulations', [UserSimulationController::class, 'get'])->name('simulations');
    Route::get('/me/simulations/{id}', [UserSimulationController::class, 'get'])->name('simulations');
    Route::post('/me/simulations/add', [UserSimulationController::class, 'add'])->name('simulations.add');
    Route::post('/me/simulations/edit/{id}', [UserSimulationController::class, 'edit'])->name('simulations.edit');
    Route::delete('/me/simulations/delete/{id}', [UserSimulationController::class, 'delete'])->name('simulations.delete');
});

// route for administrator
Route::middleware(['auth:api', 'role:administrator'])->group(function () {
    Route::get('/users', [UserController::class, 'get'])->name('users');
    Route::post('/users/add', [UserController::class, 'add'])->name('users.add');
    Route::post('/users/edit/{id}', [UserController::class, 'edit'])->name('users.edit');
    Route::delete('/users/delete/{id}', [UserController::class, 'delete'])->name('users.delete');
});

// route for operator
Route::middleware(['auth:api', 'role:administrator|operator'])->group(function () {
    Route::post('/simulations/add', [SimulationController::class, 'add'])->name('simulations.add');
    Route::post('/simulations/edit/{id}', [SimulationController::class, 'edit'])->name('simulations.edit');
    Route::delete('/simulations/delete/{id}', [SimulationController::class, 'delete'])->name('simulations.delete');

    Route::post('/components/add', [ComponentController::class, 'add'])->name('components.add');
    Route::post('/components/edit/{id}', [ComponentController::class, 'edit'])->name('components.edit');
    Route::delete('/components/delete/{id}', [ComponentController::class, 'delete'])->name('components.delete');
});
