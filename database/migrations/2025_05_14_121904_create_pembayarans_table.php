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
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('id_pendaftaran');
            $table->string('kode')->nullable();
            $table->enum('status', ['pending','lunas', 'belum','gagal','expired'])->default('belum');
            $table->string('metode',50)->nullable();
            $table->string('snap_token')->nullable();
            $table->decimal('total_harga', 10, 2);
            $table->text('error')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayarans');
    }
};
