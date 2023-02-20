<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Simulation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'code',
        'description',
        'image_path',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function components()
    {
        return $this->belongsToMany(Component::class);
    }

    public function addComponent(Component $component)
    {
        $this->components()->attach($component);
    }

    public function removeComponent(Component $component)
    {
        $this->components()->detach($component);
    }

    public function getComponents()
    {
        return $this->components()->get();
    }

    public function getComponentsCount()
    {
        return $this->components()->count();
    }

    public function getComponentsPrice()
    {
        return $this->components()->sum('price');
    }

    public function getComponentsPriceFormatted()
    {
        return number_format($this->getComponentsPrice(), 2, ',', '.');
    }

    public function getComponentsPriceFormattedWithCurrency()
    {
        return 'Rp' . $this->getComponentsPriceFormatted();
    }
}
