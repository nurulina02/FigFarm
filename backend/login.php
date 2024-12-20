<?php
session_start();
$conn = mysqli_connect("localhost:3306", "root", "", "figfarm_db");

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
} else {
  echo "Connected successfully! </br>";
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $username = $_POST['username'];
  $password = $_POST['password'];

  // Retrieve the hashed password and position from the database
  $stmt = $conn->prepare("SELECT password, position, department FROM user WHERE username = ?");
  $stmt->bind_param("s", $username);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $hashed_password = $row['password'];
    $position = $row['position'];
    $department = $row['department'];
    $_SESSION['username'] = $username;
    $_SESSION['department'] = $department;

    // Verify the password
    if (password_verify($password, $hashed_password)) {
      // Redirect based on the position
      if ($position === 'manager') {
        header("Location: ../frontend/dashboard-manager.html");
        exit();
      } elseif ($position === 'owner') {
        header("Location: ./frontend/dashboard-owner.html");
        exit();
      } else {
        echo "<h1>Access Denied: Not a valid user for this system.</h1>";
      }
    } else {
      // Incorrect password
      header("Location: login.html?error=invalid_password");
    }
  } else {
    // Username not found
    header("Location: login.html?error=invalid_username");
  }

  $stmt->close();
  exit();
}

$conn->close();
?>
