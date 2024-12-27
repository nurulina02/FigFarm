<?php
session_start();
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['staff_ID'], $data['staff_Name'], $data['email'], $data['department'])) {
  $staffID = $data['staff_ID'];
  $staffName = $data['staff_Name'];
  $email = $data['email'];
  $department = $data['department'];

  $conn = mysqli_connect("localhost:3306", "root", "", "figfarm_db");

  if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
  }

  $stmt = $conn->prepare("INSERT INTO staff (staff_ID, staff_Name, email, department, status) VALUES (?, ?, ?, ?, 'active')");
  $stmt->bind_param("ssss", $staffID, $staffName, $email, $department);

  if ($stmt->execute()) {
    echo json_encode(["success" => true]);
  } else {
    echo json_encode(["success" => false, "message" => "Error adding employee: " . $stmt->error]);
  }

  $stmt->close();
  $conn->close();
} else {
  echo json_encode(["success" => false, "message" => "Invalid input data."]);
}
?>
