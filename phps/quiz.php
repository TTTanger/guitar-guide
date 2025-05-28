<?php
header('Content-Type: application/json');
session_start();
require_once 'mysql.php';

$score = $_POST['score'];
$id = $_SESSION['id'];

if (!isset($_SESSION['id'])) {
    echo "You must be logged in to take the quiz";
    exit;
}

// Check if the user has already taken the quiz
if(!isset($_POST['score'])) {
    echo json_encode(['success' => false, 'error' => 'No score provided']);
    exit;
}

// Update best_score only if new score is higher
$sql = "UPDATE accounts SET best_score = GREATEST(COALESCE(best_score, 0), ?) WHERE id = ?";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("ii", $score, $id);
    $result = $stmt->execute();
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Score updated successfully',
            'score' => $score
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update score']);
    }
    $stmt->close();
}
$conn->close();
?>