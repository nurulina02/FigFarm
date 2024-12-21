<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['department'])) {
  echo json_encode(["success" => false, "message" => "Unauthorized access."]);
  exit;
}

// Database connection
$conn = new mysqli("localhost", "root", "", "figfarm_db");
$department = $_SESSION['department'];

// Check connection
if ($conn->connect_error) {
  echo json_encode(["success" => false, "message" => "Database connection failed."]);
  exit;
}

// Fetch employees from the database
$stmt = $conn->prepare(
  "SELECT `staff_ID`, `staff_Name`, `email`, `status`, `department` 
  FROM `staff`
  WHERE `department` = ?, `status` = 'active'
  ORDER BY  `staff_ID` ASC"
); // Adjust column names based on your table
$stmt->bind_param("s", $department);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
  // Create an array to store employees
  $employees = [];

  while ($row = $result->fetch_assoc()) {
    $employees[] = $row;
  }

  // Send JSON response
  echo json_encode([
    "success" => true,
    "employees" => $employees,
    "next_staff_ID" => $nextStaffID
  ]);
} else {
  echo json_encode([]);
}

$conn->close();
?>
