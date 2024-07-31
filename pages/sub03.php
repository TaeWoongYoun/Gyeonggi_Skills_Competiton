<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>달빛기행축제</title>
  <link rel="stylesheet" href="./style.css" />
</head>

<body>

  <div class="course_tab">
    <div>
      <p>이동수단 :</p>
      <select name="step" id="step">
        <option value="foot">도보</option>
        <option value="bicycle">자전거</option>
      </select>
    </div>
    <div>
      <p>코스 :</p>
      <select name="course" id="course" onchange="courseIntriduction()">
        <option value="창덕궁">창덕궁</option>
        <option value="경복궁">경복궁</option>
        <option value="신라">신라</option>
      </select>
    </div>
  </div>

  <div id="course_intriduction"></div>

  <div id="course_map"></div>

  <div id="course_time_list"></div>

  <script src="./script.js"></script>
  <script>
    courseIntriduction();
  </script>
</body>

</html>