<?php
/**
 * Handles user authentication status check.
 * Returns JSON with login status, username, and user avatar if logged in.
 * @author Junzhe Luo
 */
session_start();
require_once "mysql.php";

$response = array(
    'loggedin' => isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true,
    'username' => isset($_SESSION['username']) ? $_SESSION['username'] : null,
);

if ($response['loggedin'] && isset($_SESSION['id'])) {
    $sql = "SELECT user_avatar FROM accounts WHERE id = ?";
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("i", $_SESSION['id']);
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                $response['user_avatar'] = $row['user_avatar'] ?? '../images/default_avatar.jpeg';
            }
        }
        $stmt->close();
    }
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>