<?php
$course_idx = $_POST["course_idx"];
$name = $_POST["name"];
$phoneNumber = $_POST["phoneNumber"];
$email = $_POST["email"];
$personnel_count = $_POST["personnel_count"];

$sql = "INSERT INTO reservation (course_idx, name, phone_number, email, personnel_count) VALUES (?, ?, ?, ?, ?)";
$stmt = $pdo->prepare($sql);
$stmt->execute([$course_idx, $name, $phoneNumber, $email, $personnel_count]);

echo "예약이 완료되었습니다.";

?>