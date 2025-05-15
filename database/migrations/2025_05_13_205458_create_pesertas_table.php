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
        Schema::create('pesertas', function (Blueprint $table) {
            $table->bigInteger('id_peserta',true)->unique();
            $table->string('nama',100);
            $table->string('email',100);
            $table->string('password',255);
            $table->string('telepon',15);
            $table->text('alamat');
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->text('foto');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesertas');
    }
};
