    <!-- 헤더 시작 -->
    <header>
        <a href="./"><img class="logo" src="./logo.png" alt="logo" title="logo"></a>
        <ul>
            <li><a href="#">소개</a>
                <ul>
                    <li><a href="./sub01">달빛기행축제란</a></li>
                    <li><a href="#">지역별 달빛기행축제 안내</a></li>
                    <li><a href="./sub03">코스소개</a></li>
                </ul>
            </li>
            <li><a href="#">참여/소식</a>
                <ul>
                    <li><a href="#">공지사항</a></li>
                    <li><a href="./sub02">문화달력</a></li>
                    <li><a href="#">퀴즈 이벤트 참가</a></li>
                </ul>
            </li>
            <li><a href="#">굿즈SHOP</a></li>
            <li><a href="./reservation">예약하기</a></li>
            <li><a href="./mypage">마이페이지</a></li>
        </ul>
        <ul>
            <?php
            if(isset($_SESSION["user_idx"])) {
                echo "<li>" . $_SESSION['name'] . "님</li>";
                echo "<li><a href='./logout'>로그아웃</a></li>";
            } else {
                echo "<li><a href='./register'>회원가입</a></li>";
                echo "<li><a href='./login'>로그인</a></li>";
            }
            ?>
        </ul>
    </header>
    <!-- 헤더 끝 -->