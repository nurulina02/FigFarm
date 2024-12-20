<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// Parse input

$data = json_decode(file_get_contents('php://input'), true);


if (isset($data['staff_ID'], $data['status'])) {
    $staffID = $data['staff_ID'];
    $status = $data['status'];


    // Validate status
    if (!in_array($status, ['active', 'inactive'])) {
        echo json_encode(["success" => false, "message" => "Invalid status value."]);
        exit;
    }

    // Database connection
    $conn = mysqli_connect("localhost:3306", "root", "", "figfarm_db");

    if ($conn->connect_error) {
        echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
        exit;
    }

    // Update query
    $stmt = $conn->prepare("UPDATE staff SET status = ? WHERE staff_ID = ?");
    $stmt->bind_param("ss", $status, $staffID);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Employee status updated to $status."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error updating status: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid input data."]);
}
?>
