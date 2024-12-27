<?php
session_start();
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "figfarm_db");
$department_name = $_SESSION['department'];
// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]));
}

// Get POST data
$task_ID = $_POST['taskID'];
$task_date = $_POST['task_date'];
$task_name = $_POST['task'];
$staff_id = $_POST['staff_Name'];
$description = $_POST['Description'];
$status = "pending"; // Default status
$task_location = $_POST['task_location'];

// Remove debug echo statements
// echo $department_name, $task_ID, $task_date, $task_name, $staff_id, $description, $status, $task_location;

// Insert task into the database
$sql = "INSERT INTO daily_tasks (task_id, task_date, task_name, staff_id, description, status, task_location, department_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(["success" => false, "message" => "SQL prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("ssssssss", $task_ID, $task_date, $task_name, $staff_id, $description, $status, $task_location, $department_name);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

// Close connection
$stmt->close();
$conn->close();
?>
