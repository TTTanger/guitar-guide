<?php
/*
 * User Logout Script
 * This script handles user logout by clearing session data, destroying the session,
 * expiring the session cookie, and returning a JSON response indicating success or failure.
 */

session_start(); 

try {
    if (isset($_SESSION) && session_status() === PHP_SESSION_ACTIVE) {
        // Clear all session variables
        $_SESSION = [];

        if (isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', time()-3600, '/'); // Expire the session cookie
        }

        session_destroy();

        $response = array(
            "success" => true,
            "message" => "Logged out successfully!",
            "redirect" => "../htmls/login.html" 
        );
    } else {
        throw new Exception("No active session found");
    }
} catch (Exception $e) {
    $response = array(
        "success" => false,
        "error" => "Logout failed: " . $e->getMessage()
    );
}

header('Content-Type: application/json'); 
echo json_encode($response); 
exit;
?>