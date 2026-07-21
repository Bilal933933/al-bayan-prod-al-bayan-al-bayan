<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attempts', function (Blueprint $table) {
            $table->boolean('with_timer')->default(false)->after('status');
            $table->integer('answered_count')->default(0)->after('total_questions');
            $table->float('score_percentage', 5)->nullable()->after('correct_answers');
        });
    }

    public function down(): void
    {
        Schema::table('attempts', function (Blueprint $table) {
            $table->dropColumn(['with_timer', 'answered_count', 'score_percentage']);
        });
    }
};
