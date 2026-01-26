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
        Schema::table('materi', function (Blueprint $table) {
            // Drop the json column
            $table->dropColumn('materi');
            
            // Add new columns
            $table->string('judul');
            $table->string('filename');
            $table->string('filepath');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('materi', function (Blueprint $table) {
            // Remove new columns
            $table->dropColumn(['judul', 'filename', 'filepath']);
            
            // Restore json column
            $table->json('materi');
        });
    }
};
