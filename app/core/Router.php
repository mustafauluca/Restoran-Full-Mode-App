<?php
declare(strict_types=1);

/**
 * QR Adv Enterprise - Core Fast Router
 * Clean URL dispatching for multi-portal architecture.
 */
namespace App\Core;

class Router {
    private array $routes = [];

    public function get(string $path, callable|array|string $handler): self {
        $this->addRoute('GET', $path, $handler);
        return $this;
    }

    public function post(string $path, callable|array|string $handler): self {
        $this->addRoute('POST', $path, $handler);
        return $this;
    }

    private function addRoute(string $method, string $path, callable|array|string $handler): void {
        // Convert route pattern with parameters e.g. /qr/{slug} into regex
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $path);
        $pattern = '#^' . $pattern . '$#u';
        $this->routes[] = [
            'method' => $method,
            'pattern' => $pattern,
            'path' => $path,
            'handler' => $handler
        ];
    }

    public function dispatch(): void {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        $uri = '/' . trim($uri, '/');

        // Static files bypass
        if (preg_match('/\.(?:png|jpg|jpeg|gif|css|js|ico|svg|mp3|wav|pdf)$/i', $uri)) {
            return;
        }

        foreach ($this->routes as $route) {
            if ($route['method'] === $method && preg_match($route['pattern'], $uri, $matches)) {
                $params = array_filter($matches, '\is_string', ARRAY_FILTER_USE_KEY);
                $handler = $route['handler'];

                if (is_callable($handler)) {
                    call_user_func_array($handler, [$params]);
                    return;
                }

                if (is_string($handler) && file_exists($handler)) {
                    $_ROUTE_PARAMS = $params;
                    require $handler;
                    return;
                }
            }
        }

        // 404 Not Found fallback
        http_response_code(404);
        require_once __DIR__ . '/../views/layouts/404.php';
    }
}
