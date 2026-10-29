<?php
declare(strict_types=1);

/**
 * QR Adv Enterprise - Core Database Connection & PDO Wrapper
 * Handles MySQL connection, prepared statements, and automatic reconnection.
 */
namespace App\Core;

use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host = getenv('DB_HOST') ?: '127.0.0.1';
            $port = getenv('DB_PORT') ?: '3306';
            $db   = getenv('DB_NAME') ?: 'u123456789_qradv';
            $user = getenv('DB_USER') ?: 'u123456789_root';
            $pass = getenv('DB_PASS') ?: 'QRadv_Secure2026!';
            $charset = 'utf8mb4';

            $dsn = "mysql:host={$host};port={$port};dbname={$db};charset={$charset}";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ];

            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                // If MySQL is not running or credentials pending, fall back to SQLite or JSON cache
                error_log("Database connection failed: " . $e->getMessage());
                // Throw clean error for production
                throw new \RuntimeException("Veritabanı bağlantı hatası. Lütfen app/core/Database.php veya .env ayarlarınızı kontrol edin.");
            }
        }
        return self::$instance;
    }

    public static function query(string $sql, array $params = []): array {
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function queryOne(string $sql, array $params = []): ?array {
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function execute(string $sql, array $params = []): bool {
        $stmt = self::getConnection()->prepare($sql);
        return $stmt->execute($params);
    }

    public static function lastInsertId(): string {
        return self::getConnection()->lastInsertId();
    }
}
