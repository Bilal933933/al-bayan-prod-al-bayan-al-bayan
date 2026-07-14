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
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('visibility', 20)->default('general'); // general | private
            $table->text('description')->nullable();
            $table->unsignedInteger('default_questions_count')->default(10);
            $table->unsignedInteger('default_duration_minutes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();

            $table->index(['visibility', 'is_active']);
        });

        // CHECK constraint (نفس نمط classification في competitions)
        DB::statement("
            ALTER TABLE topics
            ADD CONSTRAINT topics_visibility_check
            CHECK (visibility IN ('general', 'private'))
        ");

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('topics');
    }
};
