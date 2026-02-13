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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('password');
            $table->enum('role',['admin','guest','host'])->default('guest');
            $table->boolean('email_verified')->default(false);
            $table->string('verification_token')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->string('remember_token', 100)->nullable();
            $table->string('timezone')->default('UTC');
            $table->integer('buffer_minutes')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
