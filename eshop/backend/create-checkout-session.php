<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Replace with your Stripe Secret Key
$stripeSecretKey = 'sk_test_51QOBh0GGtNp1QEZWmJ1LppB3dZdMd3RdU6rwBO2BpoqgLxwMXVGf1UIS809UYTuJ41tUXcUzMKzEXVHLYogpHpR200XKLwj87e'; // Replace with your secret key
// Collect Data from POST Request (assuming data is sent as JSON from the frontend or Postman)
// Capture JSON request data
$requestData = json_decode(file_get_contents("php://input"), true);
$items = $requestData['items'] ?? [];
$couponCode = $requestData['couponCode'] ?? null;
$discountAmount = $requestData['discountAmount'] ?? 0; // In dollars
$shipping = $requestData['shipping'] ?? [];
$customerEmail = $requestData['customerEmail'] ?? null;
$customerName = $requestData['customerName'] ?? null;
$order_id = $requestData['order_id'] ?? null;

// Function to create a custom coupon
function createCustomCoupon($discountAmount, $couponCode, $stripeSecretKey)
{
    $ch = curl_init("https://api.stripe.com/v1/coupons");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_USERPWD, $stripeSecretKey . ":");
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        "amount_off" => round($discountAmount * 100), // Convert to cents
        "currency" => "usd",
        "duration" => "once", // One-time discount
        "name" => $couponCode ?: "Custom Discount",
    ]));

    $response = curl_exec($ch);
    curl_close($ch);

    $couponResponse = json_decode($response, true);
    if (isset($couponResponse['id'])) {
        return $couponResponse['id'];
    } else {
        // Handle error creating coupon
        die("Failed to create coupon: " . $response);
    }
}

// Step 1: Create line items for the checkout session
$line_items = [];
foreach ($items as $item) {
    $line_items[] = [
        "price_data" => [
            "currency" => "usd",
            "product_data" => [
                "name" => $item['title'],
                "images" => [$item['thumbnail']],
            ],
            "unit_amount" => round($item['price'] * 100), // Convert to cents
        ],
        "quantity" => 1, // Assuming 1 quantity for simplicity
    ];
}

// Step 2: Create coupon if a discount is provided
$couponId = null;
if ($discountAmount > 0) {
    $couponId = createCustomCoupon($discountAmount, $couponCode, $stripeSecretKey);
}

// Step 3: Create shipping options
$shipping_options = [];
if (!empty($shipping)) {
    $shipping_options[] = [
        "shipping_rate_data" => [
            "display_name" => $shipping['name'] ?? "Standard Shipping",
            "type" => "fixed_amount",
            "fixed_amount" => [
                "amount" => round($shipping['amount'] * 100), // Convert to cents
                "currency" => "usd",
            ],
            "metadata" => [
                "description" => $shipping['info'] ?? "Shipping Description",
            ],
        ],
    ];
}

// Step 4: Create the checkout session
$data = [
    "payment_method_types" => ["card"],
    "line_items" => $line_items,
    "mode" => "payment",
    "success_url" => "https://eshop.learn-and-share.in/success?session_id={CHECKOUT_SESSION_ID}&ref=$order_id",
    "cancel_url" => "https://eshop.learn-and-share.in/checkout",
    "customer_email" => $customerEmail,
    "metadata" => [
        "customer_name" => $customerName,
        "order_id" => $order_id,
        "coupon_code" => $couponCode ?? "",
        "discount" => $discountAmount ?? 0
    ],
    "shipping_options" => $shipping_options,
];

// Apply the coupon if it exists
if (!empty($couponId)) {
    $data["discounts"] = [
        ["coupon" => $couponId],
    ];
}

// Send request to Stripe to create checkout session
$ch = curl_init("https://api.stripe.com/v1/checkout/sessions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_USERPWD, $stripeSecretKey . ":");
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));

$response = curl_exec($ch);
curl_close($ch);

$session = json_decode($response, true);

// Return the session URL or error message
if (isset($session['url'])) {
    echo json_encode(["url" => $session['url']]);
} else {
    echo json_encode(["error" => "Failed to create checkout session", "details" => $session]);
}

?>