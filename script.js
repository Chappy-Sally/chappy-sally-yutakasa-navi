"use strict";

/* ========================================
   基本設定
======================================== */

const STORAGE_KEY = "chappySallyYutakasaNaviData";

const imageBase =
  "https://raw.githubusercontent.com/Chappy-Sally/chappy-sally-images/main/covers/";


/* ========================================
   朝のメッセージ
======================================== */

const morningMessages = [
  {
    main:
      "おはよ〜😊\n今日も、もうある豊かさを見つけにいこう🌈",
    sub:
      "小さな「うれしい」「ありがたい」「助かった」も、ちゃんと豊かさだよ🤭"
  },
  {
    main:
      "おはよ〜☀️\n今日も大丈夫から始めよう😊",
    sub:
      "まだ何も起きていない朝にも、安心して目覚められた豊かさがあるよ🌿"
  },
  {
    main:
      "おはよ〜🌼\n今日のしあわせの種を見つけよう",
    sub:
      "お茶がおいしい、空がきれい、少し笑えた。それも立派な豊かさだよ🤭"
  },
  {
    main:
      "おはよ〜😊\n足りないものより、今あるものをひとつ見てみよう",
    sub:
      "見つけた豊かさは、小さくてもちゃんと心の中で育っていくよ🌱"
  },
  {
    main:
      "おはよ〜🌈\n今日も豊かさを受け取る準備はできて増〜す🤭",
    sub:
      "誰かのやさしさも、ひらめきも、ゆっくりできる時間も、全部受け取っていいよ✨"
  },
  {
    main:
      "おはよ〜☀️\n今日の私は、今日の私で花まる😊",
    sub:
      "たくさんできなくても大丈夫。今日ここにいることから、豊かさは始まってるよ🌿"
  },
  {
    main:
      "おはよ〜💛\n豊かさは、お金だけじゃないよ",
    sub:
      "安心、時間、ご縁、笑顔、健康、便利さ。今日もいろんな姿で届いているかも🤭"
  },
  {
    main:
      "おはよ〜🌱\n今日も焦らず、ひとつずつ",
    sub:
      "奇跡は待つものじゃない。安心して育てた種が、奇跡になっていくよ😊"
  }
];

let morningMessageIndex = 0;


/* ========================================
   深呼吸
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
      "うふふっ🤭✨\n\n今日も大丈夫🌈\n\nゆっくり深呼吸\nできたね😊💕",
    progress: "しあわせ深呼吸できました🌿",
    duration: 0,
    motion: ""
  }
];

let currentBreathStep = 0;
let breathTimeoutId = null;


/* ========================================
   保存する入力項目
======================================== */

const savedFieldIds = [
  "arutakasa1",
  "arutakasa2",
  "arutakasa3",
  "goodThing",
  "sonzaikyu",

  "nowAnxiety",
  "nowSafety",

  "beforeShift",
  "afterShift",
  "shiftNotice",

  "roleTarget",
  "roleSet",
  "roleWant",
  "roleFear",
  "roleCare",

  "moneyAmount",
  "moneyReceived",
  "moneyFeeling",
  "moneyAgain",

  "todayGrowth",
  "todayMeter"
];


/* ========================================
   ページ読み込み後
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  setTodayDate();
  setMorningMessage(0);
  setupScreenButtons();
  setupMorningButton();
  setupBreathing();
  setupMeter();
  setupStorageButtons();
  setupAutoSave();

  loadSavedData();
  showScreen("homeScreen", false);
});


/* ========================================
   画面切り替え
======================================== */

function setupScreenButtons() {
  const screenButtons = document.querySelectorAll("[data-screen]");

  screenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const screenId = button.dataset.screen;

      if (screenId) {
        showScreen(screenId);
      }
    });
  });
}


