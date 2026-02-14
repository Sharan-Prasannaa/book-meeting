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
        if(Schema::hasTable('bookings')){
            Schema::table('bookings', function (Blueprint $table){
                // Add event_type_id if not exists
                if (!Schema::hasColumn('bookings', 'event_type_id')) {
                    $table->foreignId('event_type_id')
                          ->nullable()
                          ->after('user_id')
                          ->constrained()
                          ->cascadeOnDelete();
                }

                // Add datetime start_time_new
                if (!Schema::hasColumn('bookings', 'start_datetime')) {
                    $table->dateTime('start_datetime')
                          ->nullable()
                          ->after('message');
                }

                // Add datetime end_time_new
                if (!Schema::hasColumn('bookings', 'end_datetime')) {
                    $table->dateTime('end_datetime')
                          ->nullable()
                          ->after('start_datetime');
                }

                // Add timezone
                if (!Schema::hasColumn('bookings', 'timezone')) {
                    $table->string('timezone')
                          ->default('UTC')
                          ->after('end_datetime');
                }
            });

            // Update enum safely
            DB::statement("
                ALTER TABLE bookings 
                MODIFY status ENUM(
                    'scheduled',
                    'cancelled',
                    'completed',
                    'no_show'
                ) DEFAULT 'scheduled'
            ");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('bookings')) {
            Schema::table('bookings', function (Blueprint $table) {

                if (Schema::hasColumn('bookings', 'event_type_id')) {
                    $table->dropForeign(['event_type_id']);
                    $table->dropColumn('event_type_id');
                }

                if (Schema::hasColumn('bookings', 'start_datetime')) {
                    $table->dropColumn('start_datetime');
                }

                if (Schema::hasColumn('bookings', 'end_datetime')) {
                    $table->dropColumn('end_datetime');
                }

                if (Schema::hasColumn('bookings', 'timezone')) {
                    $table->dropColumn('timezone');
                }
            });
        }
    }
};
