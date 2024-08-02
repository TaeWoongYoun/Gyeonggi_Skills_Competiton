<?php
$course_name = $_POST["course_name"];
$course_date = $_POST["course_date"];
$course_start_time = $_POST["course_start_time"];

$sql = "SELECT * FROM course WHERE course_name = :course_name AND course_date = :course_date AND course_start_time = :course_start_time";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(":course_name", $course_name);
$stmt->bindParam(":course_date", $course_date);
$stmt->bindParam(":course_start_time", $course_start_time);
$stmt->execute();
$course = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$course) {
    if (isset($_POST["courseAdd"])) {
        $sql2 = "INSERT INTO course (course_name, course_date, course_start_time) VALUES (?, ?, ?)";
        $stmt2 = $pdo->prepare($sql2);
        $stmt2->execute([$course_name, $course_date, $course_start_time]);

        echo "코스가 등록되었습니다.";
    }
} else {
    echo "중복된 날짜입니다.";
}
