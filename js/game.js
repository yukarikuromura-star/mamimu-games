// ===== 設定 =====
const TIME_LIMIT = 60;

// 出題（日本語表示　＋　正解ローマ字）
const QUESTIONS = [
   { text: "いらっしゃいませ", romaji: "irasshaimase" },
   { text: "ご注文をどうぞ", romaji: "gochuumonwodouzo" },
   { text: "お待たせしました", romaji: "omataseshimashita" },
   { text: "ありがとうございました", romaji: "arigatougozaimashita" },
   { text: "本日は晴天なり", romaji: "honjitsuseitennari" },
   { text: "タイピングゲーム", romaji: "taipingugeemu" },
   { text: "レスポンシブデザイン", romaji: "resuponsibudizain" },
   { text: "コーヒーをください", romaji: "koohiiwokudasai" },
   { text: "またお越しください", romaji: "mataokoshikudasai" },
   { text: "楽しい一日を", romaji: "tanoshiiichinichio" }
 ];

 // ===== 要素取得 =====
const promptText = document.getElementById("promptText");
const typeBox = document.getElementById("typeBox");
const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");

const timeLeftEl = document.getElementById("timeLeft");
const missEl = document.getElementById("missCount");
const typedEl = document.getElementById("typedCount");
const resultBox = document.getElementById("resultBox");

// ===== 状態 =====
let timeLeft = TIME_LIMIT;
let timer = null;
let current = null;
let questionIndex = 0;
let miss = 0;
let typed = 0;
let correct = 0;

// ===== 初期化 =====
startBtn.disabled = false;
retryBtn.disabled = true;

// ===== 出題 =====
function nextQuestion() {
  current = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  promptText.textContent = current.text;
  typeBox.value = "";
}

// ===== スタート =====
function startGame() {
  timeLeft = TIME_LIMIT;
  miss = 0;
  typed = 0;
  correct = 0;

  timeLeftEl.textContent = timeLeft;
  missEl.textContent = miss;
  typedEl.textContent = typed;

  resultBox.style.display = "none";

  typeBox.disabled = false;
  typeBox.focus();

  startBtn.disabled = true;
  retryBtn.disabled = false;

  nextQuestion();

  timer = setInterval(() => {
    timeLeft--;
    timeLeftEl.textContent = timeLeft;

    if (timeLeft <= 0) endGame();
  }, 1000);
}

// ===== 終了 =====
function endGame() {
  clearInterval(timer);
  typeBox.disabled = true;

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

  startBtn.disabled = false;
}

// ===== 入力判定 =====
typeBox.addEventListener("input", () => {
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
    nextQuestion();
  }
});

// ===== ボタン =====
startBtn.addEventListener("click", startGame);
retryBtn.addEventListener("click", startGame);
