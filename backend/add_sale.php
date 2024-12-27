<?php
session_start();
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$department_Name = $_SESSION['department'] ?? null;

// Database connection
$conn = new mysqli("localhost", "root", "", "figfarm_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

// Get JSON input from request
$input = json_decode(file_get_contents("php://input"), true);

// Extract data
$product_ID = $input['product_ID'] ?? null;
$staff_ID = $input['staff_ID'] ?? null;
$quantity = $input['quantity'] ?? null;
$payment_method = $input['payment_method'] ?? null;

$time = date("Y-m-d H:i:s");

// Validate input
if (!$product_ID || !$staff_ID || !$quantity || !$payment_method || !in_array($payment_method, ['cash', 'transfer'])) {
    echo json_encode(["success" => false, "message" => "Missing or invalid input data."]);
    exit;
}

// Fetch product price
$product_query = "SELECT price FROM products WHERE product_ID = ?";
$stmt = $conn->prepare($product_query);
$stmt->bind_param("s", $product_ID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Invalid product ID."]);
    exit;
}

$product = $result->fetch_assoc();
$product_price = $product['price'];
$total_price = $product_price * $quantity;

// Insert sale record
$sale_query = "
    INSERT INTO sales (time, product_ID, staff_ID, quantity, total_price, payment_method, department_Name)
    VALUES (?, ?, ?, ?, ?, ?, ?)
";

$stmt = $conn->prepare($sale_query);
$stmt->bind_param("sssidss", $time, $product_ID, $staff_ID, $quantity, $total_price, $payment_method, $department_Name);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Sale added successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to add sale."]);
}

$conn->close();
?>
