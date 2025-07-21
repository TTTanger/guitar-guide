<?php
/**
 * Handles user login authentication.
 * Verifies username and password, starts session, and returns JSON response.
 * @author Junzhe Luo
 */
session_start();
require_once "decrypt.php";
require_once "mysql.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);
    $time = $_POST["time"];
    $password = decrypt($password, $time); // Decrypt the password (see decrypt.php for algorithm)

    $response = [];

    $sql = "SELECT id, user_name, user_password FROM accounts WHERE user_name = ?";
    if($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("s", $username);
        if($stmt->execute()) {
            $stmt->store_result();
            if($stmt->num_rows == 1) {
                $stmt->bind_result($id, $db_username, $db_password);
                if($stmt->fetch()) {
                    if($password == $db_password) {
                        $_SESSION["loggedin"] = true;
                        $_SESSION["id"] = $id;
                        $_SESSION["username"] = $username;
                        $response["success"] = true;
                        $response["redirect"] = "../htmls/index.html";
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