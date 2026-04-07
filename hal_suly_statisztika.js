function createMonthlyTrigger() {
  // Egyszer kell futtatni: létrehozza a havi időzített futtatást (1-jén 8:00)
  ScriptApp.newTrigger("frissitHaviHalStatisztika")
    .timeBased()
    .onMonthDay(1)
    .atHour(8)
    .create();
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu("📋 Hal Napló")
    .addItem("🎣 Fogás rögzítése", "FogasRogziteseOldalsav")
    .addToUi();

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Hal_Naplo");
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const header = data[0];
  const rows = data.slice(1);

  const chipIndex = header.indexOf("Chip_Szam");
  const sulyIndex = header.indexOf("Hal_Suly");
  const idoIndex = header.indexOf("Fogas_Ido");

  const latestMap = new Map();

  for (const row of rows) {
    const chip = row[chipIndex];
    let suly = row[sulyIndex];
    let ido = row[idoIndex];

    if (!chip || !suly || !ido) continue;

    if (typeof suly === "string") {
      suly = parseFloat(suly.replace(",", ".").replace(/[^\d.]/g, ""));
    }

    if (isNaN(suly)) continue;

    if (typeof ido === "string") {
      ido = parseDateFromString(ido);
      if (!ido) continue;
    }

    const existing = latestMap.get(chip);
    if (!existing || ido > existing.ido) {
      latestMap.set(chip, { suly, ido });
    }
  }

  const sulyok = Array.from(latestMap.values()).map(e => e.suly);
  const db = sulyok.length;

  if (db === 0) return;

  const sum = sulyok.reduce((a, b) => a + b, 0);
  const avg = sum / db;
  const min = Math.min(...sulyok);
  const max = Math.max(...sulyok);

  sheet.getRange("I7").setValue(`${db} db`);
  sheet.getRange("I9").setValue(`${avg.toFixed(2)} kg`);
  sheet.getRange("I11").setValue(`${min.toFixed(2)} kg`);
  sheet.getRange("I13").setValue(`${max.toFixed(2)} kg`);

  // Ugrás a legfrissebb Fogas_Ido dátumhoz
  const idoOszlopIndex = header.indexOf("Fogas_Ido");
  if (idoOszlopIndex === -1) return;

  let latestRow = -1;
  let latestDate = null;

  for (let i = 0; i < rows.length; i++) {
    let datum = rows[i][idoOszlopIndex];
    if (typeof datum === "string") {
      datum = parseDateFromString(datum);
    }
    if (datum instanceof Date && (!latestDate || datum > latestDate)) {
      latestDate = datum;
      latestRow = i + 2; // +2: 1 a fejléc, 1 mert 0-indexes
    }
  }

  if (latestRow > 0) {
    const range = sheet.getRange(`D${latestRow}`);
    sheet.setActiveRange(range);
  }
}

