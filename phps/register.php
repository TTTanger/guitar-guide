<?php
session_start();
require_once "decrypt.php";
require_once "mysql.php"; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);
    $password = decrypt_password($password);
    
    if (strlen($password) < 6) {
        $response["success"] = false;
        $response["error"] = "Password must be at least 6 characters long";
        echo json_encode($response);
        exit;
    }
    
    $sql = "SELECT user_name FROM accounts WHERE user_name = ?";
    
    if($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("s", $username);
        
        if($stmt->execute()) {
            $stmt->store_result();
            
            if ($stmt->num_rows > 0) {
                $response["success"] = false;
                $response["error"] = "User existed!";
            }
            else {
                $stmt->close();
                $date = date("Y-m-d");
                $avatar = "../images/default_avatar.jpeg";
                // Make the password hash
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                
                $sql = "INSERT INTO accounts (user_name, user_password, user_avatar, created_at) VALUES (?, ?, ?, ?)";
                if($stmt = $conn->prepare($sql)) {
                    
                    $stmt->bind_param("ssss", $username, $hashed_password, $avatar, $date);
                    if($stmt->execute()) {
                        $stmt->store_result();
                        $response["success"] = true;
                        $response["message"] = "User created successfully!";
                        $response["redirect"] = "../htmls/login.html";
                    }
                }
            }
        }
        
        if(!isset($response["success"])) {
            $response["success"] = false;
            $response["error"] = "Invalid username or password.";
        }
        $stmt->close();
    }
    
    header('Content-Type: application/json');
    echo json_encode($response);
    $conn->close();
    exit;
}
?>