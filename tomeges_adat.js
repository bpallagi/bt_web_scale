function onEdit(e) {
  const sheet = e.source.getSheetByName('Tomeges_Adat');
  if (!sheet || e.range.getColumn() !== 1) return; // Csak A oszlop

  const szerkesztettErtek = e.value;
  if (szerkesztettErtek && szerkesztettErtek.toUpperCase().trim() === 'END') {
    feldolgozTomegesChipAdatokat(sheet);
  }
}

function feldolgozTomegesChipAdatokat(sheet) {
  const dataRange = sheet.getRange('A2:A'); // A2-től lefelé minden adat
  const data = dataRange.getValues().flat();

  // Csak a nem üres értékeket vesszük figyelembe
  const validChips = data
    .map(chip => chip ? chip.toString().replace(/ö/g, '0').trim() : null)
    .filter(val => val && val.toUpperCase() !== 'END');

  // Frissítsük az A oszlop értékeit a tisztított chip számokkal
  for (let i = 0; i < validChips.length; i++) {
    sheet.getRange(i + 2, 1).setValue(validChips[i]);
  }

  // Töröljük az END sort
  const endRow = data.findIndex(val => val && val.toString().toUpperCase().trim() === 'END');
  if (endRow !== -1) {
    sheet.getRange(endRow + 2, 1).clearContent();
  }

  // Utolsó 5 chipszám frissítése a C oszlopba
  const last5 = validChips.slice(-5);
  for (let i = 0; i < 5; i++) {
    const cell = sheet.getRange(i + 2, 3); // C oszlop
    if (i < last5.length) {
      cell.setValue(last5[i]);
    } else {
      cell.clearContent();
    }
  }
}
