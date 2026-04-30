document.getElementById('generate-btn').addEventListener('click', () => {
  const fixedInput = document.getElementById('fixed-input').value;
  const fixedNumbers = parseFixedNumbers(fixedInput);
  
  if (fixedNumbers === null) {
    alert('고정 숫자는 1~45 사이의 숫자여야 하며, 중복될 수 없습니다.');
    return;
  }
  
  if (fixedNumbers.length > 6) {
    alert('고정 숫자는 최대 6개까지만 입력 가능합니다.');
    return;
  }

  const numbers = generateLottoNumbers(fixedNumbers);
  displayNumbers(numbers);
});

function parseFixedNumbers(input) {
  if (!input.trim()) return [];
  
  const parts = input.split(',').map(s => s.trim()).filter(s => s !== '');
  const nums = [];
  
  for (const p of parts) {
    const n = parseInt(p);
    if (isNaN(n) || n < 1 || n > 45 || nums.includes(n)) {
      return null;
    }
    nums.push(n);
  }
  return nums;
}

function generateLottoNumbers(fixedNumbers = []) {
  const numbers = [...fixedNumbers];
  while (numbers.length < 6) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers.sort((a, b) => a - b);
}

function displayNumbers(numbers) {
  const container = document.getElementById('lotto-numbers');
  container.innerHTML = '';

  numbers.forEach(num => {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.textContent = num;
    
    // 색상 클래스 지정
    if (num <= 10) ball.classList.add('range-1');
    else if (num <= 20) ball.classList.add('range-11');
    else if (num <= 30) ball.classList.add('range-21');
    else if (num <= 40) ball.classList.add('range-31');
    else ball.classList.add('range-41');

    container.appendChild(ball);
  });
}
