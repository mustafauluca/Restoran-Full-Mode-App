<?php
declare(strict_types=1);

namespace App\Integrations\Payment;

class PayTRGateway {
    private string $merchantId;
    private string $merchantKey;
    private string $merchantSalt;

    public function __construct() {
        $this->merchantId = getenv('PAYTR_MERCHANT_ID') ?: 'sandbox_mid';
        $this->merchantKey = getenv('PAYTR_MERCHANT_KEY') ?: 'sandbox_mkey';
        $this->merchantSalt = getenv('PAYTR_MERCHANT_SALT') ?: 'sandbox_msalt';
    }

    public function generateToken(array $orderData): array {
        $paymentAmount = (int)(($orderData['total'] ?? 0) * 100); // Kuruş cinsinden
        $merchantOid = 'ORD' . ($orderData['order_id'] ?? time());
        
        return [
            'status' => 'success',
            'token' => 'mock_paytr_token_' . md5($merchantOid . time()),
            'iframeUrl' => 'https://www.paytr.com/odeme/guvenli/'
        ];
    }
}
