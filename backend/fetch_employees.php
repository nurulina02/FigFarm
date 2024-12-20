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
  WHERE `department` = ?
  ORDER BY `staff`.`status` ASC, `staff_ID`"
); // Adjust column names based on your table
$stmt->bind_param("s", $department);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
  // Create an array to store employees
  $employees = [];
  $lastStaffID = null;

  while ($row = $result->fetch_assoc()) {
    $employees[] = $row;
    $lastStaffID = $row['staff_ID'];
  }

  if ($lastStaffID) {
    $prefix = preg_replace('/\d/', '', $lastStaffID); // Extract prefix
    $number = preg_replace('/\D/', '', $lastStaffID); // Extract number
    $nextStaffID = $prefix . '0' . (intval($number) + 1);
  } else {
    $nextStaffID = "S1"; // Default if no employees exist
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
