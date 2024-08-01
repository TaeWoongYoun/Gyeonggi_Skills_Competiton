<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회원가입</title>
    <link rel="stylesheet" href="./style.css">
</head>

<body>
    <div class="register">
        <h1>회원가입</h1>
        <form action="post">
            <input id="username" type="text" placeholder="아이디를 입력해주세요."> <br>
            <input id="name" type="text" placeholder="이름을 입력해주세요."> <br>
            <input id="password" type="password" placeholder="비밀번호를 입력해주세요." readonly> <br>

            <button type="button">회원가입하기</button>
        </form>
    </div>
    <div id="virtual-keyboard" class="keyboard">
        <div class="keyboard-row">
            <button class="key special" data-key="Shift">Shift</button>
            <button class="key special" data-key="CapsLock">CapsLock</button>
            <button class="key special" data-key="Backspace">Backspace</button>
        </div>
        <div id="key-container-1" class="keyboard-row"></div>
        <div id="key-container-2" class="keyboard-row"></div>
        <div id="key-container-3" class="keyboard-row"></div>
    </div>

    <script src="./공통제공파일/jquery/jquery.js"></script>
    <script src="./script.js"></script>
</body>

</html>