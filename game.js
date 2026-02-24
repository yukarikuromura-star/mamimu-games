document.addEventListener("DOMContentLoaded", () => {
  const TIME_LIMIT = 60;

  const QUESTIONS = [
    { text: "いらっしゃいませ", romaji: "irasshaimase" },
    { text: "ご注文をどうぞ", romaji: "gochuumonwodouzo" },
    { text: "お待たせしました", romaji: "omataseshimashita" },
    { text: "ありがとうございました", romaji: "arigatougozaimashita" },
    { text: "タイピングゲーム", romaji: "taipingugeemu" },
    { text: "レスポンシブデザイン", romaji: "resuponsibudizain" },
    { text: "またお越しください", romaji: "mataokoshikudasai" }
  ];

  // 要素
  const promptText = document.getElementById("promptText");
  const typeBox = document.getElementById("typeBox");
  const startBtn = document.getElementById("startBtn");
  const retryBtn = document.getElementById("retryBtn");
  const timeLeftEl = document.getElementById("timeLeft");
  const missEl = document.getElementById("missCount");
  const typedEl = document.getElementById("typedCount");
  const resultBox = document.getElementById("resultBox");

  // どれか無ければ即わかるように
  const required = { promptText, typeBox, startBtn, retryBtn, timeLeftEl, missEl, typedEl, resultBox };
  for (const [k, v] of Object.entries(required)) {
    if (!v) {
      alert(`HTMLに必要な要素が見つかりません: ${k}\ngame.htmlのIDを確認してください`);
      return;
    }
  }

  let timeLeft = TIME_LIMIT;
  let timer = null;
  let current = null;

  let miss = 0;
  let typed = 0;
  let correct = 0;

  function pickQuestion() {
    current = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    promptText.textContent = current.text;
    typeBox.value = "";
  }

  function resetUI() {
    timeLeftEl.textContent = timeLeft;
    missEl.textContent = miss;
    typedEl.textContent = typed;
    resultBox.style.display = "none";
    resultBox.innerHTML = "";
  }

  function startGame() {
    clearInterval(timer);

    timeLeft = TIME_LIMIT;
    miss = 0;
    typed = 0;
    correct = 0;

    resetUI();
    pickQuestion();

    typeBox.disabled = false;
    typeBox.focus();

    startBtn.disabled = true;
    retryBtn.disabled = false;

    timer = setInterval(() => {
      timeLeft--;
      timeLeftEl.textContent = timeLeft;
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  function endGame() {
    clearInterval(timer);
    typeBox.disabled = true;
    startBtn.disabled = false;

    const accuracy = typed === 0 ? 0 : Math.round(((typed - miss) / typed) * 100);

    resultBox.innerHTML = `
      <div style="font-size:18px;font-weight:700;margin-bottom:6px;">結果</div>
      <div>正解数：${correct}</div>
      <div>総タイプ数：${typed}</div>
      <div>ミス数：${miss}</div>
      <div>正確性：${accuracy}%</div>
      <div>CPM：${typed}</div>
    `;
    resultBox.style.display = "block";
    promptText.textContent = "おつかれ！リトライで再挑戦できるよ";
  }

  // 入力判定
  typeBox.addEventListener("input", () => {
    if (!current) return;

    const input = typeBox.value;

    typed++;
    typedEl.textContent = typed;

    if (!current.romaji.startsWith(input)) {
      miss++;
      missEl.textContent = miss;
      typeBox.value = "";
      return;
    }

    if (input === current.romaji) {
      correct++;
      pickQuestion();
    }
  });

  startBtn.addEventListener("click", startGame);
  retryBtn.addEventListener("click", startGame);

  // 初期表示
  promptText.textContent = "スタートを押してね";
});
