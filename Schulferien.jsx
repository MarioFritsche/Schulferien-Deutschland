// Schulferien.jsx
// © 27.05.2020 / Mario Fritsche
// DESCRIPTION: Übersicht über alle Schulferien in Deutschland
// www.indesign-kalender.de

//Notwendige Datei, um JSON auszuwerten
#include "json.jsx";
//Import JSON
var _apiVacation =
  "curl -X GET 'https://www.indesign-kalender.de/api/v1/vacation.json'";

var _apiRequestStringCurrent = app.doScript(
  'do shell script "' + _apiVacation + '"',
  ScriptLanguage.APPLESCRIPT_LANGUAGE
);
var _jsonContentCurrent = _apiRequestStringCurrent;

//Abfangen Fehler
if (_apiVacation) {
  try {
    var _apiRequestStringCurrent = app.doScript(
      'do shell script "' + _apiVacation + '"',
      ScriptLanguage.APPLESCRIPT_LANGUAGE
    );
    var _jsonContentCurrent = _apiRequestStringCurrent;

    //Prasen
    json = _jsonContentCurrent;
    objekt = JSON.parse(json);
  } catch (e) {
    alert("Keine Verbindung zur Datenbank");
    exit();
  }
}

//New Aarray

// Liste Schuljahre
_schoolYear = [];
for (var i = 0; i < objekt.base_data[0].school_year.length; i++) {
  dataSY = objekt.base_data[0].school_year[i];
  _schoolYear[i] = dataSY.year;
}

// Liste Bundesland
listBundesland = [];
for (var i = 0; i < objekt.base_data[0].location.length; i++) {
  dataBL = objekt.base_data[0].location[i];
  listBundesland[i] = dataBL.location_name;
}

// Liste Jahre
var yearsList = [];

// Schuljahre durchlaufen und Jahre extrahieren
for (var i = 0; i < objekt.base_data[0].school_year.length; i++) {
  var yearRange = objekt.base_data[0].school_year[i].year.split("/"); // Split nach "/"
  yearsList.push(yearRange[0]); // Erstes Jahr hinzufügen
  yearsList.push(yearRange[1]); // Zweites Jahr hinzufügen
}

// Duplikate manuell entfernen, ohne indexOf
var uniqueYears = [];
for (var j = 0; j < yearsList.length; j++) {
  var isDuplicate = false;

  // Schleife, um zu prüfen, ob das Jahr bereits in uniqueYears ist
  for (var k = 0; k < uniqueYears.length; k++) {
    if (yearsList[j] == uniqueYears[k]) {
      isDuplicate = true;
      break;
    }
  }

  // Wenn es kein Duplikat ist, hinzufügen
  if (!isDuplicate) {
    uniqueYears.push(yearsList[j]);
  }
}

//Platzhalter für Suche
var _changeTried = "##";

//Funktion zum Filtern doppelter/mehrerer Einträge
Array.prototype.contains = function (v) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === v) return true;
  }
  return false;
};

Array.prototype.unique = function () {
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    if (!arr.contains(this[i])) {
      arr.push(this[i]);
    }
  }
  return arr;
};

// _WINDOW
// =======
var _window = new Window("dialog");
_window.text = "Schulferien in Deutschland";
_window.preferredSize.width = 392;
_window.orientation = "column";
_window.alignChildren = ["left", "top"];
_window.spacing = 10;
_window.margins = 16;

// PANELAUSWAHL
// ============
var panelAuswahl = _window.add("panel", undefined, undefined, {
  name: "panelAuswahl",
});
panelAuswahl.text = "Auswahl";
panelAuswahl.preferredSize.width = 380;
panelAuswahl.orientation = "row";
panelAuswahl.alignChildren = ["left", "center"];
panelAuswahl.spacing = 20;
panelAuswahl.margins = 11;

// GROUPAUSWAHL
// ============
var groupAuswahl = panelAuswahl.add("group", undefined, {
  name: "groupAuswahl",
});
groupAuswahl.orientation = "column";
groupAuswahl.alignChildren = ["left", "center"];
groupAuswahl.spacing = 10;
groupAuswahl.margins = 0;

// GROUPRADIOAUSWAHL
// =================
var groupRadioAuswahl = groupAuswahl.add("group", undefined, {
  name: "groupRadioAuswahl",
});
groupRadioAuswahl.orientation = "row";
groupRadioAuswahl.alignChildren = ["left", "center"];
groupRadioAuswahl.spacing = 10;
groupRadioAuswahl.margins = 0;

var schuljahr = groupRadioAuswahl.add("radiobutton", undefined, undefined, {
  name: "schuljahr",
});
schuljahr.text = "Schuljahr";
schuljahr.value = true;
schuljahr.preferredSize.width = 150;

var kalenderjahr = groupRadioAuswahl.add("radiobutton", undefined, undefined, {
  name: "kalenderjahr",
});
kalenderjahr.text = "Kalenderjahr";

// GROUP1
// ======
var group1 = groupAuswahl.add("group", undefined, { name: "group1" });
group1.orientation = "row";
group1.alignChildren = ["left", "center"];
group1.spacing = 10;
group1.margins = 1;

var selectSchuljahr = group1.add("dropdownlist", undefined, undefined, {
  name: "selectSchuljahr",
  items: _schoolYear,
});
selectSchuljahr.selection = 0;
selectSchuljahr.preferredSize.width = 150;

var selectKalenderjahr = group1.add("dropdownlist", undefined, undefined, {
  name: "selectKalenderjahr",
  items: uniqueYears,
});
selectKalenderjahr.selection = 0;
selectKalenderjahr.preferredSize.width = 150;
selectKalenderjahr.enabled = false;

kalenderjahr.onClick = function () {
  if (kalenderjahr.value == true) {
    selectSchuljahr.enabled = false;
    selectKalenderjahr.enabled = true;
  }
};
schuljahr.onClick = function () {
  if (kalenderjahr.value != true) {
    selectSchuljahr.enabled = true;
    selectKalenderjahr.enabled = false;
  }
};

