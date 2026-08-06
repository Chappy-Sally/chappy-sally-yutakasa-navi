"use strict";

/* ========================================
   保存設定
======================================== */

const STORAGE_KEY =
  "chappySallyYutakasaNaviData";


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
   お知らせ表示用
======================================== */

let noticeTimeoutId = null;


/* ========================================
   ページ読み込み後
======================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    setupStorageButtons();
    setupAutoSave();
    loadSavedData();
  }
);


/* ========================================
   保存・コピー・リセットボタン
======================================== */

function setupStorageButtons() {
  const saveBtn =
    document.getElementById("saveBtn");

  const copyBtn =
    document.getElementById("copyBtn");

  const resetBtn =
    document.getElementById("resetBtn");


  if (saveBtn) {
    saveBtn.addEventListener(
      "click",
      () => {
        const saved = saveData();

        if (saved) {
          showNotice(
            "今日の豊かさを保存したよ😊🌱"
          );
        }
      }
    );
  }


  if (copyBtn) {
    copyBtn.addEventListener(
      "click",
      copySummary
    );
  }


  if (resetBtn) {
    resetBtn.addEventListener(
      "click",
      resetAllData
    );
  }
}


/* ========================================
   自動保存
======================================== */

function setupAutoSave() {
  savedFieldIds.forEach(
    (fieldId) => {
      const field =
        document.getElementById(fieldId);

      if (!field) {
        return;
      }

      const eventName =
        field.tagName === "SELECT" ||
        field.type === "range"
          ? "change"
          : "input";

      field.addEventListener(
        eventName,
        () => {
          saveData(false);

          if (
            fieldId === "todayMeter" &&
            typeof window.updateMeterText === "function"
          ) {
            window.updateMeterText();
          }
        }
      );
    }
  );
}


/* ========================================
   入力内容をまとめる
======================================== */

function collectData() {
  const data = {};

  savedFieldIds.forEach(
    (fieldId) => {
      const field =
        document.getElementById(fieldId);

      if (field) {
        data[fieldId] = field.value;
      }
    }
  );

  data.savedAt =
    new Date().toISOString();

  return data;
}


/* ========================================
   保存
======================================== */

function saveData(
  showError = true
) {
  try {
    const data = collectData();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );

    return true;

  } catch (error) {
    console.error(
      "保存できませんでした:",
      error
    );

    if (showError) {
      showNotice(
        "保存できなかったみたい🥺"
      );
    }

    return false;
  }
}


/* ========================================
   保存データを復元
======================================== */

function loadSavedData() {
  try {
    const savedJson =
      localStorage.getItem(STORAGE_KEY);

    if (!savedJson) {
      return;
    }

    const savedData =
      JSON.parse(savedJson);


    savedFieldIds.forEach(
      (fieldId) => {
        const field =
          document.getElementById(fieldId);

        if (
          field &&
          Object.prototype.hasOwnProperty.call(
            savedData,
            fieldId
          )
        ) {
          field.value =
            savedData[fieldId];
        }
      }
    );


    if (
      typeof window.updateMeterText === "function"
    ) {
      window.updateMeterText();
    }

  } catch (error) {
    console.error(
      "保存データを読み込めませんでした:",
      error
    );
  }
}


/* ========================================
   まとめをコピー
======================================== */

