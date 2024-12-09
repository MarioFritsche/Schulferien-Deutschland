// Schulferien.jsx
// © 27.05.2020 | Mario Fritsche
// 16.10.2024 | Version 2.1
// DESCRIPTION: Übersicht über alle Schulferien in Deutschland
// www.indesign-kalender.de 

//Notwendige Datei, um JSON auszuwerten
#include "json.jsx";

//Import JSON
var apiVacationUrl =
  "curl -X GET 'https://www.indesign-kalender.de/api/v1/vacation.json'";

var _apiRequestStringCurrent = app.doScript(
  'do shell script "' + apiVacationUrl + '"',
  ScriptLanguage.APPLESCRIPT_LANGUAGE
);
var jsonResponse = _apiRequestStringCurrent;

//Abfangen Fehler
if (apiVacationUrl) {
  try {
    var _apiRequestStringCurrent = app.doScript(
      'do shell script "' + apiVacationUrl + '"',
      ScriptLanguage.APPLESCRIPT_LANGUAGE
    );
    var jsonResponse = _apiRequestStringCurrent;

    //Prasen
    json = jsonResponse;
    parsedData = JSON.parse(json);
  } catch (e) {
    alert("Keine Verbindung zur Datenbank");
    exit();
  }
}

// Liste Schuljahre
_schoolYear = [];
for (var i = 0; i < parsedData.base_data[0].school_year.length; i++) {
  schoolYearData = parsedData.base_data[0].school_year[i];
  _schoolYear[i] = schoolYearData.year;
}

// Liste Bundesland
listBundesland = [];
for (var i = 0; i < parsedData.base_data[0].location.length; i++) {
  locationData = parsedData.base_data[0].location[i];
  listBundesland[i] = locationData.location_name;
}

// Liste Jahre
var yearsList = [];

