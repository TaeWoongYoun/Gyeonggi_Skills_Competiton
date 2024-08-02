<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>로그인</title>
    <!-- Bootstrap CSS 링크 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <!-- External CSS 파일 링크 -->
    <link rel="stylesheet" href="./style.css">
</head>

<body>
    <div class="login">
        <h1>로그인</h1>
        <!-- 사용자 이름 및 비밀번호 입력 -->
        <input id="username" type="text" placeholder="아이디를 입력해주세요."> <br>
        <input id="login_password" type="password" placeholder="비밀번호를 입력해주세요."> <br>

        <!-- 로그인 버튼 클릭 시 CAPTCHA 모달 표시 -->
        <button id="loginButton" onclick="showCaptchaModal()">로그인</button>
        <div id="captcha_modal" class="modal fade" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">퍼즐 조각을 맞춰보세요.</h5>
                    </div>
                    <div class="modal-body">
                        <div class="captcha-container">
                            <img id="captchaImage" class="captcha-image" src="" alt="Captcha Image">
                            <div id="puzzleSlot" class="puzzle-slot"></div>
                            <div id="puzzlePiece" class="puzzle-piece"></div>
                        </div>
                        <div class="slider-container">
                            <div id="sliderBar" class="slider-bar">
                                <div id="sliderThumb" class="slider-thumb"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Bootstrap 및 jQuery 스크립트 링크 -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="./공통제공파일/jquery/jquery.js"></script>
    <!-- External JavaScript 파일 링크 -->
    <script src="./script.js"></script>
</body>

</html>
