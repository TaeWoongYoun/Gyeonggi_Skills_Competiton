<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>달빛기행축제</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="./style.css" />
</head>

<body>
    <?php
    if (isset($_SESSION["mb_level"])) {
        if ($_SESSION["mb_level"] == "관리자") {
    ?>

            <div class="course_add">
                <h1>코스 등록하기</h1>
                <div>
                    <h6>코스 : </h6>
                    <select onchange="courseCheck()" name="course_name" id="course_name">
                        <option value="창덕궁">창덕궁</option>
                        <option value="경복궁">경복궁</option>
                        <option value="신라">신라</option>
                    </select>
                </div>
                <div>
                    <h6>코스 진행 날짜 : </h6>
                    <input onchange="courseCheck()" id="course_date" type="date">
                </div>
                <div>
                    <h6>시작 시간 : </h6>
                    <input onchange="courseCheck()" id="course_start_time" max="23" type="number" placeholder="">
                </div>
                <button id="courseAdd_btn" type="button" onclick="courseAdd()" class="btn btn-dark">등록하기</button>
            </div>
            <div class="course">
                <h1>등록된 코스</h1>
                <table>
                    <tr>
                        <th>연번</th>
                        <th>코스 이름</th>
                        <th>코스 진행 날짜</th>
                        <th>시작 시간</th>
                        <th>예상 진행 시간</th>
                        <th>현재인원</th>
                        <th>해설가 이름</th>
                    </tr>
                    <?php
                        $sql = "SELECT * FROM course";
                        $stmt = $pdo->prepare($sql);
                        $stmt->execute();
                        $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

                        if($courses) {
                            foreach ($courses as $course) {
                                $divinnerhtml = "";
                                $divinnerhtml .= "<tr>";
                                $divinnerhtml .= "<td>". $course["course_idx"] ."</td>";
                                $divinnerhtml .= "<td>". $course["course_name"] ."</td>";
                                $divinnerhtml .= "<td>". $course["course_date"] ."</td>";
                                $divinnerhtml .= "<td>". $course["course_start_time"] ."시</td>";
                                $divinnerhtml .= "<td>". $course["course_start_time"]-1 ."시 ~ ". $course["course_start_time"] + 1 ."시</td>";
                                $divinnerhtml .= "<td>". $course["current_personnel"] ."</td>";
                                if($course["guide_idx"]) {
                                    $divinnerhtml .= "<td>". $course["guide_idx"] ."</td>";
                                } else {
                                    $divinnerhtml .= "<td>없음</td>";
                                }
                                $divinnerhtml .= "</tr>";
                            }
                            
                            echo $divinnerhtml;
                        }
                    ?>
                </table>
            </div>
    <?php
        } else if ($_SESSION["mb_level"] == "해설가") {
            echo "<h1>해설가 페이지</h1>";
        } else {
            echo "<h1>일반회원 페이지</h1>";
        }
    } else {
        echo "
        <script>alert('로그인 후 이용가능한 페이지입니다.');
        location.href='./login';
        </script>";
    }
    ?>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="./공통제공파일/jquery/jquery.js"></script>
    <script src="./script.js"></script>
</body>

</html>