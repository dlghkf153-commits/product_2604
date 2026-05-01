const gameCount = document.querySelector("#gameCount");
const fixedNumbersInput = document.querySelector("#fixedNumbers");
const drawButton = document.querySelector("#drawButton");
const copyButton = document.querySelector("#copyButton");
const results = document.querySelector("#results");
const toast = document.querySelector("#toast");

let currentGames = [];

function getBallClass(number) {
  if (number <= 10) return "yellow";
  if (number <= 20) return "blue";
  if (number <= 30) return "red";
  if (number <= 40) return "gray";
  return "green";
}

function parseFixedNumbers() {
  const fixedNumbers = fixedNumbersInput.value
    .split(/[\s,]+/)
    .map((value) => value.trim())
    .filter(Boolean)
    .map(Number);

  if (fixedNumbers.some((number) => !Number.isInteger(number) || number < 1 || number > 45)) {
    return { error: "고정번호는 1부터 45까지의 숫자만 입력할 수 있습니다." };
  }

  if (new Set(fixedNumbers).size !== fixedNumbers.length) {
    return { error: "고정번호에 중복된 숫자가 있습니다." };
  }

  if (fixedNumbers.length > 6) {
    return { error: "고정번호는 최대 6개까지만 입력할 수 있습니다." };
  }

  return { fixedNumbers };
}

function drawOneGame(fixedNumbers) {
  const numbers = Array.from({ length: 45 }, (_, index) => index + 1)
    .filter((number) => !fixedNumbers.includes(number));

  for (let i = numbers.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[randomIndex]] = [numbers[randomIndex], numbers[i]];
  }

  const missingCount = 6 - fixedNumbers.length;
  const mainNumbers = [...fixedNumbers, ...numbers.slice(0, missingCount)].sort((a, b) => a - b);
  const bonus = numbers[missingCount];

  return { mainNumbers, bonus, fixedNumbers };
}

function renderGames(games) {
  results.innerHTML = games.map((game, index) => {
    const mainBalls = game.mainNumbers.map((number) => (
      `<span class="ball ${getBallClass(number)}${game.fixedNumbers.includes(number) ? " fixed" : ""}" aria-label="${number}번" style="animation: bounceIn ${0.1 * game.mainNumbers.indexOf(number)}s ease;">${number}</span>`
    )).join("");

    return `
      <article class="game" style="animation: fadeInUp ${0.2 * index}s ease forwards;">
        <div class="game-title">${index + 1}게임</div>
        <div class="balls">
          ${mainBalls}
          <span class="plus" aria-hidden="true">+</span>
          <span class="ball ${getBallClass(game.bonus)}" aria-label="보너스 ${game.bonus}번" style="animation: bounceIn 0.7s ease;">${game.bonus}</span>
        </div>
      </article>
    `;
  }).join("");
}

function drawGames() {
  const parsed = parseFixedNumbers();

  if (parsed.error) {
    showToast(parsed.error, "error");
    fixedNumbersInput.focus();
    return;
  }

  // 로딩 효과 체감 유도
  results.innerHTML = '<div class="empty">운명의 숫자를 조합하고 있습니다...</div>';
  drawButton.disabled = true;

  setTimeout(() => {
    const count = Number(gameCount.value);
    currentGames = Array.from({ length: count }, () => drawOneGame(parsed.fixedNumbers));
    renderGames(currentGames);
    
    const message = parsed.fixedNumbers.length
      ? `${parsed.fixedNumbers.join(", ")}번의 기운을 담아 ${count}게임을 추출했습니다.`
      : `행운의 ${count}게임을 성공적으로 추출했습니다. 이번엔 꼭 대박 나십시오!`;
    
    showToast(message, "success");
    drawButton.disabled = false;
  }, 400);
}

function showToast(message, type) {
  toast.textContent = message;
  toast.style.color = type === "error" ? "#e74c3c" : "#1f7a64";
  
  // 3초 후 메시지 초기화
  setTimeout(() => {
    if (toast.textContent === message) toast.textContent = "";
  }, 3000);
}

async function copyResults() {
  if (!currentGames.length) {
    showToast("먼저 행운의 번호를 뽑아주십시오.", "error");
    return;
  }

  const text = currentGames.map((game, index) => (
    `${index + 1}게임: ${game.mainNumbers.join(", ")} + 보너스 ${game.bonus}`
  )).join("\n");

  try {
    await navigator.clipboard.writeText(text);
    showToast("행운의 번호가 복사되었습니다. 명당으로 가십시오!", "success");
  } catch {
    showToast("복사 권한이 없습니다. 화면의 번호를 직접 적어주십시오.", "error");
  }
}

drawButton.addEventListener("click", drawGames);
copyButton.addEventListener("click", copyResults);