async function copySummary() {
  const summaryText =
    createSummaryText();

  try {
    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(
        summaryText
      );

    } else {
      fallbackCopyText(
        summaryText
      );
    }

    showNotice(
      "今日の豊かさをコピーしたよ😊🌈"
    );

  } catch (error) {
    console.error(
      "コピーできませんでした:",
      error
    );

    try {
      fallbackCopyText(
        summaryText
      );

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


/* ========================================
   コピーする文章を作る
======================================== */

function createSummaryText() {
  const sections = [];

  const dateText =
    document.getElementById("todayDate")
      ?.textContent
      ?.trim() || "";

  const meterValue =
    document.getElementById("todayMeter")
      ?.value || "3";


  sections.push(
    "🌱 チャッピー＆サリーの豊かさを育てるナビ"
  );


  if (dateText) {
    sections.push(
      `【日付】\n${dateText}`
    );
  }


  const existingAbundance = [
    getValue("arutakasa1"),
    getValue("arutakasa2"),
    getValue("arutakasa3")
  ].filter(Boolean);


  if (
    existingAbundance.length > 0
  ) {
    const abundanceLines =
      existingAbundance
        .map(
          (item, index) =>
            `${index + 1}. ${item}`
        )
        .join("\n");

    sections.push(
      "【今日すでにある豊かさ】\n" +
      abundanceLines
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
    "今の見方",
    getValue("beforeShift")
  );

  addSection(
    sections,
    "別の角度から見ると",
    getValue("afterShift")
  );

  addSection(
    sections,
    "視点を変えて気づいたこと",
    getValue("shiftNotice")
  );


  addRoleSection(
    sections
  );


  addMoneySection(
    sections
  );


  addSection(
    sections,
    "今日の豊かさの気づき",
    getValue("todayGrowth")
  );


  sections.push(
    `【今日の豊かさ度】\n${meterValue} / 5`
  );


  sections.push(
    "今日もちゃんと、豊かさを受け取っていたね😊🌱\n" +
    "ありがと〜ご財増した〜🤭💕"
  );


  return sections.join("\n\n");
}


/* ========================================
   役割ワークの文章
======================================== */

function addRoleSection(
  sections
) {
  const roleTarget =
    getValue("roleTarget");

  const roleSet =
    getValue("roleSet");

  const roleWant =
    getValue("roleWant");

  const roleFear =
    getValue("roleFear");

  const roleCare =
    getValue("roleCare");


  if (
    !roleTarget &&
    !roleSet &&
    !roleWant &&
    !roleFear &&
    !roleCare
  ) {
    return;
  }


  const roleLines = [];


  if (roleTarget) {
    roleLines.push(
      `相手・もの・こと：${roleTarget}`
    );
  }


  if (roleSet) {
    roleLines.push(
      `設定していた役割：${roleSet}`
    );
  }


  if (roleWant) {
    roleLines.push(
      `本当はどうしてほしかった？：${roleWant}`
    );
  }


  if (roleFear) {
    roleLines.push(
      `役割どおりでない時の不安：${roleFear}`
    );
  }


  if (roleCare) {
    roleLines.push(
      `今の私が渡せる安心：${roleCare}`
    );
  }


  sections.push(
    "【勝手に設定していた役割】\n" +
    roleLines.join("\n")
  );
}


/* ========================================
   お金メモの文章
======================================== */

function addMoneySection(
  sections
) {
  const moneyAmount =
    getValue("moneyAmount");

  const moneyReceived =
    getValue("moneyReceived");

  const moneyFeeling =
    getValue("moneyFeeling");

  const moneyAgain =
    getValue("moneyAgain");


  if (
    !moneyAmount &&
    !moneyReceived &&
    !moneyFeeling &&
    !moneyAgain
  ) {
    return;
  }


  const moneyLines = [];


  if (moneyAmount) {
    moneyLines.push(
      `使った金額：${moneyAmount}`
    );
  }


  if (moneyReceived) {
    moneyLines.push(
      `受け取ったもの：${moneyReceived}`
    );
  }


  if (moneyFeeling) {
    moneyLines.push(
      `その時の気持ち：${moneyFeeling}`
    );
  }


  if (moneyAgain) {
    moneyLines.push(
      `また選びたい？：${moneyAgain}`
    );
  }


  sections.push(
    "【使ったお金の受け取りメモ】\n" +
    moneyLines.join("\n")
  );
}


/* ========================================
   項目を追加
======================================== */

function addSection(
  sections,
  title,
  value
) {
  if (!value) {
    return;
  }

  sections.push(
    `【${title}】\n${value}`
  );
}


/* ========================================
   入力値を取得
======================================== */

function getValue(
  elementId
) {
  const element =
    document.getElementById(elementId);

  if (!element) {
    return "";
  }

  return element.value.trim();
}


/* ========================================
   予備のコピー方法
======================================== */

function fallbackCopyText(
  text
) {
  const temporaryTextarea =
    document.createElement("textarea");

  temporaryTextarea.value = text;

  temporaryTextarea.setAttribute(
    "readonly",
    ""
  );

  temporaryTextarea.style.position =
    "fixed";

  temporaryTextarea.style.opacity =
    "0";

  temporaryTextarea.style.pointerEvents =
    "none";


  document.body.appendChild(
    temporaryTextarea
  );


  temporaryTextarea.select();

  temporaryTextarea.setSelectionRange(
    0,
    temporaryTextarea.value.length
  );


  const copied =
    document.execCommand("copy");


  document.body.removeChild(
    temporaryTextarea
  );


  if (!copied) {
    throw new Error(
      "コピーに失敗しました"
    );
  }
}


/* ========================================
   入力をリセット
======================================== */

function resetAllData() {
  const shouldReset =
    window.confirm(
      "入力した内容をすべて消してもいい？"
    );

  if (!shouldReset) {
    return;
  }


  savedFieldIds.forEach(
    (fieldId) => {
      const field =
        document.getElementById(fieldId);

      if (!field) {
        return;
      }


      if (
        field.type === "range"
      ) {
        field.value = "3";

      } else {
        field.value = "";
      }
    }
  );


  localStorage.removeItem(
    STORAGE_KEY
  );


  if (
    typeof window.updateMeterText === "function"
  ) {
    window.updateMeterText();
  }


  if (
    typeof window.resetBreathingDisplay === "function"
  ) {
    window.resetBreathingDisplay();
  }


  showNotice(
    "入力内容をリセットしたよ🌿"
  );
}


/* ========================================
   お知らせ表示
======================================== */

function showNotice(
  message
) {
  const noticeMessage =
    document.getElementById(
      "noticeMessage"
    );

  if (!noticeMessage) {
    return;
  }


  if (
    noticeTimeoutId !== null
  ) {
    clearTimeout(
      noticeTimeoutId
    );
  }


  noticeMessage.textContent =
    message;


  noticeTimeoutId =
    window.setTimeout(
      () => {
        noticeMessage.textContent =
          "";

        noticeTimeoutId = null;
      },
      3500
    );
}


/* ========================================
   他ファイルから使える関数
======================================== */

window.saveData = saveData;
window.loadSavedData = loadSavedData;
window.createSummaryText =
  createSummaryText;
