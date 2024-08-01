<?php
$username = $_POST["username"];
$name = $_POST["name"];
$password = $_POST["password"];

$sql = "SELECT * FROM users WHERE username = :username";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(":username", $username);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$result) {
    $sql = "INSERT INTO users (username, name, password, mb_level) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$username, $name, $password, "일반회원"]);

    echo "회원가입이 완료되었습니다.";
} else {
    echo "중복된 아이디입니다.";
}
