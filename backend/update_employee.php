<?php
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

  $stmt = $conn->prepare("UPDATE staff SET staff_Name = ?, email = ?, department = ? WHERE staff_ID = ?");
  $stmt->bind_param("ssss", $staffName, $email, $department, $staffID);

  if ($stmt->execute()) {
    echo json_encode(["success" => true]);
  } else {
    echo json_encode(["success" => false, "message" => "Error updating employee: " . $stmt->error]);
  }

  $stmt->close();
  $conn->close();
} else {
  echo json_encode(["success" => false, "message" => "Invalid input data."]);
}
?>
