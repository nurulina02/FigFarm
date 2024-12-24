<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// Database connection
$conn = new mysqli("localhost", "root", "", "figfarm_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

// Query to fetch all products
$query = "SELECT product_ID, product_Name, price, unit FROM products";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = [
            "id" => $row["product_ID"],
            "name" => $row["product_Name"],
            "price" => $row["price"],
            "unit" => $row["unit"]
        ];
    }
    echo json_encode(["success" => true, "products" => $products]);
} else {
    echo json_encode(["success" => false, "message" => "No products found."]);
}

$conn->close();
?>
