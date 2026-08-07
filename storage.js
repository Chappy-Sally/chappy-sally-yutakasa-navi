"use strict";


/* ========================================
   保存設定
======================================== */

const STORAGE_KEY =
  "chappySallyMoneySafetyNaviData";


/* ========================================
   保存する入力項目
======================================== */

const savedFieldIds = [

  /* お金ってなんだろう？ */
  "moneyFeelingChecks",
  "moneyFeelingOther",

  /* お金って、あなたにとってどんな存在？ */
  "moneyExistenceChecks",
  "moneyWishChecks",
  "moneyFutureChecks",
  "moneyImageOther",

  /* お金の不安を整理する */
  "anxietyReasonChecks",
  "anxietyOther",
  "anxietyMoodChecks",

  "paymentName",
  "paymentDate",
  "paymentAmount",
  "availableMoney",

  "incomeSource",
  "incomeDate",
  "incomeAmount",

  "moneyRealityOther",

  "moneyActionChecks",
  "moneyActionOther",

  /* 豊かさを育てる */
  "arutakasa1",
  "arutakasa2",
  "arutakasa3",

  "receivedAbundance",
  "receivedFeeling",

  "goodThing",
  "sonzaikyu",

  "abundanceMoneyReceived",
  "todayAbundanceChoice",

  /* 深呼吸 */
  "nowAnxiety",
  "nowSafety",

  /* 使ったお金の受け取りメモ */
  "moneyAmount",
  "moneyReceived",
  "moneyFeeling",
  "moneyAgain",

  /* 勝手に設定していた役割 */
  "roleTarget",
  "roleSet",
  "roleWant",
  "roleFear",
  "roleCare",

  /* 今日のまとめ */
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
    loadSavedData();
    setupAutoSave();
    setupStorageButtons();
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
        const saved =
          saveData();

        if (saved) {
          showNotice(
            "入力した内容を保存したよ😊🌿"
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
    fieldId => {

      const field =
        document.getElementById(
          fieldId
        );

      if (!field) {
        return;
      }


      const eventName =
        field.tagName === "SELECT" ||
        field.type === "range" ||
        field.type === "date"
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
   保存済みデータを取得
======================================== */

function getStoredData() {

  try {

    const savedJson =
      localStorage.getItem(
        STORAGE_KEY
      );


    if (!savedJson) {
      return {};
    }


    const parsedData =
      JSON.parse(savedJson);


    if (
      !parsedData ||
      typeof parsedData !== "object"
    ) {
      return {};
    }


    return parsedData;

  } catch (error) {

    console.error(
      "保存データを読み込めませんでした:",
      error
    );

    return {};
  }
}


/* ========================================
   現在のページの入力内容を取得
======================================== */

function collectCurrentPageData() {

  const currentPageData = {};


  savedFieldIds.forEach(
    fieldId => {

      const field =
        document.getElementById(
          fieldId
        );


      if (!field) {
        return;
      }


      currentPageData[fieldId] =
        field.value;
    }
  );


  return currentPageData;
}


/* ========================================
   全データをまとめる
======================================== */

function collectAllData() {

  const storedData =
    getStoredData();

  const currentPageData =
    collectCurrentPageData();


  return {
    ...storedData,
    ...currentPageData,
    savedAt:
      new Date().toISOString()
  };
}


/* ========================================
   保存
======================================== */

function saveData(
  showError = true
) {

  try {

    const allData =
      collectAllData();


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(allData)
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
   保存内容を入力欄へ戻す
======================================== */

function loadSavedData() {

  const savedData =
    getStoredData();


  savedFieldIds.forEach(
    fieldId => {

      const field =
        document.getElementById(
          fieldId
        );


      if (!field) {
        return;
      }


      if (
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
}


/* ========================================
   まとめをコピー
======================================== */

async function copySummary() {

  saveData(false);


  const summaryText =
    createSummaryText();


  if (!summaryText.trim()) {

    showNotice(
      "コピーする内容がまだないみたい😊"
    );

    return;
  }


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
      "入力した内容をコピーしたよ🐶🌿"
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
        "入力した内容をコピーしたよ🐶🌿"
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

  const data =
    collectAllData();

  const sections = [];


  sections.push(
    "🌿 チャッピー＆サリーの\n" +
    "お金の不安を安心に戻すナビ"
  );


  addMoneyAboutSection(
    sections,
    data
  );


  addMoneyImageSection(
    sections,
    data
  );


  addMoneyAnxietySection(
    sections,
    data
  );


  addBreathingSection(
    sections,
    data
  );


  addAbundanceSection(
    sections,
    data
  );


  addMoneyReceivedSection(
    sections,
    data
  );


  addRoleSection(
    sections,
    data
  );


  addSection(
    sections,
    "今日の気づき",
    data.todayGrowth
  );


  if (
    cleanValue(
      data.todayMeter
    )
  ) {

    sections.push(
      "【今の安心度】\n" +
      `${cleanValue(
        data.todayMeter
      )} / 5`
    );
  }


  return sections.join(
    "\n\n"
  );
}


/* ========================================
   お金ってなんだろう？
======================================== */

function addMoneyAboutSection(
  sections,
  data
) {

  const moneyFeelingChecks =
    cleanValue(
      data.moneyFeelingChecks
    );

  const moneyFeelingOther =
    cleanValue(
      data.moneyFeelingOther
    );


  if (
    !moneyFeelingChecks &&
    !moneyFeelingOther
  ) {
    return;
  }


  const lines = [];


  addLine(
    lines,
    "今のお金への気持ち",
    moneyFeelingChecks
  );


  addLine(
    lines,
    "ほかに浮かんだ気持ち",
    moneyFeelingOther
  );


  sections.push(
    "【お金ってなんだろう？】\n" +
    lines.join("\n\n")
  );
}


/* ========================================
   私にとってのお金
======================================== */

function addMoneyImageSection(
  sections,
  data
) {

  const moneyExistenceChecks =
    cleanValue(
      data.moneyExistenceChecks
    );

  const moneyWishChecks =
    cleanValue(
      data.moneyWishChecks
    );

  const moneyFutureChecks =
    cleanValue(
      data.moneyFutureChecks
    );

  const moneyImageOther =
    cleanValue(
      data.moneyImageOther
    );


  if (
    !moneyExistenceChecks &&
    !moneyWishChecks &&
    !moneyFutureChecks &&
    !moneyImageOther
  ) {
    return;
  }


  const lines = [];


  addLine(
    lines,
    "今のお金はどんな存在？",
    moneyExistenceChecks
  );


  addLine(
    lines,
    "本当はお金に何を求めていた？",
    moneyWishChecks
  );


  addLine(
    lines,
    "これからどんな関係になりたい？",
    moneyFutureChecks
  );


  addLine(
    lines,
    "ほかに浮かんだこと",
    moneyImageOther
  );


  sections.push(
    "【お金って、私にとってどんな存在？】\n" +
    lines.join("\n\n")
  );
}


/* ========================================
   お金の不安
======================================== */

function addMoneyAnxietySection(
  sections,
  data
) {

  const values = [

    data.anxietyReasonChecks,
    data.anxietyOther,
    data.anxietyMoodChecks,

    data.paymentName,
    data.paymentDate,
    data.paymentAmount,
    data.availableMoney,

    data.incomeSource,
    data.incomeDate,
    data.incomeAmount,

    data.moneyRealityOther,

    data.moneyActionChecks,
    data.moneyActionOther

  ].map(cleanValue);


  if (
    !values.some(Boolean)
  ) {
    return;
  }


  const lines = [];


  addLine(
    lines,
    "今、何が気になる？",
    data.anxietyReasonChecks
  );


  addLine(
    lines,
    "ほかに気になること",
    data.anxietyOther
  );


  addLine(
    lines,
    "今の気持ち",
    data.anxietyMoodChecks
  );


  addLine(
    lines,
    "何の支払い？",
    data.paymentName
  );


  addLine(
    lines,
    "支払日",
    formatDate(
      data.paymentDate
    )
  );


  addLine(
    lines,
    "支払額",
    data.paymentAmount
  );


  addLine(
    lines,
    "今、支払いに使えそうなお金",
    data.availableMoney
  );


  addLine(
    lines,
    "入ってくる予定のお金",
    data.incomeSource
  );


  addLine(
    lines,
    "入金予定日",
    formatDate(
      data.incomeDate
    )
  );


  addLine(
    lines,
    "入金予定額",
    data.incomeAmount
  );


  addLine(
    lines,
    "ほかに確認しておきたいこと",
    data.moneyRealityOther
  );


  addLine(
    lines,
    "今できそうな小さなこと",
    data.moneyActionChecks
  );


  addLine(
    lines,
    "ほかにできそうなこと",
    data.moneyActionOther
  );


  sections.push(
    "【お金の不安をやさしく整理してみたよ】\n" +
    lines.join("\n\n")
  );
}


/* ========================================
   深呼吸
======================================== */

function addBreathingSection(
  sections,
  data
) {

  const nowAnxiety =
    cleanValue(
      data.nowAnxiety
    );

  const nowSafety =
    cleanValue(
      data.nowSafety
    );


  if (
    !nowAnxiety &&
    !nowSafety
  ) {
    return;
  }


  const lines = [];


  addLine(
    lines,
    "今、不安に見えていること",
    nowAnxiety
  );


  addLine(
    lines,
    "今ここにある安心",
    nowSafety
  );


  sections.push(
    "【深呼吸して見つけたこと】\n" +
    lines.join("\n\n")
  );
}


/* ========================================
   豊かさを育てる
======================================== */

function addAbundanceSection(
  sections,
  data
) {

  const existingAbundance = [

    cleanValue(
      data.arutakasa1
    ),

    cleanValue(
      data.arutakasa2
    ),

    cleanValue(
      data.arutakasa3
    )

  ].filter(Boolean);


  const receivedAbundance =
    cleanValue(
      data.receivedAbundance
    );

  const receivedFeeling =
    cleanValue(
      data.receivedFeeling
    );

  const goodThing =
    cleanValue(
      data.goodThing
    );

  const sonzaikyu =
    cleanValue(
      data.sonzaikyu
    );

  const abundanceMoneyReceived =
    cleanValue(
      data.abundanceMoneyReceived
    );

  const todayAbundanceChoice =
    cleanValue(
      data.todayAbundanceChoice
    );


  if (
    existingAbundance.length === 0 &&
    !receivedAbundance &&
    !receivedFeeling &&
    !goodThing &&
    !sonzaikyu &&
    !abundanceMoneyReceived &&
    !todayAbundanceChoice
  ) {
    return;
  }


  const lines = [];


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


    lines.push(
      "今すでにある豊かさ：\n" +
      abundanceLines
    );
  }


  addLine(
    lines,
    "今日受け取った豊かさ",
    receivedAbundance
  );


  addLine(
    lines,
    "受け取って感じたこと",
    receivedFeeling
  );


  addLine(
    lines,
    "今日あった、ちょっといいこと",
    goodThing
  );


  addLine(
    lines,
    "今日の存在給",
    sonzaikyu
  );


  addLine(
    lines,
    "お金さんが届けてくれた豊かさ",
    abundanceMoneyReceived
  );


  addLine(
    lines,
    "今日育てたい小さな豊かさ",
    todayAbundanceChoice
  );


  sections.push(
    "【安心に戻ったあとに見つけた豊かさ】\n" +
    lines.join("\n\n")
  );
}


/* ========================================
   使ったお金の受け取りメモ
======================================== */

function addMoneyReceivedSection(
  sections,
  data
) {

  const moneyAmount =
    cleanValue(
      data.moneyAmount
    );

  const moneyReceived =
    cleanValue(
      data.moneyReceived
    );

  const moneyFeeling =
    cleanValue(
      data.moneyFeeling
    );

  const moneyAgain =
    cleanValue(
      data.moneyAgain
    );


  if (
    !moneyAmount &&
    !moneyReceived &&
    !moneyFeeling &&
    !moneyAgain
  ) {
    return;
  }


  const lines = [];


  addLine(
    lines,
    "使った金額",
    moneyAmount
  );


  addLine(
    lines,
    "そのお金で受け取ったもの",
    moneyReceived
  );


  addLine(
    lines,
    "受け取った時の気持ち",
    moneyFeeling
  );


  addLine(
    lines,
    "また選びたい？",
    moneyAgain
  );


  sections.push(
    "【使ったお金の受け取りメモ】\n" +
    lines.join("\n\n")
  );
}


/* ========================================
   勝手に設定していた役割
======================================== */

function addRoleSection(
  sections,
  data
) {

  const roleTarget =
    cleanValue(
      data.roleTarget
    );

  const roleSet =
    cleanValue(
      data.roleSet
    );

  const roleWant =
    cleanValue(
      data.roleWant
    );

  const roleFear =
    cleanValue(
      data.roleFear
    );

  const roleCare =
    cleanValue(
      data.roleCare
    );


  if (
    !roleTarget &&
    !roleSet &&
    !roleWant &&
    !roleFear &&
    !roleCare
  ) {
    return;
  }


  const lines = [];


  addLine(
    lines,
    "相手・もの・こと",
    roleTarget
  );


  addLine(
    lines,
    "設定していた役割",
    roleSet
  );


  addLine(
    lines,
    "本当はどうしてほしかった？",
    roleWant
  );


  addLine(
    lines,
    "役割どおりでない時の不安",
    roleFear
  );


  addLine(
    lines,
    "今の私が渡せる安心",
    roleCare
  );


  sections.push(
    "【勝手に設定していた役割】\n" +
    lines.join("\n\n")
  );
}


/* ========================================
   セクションを追加
======================================== */

function addSection(
  sections,
  title,
  value
) {

  const cleanedValue =
    cleanValue(value);


  if (!cleanedValue) {
    return;
  }


  sections.push(
    `【${title}】\n${cleanedValue}`
  );
}


/* ========================================
   行を追加
======================================== */

function addLine(
  lines,
  label,
  value
) {

  const cleanedValue =
    cleanValue(value);


  if (!cleanedValue) {
    return;
  }


  lines.push(
    `${label}：\n${cleanedValue}`
  );
}


/* ========================================
   入力値を整える
======================================== */

function cleanValue(
  value
) {

  if (
    value === undefined ||
    value === null
  ) {
    return "";
  }


  return String(
    value
  ).trim();
}


/* ========================================
   日付を読みやすくする
======================================== */

function formatDate(
  dateValue
) {

  const cleanedDate =
    cleanValue(
      dateValue
    );


  if (!cleanedDate) {
    return "";
  }


  const dateParts =
    cleanedDate.split("-");


  if (
    dateParts.length !== 3
  ) {
    return cleanedDate;
  }


  const year =
    Number(
      dateParts[0]
    );

  const month =
    Number(
      dateParts[1]
    );

  const day =
    Number(
      dateParts[2]
    );


  if (
    !year ||
    !month ||
    !day
  ) {
    return cleanedDate;
  }


  return (
    `${year}年` +
    `${month}月` +
    `${day}日`
  );
}


/* ========================================
   予備のコピー方法
======================================== */

function fallbackCopyText(
  text
) {

  const temporaryTextarea =
    document.createElement(
      "textarea"
    );


  temporaryTextarea.value =
    text;


  temporaryTextarea.setAttribute(
    "readonly",
    ""
  );


  temporaryTextarea.style.position =
    "fixed";

  temporaryTextarea.style.top =
    "-9999px";

  temporaryTextarea.style.left =
    "-9999px";

  temporaryTextarea.style.opacity =
    "0";


  document.body.appendChild(
    temporaryTextarea
  );


  temporaryTextarea.focus();

  temporaryTextarea.select();

  temporaryTextarea.setSelectionRange(
    0,
    temporaryTextarea.value.length
  );


  const copied =
    document.execCommand(
      "copy"
    );


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
   入力をすべてリセット
======================================== */

function resetAllData() {

  const shouldReset =
    window.confirm(
      "入力した内容をすべて消してもいい？"
    );


  if (!shouldReset) {
    return;
  }


  localStorage.removeItem(
    STORAGE_KEY
  );


  savedFieldIds.forEach(
    fieldId => {

      const field =
        document.getElementById(
          fieldId
        );


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

        noticeTimeoutId =
          null;

      },
      3500
    );
}


/* ========================================
   他ファイルから使える関数
======================================== */

window.saveData =
  saveData;

window.loadSavedData =
  loadSavedData;

window.createSummaryText =
  createSummaryText;
