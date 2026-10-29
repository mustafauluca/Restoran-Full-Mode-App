<?php
declare(strict_types=1);

namespace App\Integrations\Storage;

class LocalStorage {
    private string $venuesRoot;

    public function __construct() {
        $this->venuesRoot = dirname(__DIR__, 3) . '/venues';
    }

    /**
     * Saves files strictly under each venue's isolated folder:
     * /venues/{venue_slug}/{subfolder}/{filename}
     * Subfolders: uploads, products, banners, pdfler, qr_codes, playlists
     */
    public function saveVenueUpload(string $venueSlug, string $subfolder, string $filename, string $fileContent): string {
        $cleanSlug = preg_replace('/[^a-zA-Z0-9_-]/', '', $venueSlug) ?: 'default-venue';
        $cleanSub = preg_replace('/[^a-zA-Z0-9_-]/', '', $subfolder) ?: 'uploads';
        
        $targetDir = "{$this->venuesRoot}/{$cleanSlug}/{$cleanSub}";
        if (!is_dir($targetDir)) {
            @mkdir($targetDir, 0755, true);
        }

        $targetPath = "{$targetDir}/{$filename}";
        file_put_contents($targetPath, $fileContent);
        return "/venues/{$cleanSlug}/{$cleanSub}/{$filename}";
    }

    public function saveUpload(string $subfolder, string $filename, string $fileContent, string $venueSlug = 'lezzet-duragi'): string {
        return $this->saveVenueUpload($venueSlug, $subfolder, $filename, $fileContent);
    }

    public function getUrl(string $relativePath): string {
        return '/' . ltrim($relativePath, '/');
    }
}
