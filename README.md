Hal Mérlegelő Webes Alkalmazás
Ez a webalkalmazás Bluetooth-on keresztül csatlakozik egy WH-C06 típusú mérleghez, és segíti a horgászversenyek pontos és gyors mérési adatainak rögzítését.

⚙️ Funkciók
Bluetooth kapcsolat a mérleggel
WH-C06 típusú okosmérleggel csatlakozik egyetlen gombnyomásra.

2 frontend létezik.
index.html horgászversenyekre van kitalálva csapatok fogásának mérésére.
Limitáció: a save methodus nincs kifejlesztve, bele kell kötni egy adatbázisba / sheetbe.

save_catch.html ez egy mérleglő alkalmazás ami chipszám beolvasással rendelkezik, tudja mérni a halak súlyát a mérleggel, de manuálisan is meg tudjuk adni a súlyát a halnak.
Lehetőség van mérleglő visszamérésre, legutóbbi kiválasztott mérleglő súlyt megjegyezzük.
Precíz mérésre +-0.05kg eltolására mivel a mérleg kerekít 0.X-re.
Mentésnél itt egy google sheetes integráció be van fejlesztve cloudflares worker proxyn keresztül kommunikálunk az App scriptel.
Mentés után sheetből vissza adja a fogás nevét és súly differenciát.

