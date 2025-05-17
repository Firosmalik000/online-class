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
        Schema::create('kelas', function (Blueprint $table) {
            $table->bigInteger('id_kelas',true)->unique();
            $table->foreignId('id_pengajar')->constrained('pengajars');
            $table->string('nama_kelas',100);
            $table->text('deskripsi');
            $table->dateTime('jadwal');
            $table->decimal('harga', 10, 2);
            $table->enum('level', ['dasar','menengah','lanjutan'])->default('dasar');
            $table->text('link_zoom');
            $table->string('kategori',50);
            $table->string('banner',255);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