// PANELBUNDESLAND
// ===============
var panelBundesland = _window.add("panel", undefined, undefined, {
  name: "panelBundesland",
});
panelBundesland.text = "Bundesland";
panelBundesland.preferredSize.width = 380;
panelBundesland.orientation = "column";
panelBundesland.alignChildren = ["left", "center"];
panelBundesland.spacing = 10;
panelBundesland.margins = 10;

var radioBundesweit = panelBundesland.add("radiobutton", undefined, undefined, {
  name: "radioBundesweit",
});
radioBundesweit.text = "Bundesweit";
radioBundesweit.value = true;

var radioBundeslandauswahl = panelBundesland.add(
  "radiobutton",
  undefined,
  undefined,
  { name: "radioBundeslandauswahl" }
);
radioBundeslandauswahl.text = "Bundesland auswählen";

var selechgtBundesland = panelBundesland.add(
  "dropdownlist",
  undefined,
  undefined,
  { name: "selechgtBundesland", items: listBundesland }
);
selechgtBundesland.selection = 0;
selechgtBundesland.preferredSize.width = 280;
selechgtBundesland.enabled = false;

radioBundesweit.onClick = function () {
  if (radioBundesweit.value == true) {
    selechgtBundesland.enabled = false;
  }
};
radioBundeslandauswahl.onClick = function () {
  if (radioBundesweit.value != true) {
    selechgtBundesland.enabled = true;
  }
};

// GROUPBUTTON
// ===========
var groupButton = _window.add("group", undefined, { name: "groupButton" });
groupButton.orientation = "row";
groupButton.alignChildren = ["right", "center"];
groupButton.spacing = 10;
groupButton.margins = 0;
groupButton.alignment = ["right", "top"];

var buttonBreak = groupButton.add("button", undefined, undefined, {
  name: "buttonBreak",
});
buttonBreak.text = "Abbrechen";

var buttonStart = groupButton.add("button", undefined, undefined, {
  name: "buttonStart",
});
buttonStart.text = "Ausführen";

// _WINDOW
// =======
var divider1 = _window.add("panel", undefined, undefined, { name: "divider1" });
divider1.alignment = "fill";
var groupEnd = _window.add("group", undefined, { name: "groupEnd" });
groupEnd.orientation = "row";
groupEnd.alignChildren = ["right", "center"];
groupEnd.spacing = 10;
groupEnd.margins = 0;
groupEnd.alignment = ["right", "top"];

