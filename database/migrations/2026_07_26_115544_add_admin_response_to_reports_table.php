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
        Schema::table('reports', function (Blueprint $table) {
            $table->text('admin_response')->nullable()->after('description');
            $table->timestamp('admin_response_at')->nullable()->after('admin_response');
            $table->timestamp('admin_read_at')->nullable()->after('admin_response_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn(['admin_response', 'admin_response_at', 'admin_read_at']);
        });
    }
};
