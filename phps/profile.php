<?php
/**
 * User Profile Management Script
 * Handles fetching user profile, updating password, and uploading avatar.
 * @author Junzhe Luo
 */
session_start();
header('Content-Type: application/json');
require_once "mysql.php";
require "decrypt.php";
$id = $_SESSION['id'];

/**
 * Fetch user profile information from the database and return as JSON.
 * @param int $id User ID
 * @param mysqli $conn Database connection
 * @return void
 * @author Junzhe Luo
 */
function getUserProfile($id, $conn)
{
    $sql = "SELECT user_name, user_avatar, created_at, best_score FROM accounts WHERE id = ?";
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                echo json_encode([
                    'success' => true,
                    'username' => $row['user_name'],
                    'user_avatar' => $row['user_avatar'] ?? '../images/default_avatar.jpeg',
                    'join_date' => date('F j, Y', strtotime($row['created_at'])),
                    'best_score' => $row['best_score']
                ]);
            } else {
                echo json_encode(['success' => false, 'error' => 'User not found']);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Database error']);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'Query preparation failed']);
    }
}

/**
 * Update the user's password after verifying the current password.
 * @param int $id User ID
 * @param string $time Time string for decryption
 * @param mysqli $conn Database connection
 * @return void
 * @author Junzhe Luo
 */
function updatePassword($id, $time, $conn)
{
    if (!isset($_POST['current_password']) || !isset($_POST['new_password'])) {
        echo json_encode(['success' => false, 'error' => 'Missing password data']);
        return;
    }
    $current_password = decrypt($_POST['current_password'], $time);
    $new_password = decrypt($_POST['new_password'], $time);
    $sql = "SELECT user_password FROM accounts WHERE id = ?";
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                if ($current_password == $row['user_password']) {
                    $stmt->close();
                    $update_sql = "UPDATE accounts SET user_password = ? WHERE id = ?";
                    $stmt = $conn->prepare($update_sql);
                    $stmt->bind_param("si", $new_password, $id);
                    if ($stmt->execute()) {
                        echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
                    } else {
                        echo json_encode(['success' => false, 'error' => 'Failed to update password']);
                    }
                    $stmt->close();
                } else {
                    echo json_encode(['success' => false, 'error' => 'Current password is incorrect']);
                }
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to fetch current password']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to prepare query']);
    }
}

/**
 * Handle avatar upload and update the user's avatar path in the database.
 * @param int $id User ID
 * @param mysqli $conn Database connection
 * @return void
 * @author Junzhe Luo
 */
function postAvatar($id, $conn)
{
    if (!isset($_FILES['avatar'])) {
        echo json_encode(['success' => false, 'error' => 'No file uploaded']);
        return;
    }
    $file = $_FILES['avatar'];
    $tmp_name = $file['tmp_name'];
    $file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    if (!in_array($file_ext, $allowedTypes)) {
        echo json_encode(['success' => false, 'error' => 'Invalid file type']);
        return;
    }
    $new_file_name = uniqid() . '.' . $file_ext;
    $db_path = $upload_path = '../uploads/avatars/' . $new_file_name;
    if (move_uploaded_file($tmp_name, $upload_path)) {
        $sql = "UPDATE accounts SET user_avatar = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $db_path, $id);
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'user_avatar' => $db_path
            ]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Database update failed']);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'File upload failed']);
    }
}

/**
 * Main logic: route the request to the appropriate function based on action.
 * @author Junzhe Luo
 */
$action = $_GET['action'] ?? $_POST['action'] ?? '';
switch ($action) {
    case 'getUserProfile':
        getUserProfile($id, $conn);
        break;
    case 'postAvatar':
        postAvatar($id, $conn);
        break;
    case 'updatePassword':
        $time = $_POST['time'];
        updatePassword($id, $time, $conn);
        break;
    default:
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
}

$conn->close();
?>