<?php
session_start(); // Start the session to access session variables
header('Content-Type: application/json'); // Set response type to JSON
require_once "mysql.php"; // Include database connection
$id = $_SESSION['id']; // Get user ID from session

// Fetch user profile information from the database
function getUserProfile($id, $conn)
{
    $sql = "SELECT user_name, user_avatar, created_at, best_score FROM accounts WHERE id = ?";

    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("i", $id); // Bind user ID as integer

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                // Return user profile data as JSON
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

// Update the user's password after verifying the current password
function updatePassword($id, $conn)
{
    // Validate input
    if (!isset($_POST['current_password']) || !isset($_POST['new_password'])) {
        echo json_encode(['success' => false, 'error' => 'Missing password data']);
        return;
    }

    // Fetch the current password hash from the database
    $sql = "SELECT user_password FROM accounts WHERE id = ?";
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                // Debug: log password attempts (not recommended in production)
                error_log("Current password attempt: " . $_POST['current_password']);
                error_log("Stored hash: " . $row['user_password']);

                // Verify the current password using password_verify
                if (password_verify($_POST['current_password'], $row['user_password'])) {
                    $stmt->close();

                    // Hash and update the new password
                    $new_password_hash = password_hash($_POST['new_password'], PASSWORD_DEFAULT);
                    $update_sql = "UPDATE accounts SET user_password = ? WHERE id = ?";

                    if ($update_stmt = $conn->prepare($update_sql)) {
                        $update_stmt->bind_param("si", $new_password_hash, $id);
                        if ($update_stmt->execute()) {
                            echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
                        } else {
                            echo json_encode(['success' => false, 'error' => 'Failed to update password']);
                        }
                        $update_stmt->close();
                    } else {
                        echo json_encode(['success' => false, 'error' => 'Failed to prepare update statement']);
                    }
                } else {
                    error_log("Password verification failed");
                    echo json_encode([
                        'success' => false,
                        'error' => 'Incorrect current password',
                        'debug' => [
                            'input_length' => strlen($_POST['current_password']),
                            'hash_length' => strlen($row['user_password'])
                        ]
                    ]);
                }
            } else {
                echo json_encode(['success' => false, 'error' => 'User not found']);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Database error']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Query preparation failed']);
    }
}

// Handle avatar upload and update the user's avatar path in the database
function postAvatar($id, $conn)
{
    if (!isset($_FILES['avatar'])) {
        echo json_encode(['success' => false, 'error' => 'No file uploaded']);
        return;
    }

    $file = $_FILES['avatar'];

    $tmp_name = $file['tmp_name'];
    $file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    // Only allow certain file types for avatars
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    if (!in_array($file_ext, $allowedTypes)) {
        echo json_encode(['success' => false, 'error' => 'Invalid file type']);
        return;
    }

    // Generate a unique file name for the uploaded avatar
    $new_file_name = uniqid() . '.' . $file_ext;
    $db_path = $upload_path = '../uploads/avatars/' . $new_file_name;

    // Move the temporary file to the uploads folder
    if (move_uploaded_file($tmp_name, $upload_path)) {
        $sql = "UPDATE accounts SET user_avatar = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $db_path, $id);

        if ($stmt->execute()) {
            // Return the new avatar path as JSON
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

// Determine the requested action (GET or POST)
$action = $_GET['action'] ?? $_POST['action'] ?? '';

// Route the request to the appropriate function
switch ($action) {
    case 'getUserProfile':
        getUserProfile($id, $conn);
        break;
    case 'postAvatar':
        postAvatar($id, $conn);
        break;
    case 'updatePassword':
        updatePassword($id, $conn);
        break;
    default:
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
}

$conn->close(); // Close the database connection
?>