function FogasRogziteseOldalsav() {
  const html = HtmlService.createHtmlOutputFromFile("index")
    .setTitle("🎣 Fogás rögzítése")
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

function parseDateFromString(dateStr) {
  const formats = [
    "yyyy.MM.dd",
    "yyyy.MM.dd. HH:mm:ss",
    "yyyy-MM-dd",
    "yyyy/MM/dd",
    "yyyy.MM.dd HH:mm"
  ];

  for (const format of formats) {
    try {
      const parsed = Utilities.parseDate(dateStr, Session.getScriptTimeZone(), format);
      if (parsed) return parsed;
    } catch (_) {}
  }

  return null;
}

function frissitHaviHalStatisztika() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dataSheet = ss.getSheetByName("Hal_Naplo");
  const summarySheetName = "Suly_Figyelo";
  let summarySheet = ss.getSheetByName(summarySheetName);

  if (!summarySheet) {
    summarySheet = ss.insertSheet(summarySheetName);
    summarySheet.appendRow(["Hónap", "Chipelt Halak száma", "Átlag súly", "Legkisebb súly", "Legnagyobb súly"]);
  }

  const data = dataSheet.getDataRange().getValues();
  const header = data[0];
  const rows = data.slice(1);

  const chipIndex = header.indexOf("Chip_Szam");
  const sulyIndex = header.indexOf("Hal_Suly");
  const idoIndex = header.indexOf("Fogas_Ido");

  const latestMap = new Map();

  for (const row of rows) {
    const chip = row[chipIndex];
    let suly = row[sulyIndex];
    let ido = row[idoIndex];

    if (!chip || !suly || !ido) continue;

    if (typeof suly === "string") {
      suly = parseFloat(suly.replace(",", ".").replace(/[^\d.]/g, ""));
    }

    if (isNaN(suly)) continue;

    if (typeof ido === "string") {
      ido = parseDateFromString(ido);
      if (!ido) continue;
    }

    const existing = latestMap.get(chip);
    if (!existing || ido > existing.ido) {
      latestMap.set(chip, { suly, ido });
    }
  }

  const sulyok = Array.from(latestMap.values()).map(e => e.suly);
  const db = sulyok.length;

  if (db === 0) return;

  const sum = sulyok.reduce((a, b) => a + b, 0);
  const avg = sum / db;
  const min = Math.min(...sulyok);
  const max = Math.max(...sulyok);

  const now = new Date();
  const honap = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy.MM");

  const lastRow = summarySheet.getLastRow();
  if (lastRow > 1) {
    const lastDate = summarySheet.getRange(lastRow, 1).getValue();
    const lastDateStr = typeof lastDate === 'string' 
      ? lastDate 
      : Utilities.formatDate(new Date(lastDate), Session.getScriptTimeZone(), "yyyy.MM");
    if (lastDateStr === honap) return;
  }

  summarySheet.appendRow([
    honap,
    `${db} db`,
    `${avg.toFixed(2)} kg`,
    `${min.toFixed(2)} kg`,
    `${max.toFixed(2)} kg`
  ]);
}

function generateHistoricalStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dataSheet = ss.getSheetByName("Hal_Naplo");
  const summarySheetName = "Suly_Figyelo";
  let summarySheet = ss.getSheetByName(summarySheetName);

  if (!summarySheet) {
    summarySheet = ss.insertSheet(summarySheetName);
  } else {
    summarySheet.clearContents();
  }

  summarySheet.appendRow([
    "Hónap", 
    "Chipelt Halak száma", 
    "Átlag súly", 
    "Legkisebb súly", 
    "Legnagyobb súly"
  ]);

  const data = dataSheet.getDataRange().getValues();
  const header = data[0];
  const rows = data.slice(1);

  const chipIndex = header.indexOf("Chip_Szam");
  const sulyIndex = header.indexOf("Hal_Suly");
  const idoIndex = header.indexOf("Fogas_Ido");

  const fogasok = [];

  for (const row of rows) {
    const chip = row[chipIndex];
    let suly = row[sulyIndex];
    let ido = row[idoIndex];

    if (!chip || !suly || !ido) continue;

    if (typeof suly === "string") {
      suly = parseFloat(suly.replace(",", ".").replace(/[^\d.]/g, ""));
    }

    if (isNaN(suly)) continue;

    if (typeof ido === "string") {
      ido = parseDateFromString(ido);
      if (!ido) continue;
    }

    fogasok.push({ chip, suly, ido });
  }

  if (fogasok.length === 0) return;

  const startDate = new Date(Math.min(...fogasok.map(f => f.ido.getTime())));
  const endDate = new Date(Math.max(...fogasok.map(f => f.ido.getTime())));
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

  while (current <= endDate) {
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0, 23, 59, 59);
    const latestMap = new Map();

    for (const f of fogasok) {
      if (f.ido <= monthEnd) {
        const existing = latestMap.get(f.chip);
        if (!existing || f.ido > existing.ido) {
          latestMap.set(f.chip, { suly: f.suly, ido: f.ido });
        }
      }
    }

    const sulyok = Array.from(latestMap.values()).map(e => e.suly);
    const db = sulyok.length;

    if (db > 0) {
      const sum = sulyok.reduce((a, b) => a + b, 0);
      const avg = sum / db;
      const min = Math.min(...sulyok);
      const max = Math.max(...sulyok);

      const datum = Utilities.formatDate(current, Session.getScriptTimeZone(), "yyyy.MM");
      summarySheet.appendRow([
        datum,
        `${db} db`,
        `${avg.toFixed(2)} kg`,
        `${min.toFixed(2)} kg`,
        `${max.toFixed(2)} kg`
      ]);
    }

    current.setMonth(current.getMonth() + 1);
  }
}