// Schuljahre durchlaufen und Jahre extrahieren
for (var i = 0; i < parsedData.base_data[0].school_year.length; i++) {
  var yearRange = parsedData.base_data[0].school_year[i].year.split("/"); // Split nach "/"
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

//Schliefe durch Ferien
_ArrayVacation = [];

for (var iv = 0; iv < parsedData.data.length; iv++) {
  data = parsedData.data[iv];
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
  for (var vid = 0; vid < parsedData.base_data[0].vacation.length; vid++) {
    dataV = parsedData.base_data[0].vacation[vid];
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
  for (var i = 0; i < parsedData.base_data[0].school_year.length; i++) {
    schoolYearData = parsedData.base_data[0].school_year[i];
    if (selectSchuljahr.selection.text == schoolYearData.year) {
      var _schoolID = schoolYearData.id; //ID Schuljahr
    }
  }

  // //Auswahl Schuljahr abfragen
  _selectSchoolYear = selectSchuljahr.selection.text;

  //Vorlage öffnen
  if (schuljahr.value == true) {
    var _idml = app.activeScript.path + "/templates/Ferienuebersicht.idml";
  } else if (kalenderjahr.value == true) {
    var _idml = app.activeScript.path + "/templates/Ferienuebersicht_Jahr.idml";
  }

  app.open(File(_idml));

  //Schleife durch die Daten
  for (var iv = 0; iv < parsedData.data.length; iv++) {
    data = parsedData.data[iv];
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
      vATS[2] + "." + vATS[1] + "." + "-" + vATE[2] + "." + vATE[1] + ".";

    //Datum Eintagestermin erstellen
    _dayReplace = vATS[2] + "." + vATS[1] + ".";

    vSY = data.schoolyear_id; //ID Schuljahr
    vBL = data.location_id; //ID Bundesland
    vVB = data.vacation_id; //ID Bezeichnung Ferien
    vRE = data.relation_id; //ID Zuordnung

    //Abgleich des Schuljahr mit der Auswahl
    if (schuljahr.value == true) {
      if (data.schoolyear_id == _schoolID) {
        for (
          var ivO = 0;
          ivO < parsedData.base_data[0].vacation.length;
          ivO++
        ) {
          idfound = parsedData.base_data[0].vacation[i];
          if (schuljahr.value == true) {
            if (data.schoolyear_id == _schoolID) {
              for (
                var ivO = 0;
                ivO < parsedData.base_data[0].vacation.length;
                ivO++
              ) {
                idfound = parsedData.base_data[0].vacation[ivO]; // Korrektur hier von i zu ivO

                // Fall: Schulferien
                if (data.school_vacation == true) {
                  applyGrepChange(
                    _changeTried + vBL + "-" + vVB + "-1" + _changeTried,
                    getReplacement(data, _dayReplace)
                  );

                  if (data.more_entries >= 2) {
                    applyGrepChange(
                      _changeTried + vBL + "-" + vVB + "-2" + _changeTried,
                      getReplacement(data, _dayReplace)
                    );
                  }
                  if (data.more_entries == 3) {
                    applyGrepChange(
                      _changeTried + vBL + "-" + vVB + "-3" + _changeTried,
                      getReplacement(data, _dayReplace)
                    );
                  }
                }

                // Fall: Keine Schulferien
                if (data.school_vacation == false) {
                  applyGrepChange(
                    _changeTried + vBL + "-7-" + vVB + _changeTried,
                    getReplacement(data, _dayReplace + "*")
                  );
                }
              }
            }
          }
        }
      }
    }

    // Berechnung des vorherigen und nächsten Jahres
    var yearPrase = parseInt(selectKalenderjahr.selection.toString());
    var nextYear = yearPrase + 1;
    var lastYear = yearPrase - 1;

    if (kalenderjahr.value == true) {
      for (var ivO = 0; ivO < parsedData.base_data[0].vacation.length; ivO++) {
        idfound = parsedData.base_data[0].vacation[ivO];
        if (
          vATEYA == selectKalenderjahr.selection.toString() ||
          (vATEYA == nextYear && vVB == 2)
        ) {
          var findWhatBase =
            vATEYA == nextYear
              ? _changeTried + "n" + vBL + "-" + vVB
              : _changeTried + vBL + "-" + vVB;

          var replacement = getReplacement(
            data,
            (data.school_vacation ? "" : "*") + _dayReplace
          );

          applyGrepChange(findWhatBase + "-1" + _changeTried, replacement);

          if (data.school_vacation) {
            for (var entry = 2; entry <= data.more_entries; entry++) {
              applyGrepChange(
                findWhatBase + "-" + entry + _changeTried,
                replacement
              );
            }
          }
        }
      }
    }
  }

  // Schuljahr im Titel ersetzen
  if (schuljahr.value == true) {
    applyGrepChange("##Schuljahr##", _selectSchoolYear);
  } else if (kalenderjahr.value == true) {
    applyGrepChange("##Schuljahr##", selectKalenderjahr.selection.toString());
  }

  // Ersetzen für ##v##
  applyGrepChange(
    "##v##",
    parseInt(selectKalenderjahr.selection.toString()) -
      1 +
      "/" +
      selectKalenderjahr.selection.toString()
  );

  // Ersetzen für ##n##
  applyGrepChange(
    "##n##",
    selectKalenderjahr.selection.toString() +
      "/" +
      (parseInt(selectKalenderjahr.selection.toString()) + 1)
  );

  // Leere Felder ersetzen
  applyGrepChange("##.*##", "");

  // Leere Absätze ersetzen
  applyGrepChange("^\r", "");

  // Überflüssige Leerzeichen am Ende der Zeilen entfernen
  applyGrepChange("\\s+$", "");

  // Quelle ersetzen
  applyGrepChange("##Quelle##", parsedData.quelle);

  // Suche/Ersetzen zurücksetzen
  app.findGrepPreferences = NothingEnum.nothing;
  app.changeGrepPreferences = NothingEnum.nothing;
}

function applyGrepChange(findWhat, replaceWith) {
  app.findGrepPreferences = NothingEnum.nothing;
  app.findGrepPreferences.findWhat = findWhat;
  app.changeGrepPreferences = NothingEnum.nothing;
  app.changeGrepPreferences.changeTo = replaceWith;
  app.activeDocument.changeGrep();
  app.findGrepPreferences = NothingEnum.nothing;
  app.changeGrepPreferences = NothingEnum.nothing;
}

function getReplacement(data, defaultReplace) {
  return data.date_end != null ? _dateReplace : defaultReplace;
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
