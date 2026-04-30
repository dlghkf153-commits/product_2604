document.getElementById('generate-btn').addEventListener('click', () => {
  const numbers = generateLottoNumbers();
  displayNumbers(numbers);
});

function generateLottoNumbers() {
  const numbers = [];
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
