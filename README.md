# Halnyilvántartó és mérlegelő alkalmazás

Ez a projekt tógazdák számára készült halnyilvántartó alkalmazás, amely halfogások és egyedi haladatok rögzítésére szolgál. Az alkalmazás integrálva van a `WH-C06` Bluetooth mérleggel, és támogatja a microchipes azonosítást is.

A rendszer alkalmas a halak:
- chipszámának
- súlyának
- fajának
- fogási helyének
- fogási idejének

nyilvántartására, valamint a mérések alapján a halak hízási tendenciájának követésére.

## Fő funkciók

- Bluetooth kapcsolat `WH-C06` mérleggel
- automatikus súlymérés a mérlegről
- kézi súlymegadás lehetősége, ha nincs aktív mérlegkapcsolat
- mérleglőzsák visszamérés támogatása
- korábban használt mérleglőzsák súlyának megjegyzése helyi tárolóban
- precíziós mérés támogatása `-0.05 kg` és `+0.05 kg` korrekcióval
- halak azonosítása chipszám alapján
- FDX-B típusú microchipek támogatása
- 6 vagy 15 karakteres chipszámok kezelése
- fogási hely és kapcsolódó adatok rögzítése
- horgász nevének rögzítése
- súlymérés után a korábbi adatokhoz viszonyított hízás vagy fogyás visszajelzése

## Mire használható

Az alkalmazás elsősorban a halállomány nyomon követésére készült. Segítségével a visszafogott halak egyedi azonosító alapján gyorsan visszakereshetők, újramérhetők, és összevethetők a korábbi fogásokkal. Ez különösen hasznos növekedési trendek, állománykezelés és adminisztrációs feladatok esetén.

## Mérés és adatkezelés

Súlyméréskor az alkalmazás képes a mérleglőzsák tömegének levonására, így a nettó hal súlya rögzíthető. Emellett elérhető precíziós korrekció is, amellyel a mérés finomhangolható.

A mentés után a rendszer visszajelzést tud adni arról, hogy az adott hal a korábbi méréshez képest hízott vagy fogyott. Ez támogatja a halak fejlődésének és kondíciójának követését.

## Technikai háttér

- frontend: statikus HTML / JavaScript
- backend: Google Apps Script
- adattárolás: Google Sheets
- proxy réteg: Cloudflare Worker

## Versenymérlegelés

A projekt tartalmaz egy külön, versenymérlegelésre előkészített felületet is, amely jelenleg minta jelleggel érhető el.

Ez a rész arra szolgál, hogy csapatok fogásai rögzíthetők legyenek a már meglévő mérlegintegráció és mérési logika felhasználásával.

A versenymérlegelős modul céljai:
- csapatok fogásainak rögzítése
- mért súly mentése
- fogási adatok és faj rögzítése
- dátumhoz kötött eseménykezelés
- a meglévő mérleglőzsák-visszamérés és precíziós mérési funkciók átvétele

Jelenlegi állapot:
- a felület és az alap mérési logika elő van készítve
- a teljes adatmentési folyamat még nem teljes
- chipolvasás integrálása bővíthető
- statisztikai modul és tabella modul későbbi fejlesztési lehetőség

## Kapcsolat

`pallagi.bela@gmail.com`
