<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
session_start();

// Database connection
$conn = new mysqli("localhost", "root", "", "figfarm_db");

// Check connection
if ($conn->connect_error) {
  echo json_encode(["success" => false, "message" => "Database connection failed."]);
  exit;
}

// Decode incoming JSON data
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['attendance']) || !is_array($data['attendance'])) {
  echo json_encode(["success" => false, "message" => "Invalid input data."]);
  exit;
}

$attendance = $data['attendance'];

// Prepare statement for bulk insert/update
$stmt = $conn->prepare(
  "INSERT INTO attendance (staff_ID, date, attendance_Status) 
   VALUES (?, ?, ?)
   ON DUPLICATE KEY UPDATE attendance_Status = VALUES(attendance_Status)"
);

foreach ($attendance as $record) {
  $stmt->bind_param("sss", $record['staff_ID'], $record['date'], $record['attendance_Status']);
  $stmt->execute();
}


$stmt->close();
$conn->close();
echo json_encode(["success" => true, "message" => "Attendance saved successfully."]);

?>
