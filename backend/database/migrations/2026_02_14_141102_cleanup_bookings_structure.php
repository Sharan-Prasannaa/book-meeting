<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('bookings')) {

            Schema::table('bookings', function (Blueprint $table) {

                // Drop old columns
                if (Schema::hasColumn('bookings', 'date')) {
                    $table->dropColumn('date');
                }

                if (Schema::hasColumn('bookings', 'start_time')) {
                    $table->dropColumn('start_time');
                }

                if (Schema::hasColumn('bookings', 'end_time')) {
                    $table->dropColumn('end_time');
                }
            });

            // Make event_type_id NOT NULL
            DB::statement("
                ALTER TABLE bookings 
                MODIFY event_type_id BIGINT UNSIGNED NOT NULL
            ");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('bookings')) {

            // Make event_type_id nullable again
            DB::statement("
                ALTER TABLE bookings 
                MODIFY event_type_id BIGINT UNSIGNED NULL
            ");

            // Recreate old columns
            Schema::table('bookings', function (Blueprint $table) {

                if (!Schema::hasColumn('bookings', 'date')) {
                    $table->date('date')->nullable();
                }

                if (!Schema::hasColumn('bookings', 'start_time')) {
                    $table->time('start_time')->nullable();
                }

                if (!Schema::hasColumn('bookings', 'end_time')) {
                    $table->time('end_time')->nullable();
                }
            });
        }
    }

};