var image1_imgString =
  "%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%C2%8C%00%00%00)%08%06%00%00%00%C3%A7%11%C3%81c%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C3%89e%3C%00%00%03)iTXtXML%3Acom.adobe.xmp%00%00%00%00%00%3C%3Fxpacket%20begin%3D%22%C3%AF%C2%BB%C2%BF%22%20id%3D%22W5M0MpCehiHzreSzNTczkc9d%22%3F%3E%20%3Cx%3Axmpmeta%20xmlns%3Ax%3D%22adobe%3Ans%3Ameta%2F%22%20x%3Axmptk%3D%22Adobe%20XMP%20Core%209.1-c002%2079.a6a63968a%2C%202024%2F03%2F06-11%3A52%3A05%20%20%20%20%20%20%20%20%22%3E%20%3Crdf%3ARDF%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%3E%20%3Crdf%3ADescription%20rdf%3Aabout%3D%22%22%20xmlns%3Axmp%3D%22http%3A%2F%2Fns.adobe.com%2Fxap%2F1.0%2F%22%20xmlns%3AxmpMM%3D%22http%3A%2F%2Fns.adobe.com%2Fxap%2F1.0%2Fmm%2F%22%20xmlns%3AstRef%3D%22http%3A%2F%2Fns.adobe.com%2Fxap%2F1.0%2FsType%2FResourceRef%23%22%20xmp%3ACreatorTool%3D%22Adobe%20Photoshop%2025.12%20(Macintosh)%22%20xmpMM%3AInstanceID%3D%22xmp.iid%3AB634260776AF11EFB42DD89526E957F8%22%20xmpMM%3ADocumentID%3D%22xmp.did%3AB634260876AF11EFB42DD89526E957F8%22%3E%20%3CxmpMM%3ADerivedFrom%20stRef%3AinstanceID%3D%22xmp.iid%3AB634260576AF11EFB42DD89526E957F8%22%20stRef%3AdocumentID%3D%22xmp.did%3AB634260676AF11EFB42DD89526E957F8%22%2F%3E%20%3C%2Frdf%3ADescription%3E%20%3C%2Frdf%3ARDF%3E%20%3C%2Fx%3Axmpmeta%3E%20%3C%3Fxpacket%20end%3D%22r%22%3F%3Ex%C2%A4%C2%A2%0A%00%00%0B%C3%BCIDATx%C3%9A%C3%A4%C3%9Cy%C2%90%14%C3%95%1D%07%C3%B09%7B%C3%AEk%C3%AF%13%C2%96KI%C2%95%C2%88%C3%9Cb*%5E%C2%ACX!%C2%89%C3%89RZ%26%C2%95*R)%C3%B3Gb%C2%8C%C2%8A%C2%A2Q%3C%10%C3%B0%C2%88Q%01cb%C2%ACJ%25%C2%95T*%7F%24%C3%86%C3%88r-%C2%902*A%12%C2%8C%C3%91%20Zr%C2%B3%C3%8B%C2%B2%C3%8B%C3%8E%0E%7B%C3%B5%C3%9C%7D%C3%A6%C3%BBz%C2%A6%C2%97fwvwz%C3%A87%3Bh%2FS%7BL%C3%93%C3%BB%C3%A6%C2%BDO%C3%BF~%C2%BF%C3%97%C3%BDv%C3%8C_%C3%BF%C3%91jS%C2%A9of%C2%B3%C3%99d%C2%B1XL2%3E%C3%B84%1FH%24R%C3%B3%C2%92%C3%B1%C3%94%C2%92d25%C2%8F%C3%A3%C3%B8%19%C2%A2%20VK%C2%92%C3%A4%C2%95%24%C3%99j%C2%B1Zx%C3%AC%3Bd%C2%B3Y%C2%BB%1CN%C3%A6%C2%A8%C3%8B%C3%AD%C3%BC%C3%80%C3%ADv%1Dt%C2%B9%1D%C2%87m6%C2%9BH%C2%8E!%C2%89%C2%92!%C3%AD%22m%22m%13E%C3%91%C2%94J%C2%A6g%C3%87%C3%A3%C3%89%C3%85%C2%A9Dja%3A%C3%85%7D%C2%89%C3%A7%C2%85%06I%C2%96C%C2%B2%241%C3%98G%C3%86%23f%C2%B5Y%23%0Cc%3F%C3%A5t9%0Ee%C3%9B%C3%B4!%C3%A3%60%C3%BA%C3%891%C3%90~%C2%93%2C%C3%8B%C2%A5%3F%16%C2%A5%0CF%C2%85%C3%82%C3%B3%C2%BC%3B%C3%8A%C3%86%C2%9B%C3%99%C3%81%C3%98J%0C%C3%8AW%04%5Eh%02%0E%C2%8BY%C3%99)%C2%B3%C2%9Fv%C3%8B%C3%B4%C2%BBlR%C3%BB%C3%9Fj%C2%B5%24%19%C2%87%C3%BD%C2%88%C3%97%C3%A7%C3%9E%1B%08%C3%B8%C3%BE%C3%A6%C3%B1%C2%B9%C3%9E'%C3%87%C3%8D%0CR%01P%C2%AC%C3%80%2B%C3%89%26%C3%80%C2%BD%C2%8A%1D%C2%88~%2B%1A%C2%8D%C2%AF%00%C2%92%C2%ABp%3C%1F9%C2%9E9%C3%9B%C2%B0%11%C3%8D%1A%06%C2%91%C3%99%C3%87%2C%C3%9B%C3%AD%C3%96N%C2%97%C3%87u%20%10%C3%B0%C2%BE%C3%A9%0Bxv%03%13%C2%8B%C3%97U%C3%92pJ%12%C2%8C%0A%C2%85%C3%A3%C2%B8%C3%B2%C2%BE%C3%88%C3%A0%5D%C3%BD%7DC%3F%C3%A0R%C3%9C%2C%C3%A59%C2%8By%14%C2%90%7C62%08d0%2C%C3%B8%C2%BFn%C2%8Fk_yU%C3%A8%C2%95%60%C3%88%C3%B7%060%C3%89b%C2%9E%11G%C2%8524%18%5B%C3%9E%17%C3%A9%C2%BF7%16M%C3%9E%0A%246rL%C2%B3%C2%A5%C2%B06e%1E%26%13%C2%B0%C2%9C%09%C2%95%C3%BB%C3%BFP%5E%19z%C3%8D%C3%A9tt%C2%97j%C3%84)90%C3%993%C3%9Fr%C2%BEw%C3%A0%C2%87%C2%91%C3%9E%C3%BEG%C2%B84%C3%9Fh)%10%C3%89X%1B%C2%81CF%C3%89%C3%ADu%C2%BDW%5D%5B%C2%B1.%10%C3%B2%C2%BD%25%C2%8Fsf%C2%93_M%C3%9A%C2%85(%C2%B7%C2%A0%C2%A7%C3%BB%C3%BC%C2%86%18%22%C2%8A%C3%9AV%C2%A36%15%C2%B4%C3%9Dn%C3%AB-%C2%AF%0Cn%C2%AE%C2%AA)%C3%9F%C2%82%14%C2%962*%7D%1A%C2%B5Y%C2%AFX%C2%B4%C2%B4t%1Ac%C2%B5%C2%9A%12%C3%B1%C3%A4%C2%9C%C3%B6S%5D%7F%C3%AE%3B%3Fx7%3A1%C2%A0%C3%96%09FG0%12%118N%C2%982%C3%98%C3%8F%C2%AE%02%C3%8A*%C2%A4%C2%AB%C3%BD%18%C2%A0%C3%B4H4J%7D!%C2%9B%C2%98%C2%AE%C3%8E%C3%B0%C2%B3x%C3%BC%C2%86Ks%C2%B3i%C2%B5%C2%89%C2%9C%188Y%3CQ6%C3%91%C3%8C%0E%C3%85V8%1C%C3%8C%C2%A7.%C2%97%C2%A3%C2%B3%C2%A4N%C3%A8%C2%92IA%08%C3%B7%C2%91p%C3%9F%C2%AA%13G%3B%C3%B6%03%C3%8D%0DH%15%C2%86%0F%C3%8A%C3%A8h%C2%96%19%24%C2%82%C3%B3%C3%B8%C2%91%C2%8E%7D%C3%B1hb.A%7B%C3%91%C2%99%C2%9F)%C2%93%C2%90%C2%B6D%3F%C3%8Ev%C3%86%C3%88%C2%A82V_%C2%90%C3%97%C2%9EJr%C3%B3O%1D%C3%AF%C3%BCGOWd%C2%B5%02%C2%9Cr_%5C6%11F%C3%A9%08%C3%BC%C3%AB%C3%AE%C3%AC%C3%9D%C2%80%C3%8E%C3%99%C2%8C%C2%AF%1D%C2%B4%07%25%17%1C%C2%81%17k%06%07%C3%98%3B%1D%0Cs%185%C3%8Eqm%C2%A4A%1B%25%C3%94%3B%3B%C2%B1%C2%8F%2F%1EK%5Eg%C2%B1%C2%98%C2%8B%C3%93%2F%26%C2%B3%C2%95e%C3%A3%C2%B7%C3%B2%1C_%C3%AD%0Fx%C3%9BH%C2%A1%C3%BC%C2%85%06%C2%A3b%C3%A9l%3F%C2%B7%055%C3%8B%C3%83%C3%85%C2%88*%C3%A3%C2%B5%05H%5CC%C2%83%C3%91%3BPG%7C%C3%A6%C3%B1%C2%B9%3F%23u%C2%8Df%0F%C2%93%3F%C3%A4%C3%9D%C2%8B%19%C2%9A%1Fh%C2%96%16%07M%06s%3C%C2%9EX%C2%84Y%C3%98L%C3%94Z%C2%ADH%C2%A5%C2%B2I%C3%BE%02%C2%82%C3%91%60y%193%C2%A1%C3%BB%08%C2%96RH%C2%8D%C2%A4OP%3F%C2%B4%00%C3%8D%C2%A7%1E%2F%C3%90h%23%0D%3E0h%7By%5E%0C%14%0B%C2%8DZ%5C'%13%C3%A9%C2%AB%C3%93%C2%A9%C3%B4%C2%8C%40%C3%90%C2%B7u2%C3%91L%0A%18md)%15%2C%C2%B9%C3%90%C3%98%C2%80%06%C3%85%C3%B0%C2%91%C2%91%C2%91%26%10%C3%B2%C3%AEA%C2%A4%09%02%C3%8D%C2%B5%C3%85Cc%C3%96%C2%A2i%C2%9D%C2%AC%C3%B4Tt0%C2%A5%C2%8C%25g%C2%A4a%10iF%C2%A01%2B%C3%A9%C3%89%C2%B7%C2%87%C3%A7%C2%85%C3%90%C2%A4%C2%A1%C2%99%C2%A4%C3%B4TT0%1A%2C%C2%9B%C2%81%C3%A5%C3%BER%C3%842%0A%C3%8D%C2%A0%C2%82%C3%A6%C2%93%5Chp%C2%A6%C3%AF%C2%9ED4%C3%93%C2%95HSd4E%03%C2%93%C2%99%1A%C2%9ALg%C3%9B%C3%8Fm%02%C2%96%C3%95%C2%A5%C2%8Ce%0C4%C2%87%C2%81%C3%A6%C3%A8Eh%C3%8CJM%C2%B3%C2%9B%C3%A7%C2%84%C2%B2x%3C%C2%B9%C2%A4%C3%88h%C3%A6%C2%A2%10%C2%9E%064%C3%9B%C2%8A%C2%99%C2%9E%C2%8A%02F%C3%85%C2%82%C3%88%C3%B2%C3%92%C3%B9%C3%88%C3%A0%03%C2%97%03%C2%96%11hlY4%1F%C2%8FB%C2%A3F%1AN(%2F%3E%C2%9A%C3%94%C3%9Ct%C2%9Ak%0Afj%C2%9A%C3%8F%07%18%0D%C2%96%17%C2%81%C3%A5%C3%81%C3%8B%09K%0E4%2B%C3%AD%C2%8C%C3%BD%C3%A31%22M%1B%C3%90T%C2%90%3B%C3%96EFs%0D%C3%90L%C3%8DF%C2%9A%C3%8B%1B%C3%8C0%C2%96%C2%8E%C2%9E%C3%8B%16%C3%8Bh4%C3%91%16%C2%86%C2%A0%C3%B1%C2%BA%C2%8F%C2%8D%C2%9Ar%07'%07M%02h8%C2%82%26D%1F%0D50%1A%2C%2F%C2%9C%C3%AF%1DXC%0B%0B%C2%B9%C2%AB%2BI%17%C2%96%0D%C2%A87%C3%B1%C3%8C9%C2%96%3D%18%C2%85f(%C2%83%C3%A6%10%22%C3%8D%C2%B1Q%C2%91%06h8N%C2%A8%C2%8C%C3%87%12%C2%8B%2F%C2%B4)%7B%C3%83%C3%93%24S%C2%B909%C2%8C%26%C3%85M%09RFc%C2%A3%C2%87%C3%85%0C%2C%C3%A7~N%0B%0B%C2%81b%C2%B1X8%7F%C3%80%C2%BB%C3%9B%C3%A7%C3%B7%C3%ACa%1C%C3%8CQ%C3%BC%C3%8E%04~%5E%C2%860%C2%BD%00%C3%A9%C3%A3%C2%9B%C3%89dj%C2%BE%C3%91%C3%B7a%C2%B2W%C2%84%C2%9Dg%C3%9A%C2%BB_%C3%87%C2%B7w%C2%94U%06w%C2%88%C2%82%C2%98%05%C2%9B%01%C3%918%C2%B5%C3%A6%1E%C2%97%C3%9B%C3%B1%3F%C2%9B%C3%8D%C3%96o%C2%B3Y%7B%C3%B0%C2%8C%23%C2%9D%C3%A6g%C3%86%C3%98xs4%C2%9A%C3%B8%C2%9A%24%C2%8A%1E%C2%A3o%7F%C2%90%3E%1E%C3%A8g%C2%BFO%C2%9A1uz%C3%BD%5D%C3%99v%1A%3F%C2%B6F%2Fo%C3%90%60y%5E%C2%BD%C3%9Co%C3%B4F%C3%96%C2%AF%00I%5Bm%7D%C3%A5%C2%A3H%0D%C2%87%C2%94%C3%8E!s%C3%8B%C3%AC%C2%9DB%C2%92%1EDQ%C2%B4%0C%C3%B4%0D%C3%9D%C3%99%C3%93%1Dy%1ES%C3%9FF%C2%A3%07(%3B%18%C2%A9)%C3%93%C3%AAn%2F%C2%AB%08%C3%AET%C3%91d%C3%BA%C3%A0%C3%82%C3%92%07u%C3%8C%C3%946%02%C3%B3%C2%AC%C2%9E%C2%AE%C3%88%C3%BA%C2%A1%C2%81%C3%A8w%2C%C2%94%C3%BA%26T%C3%A6%C3%BF%1DA%C2%A3igi%C2%A6%C2%A4ba%C2%A9%C2%A8%0Amj%C2%9A%5E%C3%BF%3D%C3%86%C3%89%C2%84%C3%95%C2%85F%23%1Fd%C2%AA%C2%89%C2%94%C3%B1%09%22%C3%90_%C3%89e%7C%3E%C3%8D7%C2%98-%C3%86F%C2%9ALz%C2%8A%C2%B50%0E%C3%BBG%C2%80%7B%5C%C2%9B%C2%9Er%C2%B5%C2%89%3C%C2%90%C3%8A%C3%BACe%C2%817%24Y%C3%A6%C2%A2l%7C%C2%99%C3%91%C2%B5N6%3D%C3%8DC!%C3%9C%18%0C%C3%B9%0DOO%C2%86%C2%81%19%C2%BE%C3%8E%C3%92%C3%91%C3%B33%60%C3%B9)E%2C%2F4N%C2%AD%7DH%19%14i%C3%BC%C2%B3%C2%87%3C%C2%8FY%0DK%C2%96%40%C3%86b%C2%89%C3%AB%C2%81%C2%A6%C3%91x4%C2%B2%1D5%C3%8D%C3%8A%5Ch%C3%86%C2%89L%C2%A8u%C2%BC%C3%BB%C3%B1u%12hn%C2%A1%C2%82%26%C2%9E%C2%9A%0F4%0D%40%C2%B3%C3%9DH4%C2%86%C2%80Q%23%0B%C2%B0%3C%17%C3%A9%1Dx%C2%84%22%C2%96%17%C2%81%C3%A5a%C3%B5l%C3%8D7u%C2%A0%C2%96H*h%C2%A2%40%C3%83%C3%91%40c%02%C2%9A%18A%C3%B3!%C3%90%C2%9C%C2%98%08%C2%8D%C2%BA%C3%B9%02%C3%9E%C3%B7L%C2%92%C2%9C%22%C3%AB%C2%95)%C2%A2%C2%A97%12%C3%8D%25%C2%83%C3%91%60y%16X%1E%C2%A5%C2%88%C3%A5%25%14%C2%93%0F%C2%A93%C2%A1%3C%07%C3%B2%224%C3%BE%C2%A0wk%16M%03%C2%9DHC%C3%92%13%034%C2%AE%C3%BC%C3%91%04%154i%C2%8Ah%16pi%C2%BE%1ESnC%C3%90%5C%12%C2%98a%2Cg%08%C2%96~zX*%C2%81%C2%A5%C2%A9fM%C3%9EX%C3%88RG%C3%AC%C2%A7%0C%C2%80%C2%9C%13%C3%8D%0D%14%C3%91%C2%ACt%00%C2%8D%5B%1F%C2%9A%C3%BD%C3%98%C2%97%5EM%C2%93AS%074%3B.%15M%C3%81%604X%C2%9E%C2%89%C2%84%C3%BB%C3%97R%C3%84%C2%B2I%0F%16%C2%B2%C3%84%C2%92%1D%C2%8A~%C3%B9%C3%8C%C3%A9%C3%AE%C3%9Fz%3C%C3%AEw%1C%0E%3B%7B%C3%A1%C3%8F%3B%C2%86%C3%91%C2%BCY%044%C3%BFu%7B%5C'%C3%B3M%C2%9D~%05%C2%8D%C3%84G%C3%99%04M4%C2%B5%C2%97%C2%8A%C2%A6%200%1A%2CO%03%C3%8Bc%14%C2%B1l%06%C2%96%07%C3%B5a%C2%89-%C3%AE8%C3%95%C2%B5%3D%C2%9D%C3%A2%C3%A6%C2%A0%C3%B3%C2%97c%C3%BA%C2%BD%C2%8D%C3%89%C2%8Dfk4%C2%9A%C2%B8%11h%C3%AAi%C2%A0!%C3%B7%C2%9E%C2%80%C3%A6%03D%C2%9A%C2%93%C3%B9F%1A%C2%B4%C3%A9%C2%9F%C3%98%C2%97%C2%A7%18i%16%02M%0D%C3%90%C3%AC%2C%14%C2%8Dn0%1A%2C%1B%C2%81%C3%A5qZX%C3%8A%2B%C2%83%5B%1A%C2%9Bj%1F0%C3%A9%C3%83%C2%B2%C2%A8%C3%BD%C3%A4%C3%99%5D%C2%98jW%C2%90k%1C%C2%82%20T%C2%B1l%7C%C2%B9%C3%8F%C3%A7%C3%99%3E%0A%C2%8D%C3%9D%C2%96%C3%80%C2%94%3B%C2%83%C2%86%07%1A%C2%A3%2F%C3%AE%C2%99dF%C2%894%C3%8EB%C3%90H%02%C2%B0%C3%9FL%0D%0D%074%C3%81%C3%82%C3%90%C3%A8%02%C2%A3b%C3%A9*%02%C2%96)M%C2%B5%C2%AB%0B%C3%80%C2%B2%13X*%C3%95%C2%8E%20%C2%9F5hH%C2%A4%C2%89%C2%8E%C2%884%09%7F%C3%90%C3%93%C2%8A3%1A%C2%91F%C2%A0%11i%C2%98lz%C3%BA%0F%C3%90%C2%9C%C3%92%C2%89F%C2%A4%C2%8C%C2%A6%C2%BA%104y%C2%83%C3%91%60%C3%99%C3%90%1B%C3%AE%7F%C2%82%22%C2%96%C2%97%1B%C3%B5bac%0B%C2%95%C3%88%22%02%C3%8B%C2%88%0E%C3%96%C2%A0%C2%B9EIO%C3%8C%084%C2%94%23%0D~%09A%C3%93R%00%C2%9A%7D%40%23%01%C3%8DM%C2%94%C3%90%2C%02%C2%9A*%C2%A0%C3%99%C2%A5%C3%A75%C3%A7%05F%C3%BD%C3%83%C2%AF%C2%AE%C3%8E%C2%9E%C3%B5%C3%80%C3%B2%24E%2C%C2%BF%00%C2%96%C3%BBuc9%C2%81%C3%88%22JUcE%C2%88%2C%C2%9Ajv(%C3%9E%C2%9C3%C3%92%104~%0F%C3%90%C3%84o%C3%A2y%C2%A1%C2%8E%06%1A%C2%B6%C2%90H%13%C3%88%C2%A2%C2%89%C2%96%0E%C2%9A%09%C3%81%0CG%C2%96%C3%8E%C3%B0S%C2%BD%3D%C3%BD%C3%AB%C2%A8a%C2%A9P%C2%B0%C3%9C%C2%A7%C2%BD%1A%3A%11%C2%96(%1B%5B%00%2C%C2%A4f%C2%A9%C2%9A(%C2%9D%C2%A8h%C3%88%C2%95Uo%C2%AEH%C3%83%104%C3%9EV%C2%A0%C2%B9%C2%99%06%1A%C3%B9%02%C2%9A%C3%B7%C2%81%C3%A6%C2%B4N42M4H%C3%87%C2%95%C3%B9%C2%A2%19%17%C3%8C%C3%85X%C3%BAhby%C2%A5%00%2C%C3%B3O%C2%9F8%C3%9B6%5Ed%19%13%0D%22%0D%C3%90%C2%B4%02Ml%04%C2%9A%C2%B8%C3%8FO%C2%AE%C3%93PE%C3%93%C3%A2t0%07u%C2%A2y%C2%97%C3%9C3%C2%8B!m%C3%92%40C%C3%96%C3%AF%C2%90u%3Cdi%C3%86D%C2%AFyL0%1A%2C%C3%AB%C2%80%C3%A5)%C2%8AX~%09%2C%C3%B7%C3%AA%C3%86%C2%92%C2%A9Y%C2%AA%C3%B5%16%C2%AAY45c%C2%A1%C2%B1%03%C2%8D%12iX%05M-%054%0ER%08%3B%C2%9D%C2%8E%C2%83nO%C3%89%C2%A1)%C2%9F%08MN0%1A%2CO%02%C3%8Bz%C2%8AX~%05%2C%3F%C3%91%C2%89e%1E%C2%B0%C2%B4%15%C2%82%25%07%C2%9Ae%04%C2%8D%3DW%C2%A4%09x%5BcT%C3%91D%09%C2%9A%7F%C2%BB%C3%9D%C2%AEv%1D%17%C3%B7%C3%9E%C2%95D%C3%91L%11%C3%8D%C2%92%C2%89%C3%90%C2%8C%02s%C2%A1%C3%80%0D%3F%01%2C%1Bha)%03%16L%C2%9D%C3%AF%C3%91%C2%8BE%C2%99%0D%09R%C3%8D%C2%A5N%C2%81%C2%B5%C2%91%C3%86%C2%9F%03%C2%8D%3D%C2%83f%1B%C3%90%2C%C2%A3%C2%88%C2%A6%C3%85%C3%A9%02%1A%0F%C3%90%C3%A4%1Di%7C%C3%AF%60%C3%86m!W%C2%AA%C2%A9%C2%A1%C3%A1%C2%852%C3%B2%C3%97%10d%5D%C3%91%C2%B8%60T%2C%C3%9Dghc%09%C2%BC%3A%C2%A5%C2%A9N'%C2%96%C3%B85Jd1%00%C3%8BH4%C3%AC%60%C3%BC%C2%AB%5E%C2%BF%7B%17%C2%90%0Cj%C3%AF%3D%C3%A1%C3%BBX6%C3%924%C2%A3%13k%C2%A8F%1A%C3%BDh%C2%AC%C3%94%C3%90%C3%84%144%C2%A1%20%C3%90%C2%98F%C2%A0%19%063%C2%8C%C2%A53%C3%BCx%C2%B8%C2%A7o%23E%2C%C2%BF%06%C2%96%1F%C3%AB%C3%85B%22%C2%8B(H%C2%B5FwP%C3%B6%C3%AD%C3%83%C2%84P%C2%99%C3%BFO%0Cc%C3%AB%C3%936I%C2%83f%1B%C2%B9%5C%2F%C3%90E%C3%B3%2F%C2%A0%C3%A9%C3%90%C2%81%C3%A6mQ%14m%C3%A4%C3%AE%3B%254%C3%97%02M%10%C2%91f%C2%8F6%C3%92(%604X%1E%0B%C2%9F%C3%AB%7B%C2%9A%22%C2%96%C3%97%C2%80%C3%A5n%3DX0c%C2%99%0B%2Cm%C2%A2%20%1A%C2%8E%25%C3%BB%C2%8EO%C2%A7%C2%A7_%C3%91%C3%98%C2%8CY%C3%8B1)%C3%87%60%C2%A9h%C3%BC%194%C3%8D%14%C3%91%C2%B4%C3%A8E%C2%83Z%C2%A3(h%10i%C3%B6%C2%A8%C2%91%C3%86z%C3%A5%C3%A2%C3%ABT%2Ck%C2%81%C3%A5%19%C2%A3%C2%B1dV%C3%B1%2B5%C3%8B%C2%ABz%C2%B1D%C2%A3%C3%B1%C2%AB%C3%9BO%C2%9C%C3%9DM%C2%B0%C2%98%0D%C3%AE%10%02%C2%98q%C3%98OL%C2%9B%C3%95%C2%B0%C3%82%C3%A3q%1D%1F%C3%AF%C2%AD%C3%814hZ%01%C3%B8F%C2%8E%13%C3%AA%2C%16%C3%A3%17%C2%96g%C3%91%1C%40!%C3%9C%C2%91o!L%C3%90HY4F%C3%BF%C2%A5%C2%84%C2%8A%06'I%20%C2%90Ec%C2%9D%0D0%C3%9Dg%7B%0D%C3%87%C2%A2%C2%AC%C2%8A%C2%93%C2%94%C3%BB5%C3%A1%C2%9A%C2%BA%C3%8A%C2%B5u%0D%C3%95%C3%AB%C3%B2%C3%85Bn%1C%C2%A2nX%C3%90~%C2%B2%C2%ABM00%C2%B2%0C%C2%AF%C3%94%C3%83'%7F%C3%90%C3%B7z%C3%93%C2%8C%C3%BAo%C2%BB%C3%9C%C3%8E%C3%B6%7C%C3%9EGNAc%C2%B7%C3%85%02!%C3%BF_%C3%90%C2%81%15%C2%A9dz%0E~f%1D%C2%BE%C2%9Ak%1C%C2%9A%C3%9BQ%08%1Ft%C2%BB%C2%9D%C2%A7%C3%B3%C2%9F%3D%C3%B9%C3%9E%C2%B6%C3%9B%C2%AD%C3%AD%C3%89Dz%3E%22N%C3%80%C2%A86i%C3%90%2C%C3%858%04p%C3%82%C3%BC%C3%9D%C2%BC%C3%A0%C2%B6%C3%AF%C2%AE%C2%89%C2%84%076%C3%A2%09%C3%92k%C2%86%2C1%C3%87%C2%80'%18%C2%BB%C3%BD%24)%24%C3%8B%C3%8A%C2%83%C2%BF%C3%87%C2%A0t%C2%8A%C2%92%C2%98%C3%97%C3%91%C2%B3W%1Fg%C2%9E%3A%C3%9E%C2%B9%03%C2%8D%C2%9C%C2%8E%C3%AF9%C2%83%C3%8Eb%C3%91f%C2%B3%C2%86%C3%91%C2%96%03%C2%A1%C3%B2%C3%80%1F%C3%B1%C3%A2%C3%9FR%C3%9F%1FW%C3%AF%C3%80%C2%92%07%3B%14%5BJ%C3%9E%1F%0F%C2%B3%C2%8A%C3%ABEA%C2%A8C%3A%C2%B3%1B%C2%84%C3%9A%C2%86%C3%A3G%C2%A6%C3%8Dl%C2%B8%C3%8D%C3%A7%C3%B7~%C2%94o%C3%BB%C2%94%C2%B79Kq%C3%95%03%7DC%C2%AB%C3%90%C2%B6op%1C%7F%25N%04%C2%8FQA%C2%90%C2%BC%5D%5Bye%C3%B0%C2%B9%C3%BF%0B0%00%3D%1F%1B%C3%B8%5E%C3%BB%C2%B8%C2%8B%00%00%00%00IEND%C2%AEB%60%C2%82";