function showScreen(screenId, scrollToTop = true) {
  const screens = document.querySelectorAll(".screen");
  const targetScreen = document.getElementById(screenId);

  if (!targetScreen) {
    console.warn(`画面が見つかりません: ${screenId}`);
    return;
  }

  screens.forEach((screen) => {
    screen.classList.remove("active-screen");
  });

  targetScreen.classList.add("active-screen");

  if (screenId !== "breathScreen") {
    stopBreathing(false);
  }

  if (scrollToTop) {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}


/* ========================================
   日付
======================================== */

function setTodayDate() {
  const todayDate = document.getElementById("todayDate");

  if (!todayDate) {
    return;
  }

  const today = new Date();

  const formattedDate = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(today);

  todayDate.textContent = formattedDate;
}


/* ========================================
   朝のメッセージ
======================================== */

function setupMorningButton() {
  const changeMessageBtn =
    document.getElementById("changeMessageBtn");

  if (!changeMessageBtn) {
    return;
  }

  changeMessageBtn.addEventListener("click", () => {
    morningMessageIndex++;

    if (morningMessageIndex >= morningMessages.length) {
      morningMessageIndex = 0;
    }

    setMorningMessage(morningMessageIndex);
  });
}


function setMorningMessage(index) {
  const morningMessage =
    document.getElementById("morningMessage");

  const morningSubMessage =
    document.getElementById("morningSubMessage");

  const message = morningMessages[index];

  if (!message) {
    return;
  }

  if (morningMessage) {
    morningMessage.innerHTML =
      escapeHtml(message.main).replace(/\n/g, "<br>");
  }

  if (morningSubMessage) {
    morningSubMessage.textContent = message.sub;
  }
}


/* ========================================
   深呼吸
======================================== */

function setupBreathing() {
  const startBtn = document.getElementById("startBtn");
  const againBtn = document.getElementById("againBtn");

  if (startBtn) {
    startBtn.addEventListener("click", startBreathing);
  }

  if (againBtn) {
    againBtn.addEventListener("click", startBreathing);
  }
}


function startBreathing() {
  stopBreathing(false);

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


function showBreathStep() {
  const step = breathSteps[currentBreathStep];

  const breathMessage =
    document.getElementById("breathMessage");

  const progressText =
    document.getElementById("progressText");

  const againBtn =
    document.getElementById("againBtn");

  const sparkles =
    document.getElementById("sparkles");

  if (!step) {
    return;
  }

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


function changeBreathImage(fileName, motion) {
  const breathImg = document.getElementById("breathImg");

  if (!breathImg) {
    return;
  }

  breathImg.classList.add("fade");

  window.setTimeout(() => {
    breathImg.src = imageBase + fileName;

    breathImg.classList.remove("inhale", "exhale");

    /*
      同じ画像を続けて使う場合でも、
      動きを最初から始められるように一度再描画する
    */
    void breathImg.offsetWidth;

    if (motion) {
      breathImg.classList.add(motion);
    }

    breathImg.classList.remove("fade");
  }, 350);
}


function stopBreathing(resetDisplay = true) {
  if (breathTimeoutId !== null) {
    clearTimeout(breathTimeoutId);
    breathTimeoutId = null;
  }

  if (!resetDisplay) {
    return;
  }

  resetBreathingDisplay();
}


function resetBreathingDisplay() {
  const breathImg = document.getElementById("breathImg");
  const breathMessage = document.getElementById("breathMessage");
  const progressText = document.getElementById("progressText");
  const startBtn = document.getElementById("startBtn");
  const againBtn = document.getElementById("againBtn");
  const sparkles = document.getElementById("sparkles");

  if (breathImg) {
    breathImg.src = imageBase + "CS_shinkokyu.png";
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
   豊かさ度
======================================== */

function setupMeter() {
  const todayMeter = document.getElementById("todayMeter");

  if (!todayMeter) {
    return;
  }

  todayMeter.addEventListener("input", updateMeterText);

  updateMeterText();
}


function updateMeterText() {
  const todayMeter = document.getElementById("todayMeter");
  const meterText = document.getElementById("meterText");
  const closingMessage =
    document.getElementById("closingMessage");

  if (!todayMeter || !meterText) {
    return;
  }

  const meterValue = Number(todayMeter.value);

  meterText.textContent = `${meterValue} / 5`;

  if (!closingMessage) {
    return;
  }

  const closingMessages = {
    1:
      "今日は豊かさを感じにくい日だったんだね。そんな日も大丈夫だよ😊🌿",
    2:
      "小さな豊かさをひとつ見つけられたら、それで花まるだよ🌱",
    3:
      "今日もちゃんと、豊かさはあったね😊🌱",
    4:
      "今日はいろんな豊かさを受け取れたね🤭✨",
    5:
      "あ〜〜しあわせぇ🍀 今日も豊かさがいっぱいだったね🌈💕"
  };

  closingMessage.textContent =
    closingMessages[meterValue] ||
    "今日もちゃんと、豊かさはあったね😊🌱";
}


/* ========================================
   保存・コピー・リセット
======================================== */

function setupStorageButtons() {
  const saveBtn = document.getElementById("saveBtn");
  const copyBtn = document.getElementById("copyBtn");
  const resetBtn = document.getElementById("resetBtn");

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      saveData();
      showNotice("今日の豊かさを保存したよ😊🌱");
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", copySummary);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetAllData);
  }
}


function setupAutoSave() {
  savedFieldIds.forEach((fieldId) => {
    const field = document.getElementById(fieldId);

    if (!field) {
      return;
    }

    const eventName =
      field.tagName === "SELECT" ||
      field.type === "range"
        ? "change"
        : "input";

    field.addEventListener(eventName, () => {
      saveData(false);

      if (fieldId === "todayMeter") {
        updateMeterText();
      }
    });
  });
}


function collectData() {
  const data = {};

  savedFieldIds.forEach((fieldId) => {
    const field = document.getElementById(fieldId);

    if (field) {
      data[fieldId] = field.value;
    }
  });

  data.savedAt = new Date().toISOString();

  return data;
}


function saveData(showError = true) {
  try {
    const data = collectData();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );

    return true;
  } catch (error) {
    console.error("保存できませんでした:", error);

    if (showError) {
      showNotice(
        "保存できなかったみたい🥺 もう一度試してみてね。"
      );
    }

    return false;
  }
}


function loadSavedData() {
  try {
    const savedJson =
      localStorage.getItem(STORAGE_KEY);

    if (!savedJson) {
      return;
    }

    const savedData = JSON.parse(savedJson);

    savedFieldIds.forEach((fieldId) => {
      const field = document.getElementById(fieldId);

      if (
        field &&
        Object.prototype.hasOwnProperty.call(
          savedData,
          fieldId
        )
      ) {
        field.value = savedData[fieldId];
      }
    });

    updateMeterText();
  } catch (error) {
    console.error("保存データを読み込めませんでした:", error);
  }
}


async function copySummary() {
  const summaryText = createSummaryText();

  try {
    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(summaryText);
    } else {
      fallbackCopyText(summaryText);
    }

    showNotice(
      "今日の豊かさをコピーしたよ😊🌈"
    );
  } catch (error) {
    console.error("コピーできませんでした:", error);

    try {
      fallbackCopyText(summaryText);

      showNotice(
        "今日の豊かさをコピーしたよ😊🌈"
      );
    } catch (fallbackError) {
      console.error(
        "予備のコピーも失敗しました:",
        fallbackError
      );

      showNotice(
        "コピーできなかったみたい🥺"
      );
    }
  }
}


function createSummaryText() {
  const getValue = (id) => {
    const element = document.getElementById(id);

    if (!element) {
      return "";
    }

    return element.value.trim();
  };

  const dateText =
    document.getElementById("todayDate")?.textContent || "";

  const moneyAgain = getValue("moneyAgain");
  const meterValue =
    document.getElementById("todayMeter")?.value || "3";

  const sections = [];

  sections.push(
    "🌱 チャッピー＆サリーの豊かさを育てるナビ"
  );

  if (dateText) {
    sections.push(`【日付】\n${dateText}`);
  }

  const existingAbundance = [
    getValue("arutakasa1"),
    getValue("arutakasa2"),
    getValue("arutakasa3")
  ].filter(Boolean);

  if (existingAbundance.length > 0) {
    const abundanceLines =
      existingAbundance
        .map((item, index) => `${index + 1}. ${item}`)
        .join("\n");

    sections.push(
      `【今日すでにある豊かさ】\n${abundanceLines}`
    );
  }

  addSection(
    sections,
    "今日あったいいこと",
    getValue("goodThing")
  );

  addSection(
    sections,
    "今日の存在給",
    getValue("sonzaikyu")
  );

  addSection(
    sections,
    "今、不安に見えていること",
    getValue("nowAnxiety")
  );

  addSection(
    sections,
    "今ある安心",
    getValue("nowSafety")
  );

  addSection(
    sections,
    "今までの見方",
    getValue("beforeShift")
  );

  addSection(
    sections,
    "別の角度から見たら",
    getValue("afterShift")
  );

  addSection(
    sections,
    "視点を変えて気づいたこと",
    getValue("shiftNotice")
  );

  const roleTarget = getValue("roleTarget");

  if (
    roleTarget ||
    getValue("roleSet") ||
    getValue("roleWant") ||
    getValue("roleFear") ||
    getValue("roleCare")
  ) {
    const roleLines = [];

    if (roleTarget) {
      roleLines.push(`相手・もの・こと：${roleTarget}`);
    }

    if (getValue("roleSet")) {
      roleLines.push(
        `設定していた役割：${getValue("roleSet")}`
      );
    }

    if (getValue("roleWant")) {
      roleLines.push(
        `本当はどうしてほしかった？：${getValue("roleWant")}`
      );
    }

    if (getValue("roleFear")) {
      roleLines.push(
        `役割どおりでない時の不安：${getValue("roleFear")}`
      );
    }

    if (getValue("roleCare")) {
      roleLines.push(
        `今の私が渡せる安心：${getValue("roleCare")}`
      );
    }

    sections.push(
      `【勝手に設定していた役割】\n${roleLines.join("\n")}`
    );
  }

  if (
    getValue("moneyAmount") ||
    getValue("moneyReceived") ||
    getValue("moneyFeeling") ||
    moneyAgain
  ) {
    const moneyLines = [];

    if (getValue("moneyAmount")) {
      moneyLines.push(
        `使った金額：${getValue("moneyAmount")}`
      );
    }

    if (getValue("moneyReceived")) {
      moneyLines.push(
        `受け取ったもの：${getValue("moneyReceived")}`
      );
    }

    if (getValue("moneyFeeling")) {
      moneyLines.push(
        `その時の気持ち：${getValue("moneyFeeling")}`
      );
    }

    if (moneyAgain) {
      moneyLines.push(
        `また選びたい？：${moneyAgain}`
      );
    }

    sections.push(
      `【使ったお金の受け取りメモ】\n${moneyLines.join("\n")}`
    );
  }

  addSection(
    sections,
    "今日の豊かさの気づき",
    getValue("todayGrowth")
  );

  sections.push(
    `【今日の豊かさ度】\n${meterValue} / 5`
  );

  sections.push(
    "今日もちゃんと、豊かさを受け取っていたね😊🌱\nありがと〜ご財増した〜🤭💕"
  );

  return sections.join("\n\n");
}


function addSection(array, title, value) {
  if (!value) {
    return;
  }

  array.push(`【${title}】\n${value}`);
}


function fallbackCopyText(text) {
  const temporaryTextarea =
    document.createElement("textarea");

  temporaryTextarea.value = text;
  temporaryTextarea.setAttribute("readonly", "");
  temporaryTextarea.style.position = "fixed";
  temporaryTextarea.style.opacity = "0";
  temporaryTextarea.style.pointerEvents = "none";

  document.body.appendChild(temporaryTextarea);

  temporaryTextarea.select();
  temporaryTextarea.setSelectionRange(
    0,
    temporaryTextarea.value.length
  );

  const copied = document.execCommand("copy");

  document.body.removeChild(temporaryTextarea);

  if (!copied) {
    throw new Error("コピーに失敗しました");
  }
}


function resetAllData() {
  const shouldReset = window.confirm(
    "入力した内容をすべて消してもいい？"
  );

  if (!shouldReset) {
    return;
  }

  savedFieldIds.forEach((fieldId) => {
    const field = document.getElementById(fieldId);

    if (!field) {
      return;
    }

    if (field.type === "range") {
      field.value = "3";
    } else {
      field.value = "";
    }
  });

  localStorage.removeItem(STORAGE_KEY);

  updateMeterText();
  resetBreathingDisplay();

  showNotice(
    "入力内容をリセットしたよ🌿"
  );
}


/* ========================================
   お知らせ表示
======================================== */

let noticeTimeoutId = null;

function showNotice(message) {
  const noticeMessage =
    document.getElementById("noticeMessage");

  if (!noticeMessage) {
    return;
  }

  if (noticeTimeoutId !== null) {
    clearTimeout(noticeTimeoutId);
  }

  noticeMessage.textContent = message;

  noticeTimeoutId = window.setTimeout(() => {
    noticeMessage.textContent = "";
    noticeTimeoutId = null;
  }, 3500);
}


/* ========================================
   HTML文字の安全処理
======================================== */

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
      }
