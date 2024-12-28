<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

$conn = new mysqli("localhost", "root", "", "figfarm_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

foreach ($data['status'] as $record) {
    $task_id = $record['task_id'];
    $status = $record['status'];
    $date = $record['date'];
    $department = $_SESSION['department'];

    $query = "UPDATE `daily_tasks` SET `status`=? WHERE `task_id`=? AND `task_date`=? AND `department_name`=?";
    $stmt = $conn->prepare($query);
    if ($stmt) {
        $stmt->bind_param("ssss", $status, $task_id, $date, $department);
        $stmt->execute();
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error preparing statement."]);
        exit;
    }
}

echo json_encode(["success" => true, "message" => "Status updated successfully."]);
$conn->close();
?>