var image1 = _window.add("image", undefined, File.decode(image1_imgString), {
  name: "image1",
});
image1.alignment = ["right", "center"];
var footer = _window.add("statictext", undefined, undefined, {
  name: "footer",
});
footer.text = "Schulferien | www.indesign-kalender.de";
footer.alignment = ["right", "top"];
footer.enabled = false;

buttonBreak.onClick = function () {
  _window.close();
};
buttonStart.onClick = function () {
  _window.close(1);
};
var dialogResult = _window.show();

if (dialogResult == 1) {
  vacation();
}

//Schliefe durch Ferien NEU
_ArrayVacation = [];
for (var iv = 0; iv < objekt.data.length; iv++) {
  data = objekt.data[iv];
  vATS = data.date_start.split("-"); //Auftrennung Startdatum
  if (data.date_end != null) {
    vATE = data.date_end.split("-"); //Auftrennung Enddatum
  }
  vATSY = new Date(vATS[0]); //Start Jahr ermittlung
  vATSYA = vATSY.getFullYear(); //Start Jahr ausgabe

  vATEY = new Date(vATE[0]); //End Jahr ermittlung
  vATEYA = vATEY.getFullYear(); //End Jahr ausgabe

  vSY = data.schoolyear_id; //ID Schuljahr
  vBL = data.location_id; //ID Bundesland
  vVB = data.vacation_id; //ID Bezeichnung Ferien

  // Liste Feriennamen
  for (var vid = 0; vid < objekt.base_data[0].vacation.length; vid++) {
    dataV = objekt.base_data[0].vacation[vid];
    if (vVB == dataV.id) {
      _curV = dataV.vacation_name;
    }
  }

  // Datum neu zusammensetzen
  vacationDateStart = new Date(vATSYA, vATS[1] - 1, vATS[2]);

  if (data.date_end != null) {
    vacationDateEnd = new Date(vATEYA, vATE[1] - 1, vATE[2]);
  } else {
    vacationDateEnd = new Date(vATSYA, vATS[1] - 1, vATS[2]);
  }
  _ArrayVacation[iv] =
    vacationDateStart +
    "," +
    vacationDateEnd +
    "," +
    vSY +
    "," +
    vBL +
    "," +
    _curV;
}

