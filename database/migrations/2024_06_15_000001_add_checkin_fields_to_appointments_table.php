<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCheckinFieldsToAppointmentsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->timestamp('check_in_time')->nullable()->after('status');
            $table->boolean('payment_collected')->default(false)->after('check_in_time');
            $table->text('triage_notes')->nullable()->after('payment_collected');
            $table->string('contact_number')->nullable()->after('triage_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn(['check_in_time', 'payment_collected', 'triage_notes', 'contact_number']);
        });
    }
}
