<?php
// Database connection configuration
// These constants define the connection parameters for MySQL

define('DB_SERVER', 'localhost'); // MySQL server address
define('DB_USERNAME', 'guitar');    // MySQL username
define('DB_PASSWORD', '');        // MySQL password (empty by default)
define('DB_NAME', 'guitar-guide'); // Name of the database to use

try {
    // Create a new MySQLi connection using the defined constants
    $conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
    
    // Set the character set to utf8mb4 for full Unicode support
    $conn->set_charset("utf8mb4");
    
    // Check for connection errors
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
} catch (Exception $e) {
    // If connection fails, return a JSON error and exit
    header('Content-Type: application/json');
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}
?>