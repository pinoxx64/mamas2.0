<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Rol;
use App\Models\UserRol;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserTest extends TestCase
{
    /** @test */
    protected function actingAsAdmin()
    {
        $admin = User::factory()->create([
            'active' => 1,
        ]);
        $rolAdmin = (new Rol)->setTable('rol')->firstOrCreate(['nombre' => 'admin']);
        UserRol::create([
            'usuarioId' => $admin->id,
            'rolId' => $rolAdmin->id,
        ]);
        Sanctum::actingAs($admin, ['*']);
        return $admin;
    }

    /** @test */
    public function puede_obtener_todos_los_usuarios()
    {
        $this->actingAsAdmin();
        User::factory()->count(3)->create();
        $response = $this->getJson('/api/user');
        $response->assertStatus(200)
            ->assertJsonStructure(['user']);
    }

    /** @test */
    public function puede_obtener_usuario_por_id()
    {
        $this->actingAsAdmin();
        $user = User::factory()->create();
        $response = $this->getJson("/api/user/{$user->id}");
        $response->assertStatus(200)
            ->assertJson(['user' => ['id' => $user->id]]);
    }

    /** @test */
    public function devuelve_404_si_usuario_no_existe()
    {
        $this->actingAsAdmin();
        $response = $this->getJson('/api/user/999');
        $response->assertStatus(404);
    }

    /** @test */
    public function puede_actualizar_usuario()
    {
        $this->actingAsAdmin();
        $user = User::factory()->create();
        $response = $this->putJson("/api/user/{$user->id}", [
            'name' => 'Nuevo Nombre',
            'email' => 'nuevo@email.com',
            'active' => 1,
            'foto' => null,
        ]);
        $response->assertStatus(201)
            ->assertJson(['user' => ['name' => 'Nuevo Nombre']]);
    }

    /** @test */
    public function puede_actualizar_password()
    {
        $this->actingAsAdmin();
        $user = User::factory()->create(['password' => bcrypt('oldpass')]);
        $response = $this->putJson("/api/user/password/{$user->id}", [
            'password' => 'newpass'
        ]);
        $response->assertStatus(201);
    }
}
