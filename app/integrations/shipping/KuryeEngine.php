<?php
declare(strict_types=1);

namespace App\Integrations\Shipping;

class KuryeEngine {
    /**
     * Calculates courier delivery fee and dispatch availability
     */
    public static function calculateFee(float $subtotal, float $distanceKm, array $venueQuota): array {
        $minOrder = (float)($venueQuota['minOrderAmount'] ?? 100.0);
        $baseFee  = (float)($venueQuota['deliveryFee'] ?? 30.0);
        $freeThreshold = (float)($venueQuota['freeDeliveryThreshold'] ?? 400.0);
        $maxCap   = (float)($venueQuota['maxOrderCap'] ?? 5000.0);

        if ($subtotal < $minOrder) {
            return [
                'eligible' => false,
                'message' => "Minimum paket sipariş tutarı {$minOrder} ₺ olmalıdır.",
                'fee' => 0.0
            ];
        }

        if ($subtotal > $maxCap) {
            return [
                'eligible' => false,
                'message' => "Maksimum sepet tutarı {$maxCap} ₺ aşılmıştır.",
                'fee' => 0.0
            ];
        }

        $fee = ($subtotal >= $freeThreshold) ? 0.0 : $baseFee;
        $etaMinutes = 25 + (int)($distanceKm * 3.5);

        return [
            'eligible' => true,
            'fee' => $fee,
            'isFree' => ($fee === 0.0),
            'distanceKm' => $distanceKm,
            'etaMinutes' => min(90, max(20, $etaMinutes))
        ];
    }
}
