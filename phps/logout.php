<?php
session_start(); // 必须先启动会话才能销毁

try {
    // 检查会话状态
    if (isset($_SESSION) && session_status() === PHP_SESSION_ACTIVE) {
        // 清除所有会话变量
        $_SESSION = array();

        // 如果使用了会话cookie，清除它
        if (isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', time()-3600, '/');
        }

        // 销毁会话
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