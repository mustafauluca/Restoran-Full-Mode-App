<?php
declare(strict_types=1);

namespace App\Core;

class Auth {
    // Super Admin Authentication
    public static function isSuperAdmin(): bool {
        return Session::get('user_role') === 'super_admin';
    }

    public static function requireSuperAdmin(): void {
        if (!self::isSuperAdmin()) {
            header('Location: /manager/login');
            exit;
        }
    }

    // Venue Manager Authentication
    public static function isVenueManager(): bool {
        $role = Session::get('user_role');
        return in_array($role, ['venue_manager', 'super_admin'], true);
    }

    public static function requireVenueManager(): void {
        if (!self::isVenueManager()) {
            header('Location: /panel/login');
            exit;
        }
    }

    public static function getVenueId(): ?int {
        return Session::get('venue_id');
    }

    // POS Station / Staff PIN Authentication
    public static function isStaffAuthenticated(): bool {
        return Session::has('staff_pin') && Session::has('pos_station');
    }

    public static function getStaffStation(): string {
        return (string)Session::get('pos_station', 'waiter');
    }

    public static function requireStaffAuth(): void {
        if (!self::isStaffAuthenticated()) {
            header('Location: /pos/login');
            exit;
        }
    }
}
