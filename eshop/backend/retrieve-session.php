<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Replace with your Stripe Secret Key
$apiKey = 'sk_test_51QOBh0GGtNp1QEZWmJ1LppB3dZdMd3RdU6rwBO2BpoqgLxwMXVGf1UIS809UYTuJ41tUXcUzMKzEXVHLYogpHpR200XKLwj87e'; // Replace with your secret key
// Collect Data from POST Request (assuming data is sent as JSON from the frontend or Postman)
$input = file_get_contents('php://input');
$requestData = json_decode($input, true);

// Extract data
$items = $requestData['items'] ?? [];
$customerEmail = $requestData['customerEmail'] ?? '';
$customerName = $requestData['customerName'] ?? '';
$orderId = $requestData['order_id'] ?? '';
$shipping = $requestData['shipping'] ?? [];
$couponDiscount = $requestData['discountAmount'] ?? 0; // Amount in dollars
$couponCode = $requestData['couponCode'] ?? '';

// Prepare line_items dynamically
$lineItems = [];
foreach ($items as $index => $item) {
    $lineItems["line_items[$index][price_data][currency]"] = "usd";
    $lineItems["line_items[$index][price_data][product_data][name]"] = $item['title'];
    $lineItems["line_items[$index][price_data][product_data][images][0]"] = $item['thumbnail'];
    $lineItems["line_items[$index][price_data][unit_amount]"] = round($item['price'] * 100); // Convert price to cents
    $lineItems["line_items[$index][quantity]"] = $item['quantity'] ?? 1;
}

// Add coupon (if any)
if ($couponDiscount > 0) {
    $lineItems["discounts[0][coupon_data][amount_off]"] = round($couponDiscount * 100); // Convert to cents
    $lineItems["discounts[0][coupon_data][currency]"] = "usd";
    $lineItems["discounts[0][coupon_data][name]"] = $couponCode ?: "Custom Discount";
}

// Prepare shipping details
if (!empty($shipping)) {
    $lineItems["shipping_options[0][shipping_rate_data][display_name]"] = $shipping['name'] ?? 'Standard Shipping';
    $lineItems["shipping_options[0][shipping_rate_data][type]"] = "fixed_amount";
    $lineItems["shipping_options[0][shipping_rate_data][fixed_amount][amount]"] = round($shipping['amount'] * 100); // Convert to cents
    $lineItems["shipping_options[0][shipping_rate_data][fixed_amount][currency]"] = "usd";
    $lineItems["shipping_options[0][shipping_rate_data][metadata][description]"] = $shipping['info'] ?? '';
}

// Add metadata (custom data like order ID, customer name, etc.)
$lineItems["metadata[order_id]"] = $orderId;
$lineItems["metadata[customer_name]"] = $customerName;
$lineItems["metadata[coupon_code]"] = $couponCode;

// Success and cancel URLs
$successUrl = "https://eshop.learn-and-share.in/success?session_id={CHECKOUT_SESSION_ID}";
$cancelUrl = "https://eshop.learn-and-share.in/cancel";

// Combine all data into one array
$data = array_merge(
    $lineItems,
    [
        "payment_method_types[]" => "card",
        "mode" => "payment",
        "success_url" => $successUrl,
        "cancel_url" => $cancelUrl,
        "customer_email" => $customerEmail
    ]
);

// Convert the data to URL-encoded format
$postFields = http_build_query($data);

// cURL request setup
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.stripe.com/v1/checkout/sessions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $apiKey",
    "Content-Type: application/x-www-form-urlencoded"
]);

// Execute the request
$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
}
curl_close($ch);

// Output the response (session URL or error)
echo $response;

?>