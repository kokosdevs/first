const cursor = document.getElementById('custom-cursor');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let cursorX = mouseX, cursorY = mouseY;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.18;
  cursorY += (mouseY - cursorY) * 0.18;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a, button, .logo').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('active'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});
const logo = document.getElementById('logo')
const card = document.getElementById('card')
logo.addEventListener('click', (e) => {
  e.stopPropagation();
  card.classList.toggle('show-card')
})
document.addEventListener('click', e => {
  if (!logo.contains(e.target) && !card.contains(e.target)) {
    card.classList.remove('show-card')
  }
})
const themeSwitch = document.getElementById('theme-switch');
function setTheme(dark) {
  if (dark) {
    document.body.classList.add('dark');
    themeSwitch.checked = true;
  } else {
    document.body.classList.remove('dark');
    themeSwitch.checked = false;
  }
}
let dark = localStorage.getItem('theme') === 'dark';
setTheme(dark);
themeSwitch.addEventListener('change', () => {
  dark = themeSwitch.checked;
  setTheme(dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
});
  const gamesLink = document.getElementById('games-link');
  const mainContent = document.getElementById('main-content');
  const gamesPage = document.getElementById('games-page');
  const backBtn = document.getElementById('back-btn');
  gamesLink.addEventListener('click', e => {
    e.preventDefault();
    mainContent.style.display = 'none';
    gamesPage.style.display = '';
    showArtPreview();
  });
  backBtn.addEventListener('click', () => {
    gamesPage.style.display = 'none';
    mainContent.style.display = '';
  });
  const openDrawModal = document.getElementById('open-draw-modal');
  const drawModal = document.getElementById('draw-modal');
  const closeDrawModal = document.getElementById('close-draw-modal');
  const drawCanvas = document.getElementById('draw-canvas');
  const ctx = drawCanvas.getContext('2d');
  let drawing = false, lastX = 0, lastY = 0;
  const drawColor = document.getElementById('draw-color');
  const drawWidth = document.getElementById('draw-width');
  function startDraw(e) {
    drawing = true;
    [lastX, lastY] = getXY(e);
  }
  function endDraw() { drawing = false; ctx.beginPath(); }
  function draw(e) {
    if (!drawing) return;
    const [x, y] = getXY(e);
    ctx.strokeStyle = drawColor.value;
    ctx.lineWidth = drawWidth.value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
  }
  function getXY(e) {
    if (e.touches) {
      const rect = drawCanvas.getBoundingClientRect();
      return [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
    } else {
      const rect = drawCanvas.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    }
  }
  drawCanvas.addEventListener('mousedown', startDraw);
  drawCanvas.addEventListener('touchstart', startDraw);
  drawCanvas.addEventListener('mousemove', draw);
  drawCanvas.addEventListener('touchmove', draw);
  drawCanvas.addEventListener('mouseup', endDraw);
  drawCanvas.addEventListener('mouseleave', endDraw);
  drawCanvas.addEventListener('touchend', endDraw);
  const defaultCursorBg = cursor.style.background;
  const defaultCursorBoxShadow = cursor.style.boxShadow;
  const defaultCursorAnimation = cursor.style.animation;
  function setCursorToBrushColor() {
    cursor.style.transition = 'background 0.3s, box-shadow 0.3s, animation 0.3s';
    cursor.style.background = drawColor.value;
    cursor.style.boxShadow = `0 0 40px 16px ${drawColor.value}, 0 0 0 8px ${drawColor.value}99`;
    cursor.style.animation = 'none';
  }
  function resetCursorColor() {
    cursor.style.background = '';
    cursor.style.boxShadow = '';
    cursor.style.animation = '';
  }
  openDrawModal.addEventListener('click', () => {
    drawModal.style.display = 'flex';
    setTimeout(() => { drawModal.querySelector('.modal-content').focus(); }, 10);
    setCursorToBrushColor();
  });
  closeDrawModal.addEventListener('click', () => {
    drawModal.style.display = 'none';
    resetCursorColor();
  });
  drawColor.addEventListener('input', setCursorToBrushColor);
  document.getElementById('clear-canvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  });
  document.getElementById('save-canvas').addEventListener('click', () => {
    const data = drawCanvas.toDataURL('image/png');
    localStorage.setItem('lastArt', data);
    showArtPreview();
    drawModal.style.display = 'none';
  });
  document.getElementById('download-canvas').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'my-art.png';
    link.href = drawCanvas.toDataURL('image/png');
    link.click();
  });
  function showArtPreview() {
    const data = localStorage.getItem('lastArt');
    const img = document.getElementById('art-preview');
    if (data) {
      img.src = data;
      img.style.display = '';
    } else {
      img.style.display = 'none';
    }
  }
  showArtPreview();
  const snakeModal = document.getElementById('snake-modal');
  const openSnakeModal = document.getElementById('open-snake-modal');
  const closeSnakeModal = document.getElementById('close-snake-modal');
  const snakeCanvas = document.getElementById('snake-canvas');
  const snakeCtx = snakeCanvas.getContext('2d');
  const snakeScoreEl = document.getElementById('snake-score');
  const snakeBestValue = document.getElementById('snake-best-value');
  const snakeRestart = document.getElementById('snake-restart');
  const snakeLeaderboard = document.getElementById('snake-leaderboard');
  let snake, snakeDir, snakeNextDir, snakeFood, snakeScore, snakeBest, snakeInterval, snakeGameOver, snakeSpeed, snakeMoveTimer;
  const SNAKE_SIZE = 20;
  const SNAKE_CELLS = 16;
  const SNAKE_INIT = [ {x:8, y:8}, {x:7, y:8}, {x:6, y:8} ];
  const SNAKE_SPEED_START = 120;
  const SNAKE_SPEED_MIN = 60;
  const SNAKE_SPEED_STEP = 2;
  function resetSnake() {
    snake = JSON.parse(JSON.stringify(SNAKE_INIT));
    snakeDir = 'right';
    snakeNextDir = 'right';
    snakeFood = placeFood();
    snakeScore = 0;
    snakeGameOver = false;
    snakeSpeed = SNAKE_SPEED_START;
    updateSnakeScore();
  }
  function placeFood() {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random()*SNAKE_CELLS),
        y: Math.floor(Math.random()*SNAKE_CELLS)
      };
    } while (snake.some(s => s.x===pos.x && s.y===pos.y));
    return pos;
  }
  function drawSnake() {
    snakeCtx.clearRect(0,0,snakeCanvas.width,snakeCanvas.height);
    snakeCtx.save();
    snakeCtx.globalAlpha = 0.9;
    snakeCtx.beginPath();
    snakeCtx.arc((snakeFood.x+0.5)*SNAKE_SIZE, (snakeFood.y+0.5)*SNAKE_SIZE, SNAKE_SIZE/2-2, 0, 2*Math.PI);
    snakeCtx.fillStyle = '#ff3b3f';
    snakeCtx.shadowColor = '#ff3b3f';
    snakeCtx.shadowBlur = 12;
    snakeCtx.fill();
    snakeCtx.restore();
    snake.forEach((s,i) => {
      snakeCtx.beginPath();
      snakeCtx.arc((s.x+0.5)*SNAKE_SIZE, (s.y+0.5)*SNAKE_SIZE, SNAKE_SIZE/2-2, 0, 2*Math.PI);
      snakeCtx.fillStyle = i===0 ? '#00c2cb' : '#007a87';
      snakeCtx.shadowColor = i===0 ? '#00eaff' : 'transparent';
      snakeCtx.shadowBlur = i===0 ? 10 : 0;
      snakeCtx.fill();
    });
  }
  function updateSnakeScore() {
    snakeScoreEl.textContent = `Очки: ${snakeScore}`;
    snakeBest = getSnakeBest();
    snakeBestValue.textContent = snakeBest;
  }
  function getSnakeBest() {
    const lb = JSON.parse(localStorage.getItem('snakeLeaderboard')||'[]');
    return lb.length ? lb[0].score : 0;
  }
  function showSnakeLeaderboard() {
    const lb = JSON.parse(localStorage.getItem('snakeLeaderboard')||'[]');
    let html = '<div class="leaderboard-title">Топ-5 🏆</div><ul class="leaderboard-list">';
    lb.slice(0,5).forEach((r,i)=>{
      const place = i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1)+'.';
      html += `<li><span class="place">${place}</span> <span>${r.name}</span> <span class="score">${r.score}</span></li>`;
    });
    html += '</ul>';
    snakeLeaderboard.innerHTML = html;
  }
  function snakeStep() {
    if (snakeGameOver) return;
    let head = {...snake[0]};
    if (snakeNextDir==='up' && snakeDir!=='down') snakeDir='up';
    if (snakeNextDir==='down' && snakeDir!=='up') snakeDir='down';
    if (snakeNextDir==='left' && snakeDir!=='right') snakeDir='left';
    if (snakeNextDir==='right' && snakeDir!=='left') snakeDir='right';
    if (snakeDir==='up') head.y--;
    if (snakeDir==='down') head.y++;
    if (snakeDir==='left') head.x--;
    if (snakeDir==='right') head.x++;
    if (head.x<0||head.x>=SNAKE_CELLS||head.y<0||head.y>=SNAKE_CELLS) return snakeGameOverFn();
    if (snake.some(s=>s.x===head.x&&s.y===head.y)) return snakeGameOverFn();
    snake.unshift(head);
    if (head.x===snakeFood.x&&head.y===snakeFood.y) {
      snakeScore+=10;
      snakeSpeed = Math.max(SNAKE_SPEED_MIN, snakeSpeed-SNAKE_SPEED_STEP);
      snakeFood = placeFood();
    } else {
      snake.pop();
    }
    updateSnakeScore();
    drawSnake();
    snakeMoveTimer = setTimeout(snakeStep, snakeSpeed);
  }
  function snakeGameOverFn() {
    snakeGameOver = true;
    drawSnake();
    document.getElementById('snake-final-score').textContent = snakeScore;
    const lb = JSON.parse(localStorage.getItem('snakeLeaderboard')||'[]');
    const isRecord = (!lb.length || snakeScore > lb[lb.length-1].score || lb.length<5);
    document.getElementById('snake-new-record-block').style.display = isRecord ? '' : 'none';
    document.getElementById('snake-gameover-modal').style.display = 'flex';
    if (isRecord) {
      setTimeout(()=>{
        document.getElementById('snake-modal-nickname').focus();
      }, 200);
    }
  }
  function saveSnakeRecord() {
    const name = document.getElementById('snake-nickname-input').value.trim()||'Гравець';
    let lb = JSON.parse(localStorage.getItem('snakeLeaderboard')||'[]');
    lb.push({name,score:snakeScore});
    lb = lb.sort((a,b)=>b.score-a.score).slice(0,5);
    localStorage.setItem('snakeLeaderboard',JSON.stringify(lb));
    document.getElementById('snake-nickname-modal').style.display='none';
    showSnakeLeaderboard();
  }
  document.getElementById('snake-nickname-save').onclick = saveSnakeRecord;
  document.getElementById('snake-nickname-input').onkeydown = e => { if(e.key==='Enter') saveSnakeRecord(); };
  let snakeIsActive = false;
  openSnakeModal.onclick = () => {
    snakeModal.style.display = 'flex';
    document.getElementById('snake-gameover-modal').style.display = 'none';
    resetSnake();
    drawSnake();
    showSnakeLeaderboard();
    clearTimeout(snakeMoveTimer);
    snakeMoveTimer = setTimeout(snakeStep, snakeSpeed);
    snakeIsActive = true;
  };
  closeSnakeModal.onclick = () => {
    snakeModal.style.display = 'none';
    document.getElementById('snake-gameover-modal').style.display = 'none';
    clearTimeout(snakeMoveTimer);
    snakeIsActive = false;
  };
  snakeRestart.onclick = () => {
    clearTimeout(snakeMoveTimer);
    document.getElementById('snake-gameover-modal').style.display = 'none';
    resetSnake();
    drawSnake();
    showSnakeLeaderboard();
    clearTimeout(snakeMoveTimer);
    snakeMoveTimer = setTimeout(snakeStep, snakeSpeed);
    snakeIsActive = true;
  };
  document.getElementById('snake-modal-restart').onclick = () => {
    document.getElementById('snake-gameover-modal').style.display = 'none';
    resetSnake();
    drawSnake();
    showSnakeLeaderboard();
    clearTimeout(snakeMoveTimer);
    snakeMoveTimer = setTimeout(snakeStep, snakeSpeed);
    snakeIsActive = true;
  };
  document.getElementById('snake-modal-save').onclick = () => {
    const name = document.getElementById('snake-modal-nickname').value.trim()||'Гравець';
    let lb = JSON.parse(localStorage.getItem('snakeLeaderboard')||'[]');
    lb.push({name,score:snakeScore});
    lb = lb.sort((a,b)=>b.score-a.score).slice(0,5);
    localStorage.setItem('snakeLeaderboard',JSON.stringify(lb));
    document.getElementById('snake-gameover-modal').style.display = 'none';
    showSnakeLeaderboard();
    resetSnake();
    drawSnake();
    clearTimeout(snakeMoveTimer);
    snakeMoveTimer = setTimeout(snakeStep, snakeSpeed);
    snakeIsActive = true;
  };
  document.getElementById('snake-modal-nickname').onkeydown = e => { if(e.key==='Enter') document.getElementById('snake-modal-save').click(); };
  document.addEventListener('keydown', e => {
    if (!snakeIsActive) return;
    if (['ArrowUp','w','W'].includes(e.key)) snakeNextDir='up';
    if (['ArrowDown','s','S'].includes(e.key)) snakeNextDir='down';
    if (['ArrowLeft','a','A'].includes(e.key)) snakeNextDir='left';
    if (['ArrowRight','d','D'].includes(e.key)) snakeNextDir='right';
  }); 