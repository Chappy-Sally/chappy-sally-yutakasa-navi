"use strict";


/* ========================================
   保存キー
======================================== */

const MISSION_STORAGE_KEY =
  "chappySallyYutakasaMissionData";


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
      "安心して目覚められたことも、今日すでに受け取った豊かさだよ🌿"
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
      "おはよ〜🌈\n豊かさを受け取る準備はできて増〜す🤭",

    sub:
      "やさしさも、ひらめきも、ゆっくりできる時間も、全部受け取っていいよ✨"
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
      "安心、時間、ご縁、笑顔、便利さ。今日もいろんな姿で届いているかも🤭"
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
   豊かさミッション
======================================== */

const abundanceMissions = [
  "今日、無料で受け取った豊かさを\nひとつ見つけてみよう😊",

  "窓の外を見て、好きな色を\nひとつ見つけてみよう🌈",

  "今日「助かったな」と思ったことを\nひとつ見つけてみよう🌿",

  "今そばにある便利なものを\nひとつ見つけてみよう✨",

  "今日飲んだものを、いつもより少し\nゆっくり味わってみよう☕",

  "誰かから受け取ったやさしさを\nひとつ思い出してみよう😊",

  "今の自分に「今日も花まる」と\n言ってあげよう🌼",

  "空や風や光から受け取ったものを\nひとつ見つけてみよう☀️",

  "100円以内で楽しめるしあわせを\nひとつ考えてみよう🤭",

  "今日できたことを、どんなに小さくても\nひとつ見つけてみよう🌱",

  "家の中にあるお気に入りを\nひとつ眺めてみよう💕",

  "今日の自分の体に\n『ありがと〜』を伝えてみよう🌿",

  "食べられるものがある豊かさを\nひとつ味わってみよう😋",

  "今ある安心を\nひとつ声に出してみよう😊",

  "今日は何もしない時間も\n豊かさだと認めてみよう🤣"
];

const missionResultMessages = [
  "豊かさの種をひとつ見つけました🌱✨",

  "しあわせコインを受け取りました💰💕",

  "今日の豊かさ、発見〜😆🌈",

  "小さな豊かさが、またひとつ増えたね😊",

  "見つけてくれて、ありがと〜ご財増した〜🤭💰",

  "うふふふふっ🤭 ちゃんと豊かさはあったね🌼"
];

let missionIndex = 0;
let coinCount = 0;


/* ========================================
   ページ読み込み後
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  setupTodayDate();
  setupMorningMessage();
  setupMorningButton();

  setupMission();
  setupMissionButtons();

  setupMeter();
});


/* ========================================
   日付
======================================== */

