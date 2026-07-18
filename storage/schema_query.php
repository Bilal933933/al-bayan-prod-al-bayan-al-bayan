<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require 'E:\heard\al-bayan-exam-platform\vendor\autoload.php';
$app = require 'E:\heard\al-bayan-exam-platform\bootstrap\app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tables = ['competitions', 'attempts', 'questions', 'user_scores', 'users'];
foreach ($tables as $table) {
    echo "=== Constraints for $table ===\n";
    $results = DB::select("
        SELECT con.conname as constraint_name,
               con.contype as constraint_type,
               pg_get_constraintdef(con.oid) as constraint_def
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        WHERE rel.relname = ?
    ", [$table]);
    echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";
}

// Also check for user_scores type distinct values
$queries2 = [
    'SELECT DISTINCT type FROM user_scores',
    'SELECT DISTINCT type FROM questions',
];
foreach ($queries2 as $q) {
    echo "=== $q ===\n";
    $results = DB::select($q);
    echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";
}
