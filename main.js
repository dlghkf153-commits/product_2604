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
      `<span class="ball ${getBallClass(number)}${game.fixedNumbers.includes(number) ? " fixed" : ""}" aria-label="${number}번">${number}</span>`
    )).join("");

    return `
      <article class="game">
        <div class="game-title">${index + 1}게임</div>
        <div class="balls">
          ${mainBalls}
          <span class="plus" aria-hidden="true">+</span>
          <span class="ball ${getBallClass(game.bonus)}" aria-label="보너스 ${game.bonus}번">${game.bonus}</span>
        </div>
      </article>
    `;
  }).join("");
}

function drawGames() {
  const parsed = parseFixedNumbers();

  if (parsed.error) {
    toast.textContent = parsed.error;
    fixedNumbersInput.focus();
    return;
  }

  const count = Number(gameCount.value);
  currentGames = Array.from({ length: count }, () => drawOneGame(parsed.fixedNumbers));
  renderGames(currentGames);
  toast.textContent = parsed.fixedNumbers.length
    ? `${parsed.fixedNumbers.join(", ")}번을 고정해서 ${count}게임을 추첨했습니다.`
    : `${count}게임을 추첨했습니다.`;
}

async function copyResults() {
  if (!currentGames.length) {
    toast.textContent = "먼저 번호를 추첨해주세요.";
    return;
  }

  const text = currentGames.map((game, index) => (
    `${index + 1}게임: ${game.mainNumbers.join(", ")} + 보너스 ${game.bonus}`
  )).join("\n");

  try {
    await navigator.clipboard.writeText(text);
    toast.textContent = "추첨 결과를 복사했습니다.";
  } catch {
    toast.textContent = "복사 권한이 없어 화면의 결과를 직접 선택해주세요.";
  }
}

drawButton.addEventListener("click", drawGames);
copyButton.addEventListener("click", copyResults);
