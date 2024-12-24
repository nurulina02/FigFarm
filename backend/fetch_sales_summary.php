<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
session_start();

// Check if department is set in session
if (!isset($_SESSION['department'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit;
}

// Database connection
$conn = new mysqli("localhost", "root", "", "figfarm_db");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

$department_ID = $_SESSION['department'];

// Fetch product sales summary for the current day
$summaryQuery = "
    SELECT 
        p.product_Name AS name,
        p.price AS price,
        COALESCE(SUM(s.quantity), 0) AS quantity_sold,
        COALESCE(SUM(s.total_price), 0.0) AS total_sales
    FROM products p
    LEFT JOIN sales s 
        ON p.product_ID = s.product_ID 
        AND DATE(s.time) = CURDATE()
        AND s.department_ID = ?
    GROUP BY p.product_ID
    ORDER BY p.product_ID ASC
";


$summaryStmt = $conn->prepare($summaryQuery);
$summaryStmt->bind_param("s", $department_ID);
$summaryStmt->execute();
$summaryResult = $summaryStmt->get_result();

$products = [];
while ($row = $summaryResult->fetch_assoc()) {
    $products[] = [
        "name" => $row["name"],
        "price" => $row["price"],
        "quantity_sold" => $row["quantity_sold"],
        "total_sales" => $row["total_sales"]
    ];
}

// Fetch transaction history for the current day
$transactionQuery = "
    SELECT 
        s.time,
        p.product_Name AS product,
        st.staff_Name AS staff,
        s.quantity,
        s.payment_method
    FROM sales s
    JOIN products p ON s.product_ID = p.product_ID
    JOIN staff st ON s.staff_ID = st.staff_ID
    WHERE DATE(s.time) = CURDATE()
    AND s.department_ID = ?
    ORDER BY s.time DESC
";

$transactionStmt = $conn->prepare($transactionQuery);
$transactionStmt->bind_param("s", $department_ID);
$transactionStmt->execute();
$transactionResult = $transactionStmt->get_result();

$transactions = [];
while ($row = $transactionResult->fetch_assoc()) {
    $transactions[] = [
        "time" => $row["time"],
        "product" => $row["product"],
        "staff" => $row["staff"],
        "quantity" => $row["quantity"],
        "payment_method" => $row["payment_method"]
    ];
}

// Return data as JSON
echo json_encode([
    "success" => true,
    "products" => $products,
    "transactions" => $transactions
]);

$conn->close();
?>
