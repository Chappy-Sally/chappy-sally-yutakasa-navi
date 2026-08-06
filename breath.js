"use strict";

/* ========================================
   深呼吸画像の場所
======================================== */

const breathImageBase =
  "https://raw.githubusercontent.com/Chappy-Sally/chappy-sally-images/main/covers/";


/* ========================================
   深呼吸の流れ
======================================== */

const breathSteps = [
  {
    image: "CS_shinkokyu_suu.png",
    message: "ゆっくり\nすぅ〜〜🌿",
    progress: "1回目・吸って",
    duration: 4000,
    motion: "inhale"
  },
  {
    image: "CS_shinkokyu_haku.png",
    message: "力をぬいて\nはぁ〜〜🌈",
    progress: "1回目・吐いて",
    duration: 6000,
    motion: "exhale"
  },
  {
    image: "CS_shinkokyu_suu.png",
    message: "もう一度\nゆっくり すぅ〜〜🌿",
    progress: "2回目・吸って",
    duration: 4000,
    motion: "inhale"
  },
  {
    image: "CS_shinkokyu_haku.png",
    message: "ゆっくり\nはぁ〜〜🌈",
    progress: "2回目・吐いて",
    duration: 6000,
    motion: "exhale"
  },
  {
    image: "CS_shinkokyu_cs.png",
    message:
      "うふふっ🤭✨\n\n" +
      "今日も大丈夫🌈\n\n" +
      "ゆっくり深呼吸\n" +
      "できたね😊💕",
    progress: "しあわせ深呼吸できました🌿",
    duration: 0,
    motion: ""
  }
];


/* ========================================
   深呼吸の状態
======================================== */

let currentBreathStep = 0;
let breathTimeoutId = null;
let imageChangeTimeoutId = null;


/* ========================================
   ページ読み込み後
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  setupBreathButtons();
  resetBreathingDisplay();
});


/* ========================================
   ボタン設定
======================================== */

function setupBreathButtons() {
  const startBtn = document.getElementById("startBtn");
  const againBtn = document.getElementById("againBtn");

  if (startBtn) {
    startBtn.addEventListener("click", startBreathing);
  }

  if (againBtn) {
    againBtn.addEventListener("click", startBreathing);
  }
}


/* ========================================
   深呼吸スタート
======================================== */

function startBreathing() {
  clearBreathTimers();

  currentBreathStep = 0;

  const startBtn = document.getElementById("startBtn");
  const againBtn = document.getElementById("againBtn");
  const sparkles = document.getElementById("sparkles");

  if (startBtn) {
    startBtn.classList.add("hidden");
  }

  if (againBtn) {
    againBtn.classList.add("hidden");
  }

  if (sparkles) {
    sparkles.classList.add("hidden");
  }

  showBreathStep();
}


/* ========================================
   各ステップ表示
======================================== */

function showBreathStep() {
  const step = breathSteps[currentBreathStep];

  if (!step) {
    return;
  }

  const breathMessage =
    document.getElementById("breathMessage");

  const progressText =
    document.getElementById("progressText");

  const againBtn =
    document.getElementById("againBtn");

  const sparkles =
    document.getElementById("sparkles");

  changeBreathImage(step.image, step.motion);

  if (breathMessage) {
    breathMessage.textContent = step.message;
  }

  if (progressText) {
    progressText.textContent = step.progress;
  }

  const isLastStep =
    currentBreathStep === breathSteps.length - 1;

  if (isLastStep) {
    if (sparkles) {
      sparkles.classList.remove("hidden");
    }

    if (againBtn) {
      againBtn.classList.remove("hidden");
    }

    breathTimeoutId = null;
    return;
  }

  breathTimeoutId = window.setTimeout(() => {
    currentBreathStep++;
    showBreathStep();
  }, step.duration);
}


/* ========================================
   深呼吸画像の切り替え
======================================== */

function changeBreathImage(fileName, motion) {
  const breathImg = document.getElementById("breathImg");

  if (!breathImg) {
    return;
  }

  if (imageChangeTimeoutId !== null) {
    clearTimeout(imageChangeTimeoutId);
    imageChangeTimeoutId = null;
  }

  breathImg.classList.add("fade");

  imageChangeTimeoutId = window.setTimeout(() => {
    breathImg.src = breathImageBase + fileName;

    breathImg.classList.remove(
      "inhale",
      "exhale"
    );

    /*
      同じ画像が続いても、
      アニメーションを最初から動かすための再描画
    */
    void breathImg.offsetWidth;

    if (motion) {
      breathImg.classList.add(motion);
    }

    breathImg.classList.remove("fade");

    imageChangeTimeoutId = null;
  }, 350);
}


/* ========================================
   深呼吸を止める
======================================== */

function stopBreathing(resetDisplay = true) {
  clearBreathTimers();

  if (resetDisplay) {
    resetBreathingDisplay();
  }
}


/* ========================================
   タイマーを止める
======================================== */

function clearBreathTimers() {
  if (breathTimeoutId !== null) {
    clearTimeout(breathTimeoutId);
    breathTimeoutId = null;
  }

  if (imageChangeTimeoutId !== null) {
    clearTimeout(imageChangeTimeoutId);
    imageChangeTimeoutId = null;
  }
}


/* ========================================
   初期表示へ戻す
======================================== */

function resetBreathingDisplay() {
  clearBreathTimers();

  currentBreathStep = 0;

  const breathImg =
    document.getElementById("breathImg");

  const breathMessage =
    document.getElementById("breathMessage");

  const progressText =
    document.getElementById("progressText");

  const startBtn =
    document.getElementById("startBtn");

  const againBtn =
    document.getElementById("againBtn");

  const sparkles =
    document.getElementById("sparkles");

  if (breathImg) {
    breathImg.src =
      breathImageBase + "CS_shinkokyu.png";

    breathImg.classList.remove(
      "fade",
      "inhale",
      "exhale"
    );
  }

  if (breathMessage) {
    breathMessage.textContent =
      "うまくできなくても大丈夫😊\n\n" +
      "チャッピーとサリーと一緒に\n" +
      "ゆっくり深呼吸してみよう🌿";
  }

  if (progressText) {
    progressText.textContent = "";
  }

  if (startBtn) {
    startBtn.classList.remove("hidden");
  }

  if (againBtn) {
    againBtn.classList.add("hidden");
  }

  if (sparkles) {
    sparkles.classList.add("hidden");
  }
}


/* ========================================
   他のJavaScriptから使えるようにする
======================================== */

window.startBreathing = startBreathing;
window.stopBreathing = stopBreathing;
window.resetBreathingDisplay =
  resetBreathingDisplay;
