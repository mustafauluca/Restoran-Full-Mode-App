<?php
declare(strict_types=1);

namespace App\Integrations\Payment;

class IyzicoGateway {
    private string $apiKey;
    private string $secretKey;
    private string $baseUrl;

    public function __construct(string $apiKey = '', string $secretKey = '', bool $sandbox = true) {
        $this->apiKey = $apiKey ?: (getenv('IYZICO_API_KEY') ?: 'sandbox_iyzico_api_key');
        $this->secretKey = $secretKey ?: (getenv('IYZICO_SECRET_KEY') ?: 'sandbox_iyzico_secret_key');
        $this->baseUrl = $sandbox ? 'https://sandbox-api.iyzipay.com' : 'https://api.iyzipay.com';
    }

    public function createPaymentForm(array $orderData): array {
        // Initializes Iyzico 3D Secure / Checkout Form
        $payload = [
            'locale' => 'tr',
            'conversationId' => 'ORD-' . ($orderData['order_id'] ?? time()),
            'price' => number_format((float)($orderData['total'] ?? 0), 2, '.', ''),
            'paidPrice' => number_format((float)($orderData['total'] ?? 0), 2, '.', ''),
            'currency' => $orderData['currency'] ?? 'TRY',
            'basketId' => 'B-' . ($orderData['order_id'] ?? time()),
            'paymentGroup' => 'PRODUCT',
            'callbackUrl' => (getenv('APP_URL') ?: 'https://qradv.com') . '/api/payment/callback/iyzico',
            'buyer' => [
                'id' => 'BY-' . ($orderData['customer_phone'] ?? 'guest'),
                'name' => $orderData['customer_name'] ?? 'Misafir',
                'surname' => 'Müşteri',
                'gsmNumber' => $orderData['customer_phone'] ?? '+905320000000',
                'email' => $orderData['customer_email'] ?? 'musteri@qradv.com',
                'identityNumber' => '11111111111',
                'registrationAddress' => $orderData['delivery_address'] ?? 'Masa Siparişi',
                'ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
                'city' => $orderData['city'] ?? 'İstanbul',
                'country' => 'Turkey'
            ]
        ];

        return [
            'status' => 'success',
            'token' => 'mock_iyzi_token_' . bin2hex(random_bytes(8)),
            'paymentPageUrl' => $this->baseUrl . '/payment/checkoutform',
            'orderId' => $payload['conversationId']
        ];
    }
}
