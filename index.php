<?php
declare(strict_types=1);

/**
 * QR Adv Enterprise - Front Controller
 * Modular PHP Architecture
 */

// Autoload core files
require_once __DIR__ . '/app/core/Database.php';
require_once __DIR__ . '/app/core/Session.php';
require_once __DIR__ . '/app/core/Auth.php';
require_once __DIR__ . '/app/core/Helpers.php';
require_once __DIR__ . '/app/core/Router.php';

// Autoload integrations
require_once __DIR__ . '/app/integrations/payment/IyzicoGateway.php';
require_once __DIR__ . '/app/integrations/payment/PayTRGateway.php';
require_once __DIR__ . '/app/integrations/payment/StripeGateway.php';
require_once __DIR__ . '/app/integrations/shipping/KuryeEngine.php';
require_once __DIR__ . '/app/integrations/storage/LocalStorage.php';

use App\Core\Router;
use App\Core\Helpers;
use App\Core\Session;

Session::start();

$router = new Router();

// 1. Customer QR Menus
$router->get('/', __DIR__ . '/app/modules/qr_menu/index.php');
$router->get('/qr/{slug}', __DIR__ . '/app/modules/qr_menu/index.php');

// 2. Restaurant Manager Panel
$router->get('/panel', __DIR__ . '/app/modules/panel/index.php');
$router->post('/panel', __DIR__ . '/app/modules/panel/index.php');

// 3. Super Admin Platform Master
$router->get('/manager', __DIR__ . '/app/modules/manager/index.php');
$router->post('/manager', __DIR__ . '/app/modules/manager/index.php');

// 4. POS Touchscreen & Kitchen Display System (KDS)
$router->get('/pos', __DIR__ . '/app/modules/pos_kds/index.php');
$router->post('/pos', __DIR__ . '/app/modules/pos_kds/index.php');

// 5. Menuboard TV Broadcast
$router->get('/tv', __DIR__ . '/app/modules/tv_board/index.php');
$router->get('/tv/{slug}/{screenId}', __DIR__ . '/app/modules/tv_board/index.php');

// 6. Venue Live Radio Player
$router->get('/radyo', __DIR__ . '/app/modules/radio/index.php');
$router->get('/radyo/{slug}', __DIR__ . '/app/modules/radio/index.php');

// 7. REST APIs
$router->get('/api/rates', function() {
    header('Content-Type: application/json');
    echo json_encode(Helpers::getExchangeRates());
});

$router->post('/api/call-waiter', function() {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => 'Garson çağrıldı']);
});

// Run router
$router->dispatch();
