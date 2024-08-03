<?php
// 날짜가 하루 늦어서, 오늘 날짜로 맞추는 코드 추가
date_default_timezone_set('Asia/Seoul');
include "./config/DBconnect.php";
session_start();
$request = $_SERVER['REQUEST_URI'];
$path = explode("?", $request);
$path[1] = isset($path[1]) ? $path[1] : null;
$resource = explode("/", $path[0]);

$page = "";
if ($resource[1] == "api") {
    switch ($resource[2]) {
        case "register":
            $page = "./api/register.php";
            break;
        case "login":
            $page = "./api/login.php";
            break;
        case "courseAdd":
            $page = "./api/courseAdd.php";
            break;
        case "reservation":
            $page = "./api/reservation.php";
            break;
        default:
            echo "잘못된 접근입니다.";
            break;
    }
    include($page);
} else {
    switch ($resource[1]) {
        case "":
            $page = "./pages/index.php";
            break;
        case "sub01":
            $page = "./pages/sub01.php";
            break;
        case "sub02":
            $page = "./pages/sub02.php";
            break;
        case "sub03":
            $page = "./pages/sub03.php";
            break;
        case "register":
            $page = "./pages/register.php";
            break;
        case "login":
            $page = "./pages/login.php";
            break;
        case "logout":
            $page = "./pages/logout.php";
            break;
        case "reservation":
            $page = "./pages/reservation.php";
            break;
        default:
            echo "잘못된 접근입니다.";
            break;
    }
    include("./components/header.php");
    include($page);
    include("./components/footer.php");
}