function setupTodayDate() {
  const todayDate =
    document.getElementById("todayDate");

  if (!todayDate) {
    return;
  }

  const today = new Date();

  const formattedDate =
    new Intl.DateTimeFormat("ja-JP", {
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

function setupMorningMessage() {
  if (
    !document.getElementById("morningMessage") &&
    !document.getElementById("morningSubMessage")
  ) {
    return;
  }

  morningMessageIndex =
    getTodayMessageIndex();

  showMorningMessage(morningMessageIndex);
}


function setupMorningButton() {
  const changeMessageBtn =
    document.getElementById("changeMessageBtn");

  if (!changeMessageBtn) {
    return;
  }

  changeMessageBtn.addEventListener("click", () => {
    morningMessageIndex++;

    if (
      morningMessageIndex >=
      morningMessages.length
    ) {
      morningMessageIndex = 0;
    }

    showMorningMessage(morningMessageIndex);
  });
}


function showMorningMessage(index) {
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
      escapeHtml(message.main)
        .replace(/\n/g, "<br>");
  }

  if (morningSubMessage) {
    morningSubMessage.textContent =
      message.sub;
  }
}


function getTodayMessageIndex() {
  const today = new Date();

  const dateNumber =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  return dateNumber % morningMessages.length;
}


/* ========================================
   豊かさミッションの準備
======================================== */

function setupMission() {
  const missionText =
    document.getElementById("missionText");

  if (!missionText) {
    return;
  }

  const savedMissionData =
    loadMissionData();

  coinCount =
    Number(savedMissionData.coinCount) || 0;

  if (
    Number.isInteger(
      savedMissionData.missionIndex
    ) &&
    abundanceMissions[
      savedMissionData.missionIndex
    ]
  ) {
    missionIndex =
      savedMissionData.missionIndex;
  } else {
    missionIndex =
      getTodayMissionIndex();
  }

  showMission();
  updateCoinDisplay();
}


function setupMissionButtons() {
  const changeMissionBtn =
    document.getElementById(
      "changeMissionBtn"
    );

  const completeMissionBtn =
    document.getElementById(
      "completeMissionBtn"
    );

  if (changeMissionBtn) {
    changeMissionBtn.addEventListener(
      "click",
      changeMission
    );
  }

  if (completeMissionBtn) {
    completeMissionBtn.addEventListener(
      "click",
      completeMission
    );
  }
}


/* ========================================
   ミッションを表示
======================================== */

function showMission() {
  const missionText =
    document.getElementById("missionText");

  if (!missionText) {
    return;
  }

  const mission =
    abundanceMissions[missionIndex];

  if (!mission) {
    return;
  }

  missionText.innerHTML =
    escapeHtml(mission)
      .replace(/\n/g, "<br>");

  saveMissionData();
}


/* ========================================
   別のミッション
======================================== */

function changeMission() {
  if (abundanceMissions.length <= 1) {
    return;
  }

  let nextIndex = missionIndex;

  while (nextIndex === missionIndex) {
    nextIndex = Math.floor(
      Math.random() *
      abundanceMissions.length
    );
  }

  missionIndex = nextIndex;

  showMission();
  clearMissionResult();

  const missionBox =
    document.querySelector(".mission-box");

  if (missionBox) {
    missionBox.animate(
      [
        {
          opacity: 0.35,
          transform: "scale(0.98)"
        },
        {
          opacity: 1,
          transform: "scale(1)"
        }
      ],
      {
        duration: 350,
        easing: "ease-out"
      }
    );
  }
}


/* ========================================
   ミッション達成
======================================== */

function completeMission() {
  coinCount++;

  updateCoinDisplay();
  saveMissionData();

  const missionResult =
    document.getElementById(
      "missionResult"
    );

  if (missionResult) {
    const randomIndex = Math.floor(
      Math.random() *
      missionResultMessages.length
    );

    missionResult.textContent =
      missionResultMessages[randomIndex];

    missionResult.animate(
      [
        {
          opacity: 0,
          transform: "translateY(7px)"
        },
        {
          opacity: 1,
          transform: "translateY(0)"
        }
      ],
      {
        duration: 400,
        easing: "ease-out"
      }
    );
  }

  const coinBox =
    document.querySelector(".coin-box");

  if (coinBox) {
    coinBox.animate(
      [
        {
          transform: "scale(1)"
        },
        {
          transform: "scale(1.08)"
        },
        {
          transform: "scale(1)"
        }
      ],
      {
        duration: 420,
        easing: "ease-out"
      }
    );
  }
}


function updateCoinDisplay() {
  const coinCountElement =
    document.getElementById("coinCount");

  if (!coinCountElement) {
    return;
  }

  coinCountElement.textContent =
    String(coinCount);
}


function clearMissionResult() {
  const missionResult =
    document.getElementById(
      "missionResult"
    );

  if (missionResult) {
    missionResult.textContent = "";
  }
}


function getTodayMissionIndex() {
  const today = new Date();

  const dateNumber =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  return dateNumber %
    abundanceMissions.length;
}


/* ========================================
   ミッションとコインの保存
======================================== */

function saveMissionData() {
  try {
    const missionData = {
      missionIndex,
      coinCount
    };

    localStorage.setItem(
      MISSION_STORAGE_KEY,
      JSON.stringify(missionData)
    );
  } catch (error) {
    console.error(
      "ミッションを保存できませんでした:",
      error
    );
  }
}


function loadMissionData() {
  try {
    const savedData =
      localStorage.getItem(
        MISSION_STORAGE_KEY
      );

    if (!savedData) {
      return {};
    }

    return JSON.parse(savedData);
  } catch (error) {
    console.error(
      "ミッションを読み込めませんでした:",
      error
    );

    return {};
  }
}


/* ========================================
   今日の豊かさ度
======================================== */

function setupMeter() {
  const todayMeter =
    document.getElementById("todayMeter");

  if (!todayMeter) {
    return;
  }

  todayMeter.addEventListener(
    "input",
    updateMeterText
  );

  updateMeterText();
}


function updateMeterText() {
  const todayMeter =
    document.getElementById("todayMeter");

  const meterText =
    document.getElementById("meterText");

  const closingMessage =
    document.getElementById(
      "closingMessage"
    );

  if (!todayMeter || !meterText) {
    return;
  }

  const meterValue =
    Number(todayMeter.value);

  meterText.textContent =
    `${meterValue} / 5`;

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
    closingMessages[3];
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


/* ========================================
   他のファイルから使えるようにする
======================================== */

window.updateMeterText =
  updateMeterText;


/* ========================================
   今日のチャッピーのひとこと
======================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const chappyMessage =
      document.getElementById(
        "chappyMessage"
      );

    if (!chappyMessage) {
      return;
    }


    const messages = [

      "💰 お金は、しあわせそのものじゃなくて<br>しあわせを運んでくれるツール😊",

      "🌿 不安な日は、<br>答えを出すより安心に戻るのが先でもいいよ。",

      "🤭 お金さん、<br>今日もどこかで働いてるかもよ。",

      "🌈 使ったお金は、<br>食べ物や安心や楽しさに姿を変えてるよ。",

      "💖 豊かさは、<br>たくさん持つことより「ある」に気づくことから。",

      "🐶 今日も大丈夫。<br>ひとつ気づけたら、それで花まる🌼"

    ];


    const randomIndex =
      Math.floor(
        Math.random() *
        messages.length
      );


    chappyMessage.innerHTML =
      messages[randomIndex];

  }
);
