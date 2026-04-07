function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const clientKey = data.api_key;
    const API_KEY = PropertiesService.getScriptProperties().getProperty('api_key');

    if (clientKey !== API_KEY) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Unauthorized: invalid API key' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var result = saveCatchData(data.chipNumber, parseFloat(data.fishWeight), data.anglerName, data.catchLocation);

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Hal Napló')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function findFullChipAndFishName(shortChip) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Hal_Naplo');
  const data = sheet.getDataRange().getValues();
  let fishName = "Új_Hal";
  let fullChip = null;
  let latestRow = null;

  for (let i = 1; i < data.length; i++) {
    let rowChip = data[i][0];
    let note = sheet.getRange(i + 1, 1).getNote();
    
    if (rowChip.slice(-6) === shortChip) {
      // Ha a 6 karakter hosszú chip megegyezik
      fullChip = note ? note : rowChip;
      fishName = data[i][1];
      latestRow = i + 1;
      break;
    }
  }

  return { fullChip, fishName, latestRow };
}

function saveCatchData(chipNumber, fishWeight, anglerName, location) {
  // A chipNumber-ben az "ö" betűket cseréld le '0'-ra
  const sanitizedFullChipNumber = chipNumber.replace(/ö/g, '0');
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Hal_Naplo');
  var date = new Date();
  var formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy.MM.dd HH:mm');

  var chipLast6 = chipNumber;
  var fullChipNumber = null;

  // Ha 15 karakteres chipszámot kaptunk
  if (chipNumber.length === 15) {
    fullChipNumber = chipNumber;
    chipLast6 = chipNumber.slice(-6);
  }

  var data = sheet.getDataRange().getValues();
  var fishName = 'Új_Hal';
  var lastWeight = null;
  var existingNote = null;
  var found = false;
  var lastMatchingRow = -1; // A legutolsó egyezés sorának tárolása

  // Keresés a táblázatban az utolsó 6 karakter alapján
  for (var i = 1; i < data.length; i++) {
    var existingChip = data[i][0].toString();
    if (existingChip === chipLast6) {
      fishName = data[i][1];
      lastWeight = parseFloat(data[i][2]);
      existingNote = sheet.getRange(i + 1, 1).getNote(); // Meglévő teljes chip szám a megjegyzésből
      lastMatchingRow = i; // Legutolsó egyezés sorának elmentése
      found = true;
    }
  }

  if (!found) {
    if (chipNumber.length === 6) {
      return { message: 'Nem található a megadott chip szám. Olvasd be a teljes 15 karakteres chipszámot!', weightDifference: null };
    }
    // Ha 15 karakteres chipszám, de nincs találat, új hal lesz
    fishName = 'Új_Hal';
  }

  // Súlykülönbség számítása
  var weightDifference = null;
  var weightColor = '';
  if (lastWeight !== null) {
    weightDifference = (fishWeight - lastWeight).toFixed(2);
    if (weightDifference > 0) {
      weightColor = '#a8e6a2'; // Világos zöld
    } else if (weightDifference < 0) {
      weightColor = '#ffb3b3'; // Világos piros
    }
  }

  // Új sor beszúrása
  var newRow = [chipLast6, fishName, fishWeight + ' kg', formattedDate, anglerName,location, weightDifference !== null ? weightDifference + ' kg' : ''];
  sheet.appendRow(newRow);

  var lastRow = sheet.getLastRow();
  var chipCell = sheet.getRange(lastRow, 1); // Chip szám cella

  // Note beállítása
  if (fullChipNumber) {
    chipCell.setNote(sanitizedFullChipNumber);
  } else if (existingNote && lastMatchingRow !== -1) {
  // Itt is érdemes lecserélni az "ö"-t 0-ra az existingNote-ban, ha még benne van
    const sanitizedExistingNote = existingNote.replace(/ö/g, '0');
    chipCell.setNote(sanitizedExistingNote);
  }

  // Súlykülönbség színezése
  if (weightColor) {
    var weightDiffCell = sheet.getRange(lastRow, 7);
    weightDiffCell.setBackground(weightColor);
  }

  // Visszatérő üzenet
  if (fishName === 'Új_Hal') {
    return { message: '🥳 Gratulálunk a fogáshoz, őt nem ismerjük. Nevezd el!🍾 '};
  } else {
    return { message: '🎉Gratulálunk, megfogtad a ' + fishName + ' nevű 🐠-t!🍾 ', weightDifference: weightDifference };
  }
}
