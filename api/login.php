<?php
$username = $_POST["username"];
$password = $_POST["password"];

$sql = "SELECT * FROM users WHERE username = :username AND password = :password";
$stmt = $pdo->prepare($sql);
$stmt->bindParam("username", $username);
$stmt->bindParam("password", $password);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$user) {
    echo "아이디 또는 비밀번호를 확인해주세요.";
} else {
    $_SESSION["user_idx"] = $user["user_idx"];
    $_SESSION["mb_level"] = $user["mb_level"];
    echo "로그인이 완료되었습니다.";
    
}