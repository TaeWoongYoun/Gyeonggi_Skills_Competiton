const speed = {
  bicycle: 10, // m/s
  foot: 3, // m/s
};

async function fetchCourseData() {
  const response = await fetch("./공통제공파일/B모듈/JSON/course.json");
  const data = await response.json();
  return data;
}

async function courseIntriduction() {
  const data = await fetchCourseData();
  const courseElem = document.querySelector("#course_intriduction");
  const mapElem = document.querySelector("#course_map");
  const courseSelect = document.querySelector("#course");
  const course = courseSelect.value;

  // 코스 설명 추가
  let mapImageSrc = "";
  let pointersHtml = "";

  if (course === "창덕궁") {
    courseElem.innerHTML = `<h1>창덕궁 달빛기행</h1>
              <p>조선시대 왕들의 사랑을 가장 많이 받았던 궁, 창덕궁에 여러분을 초대합니다.</p>
              <p>은은한 달빛 아래 녹음이 어우러진 창덕궁에서 청사초롱으로 불을 밝히며 궁궐 곳곳 숨은 옛이야기를 찾아보세요.</p>
              <p><창덕궁 달빛기행>이 여러분을 기다립니다.</p>`;
    mapImageSrc = "./공통제공파일/B모듈/map/창덕궁.png";
  } else if (course === "경복궁") {
    courseElem.innerHTML = `<h1>경복궁 별빛야행</h1>
              <p>별 가득한 밤, 경복궁 달빛기행에 여러분을 초대합니다.</p>
              <p>은은한 달빛 아래 경복궁 소주방에서 국악공연을 즐기며 수라상을 맛보고 전문해설사와 함께 경복궁 달빛산책을 떠나볼까요.</p>
              <p>장고, 집옥재와 팔우정, 건청궁을 거치며 궁궐의 옛 이야기를 마주하고 쏟아지는 별빛아래에서 향원정의 정취를 느껴보세요.</p>
              <p>달빛 가득한 밤, 경복궁의 문이 열립니다.</p>`;
    mapImageSrc = "./공통제공파일/B모듈/map/경복궁.png";
  } else if (course === "신라") {
    courseElem.innerHTML = `<h1>신라 달빛기행</h1>
              <p>달빛기행으로 만나는 통일신라 그 날 우리나라에 새로운 혁명, </p>
              <p>삼국통일을 이뤘던 신라의 문화들을 모두 함께 달빛과 함께 걸으며 다시 만나보는 시간을 가져보자는 취지로 기획하게 된 기행축제입니다. </p>
              <p>비록 후삼국으로 나뉜 신라여도, 우리나라에 여러 새로운 폭풍을 몰고 온 신라로 함께 떠나봅시다!</p>`;
    mapImageSrc = "./공통제공파일/B모듈/map/신라.png";
  }

  // 지도 이미지와 포인터 HTML 업데이트
  mapElem.innerHTML = `<img id="mapImage" src="${mapImageSrc}" alt="지도 이미지" class="map-image"><canvas id="pointerCanvas"></canvas>`;

  const img = document.getElementById("mapImage");
  const canvas = document.getElementById("pointerCanvas");
  const ctx = canvas.getContext("2d");

  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.style.position = "absolute";
    canvas.style.left = img.offsetLeft + "px";
    canvas.style.top = img.offsetTop + "px";

    // 모든 포인터와 경로 표시
    let pointers = [];
    if (course === "창덕궁") {
      pointers = data[0].pointer;
    } else if (course === "경복궁") {
      pointers = data[1].pointer;
    } else if (course === "신라") {
      pointers = data[2].pointer;
    }

    pointers.forEach((pointer) => {
      const x1 = pointer.location[0];
      const y1 = pointer.location[1];
      const pointerDiv = document.createElement("div");
      pointerDiv.className = "pointer";
      pointerDiv.style.left = `${x1}px`;
      pointerDiv.style.top = `${y1}px`;
      pointerDiv.innerText = pointer.idx;
      mapElem.appendChild(pointerDiv);

      pointer.link.forEach((linkIdx) => {
        const targetPointer = pointers.find((p) => p.idx === linkIdx);
        if (targetPointer) {
          const x2 = targetPointer.location[0];
          const y2 = targetPointer.location[1];
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = "black";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    });

    updateTables();
  };
}

async function updateTables() {
  const data = await fetchCourseData();
  const selectedCourse = document.getElementById("course").value;
  const transportMode = document.getElementById("step").value;
  const coursesDiv = document.getElementById("course_time_list");
  coursesDiv.innerHTML = "";

  const courseIndex =
    selectedCourse === "창덕궁" ? 0 : selectedCourse === "경복궁" ? 1 : 2;
  const courseData = data[courseIndex];

  const results = findPaths(courseData, transportMode);
  const table = createTable(results, transportMode);
  coursesDiv.appendChild(table);

  // 경로 클릭 이벤트 추가
  table.querySelectorAll("tr").forEach((row, index) => {
    if (index > 0) {
      // 헤더 행을 제외하고
      row.addEventListener("click", () => {
        highlightPath(results[index - 1].path, courseData.pointer);
        highlightRow(row);
      });
    }
  });
}

function highlightRow(row) {
  document.querySelectorAll("td").forEach((td) => {
    td.classList.remove("selected");
  });
  row.querySelectorAll("td").forEach((td) => {
    td.classList.add("selected");
  });
}

function highlightPath(path, pointers) {
  // 모든 포인터 초기화
  document.querySelectorAll(".pointer").forEach((pointer) => {
    pointer.remove();
  });

  const canvas = document.getElementById("pointerCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 경로의 포인터 하이라이트 및 선 그리기
  for (let i = 0; i < path.length - 1; i++) {
    const point1 = pointers.find((p) => p.idx === path[i]);
    const point2 = pointers.find((p) => p.idx === path[i + 1]);
    if (point1 && point2) {
      // 포인터 추가
      const pointer1 = document.createElement("div");
      pointer1.className = "pointer highlight";
      pointer1.style.left = `${point1.location[0]}px`;
      pointer1.style.top = `${point1.location[1]}px`;
      pointer1.innerText = point1.idx;
      document.getElementById("course_map").appendChild(pointer1);

      const pointer2 = document.createElement("div");
      pointer2.className = "pointer highlight";
      pointer2.style.left = `${point2.location[0]}px`;
      pointer2.style.top = `${point2.location[1]}px`;
      pointer2.innerText = point2.idx;
      document.getElementById("course_map").appendChild(pointer2);

      // 선 그리기
      ctx.beginPath();
      ctx.moveTo(point1.location[0], point1.location[1]);
      ctx.lineTo(point2.location[0], point2.location[1]);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}

function calculateDistance(loc1, loc2) {
  const dx = loc2[0] - loc1[0];
  const dy = loc2[1] - loc1[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function calculateTime(distance, speed) {
  return (distance / speed).toFixed(2);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}분 ${secs}초`;
}

function findPaths(course, transportMode) {
  const startPoint = course.pointer.find((p) => p.idx === 1);
  const endPoint = course.pointer.find((p) => p.idx === 6);
  let paths = [];

  function dfs(currentPoint, path, distance, time, visited) {
    if (currentPoint.idx === 6) {
      paths.push({ path: [...path], distance, time });
      return;
    }

    visited.add(currentPoint.idx);

    for (const linkIdx of currentPoint.link) {
      if (!visited.has(linkIdx)) {
        const nextPoint = course.pointer.find((p) => p.idx === linkIdx);
        const dist = calculateDistance(
          currentPoint.location,
          nextPoint.location
        );
        const travelTime = parseFloat(
          calculateTime(dist, speed[transportMode])
        );
        path.push(nextPoint.idx);
        dfs(nextPoint, path, distance + dist, time + travelTime, visited);
        path.pop();
      }
    }

    visited.delete(currentPoint.idx);
  }

  dfs(startPoint, [startPoint.idx], 0, 0, new Set());
  return paths.sort((a, b) => a.distance - b.distance).slice(0, 5);
}

function createTable(results, transportMode) {
  const table = document.createElement("table");
  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `<th>경로</th><th>거리 (m)</th><th>${
    transportMode === "bicycle" ? "자전거" : "도보"
  }로 이동시간</th>`;
  table.appendChild(headerRow);

  results.forEach((result) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${result.path.join(
      " -> "
    )}</td><td>${result.distance.toFixed(2)}</td><td>${formatTime(
      result.time
    )}</td>`;
    table.appendChild(row);
  });

  return table;
}

document.addEventListener("DOMContentLoaded", () => {
  courseIntriduction();
  document.getElementById("step").addEventListener("change", updateTables);
});

$(document).ready(function () {
  const passwordInput = $("#password");
  const virtualKeyboard = $("#virtual-keyboard");
  const keyContainer1 = $("#key-container-1");
  const keyContainer2 = $("#key-container-2");
  const keyContainer3 = $("#key-container-3");

  let isCapsLock = false;
  let isShiftActive = false;

  // Function to generate a full set of keys
  const generateFullKeySet = () => {
    const keys =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(
        ""
      );
    for (let i = keys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    return keys;
  };

  // Function to render the virtual keyboard
  const renderKeyboard = () => {
    keyContainer1.empty();
    keyContainer2.empty();
    keyContainer3.empty();

    const keys = generateFullKeySet();
    const rows = [keyContainer1, keyContainer2, keyContainer3];

    let currentRow = 0;
    const maxKeysPerRow = Math.ceil(keys.length / rows.length);

    keys.forEach((key, index) => {
      if (index > 0 && index % maxKeysPerRow === 0) {
        currentRow++;
      }

      const keyButton = $('<button class="key"></button>');
      // Shift or CapsLock logic for uppercase letters
      if ((isShiftActive || isCapsLock) && isNaN(key)) {
        keyButton.text(key.toUpperCase());
      } else {
        keyButton.text(key.toLowerCase());
      }
      keyButton.data("key", key);
      rows[currentRow].append(keyButton);
    });
  };

  // Event when password input is focused
  passwordInput.on("focus", () => {
    virtualKeyboard.css("display", "flex");
    renderKeyboard();
  });

  // Event to close keyboard when clicking outside
  $(document).on("mousedown", (event) => {
    if (
      !virtualKeyboard.is(event.target) &&
      !$.contains(virtualKeyboard[0], event.target) &&
      event.target !== passwordInput[0]
    ) {
      virtualKeyboard.css("display", "none");
    }
  });

  // Event for key press on the virtual keyboard
  virtualKeyboard.on("mousedown", ".key", (event) => {
    const key = $(event.target).data("key");

    if (key === "Shift") {
      // Toggle Shift state without closing the keyboard
      isShiftActive = !isShiftActive;
      renderKeyboard();
    } else if (key === "CapsLock") {
      isCapsLock = !isCapsLock;
      renderKeyboard();
    } else if (key === "Backspace") {
      passwordInput.val(passwordInput.val().slice(0, -1));
    } else {
      const valueToAdd = $(event.target).text();
      passwordInput.val(passwordInput.val() + valueToAdd);

      // Disable shift after a key press if shift was active
      if (isShiftActive) {
        isShiftActive = false;
        renderKeyboard(); // Re-render keyboard to reset shift state
      }
    }

    // Prevent default keyboard close behavior
    event.stopPropagation(); // Ensure that clicking the keyboard doesn't close it
  });

  // Prevent typing directly into the password input
  passwordInput.on("keydown", (event) => {
    event.preventDefault();
  });
});

// 한글만 입력
function regexNameCheck(name) {
  const regExp = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g;
  if (regExp.test(name)) {
    return true;
  } else {
    return false;
  }
}

// 영어, 숫자만 입력
function regexUsernameCheck(username) {
  const regExp = /^[a-zA-Z0-9]+$/;
  if (regExp.test(username)) {
    return true;
  } else {
    return false;
  }
}

// 휴대폰 정규표현식
const regexPhonNumber = (target) => {
  target.value = target.value
    .replace(/[^0-9]/g, "")
    .replace(/^(\d{3})(\d{4})(\d{4})/, `$1-$2-$3`);
};

// 회원가입
function register() {
  const username = document.querySelector("#username").value;
  const name = document.querySelector("#name").value;
  const password = document.querySelector("#password").value;

  if (!username) {
    alert("아이디를 입력해주세요.");
  } else if (!name) {
    alert("이름을 입력해주세요.");
  } else if (!password) {
    alert("비밀번호를 입력해주세요.");
  } else if (regexNameCheck(name) == false) {
    alert("이름은 한글만 입력가능합니다.");
  } else if (regexUsernameCheck(username) == false) {
    alert("아이디는 영문&숫자만 입력가능합니다.");
  } else {
    $.post("./api/register", {
      username: username,
      name: name,
      password: password,
    }).done(function (data) {
      if (data == "회원가입이 완료되었습니다.") {
        alert(data);
        location.href = "./login";
      } else if (data == "중복된 아이디입니다.") {
        alert(data);
      } else {
        alert("회원가입에 실패하였습니다.");
      }
    });
  }
}

// CAPTCHA 퍼즐을 다루기 위한 JavaScript

// HTML 요소 참조
const sliderBar = document.getElementById("sliderBar");
const sliderThumb = document.getElementById("sliderThumb");
const puzzlePiece = document.getElementById("puzzlePiece");
const puzzleSlot = document.getElementById("puzzleSlot");
const captchaImage = document.getElementById("captchaImage");
const modalElement = document.getElementById("captcha_modal");
const loginButton = document.getElementById("loginButton"); // 로그인 버튼 참조
let isDragging = false; // 드래그 상태 확인
let startX, offsetX;

// 랜덤 이미지를 위한 이미지 소스 배열
const imageSources = [
  "../공통제공파일/C모듈/capcha/1.jpg",
  "../공통제공파일/C모듈/capcha/2.jpg",
  "../공통제공파일/C모듈/capcha/3.jpg",
  "../공통제공파일/C모듈/capcha/4.jpg",
  "../공통제공파일/C모듈/capcha/5.jpg",
];

// CAPTCHA 모달을 표시하는 함수
function showCaptchaModal() {
  const username = document.querySelector("#username").value;
  const login_password = document.querySelector("#login_password").value;

  if (!username) {
    alert("아이디를 입력해주세요.");
  } else if (!login_password) {
    alert("비밀번호를 입력해주세요.");
  } else {
    selectRandomCaptchaImage(); // 랜덤 이미지 선택
    setRandomSlotPosition(); // 랜덤 슬롯 위치 설정
    resetPuzzlePiece(); // 퍼즐 조각 위치 초기화

    $("#captcha_modal").modal("show");
  }
}

// 랜덤 CAPTCHA 이미지를 선택하는 함수
function selectRandomCaptchaImage() {
  const randomIndex = Math.floor(Math.random() * imageSources.length);
  captchaImage.src = imageSources[randomIndex];
}

// 랜덤 퍼즐 슬롯 위치를 설정하는 함수
function setRandomSlotPosition() {
  const maxLeft = captchaImage.clientWidth - puzzleSlot.offsetWidth;
  const randomLeft = Math.floor(Math.random() * maxLeft);
  puzzleSlot.style.left = `${randomLeft}px`;
}

// 마우스 다운 이벤트 처리 함수
function handleMouseDown(e) {
  isDragging = true; // 드래그 상태 활성화
  startX = e.clientX - sliderThumb.offsetLeft; // 드래그 시작 위치
  sliderThumb.style.transition = "none"; // 애니메이션 없음
  puzzlePiece.style.transition = "none"; // 애니메이션 없음
}

// 마우스 업 이벤트 처리 함수
function handleMouseUp() {
  if (isDragging) {
    isDragging = false; // 드래그 상태 비활성화
    sliderThumb.style.transition = "background-color 0.3s"; // 배경색 애니메이션
    puzzlePiece.style.transition = "left 0.3s"; // 위치 애니메이션
    checkPuzzleAccuracy(); // 퍼즐 정확도 체크
  }
}

// 마우스 이동 이벤트 처리 함수
function handleMouseMove(e) {
  if (isDragging) {
    offsetX = e.clientX - startX; // 현재 위치 계산
    if (
      offsetX >= 0 &&
      offsetX <= sliderBar.clientWidth - sliderThumb.clientWidth
    ) {
      sliderThumb.style.left = offsetX + "px"; // 슬라이더 위치 업데이트
      puzzlePiece.style.left =
        offsetX *
          ((sliderBar.clientWidth - puzzlePiece.clientWidth) /
            (sliderBar.clientWidth - sliderThumb.clientWidth)) +
        "px"; // 퍼즐 조각 위치 업데이트
    }
  }
}

// 퍼즐 위치 정확도를 체크하는 함수
function checkPuzzleAccuracy() {
  const slotLeft = puzzleSlot.getBoundingClientRect().left;
  const pieceLeft = puzzlePiece.getBoundingClientRect().left;
  const accuracy =
    100 - (Math.abs(slotLeft - pieceLeft) / puzzleSlot.offsetWidth) * 100;

  if (accuracy >= 90) {
    // 90% 정확도 필요
    sliderThumb.style.backgroundColor = "green"; // 성공 시 색상 변경
    login(); // 로그인 함수 실행
  } else {
    sliderThumb.style.backgroundColor = "#007bff"; // 실패 시 초기 색상으로 변경
    alert("정확도가 90% 미만입니다. 다시 시도하세요."); // 실패 메시지
    resetPuzzlePiece(); // 퍼즐 조각 위치 초기화
    selectRandomCaptchaImage(); // 새로운 랜덤 이미지 선택
    setRandomSlotPosition(); // 새로운 랜덤 슬롯 위치 설정
  }
}

// 퍼즐 조각을 초기 위치로 리셋하는 함수
function resetPuzzlePiece() {
  sliderThumb.style.left = "0"; // 슬라이더 위치 초기화
  puzzlePiece.style.left = "0"; // 퍼즐 조각 위치 초기화
}

// 사용자 로그인을 시뮬레이션하는 함수
function login() {
  const username = document.querySelector("#username").value;
  const login_password = document.querySelector("#login_password").value;

  $.post("./api/login", {
    username: username,
    password: login_password,
  }).done(function (data) {
    if (data == "로그인이 완료되었습니다.") {
      alert(data);
      $("#captcha_modal").modal("hide");
      location.href = "./";
    } else if (data == "아이디 또는 비밀번호를 확인해주세요.") {
      alert(data);
      $("#captcha_modal").modal("hide");
    } else {
      alert("로그인에 실패하였습니다.");
      $("#captcha_modal").modal("hide");
    }
  });
}

// 마우스 이벤트에 대한 이벤트 리스너
sliderThumb.addEventListener("mousedown", handleMouseDown); // 마우스 다운 이벤트
document.addEventListener("mouseup", handleMouseUp); // 마우스 업 이벤트
document.addEventListener("mousemove", handleMouseMove); // 마우스 이동 이벤트

// 관리자 영역 -> 코스 등록
function courseAdd() {
  const course_name = document.querySelector("#course_name").value;
  const course_date = document.querySelector("#course_date").value;
  const course_start_time = document.querySelector("#course_start_time").value;

  if (!course_date) {
    alert("코스 진행 날짜를 입력해주세요.");
  } else if (!course_start_time) {
    alert("코스 시작 시간을 입력해주세요.");
  } else if (course_start_time >= 24) {
    alert("시간은 23시까지 입력가능합니다.");
  } else {
    $.post("./api/courseAdd", {
      course_name: course_name,
      course_date: course_date,
      course_start_time: course_start_time,
      courseAdd: true,
    }).done(function (data) {
      // console.log(data);
      if (data == "코스가 등록되었습니다.") {
        alert(data);
        location.href = "./reservation";
      } else if (data == "중복된 날짜입니다.") {
        alert(data);
      } else {
        alert(data);
      }
    });
  }
}

function courseCheck() {
  const course_name = document.querySelector("#course_name").value;
  const course_date = document.querySelector("#course_date").value;
  const course_start_time = document.querySelector("#course_start_time").value;

  $.post("./api/courseAdd", {
    course_name: course_name,
    course_date: course_date,
    course_start_time: course_start_time,
  }).done(function (data) {
    if (data == "중복된 날짜입니다") {
      document.querySelector("#courseAdd_btn").disabled = false;
    }
  });
}

// let course_idx = null;  // 변수 선언 및 초기화

function reservationModal(elem) {
  $("#reservationModal").modal("show");

  // course_idx 저장
  course_idx = elem.parentElement.parentElement.id;
  console.log(course_idx);
}

function reservation() {

  const name = document.querySelector("#name").value;
  const phoneNumber = document.querySelector("#phoneNumber").value;
  const email = document.querySelector("#email").value;
  const personnel_count = document.querySelector("#personnel_count").value;

  if (!name) {
    alert("이름을 입력해주세요.");
  } else if (!phoneNumber) {
    alert("전화번호를 입력해주세요.");
  } else if (phoneNumber.length < 13) {
    alert("전화번호를 다시 확인해주세요.");
  } else if (!email) {
    alert("이메일을 입력해주세요.");
  } else if (personnel_count > 5) {
    alert("최대 5명까지 예약 가능합니다.");
  } else {
    $.post("./api/reservation", {
      name: name,
      phoneNumber: phoneNumber,
      email: email,
      personnel_count: personnel_count,
      course_idx: course_idx,
      // course_idx: course_idx,
    }).done(function (data) {
      if (data === "예약이 완료되었습니다.") {
        alert(data);
        $("#reservationModal").modal("hide");
        location.href = "./reservation";
      } else {
        alert("예약 실패");
        $("#reservationModal").modal("hide");
      }
    });
  }
}

