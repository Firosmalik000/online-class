<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengguna', function (Blueprint $table) {
            $table->id('id_pengguna');
            $table->string('name',100);
            $table->string('email',100)->unique();
            $table->string('password',255);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->string('telepon',15)->nullable();
            $table->text('alamat')->nullable();
            $table->enum('role', ['admin', 'pegawai','peserta'])->default('admin');
            $table->text('foto')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pegawais');
    }
};
