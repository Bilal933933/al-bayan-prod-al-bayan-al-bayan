<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained()->cascadeOnDelete();
            $table->string('type', 20)->default('mcq');
            $table->text('text');
            $table->string('difficulty', 20)->default('medium');
            $table->text('explanation')->nullable();
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();

            $table->index(['topic_id', 'is_active']);
            $table->index('difficulty');
        });

        DB::statement("ALTER TABLE questions ADD CONSTRAINT questions_type_check CHECK (type IN ('mcq', 'true_false'))");
        DB::statement("ALTER TABLE questions ADD CONSTRAINT questions_difficulty_check CHECK (difficulty IN ('easy', 'medium', 'hard'))");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_type_check');
        DB::statement('ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_difficulty_check');

        Schema::dropIfExists('questions');
    }
};
