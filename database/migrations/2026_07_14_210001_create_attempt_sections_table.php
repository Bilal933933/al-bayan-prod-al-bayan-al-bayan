<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attempt_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attempt_id')->constrained()->cascadeOnDelete();
            $table->foreignId('topic_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('questions_count');
            $table->unsignedInteger('duration_minutes')->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();

            $table->index('attempt_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attempt_sections');
    }
};
