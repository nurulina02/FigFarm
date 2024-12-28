<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
session_start();
$department = $_SESSION['department'];
// Database connection
$conn = new mysqli("localhost", "root", "", "figfarm_db");

// Check connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

// Fetch tasks
$stmt = $conn->prepare( "SELECT 
            daily_tasks.task_id, 
            daily_tasks.task_name, 
            staff.staff_Name AS staff_name, 
            daily_tasks.task_location, 
            daily_tasks.status, 
            daily_tasks.description
        FROM daily_tasks
        LEFT JOIN staff ON daily_tasks.staff_id = staff.staff_ID
        WHERE department_name = ? and daily_tasks.task_date = CURRENT_DATE
        ORDER BY daily_tasks.task_id ASC"
);
$stmt->bind_param("s", $department);
$stmt->execute();

$result = $stmt->get_result();
$lastTaskID = null;
$nextTaskID = "T001";

if ($result->num_rows > 0) {
    $tasks = [];
    

    while ($row = $result->fetch_assoc()) {
        $tasks[] = $row;
        $lastTaskID = $row['task_id'];
    }

    if ($lastTaskID != null) {
      $prefix = preg_replace('/\d/', '', $lastTaskID); // Extract prefix
      $number = preg_replace('/\D/', '', $lastTaskID); // Extract number
      $nextTaskID = $prefix . '00' . (intval($number) + 1);
    } else {
      $nextTaskID = "T001"; 
    }

    echo json_encode(["success" => true, "tasks" => $tasks, "next_task_ID" => $nextTaskID]);
} else {
    echo json_encode(["success" => false, "message" => "No tasks found.","next_task_ID" => $nextTaskID]);
}

$conn->close();
?>
