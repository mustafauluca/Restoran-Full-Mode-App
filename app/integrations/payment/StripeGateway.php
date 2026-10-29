<?php
declare(strict_types=1);

namespace App\Integrations\Payment;

class StripeGateway {
    private string $secretKey;

    public function __construct() {
        $this->secretKey = getenv('STRIPE_SECRET_KEY') ?: 'sk_test_mock_stripe_key';
    }

    public function createCheckoutSession(array $orderData): array {
        return [
            'status' => 'success',
            'sessionId' => 'cs_test_' . bin2hex(random_bytes(12)),
            'checkoutUrl' => 'https://checkout.stripe.com/pay/' . bin2hex(random_bytes(8))
        ];
    }
}
