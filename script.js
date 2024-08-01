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