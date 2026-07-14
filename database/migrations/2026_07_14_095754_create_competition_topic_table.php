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
        Schema::create('competition_topic', function (Blueprint $table) {
            $table->id();
            $table->foreignId('competition_id')->constrained()->cascadeOnDelete();
            $table->foreignId('topic_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('questions_count')->default(10);
            $table->unsignedInteger('duration_minutes')->default(15);
            $table->json('difficulty_distribution')->nullable();
            $table->timestamps();

            $table->unique(['competition_id', 'topic_id']); // منع تكرار نفس الربط مرتين
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competition_topic');
    }
};
