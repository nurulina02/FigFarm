<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

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

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['attendance']) || !is_array($data['attendance'])) {
  echo json_encode(["success" => false, "message" => "Invalid input data."]);
  exit;
}

foreach ($data['attendance'] as $record) {
  $staff_ID = $record['staff_ID'];
  $attendance_Status = $record['attendance_Status'];
  $date = $record['date'];

  // Upsert logic (insert if not exists, update otherwise)
  $query = "
    INSERT INTO attendance (staff_ID, date, attendance_Status)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE attendance_Status = VALUES(attendance_Status)
  ";
  $stmt = $conn->prepare($query);
  $stmt->bind_param("sss", $staff_ID, $date, $attendance_Status);
  $stmt->execute();
}

echo json_encode(["success" => true, "message" => "Attendance saved successfully."]);
$conn->close();
?>
