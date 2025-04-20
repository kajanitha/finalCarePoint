<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ModifyClinicsAddLocation extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('clinics', function (Blueprint $table) {
            // Drop latitude and longitude columns
            $table->dropColumn(['latitude', 'longitude']);
        });

        // Add spatial point column 'location' using raw SQL
        DB::statement('ALTER TABLE clinics ADD COLUMN location POINT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clinics', function (Blueprint $table) {
            // Add latitude and longitude columns back
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
        });

        // Drop the location column using raw SQL
        DB::statement('ALTER TABLE clinics DROP COLUMN location');
    }
}
