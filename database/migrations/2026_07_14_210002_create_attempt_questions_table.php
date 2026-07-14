<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attempt_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attempt_section_id')->constrained()->cascadeOnDelete();
            $table->foreignId('question_id')->constrained()->cascadeOnDelete();
            $table->foreignId('selected_option_id')->nullable()->constrained('question_options')->nullOnDelete();
            $table->boolean('is_correct')->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();

            $table->unique(['attempt_section_id', 'question_id']);
            $table->index('question_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attempt_questions');
    }
};
