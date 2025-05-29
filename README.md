Hal Mérlegelő Webes Alkalmazás – README
Ez a webalkalmazás Bluetooth-on keresztül csatlakozik egy WH-C06 típusú mérleghez, és segíti a horgászversenyek pontos és gyors mérési adatainak rögzítését.

⚙️ Funkciók
Bluetooth kapcsolat a mérleggel
WH-C06 típusú okosmérleggel csatlakozik egyetlen gombnyomásra.

Horgász nevének rögzítése
Egy szabad szöveges mező segítségével.

Csapat kiválasztása
Legördülő menüből 1-től 24-ig (pl. Csapat 1, Csapat 2 stb.).

Zsáksúly levonás támogatása
"Mérleglőzsák visszamérése" opcióval, amely egy külön menüt nyit, 1.0 kg – 3.5 kg közti választható értékekkel (0.1 kg lépésközzel).

Precíziós korrekció
-/+0.05 kg" kapcsolóval a finomhangolt eredmény érdekében.

Súly kijelzése valós időben
Folyamatosan frissülő tömegadatok a mérlegről (bruttó súly).

Nettó súly kiszámítása
A zsáksúly automatikus levonása után, opcionálisan 0.05 kg hozzáadásával.

Mentés gomb
A számított értékek naplózása vagy adatbázisba továbbítása céljából (a mentés helye jelenleg console.log, de bővíthető).

📦 Használati útmutató
Horgász nevének megadása
Töltsd ki a „👤 Horgász neve” mezőt.

Csapat kiválasztása
Válaszd ki a megfelelő csapatot a „🥇 Csapat kiválasztása” menüből.

Bluetooth kapcsolat
Kattints a 🛜 Csatlakozás a mérleghez gombra, majd válaszd ki a WH-C06 mérleget.

Opciók (ha szükséges)

Jelöld be a „Mérleglőzsák visszamérése” opciót, ha zsákból történik a mérés.

Válaszd ki a zsák súlyát.

Használhatod a „Precíz mérés” opciót 0.05 kg korrekcióval.

Súly megtekintése
A súly automatikusan megjelenik.

💾 Mentés
Nyomd meg a mentés gombot, az eredményeket a konzolban is naplózza.

🛠️ Fejlesztési információk
Web Bluetooth API-t használ (@hangtime/grip-connect)

