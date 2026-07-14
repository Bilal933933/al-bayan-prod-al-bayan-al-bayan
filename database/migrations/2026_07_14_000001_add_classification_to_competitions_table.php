<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('competitions', function (Blueprint $table) {
            $table->string('classification', 20)->default('standalone');
        });

        DB::table('competitions')->update([
            'classification' => DB::raw("
                CASE
                    WHEN is_container = true THEN 'container'
                    WHEN parent_id IS NOT NULL THEN 'child'
                    ELSE 'standalone'
                END
            "),
        ]);

        Schema::table('competitions', function (Blueprint $table) {
            $table->dropColumn('is_container');

            $table->index('classification');
        });

        DB::statement("
            ALTER TABLE competitions
            ADD CONSTRAINT competitions_classification_check
            CHECK (classification IN ('container', 'standalone', 'child'))
        ");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE competitions DROP CONSTRAINT IF EXISTS competitions_classification_check');

        Schema::table('competitions', function (Blueprint $table) {
            $table->boolean('is_container')->default(false);
        });

        DB::table('competitions')->update([
            'is_container' => DB::raw("
                CASE
                    WHEN classification = 'container' THEN true
                    ELSE false
                END
            "),
        ]);

        Schema::table('competitions', function (Blueprint $table) {
            $table->dropColumn('classification');

            $table->dropIndex(['classification']);
        });
    }
};