//Funktion zum erstellen der Übersicht
function vacation() {
  //Schuljahr ID ermitteln
  for (var i = 0; i < objekt.base_data[0].school_year.length; i++) {
    dataSY = objekt.base_data[0].school_year[i];
    if (selectSchuljahr.selection.text == dataSY.year) {
      var _schoolID = dataSY.id; //ID Schuljahr
    }
  }

  //Bundesland ID ermitteln
  for (var i = 0; i < objekt.base_data[0].location.length; i++) {
    dataBL = objekt.base_data[0].location[i];
    if (selechgtBundesland.selection.text == dataBL.location_name) {
      var blID = dataBL.id; //ID Schuljahr
    }
  }

  // //Auswahl Schuljahr abfragen
  _selectSchoolYear = selectSchuljahr.selection.text;

  //Vorlage öffnen
  var _idml = app.activeScript.path + "/Ferienuebersicht.idml";
  app.open(File(_idml)); 

  //Schleife durch die Daten
  for (var iv = 0; iv < objekt.data.length; iv++) {
    data = objekt.data[iv];
    vATS = data.date_start.split("-"); //Auftrennung Startdatum
    if (data.date_end != null) {
      vATE = data.date_end.split("-"); //Auftrennung Enddatum
    }
    vATSY = new Date(vATS[0]); //Start Jahr ermittlung
    vATSYA = vATSY.getFullYear(); //Start Jahr ausgabe

    vATEY = new Date(vATE[0]); //End Jahr ermittlung
    vATEYA = vATEY.getFullYear(); //End Jahr ausgabe

    //Datum Zeitraum Ausgabe erstellen
    _dateReplace =
      vATS[2] + "." + vATS[1] + ".-" + vATE[2] + "." + vATE[1] + ".";
    //Datum Eintagestermin erstellen
    _dayReplace = vATS[2] + "." + vATS[1] + ".";

    vSY = data.schoolyear_id; //ID Schuljahr
    vBL = data.location_id; //ID Bundesland
    vVB = data.vacation_id; //ID Bezeichnung Ferien
    vRE = data.relation_id; //ID Zuordnung

    //Abgleich des Schuljahr mit der Auswahl
    if (data.schoolyear_id == _schoolID) {
      for (var ivO = 0; ivO < objekt.base_data[0].vacation.length; ivO++) {
        idfound = objekt.base_data[0].vacation[i];
        if (data.school_vacation == true) {
          //Suche und Ersetzen Ferien
          app.findGrepPreferences = NothingEnum.nothing;

          app.findGrepPreferences.findWhat =
            _changeTried + vBL + "-" + vVB + "-1" + _changeTried;
          app.changeGrepPreferences = NothingEnum.nothing;
          if (data.date_end != null) {
            app.changeGrepPreferences.changeTo = _dateReplace;
          }
          if (data.date_end == null) {
            app.changeGrepPreferences.changeTo = _dayReplace;
          }

          if (data.more_entries == 2) {
            app.findGrepPreferences = NothingEnum.nothing;
            app.findGrepPreferences.findWhat =
              _changeTried + vBL + "-" + vVB + "-2" + _changeTried;
            app.changeGrepPreferences = NothingEnum.nothing;
            if (data.date_end != null) {
              app.changeGrepPreferences.changeTo = _dateReplace;
            }
            if (data.date_end == null) {
              app.changeGrepPreferences.changeTo = _dayReplace;
            }
          }
          if (data.more_entries == 3) {
            app.findGrepPreferences = NothingEnum.nothing;
            app.findGrepPreferences.findWhat =
              _changeTried + vBL + "-" + vVB + "-3" + _changeTried;
            app.changeGrepPreferences = NothingEnum.nothing;
            if (data.date_end != null) {
              app.changeGrepPreferences.changeTo = _dateReplace;
            }
            if (data.date_end == null) {
              app.changeGrepPreferences.changeTo = _dayReplace;
            }
          }
          app.activeDocument.changeGrep();
          app.findGrepPreferences = NothingEnum.nothing;
          app.changeGrepPreferences = NothingEnum.nothing;
        }
        if (data.school_vacation == false) {
          app.findGrepPreferences = NothingEnum.nothing;
          app.findGrepPreferences.findWhat =
            _changeTried + vBL + "-7-" + vVB + _changeTried;
          app.changeGrepPreferences = NothingEnum.nothing;
          if (data.date_end != null) {
            app.changeGrepPreferences.changeTo = _dateReplace + "*";
          }
          if (data.date_end == null) {
            app.changeGrepPreferences.changeTo = _dayReplace + "*";
          }
          app.activeDocument.changeGrep();
          app.findGrepPreferences = NothingEnum.nothing;
          app.changeGrepPreferences = NothingEnum.nothing;
        }
      }
    }
  }

  //Schuljahr im Titel ersetzen
  app.findGrepPreferences = NothingEnum.nothing;
  app.findGrepPreferences.findWhat = "##Schuljahr##";
  app.changeGrepPreferences = NothingEnum.nothing;
  app.changeGrepPreferences.changeTo = _selectSchoolYear;
  app.activeDocument.changeGrep();

  //Leere Felder ersetzen
  app.findGrepPreferences = NothingEnum.nothing;
  app.findGrepPreferences.findWhat = "##.*##";
  app.changeGrepPreferences = NothingEnum.nothing;
  app.changeGrepPreferences.changeTo = "";
  app.activeDocument.changeGrep();

  //Leere Absätze ersetzen
  app.findGrepPreferences = NothingEnum.nothing;
  app.findGrepPreferences.findWhat = "^\r";
  app.changeGrepPreferences = NothingEnum.nothing;
  app.changeGrepPreferences.changeTo = "";
  app.activeDocument.changeGrep();

  app.findGrepPreferences = NothingEnum.nothing;
  app.findGrepPreferences.findWhat = "\\s+$";
  app.changeGrepPreferences = NothingEnum.nothing;
  app.changeGrepPreferences.changeTo = "";
  app.activeDocument.changeGrep();

  //Quelle ersetzen
  app.findGrepPreferences = NothingEnum.nothing;
  app.findGrepPreferences.findWhat = "##Quelle##";
  app.changeGrepPreferences = NothingEnum.nothing;
  app.changeGrepPreferences.changeTo = objekt.quelle;
  app.activeDocument.changeGrep();

  //Suche/Ersetzen zurücksetzen
  app.findGrepPreferences = NothingEnum.nothing;
  app.changeGrepPreferences = NothingEnum.nothing;
}

//Aktuelles Verzeichnis ermitteln
function _path(file) {
  try {
    var file = app.activeScript;
  } catch (error) {
    return File(error.fileName).path;
  }
  return file.path;
}
